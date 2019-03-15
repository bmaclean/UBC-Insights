import chai = require('chai');
import chaiHttp = require('chai-http');
import {expect} from 'chai';
import Server from "../src/rest/Server";
import fs = require('fs');
import Response = ChaiHttp.Response;

describe("Test Server REST", function () {

    let serverUrl: string;
    let server: Server;

    before(function () {
        chai.use(chaiHttp);
        let port: number = 4322;
        server = new Server(port);
        serverUrl = 'http://localhost:' + port;

        expect(server).to.not.equal(undefined);
        expect(server).to.not.equal(null);

        return server.start().then((val: boolean) => {
            expect(val).to.equal(true);

        }).catch((err) => {
            console.log(err);
            expect.fail();
        })
    });

    after(function() {
        server.stop()
            .then(function() {})
            .catch(function () {})
    });

    describe("Test PUT", function () {

        it("PUT should fail with 400 when no file attached", function () {
            return chai.request(serverUrl)
                .put('/dataset/rooms')
                .then(function () {
                    expect.fail();
                })
                .catch(function (err: Response) {
                    expect(err.status).to.equal(400);
                });
        });

        it("PUT should fail with 400 when invalid dataset is attached", function () {
            return chai.request(serverUrl)
                .put('/dataset/rooms')
                .attach("body", fs.readFileSync("test-data/rooms-no-index.zip"), "rooms-no-index.zip")
                .then(function () {
                    expect.fail();
                })
                .catch(function (err: Response) {
                    expect(err.status).to.equal(400);
                });
        });

        it("PUT should pass with 201/204 for rooms dataset", function () {
            return chai.request(serverUrl)
                .put('/dataset/rooms')
                .attach("body", fs.readFileSync("test-data/rooms.zip"), "rooms.zip")
                .then(function (res: Response) {
                    expect([201, 204]).to.include(res.status);  // response status should be either 201 or 204
                })
                .catch(function (err: Response) {
                    expect.fail();
                });
        });

        it("PUT should pass with 201/204 for courses dataset", function () {
            return chai.request(serverUrl)
                .put('/dataset/courses')
                .attach("body", fs.readFileSync("test-data/courses.zip"), "courses.zip")
                .then(function (res: Response) {
                    expect([201, 204]).to.include(res.status);  // response status should be either 201 or 204
                })
                .catch(function (err: Response) {
                    expect.fail();
                });
        });
    });
    
    describe("Test DELETE", function () {

        it("DELETE should fail with 404 on non-existing dataset", function () {
            return chai.request(serverUrl)
                .del('/dataset/abcsdfs')
                .then(function() {
                    expect.fail();
                })
                .catch(function (err: Response) {
                    expect(err.status).to.equal(404);
                });
        });

        it("DELETE should pass with 204 for valid dataset name", function() {
            return chai.request(serverUrl)
                .put('/dataset/rooms')
                .attach("body", fs.readFileSync("test-data/rooms.zip"), "rooms.zip")
                .then(function (res: Response) {

                    expect([201, 204]).to.include(res.status);  // response status should be either 201 or 204

                    return chai.request(serverUrl)
                        .del('/dataset/rooms')
                        .then(function(res: Response) {
                            expect(res.status).to.equal(204);
                        })
                        .catch(function () {
                            expect.fail();
                        });
                })
                .catch(function (err: Response) {
                    expect.fail();
                });
        });
    });
    
    describe("Test POST", function () {

        it("POST should fail for empty request body", function () {
            return chai.request(serverUrl)
                .post('/query')
                .then(function (res: Response) {
                    expect.fail();
                })
                .catch(function (err: Response) {
                    expect(err.status).to.equal(400);
                });
        });

        it("POST should fail for empty query", function () {
            return chai.request(serverUrl)
                .post('/query')
                .send({})
                .then(function (res: Response) {
                    expect.fail();
                })
                .catch(function (err: Response) {
                    expect(err.status).to.equal(400);
                });
        });

        // this test assumes dataset 'courses' is already added
        it("POST should pass for simple query", function () {
            return chai.request(serverUrl)
                .post('/query')
                .send({
                    "WHERE": {
                        "GT": {
                            "courses_avg": 95
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": ["courses_uuid", "courses_avg"]
                    }
                })
                .then(function (res: Response) {
                    expect(res.status).to.equal(200);
                })
                .catch(function() {
                    expect.fail();
                });
        });
    });
});