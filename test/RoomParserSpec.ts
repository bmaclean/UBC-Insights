
import {expect} from 'chai';

let fs = require('fs');
import Log from "../src/Util";
import {RoomParser} from "../src/controller/RoomParser";
import {Room} from "../src/controller/Room";
import {Dataset} from "../src/controller/Dataset";

function getBase64StringOfFile(filename: string) : string {
    return fs.readFileSync(filename).toString('base64');
}

describe("RoomParserSpec", function() {
    let parser : RoomParser;
    parser = new RoomParser();

    describe("Test parse", function() {

        it("reject an empty input", function () {
            return parser.parse('')
                .then(function (ds: Dataset<Room>) {
                expect.fail();
            })
                .catch(function (err) {
                Log.test('Error: ' + err);
            });
        });

        it("reject non-zip file formats", function() {
            return parser.parse('test-data/non-zip.txt')
                .then(function (ds: Dataset<Room>) {
                    expect.fail();
            })
                .catch(function (err) {
                    Log.test('Error: ' + err);
                });
        });

        it("test parse full rooms.zip dataset", function() {
            return parser.parse(getBase64StringOfFile('test-data/rooms.zip'))
                .then(function (ds: Dataset<Room>) {
                    expect(ds.getSize()).to.deep.equal(364);
                    expect.fail();
                })
                .catch(function (err) {
                    Log.test('Error: ' + err);
                });
        });

        it("should find no buildings without index.htm, and return empty dataset", function () {
            return parser.parse(getBase64StringOfFile('test-data/rooms-no-index.zip'))
                .then(function (ds: Dataset<Room>) {
                    expect.fail();
                })
                .catch(function (err) {
                    Log.test('Error: ' + err);
                });
        });

        it("reject a zip file with no rooms", function() {
            return parser.parse(getBase64StringOfFile('test-data/rooms.zip'))
                .then(function (ds: Dataset<Room>) {
                    expect.fail();
                })
                .catch(function (err) {
                    Log.test('Error: ' + err);
                });
        });

    });
});