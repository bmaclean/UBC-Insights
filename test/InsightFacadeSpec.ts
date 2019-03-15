import {expect} from 'chai';
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";
import Log from "../src/Util";
import fs = require('fs');

function getBase64StringOfFile(filename: string) : string {
    return fs.readFileSync(filename).toString('base64');
}

/**
 * Test suite: test InsightFacade's addDataset, removeDataset and invalid queries on performQuery
 */

describe("InsightFacadeSpec", function() {

    describe("Test addDataset for Courses", function () {

        it("addDataset should fail on unrecognized id", function () {
            let insight: InsightFacade = new InsightFacade();
            return insight.addDataset('what', getBase64StringOfFile('test-data/rooms.zip'))
                .then(function () {
                    expect.fail();
                }).catch(function (err) {
                    expect(err.code).to.equal(400);
                    expect(err.body).to.deep.equal({ "error": "no matching parser for id: " + "what" });
                });
        });

        it("addDataset should fail on non-zip file when calling with courses id", function () {
            let insight: InsightFacade = new InsightFacade();
            return insight.addDataset('courses', getBase64StringOfFile('test-data/text-file.txt'))
                .then(function () {
                    expect.fail();
                }).catch(function (err: InsightResponse) {
                    expect(err.code).to.equal(400);
                    expect(err.body).to.deep.equal({"error": "dataset is not a valid zip file"});
                });
        });

        it("addDataset should fail on invalid courses dataset", function () {
            let insight: InsightFacade = new InsightFacade();
            return insight.addDataset('courses', getBase64StringOfFile('test-data/zip-with-multiple-invalid-json.zip'))
                .then(function () {
                    expect.fail();
                }).catch(function (err) {
                    expect(err.code).to.equal(400);
                    expect(err.body).to.deep.equal({"error": "dataset is not valid"});
                });
        });

        it("addDataset should fulfill when adding a simple courses dataset", function () {
            let insight: InsightFacade = new InsightFacade();
            return insight.addDataset('courses', getBase64StringOfFile('test-data/courses-lite.zip'))
                .then(function (value: InsightResponse) {
                    expect([201, 204]).to.include(value.code);
                }).catch(function () {
                    expect.fail();
                });
        });

        it("addDataset should fulfill when adding courses dataset", function () {
            let insight: InsightFacade = new InsightFacade();
            return insight.addDataset('courses', getBase64StringOfFile('test-data/courses.zip'))
                .then(function (value: InsightResponse) {
                    expect([201, 204]).to.include(value.code);
                }).catch(function () {
                    expect.fail();
                });
        });

        it("addDataset should fulfill with 201 when id is already cached", function() {
            let insight: InsightFacade = new InsightFacade();
            return insight.addDataset('courses', getBase64StringOfFile('test-data/courses-lite.zip'))
                .then(function() {

                    // courses is already added, addDataset would return code 201
                    return insight.addDataset('courses', getBase64StringOfFile('test-data/courses-lite.zip'))
                        .then(function(value: InsightResponse) {
                            expect(value.code).to.equal(201);
                        }).catch(function () {
                            expect.fail();
                        });

                }).catch(function() {
                    expect.fail();
            });
        });

        it("addDataset should fulfill with 204 when id is new", function() {
            let insight: InsightFacade = new InsightFacade();
            return insight.addDataset('courses', getBase64StringOfFile('test-data/courses-lite.zip'))
                .then(function() {

                    // remove the added dataset
                    return insight.removeDataset('courses').then(function() {

                        // add it again, addDataset should return code 204 since id is new
                        return insight.addDataset('courses', getBase64StringOfFile('test-data/courses-lite.zip'))
                            .then(function(value: InsightResponse) {
                                expect(value.code).to.equal(204);
                            }).catch(function() {
                                expect.fail();
                            });

                    }).catch(function() {
                        expect.fail();
                    });

                }).catch(function() {
                    expect.fail();
                });
        });
    });

    describe("Test addDataset for Rooms", function () {

        it("addDataset should fail on non-zip file", function() {
            let insight: InsightFacade = new InsightFacade();
            return insight.addDataset('rooms', getBase64StringOfFile('test-data/text-file.txt'))
                .then(function () {
                    expect.fail();
                }).catch(function (err: InsightResponse) {
                    expect(err.code).to.equal(400);
                });

        });

        it("addDataset should fail when missing index", function() {
            let insight: InsightFacade = new InsightFacade();
            return insight.addDataset('rooms', getBase64StringOfFile('test-data/rooms-no-index.zip'))
                .then(function () {
                    expect.fail();
                }).catch(function (err: InsightResponse) {
                    expect(err.code).to.equal(400);
                });
        });

        it("addDataset should fail when zip has zero rooms", function() {
            let insight: InsightFacade = new InsightFacade();
            return insight.addDataset('rooms', getBase64StringOfFile('test-data/rooms-no-rooms.zip'))
                .then(function () {
                    expect.fail();
                }).catch(function (err: InsightResponse) {
                    console.log(err);
                    expect(err.code).to.equal(400);
                });
        });

        it("addDataset should fulfill when adding rooms dataset", function () {
            let insight: InsightFacade = new InsightFacade();
            return insight.addDataset('rooms', getBase64StringOfFile('test-data/rooms.zip'))
                .then(function (value: InsightResponse) {
                    expect([201, 204]).to.include(value.code);
                }).catch(function () {
                    expect.fail();
                });
        });
    });

    describe("Test removeDataset", function () {

        it("removeDataset should fulfill removing courses dataset", function () {
            let insight: InsightFacade = new InsightFacade();
            return insight.addDataset('courses', getBase64StringOfFile('test-data/courses-lite.zip'))
                .then(function () {

                    // remove the dataset
                    return insight.removeDataset('courses').then(function (value: InsightResponse) {
                        expect(value.code).to.equal(204);
                    }).catch(function () {
                        expect.fail();
                    });

                }).catch(function () {
                    expect.fail();
                });
        });

        it("removeDataset should fulfill removing rooms dataset", function () {
            let insight: InsightFacade = new InsightFacade();
            return insight.addDataset('rooms', getBase64StringOfFile('test-data/rooms.zip'))
                .then(function () {

                    // remove the dataset
                    return insight.removeDataset('rooms').then(function (value: InsightResponse) {
                        expect(value.code).to.equal(204);
                    }).catch(function () {
                        expect.fail();
                    });

                }).catch(function () {
                    expect.fail();
                });
        });

        it("removeDataset should reject when dataset with given id does not exist", function () {
            let insight: InsightFacade = new InsightFacade();
            return insight.addDataset('courses', getBase64StringOfFile('test-data/courses-lite.zip'))
                .then(function () {

                    // remove the dataset
                    return insight.removeDataset('courses').then(function (value: InsightResponse) {
                        expect(value.code).to.equal(204);

                        // courses should already be removed
                        return insight.removeDataset('courses').then(function () {
                            expect.fail();
                        }).catch(function (err: InsightResponse) {
                            expect(err.code).to.equal(404);
                        });

                    }).catch(function () {
                        expect.fail();
                    });

                }).catch(function () {
                    expect.fail();
                });
        });
    });

    describe("Test performQuery on missing dataset/s", function() {

        it("performQuery should fail when there are no datasets", function () {

            // remove all cache datasets and cache directory
            Log.warn("removing local cache directory");
            let cacheDir = 'cache-data/';
            if(fs.existsSync(cacheDir)) {
                fs.readdirSync(cacheDir).forEach((filename: string) => {
                    fs.unlinkSync(cacheDir + filename);
                });
                fs.rmdirSync(cacheDir);
            }

            // create a new InsightFacade, there is no cache data to be loaded to this
            let insight: InsightFacade = new InsightFacade();

            // since there are no dataset loaded into insight, this performQuery should fail with code 424
            return insight.performQuery({
                WHERE: {
                    GT: { courses_avg: 50 }
                },
                OPTIONS: {
                    COLUMNS: ["courses_avg", "courses_dept" ]
                }
            }).then(function() {
                expect.fail();
            }).catch(function(err) {
                expect(err).to.deep.equal({
                    code: 424,
                    body: { "error": "no datasets with id: " + "courses" + " to perform query" }
                });
            })
        });

        it("performQuery should fail when query dataset is not added", function () {

            // remove all cache datasets and cache directory
            Log.warn("removing local cache directory");
            let cacheDir = 'cache-data/';
            if(fs.existsSync(cacheDir)) {
                fs.readdirSync(cacheDir).forEach((filename: string) => {
                    fs.unlinkSync(cacheDir + filename);
                });
                fs.rmdirSync(cacheDir);
            }

            // create a new InsightFacade, there is no cache data to be loaded to this
            let insight: InsightFacade = new InsightFacade();

            // add a courses dataset and call performQuery with a rooms query
            return insight.addDataset("courses", getBase64StringOfFile('test-data/courses-lite.zip'))
                .then(function() {

                    return insight.performQuery({
                        "WHERE": {
                            "GT": { "rooms_seats": 50 }
                        },
                        "OPTIONS": {
                            "COLUMNS": ["rooms_name", "rooms_seats" ]
                        }
                    }).then(function() {
                        expect.fail();
                    }).catch(function(err) {
                        expect(err).to.deep.equal({
                            code: 424,
                            body: { "error": "no datasets with id: " + "rooms" + " to perform query" }
                        });
                    });

                }).catch(function() {
                    expect.fail();
                });

        });
    });

    describe("Test invalid queries on performQuery", function() {

        let insightFacade: InsightFacade;

        before(function() {
            insightFacade = new InsightFacade();
        });

        after(function() {
            insightFacade = null;
        });

        it("performQuery should reject an empty input", function() {
            return insightFacade.performQuery(null)
                .then(function() {
                    expect.fail();
                })
                .catch(function(err: InsightResponse) {
                    expect(err).to.deep.equal({
                        "code": 400,
                        "body": {
                            "error": "empty query"
                        }
                    });
                });
        });

        it("performQuery should reject queries without WHERE or OPTIONS", function() {
            return insightFacade.performQuery({ SOME: "thing", WE: 1234 })
                .then(function() {
                    expect.fail();
                }).catch(function (err: InsightResponse) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries without OPTIONS", function() {
            return insightFacade.performQuery({ WHERE: { }, WE: 1234 })
                .then(function() {
                    expect.fail();
                }).catch(function (err: InsightResponse) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries with unidentified information", function() {
            return insightFacade.performQuery({
                WHERE: {
                    GT: {
                        "courses_avg": 85
                    }
                },
                OPTIONS: { COLUMNS:["courses_dept"] },
                NONSENSE: "abcef",
                MORE_NONSENSE: 1234
            })
                .then(function() {
                    expect.fail();
                }).catch(function(err: InsightResponse) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries with multiple numeric filter keys", function() {
            return insightFacade.performQuery({
                WHERE: {
                    GT: {
                        courses_avg: 85,
                        courses_pass: 40
                    }
                },
                OPTIONS: { COLUMNS:["courses_dept"] },
            })
                .then(function() {
                    expect.fail();
                }).catch(function(err: InsightResponse) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries with multiple string filter keys", function() {
            return insightFacade.performQuery({
                WHERE: {
                    IS: {
                        courses_instructor: "jones",
                        courses_dept: "math"
                    }
                },
                OPTIONS: { COLUMNS:["courses_dept"] },
            })
                .then(function() {
                    expect.fail();
                }).catch(function(err: InsightResponse) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries where string value is provided for numeric filter", function() {
            return insightFacade.performQuery({
                WHERE: {
                    GT: {
                        courses_avg: "math"
                    }
                },
                OPTIONS: { COLUMNS:["courses_dept"] },
            })
                .then(function() {
                    expect.fail();
                }).catch(function(err: InsightResponse) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries with invalid mKey", function() {
            return insightFacade.performQuery({
                WHERE: {
                    GT: {
                        courses_av: 90
                    }
                },
                OPTIONS: { COLUMNS:["courses_dept"] },
            })
                .then(function() {
                    expect.fail();
                }).catch(function(err: InsightResponse) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries with invalid sKey", function() {
            return insightFacade.performQuery({
                WHERE: {
                    IS: {
                        courses_dpt: "math"
                    }
                },
                OPTIONS: { COLUMNS:["courses_dept"] },
            })
                .then(function() {
                    expect.fail();
                }).catch(function(err: InsightResponse) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries where numeric value is provided for string filter", function() {
            return insightFacade.performQuery({
                WHERE: {
                    IS: {
                        courses_dept: 5
                    }
                },
                OPTIONS: { COLUMNS:["courses_dept"] },
            })
                .then(function() {
                    expect.fail();
                }).catch(function(err: InsightResponse) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries with invalid keys in ORDER", function() {
            return insightFacade.performQuery({
                WHERE: {
                    IS: {
                        courses_dept: "math"
                    }
                },
                OPTIONS: { COLUMNS:[
                    "courses_dept",
                    "courses_avg"
                ],
                    ORDER: "courses_av"
                },
            })
                .then(function() {
                    expect.fail();
                }).catch(function(err: InsightResponse) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries with non-column keys in ORDER", function() {
            return insightFacade.performQuery({
                WHERE: {
                    IS: {
                        courses_dept: "math"
                    }
                },
                OPTIONS: { COLUMNS:[
                    "courses_dept",
                    "courses_avg"
                ],
                    ORDER: "courses_fail"
                },
            })
                .then(function() {
                    expect.fail();
                }).catch(function(err: InsightResponse) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries with empty logic block", function() {
            return insightFacade.performQuery({
                WHERE: {
                    AND: []
                },
                OPTIONS: {
                    COLUMNS: [ "courses_dept" ]
                }
            })
                .then(function() {
                    expect.fail();
                }).catch(function (err) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries with invalid logic block", function() {
            return insightFacade.performQuery({
                WHERE: {
                    AND: "abcdef"
                },
                OPTIONS: {
                    COLUMNS: [ "courses_dept" ]
                }
            })
                .then(function() {
                    expect.fail();
                }).catch(function (err) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries with invalid keys nested in logic blocks", function() {
            return insightFacade.performQuery({
                WHERE: {
                    AND: [
                        {
                            GT: { courses_pass: 70 }
                        },
                        {
                            IS: { cours_dept: 'math' }
                        }
                    ]
                },
                OPTIONS: {
                    COLUMNS: [ "courses_dept" ]
                }
            })
                .then(function() {
                    expect.fail();
                }).catch(function (err) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries without a COLUMN array", function() {
            return insightFacade.performQuery({
                WHERE: {
                    GT: { courses_pass: 50 }
                },
                OPTIONS: {
                    ORDER: "courses_avg"
                }
            })
                .then(function() {
                    expect.fail();
                }).catch(function (err) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries with empty COLUMNS array", function() {
            return insightFacade.performQuery({
                WHERE: {
                    GT: { courses_pass: 50 }
                },
                OPTIONS: {
                    COLUMNS: []
                }
            })
                .then(function() {
                    expect.fail();
                }).catch(function (err) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries with invalid COLUMNS entry", function() {
            return insightFacade.performQuery({
                WHERE: {
                    GT: { courses_pass: 50 }
                },
                OPTIONS: {
                    COLUMNS: 48
                }
            })
                .then(function() {
                    expect.fail();
                }).catch(function (err) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries with invalid keys in COLUMNS", function() {
            return insightFacade.performQuery({
                WHERE: {
                    GT: { courses_pass: 50 }
                },
                OPTIONS: {
                    COLUMNS: [ "abcd", 45 ]
                }
            })
                .then(function() {
                    expect.fail();
                }).catch(function (err) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject invalid NOT query", function() {
            return insightFacade.performQuery({
                WHERE: {
                    NOT: {
                        LS: { courses_instructor: 50}
                    }
                },
                OPTIONS: {
                    COLUMNS: [ "courses_instructor" ]
                }
            })
                .then(function() {
                    expect.fail();
                }).catch(function (err) {
                    expect(err.code).to.equal(400);
                });
        });

        it("performQuery should reject queries with keys from courses are followed by keys from rooms", function() {
            return insightFacade.performQuery({
                "WHERE": {
                    "AND": [
                        {
                            "GT" : { "courses_year": 2014 }
                        },
                        {
                            "LT": { "rooms_seats": 45 }
                        }
                    ]
                },
                "OPTIONS": {
                    "COLUMNS": [ "courses_uuid" ]
                }
            }).then(function() {
                expect.fail();
            }).catch(function(err) {
                expect(err.code).to.equal(400);
            });
        });

        it("performQuery should reject queries with keys from rooms are followed by keys from courses", function() {
            return insightFacade.performQuery({
                "WHERE": {
                    "AND": [
                        {
                            "GT" : { "rooms_seats": 2014 }
                        },
                        {
                            "LT": { "courses_year": 45 }
                        }
                    ]
                },
                "OPTIONS": {
                    "COLUMNS": [ "courses_uuid" ]
                }
            }).then(function() {
                expect.fail();
            }).catch(function(err) {
                expect(err.code).to.equal(400);
            });
        });

        it("performQuery should reject queries with invalid TRANSFORMATIONS", function() {
            return insightFacade.performQuery({
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [ "courses_uuid" ]
                },
                "TRANSFORMATIONS": {
                    "ABCD": {}
                }
            }).then(function() {
                expect.fail();
            }).catch(function(err) {
                expect(err.code).to.equal(400);
            });
        });

        it("performQuery should reject queries with invalid GROUP", function() {
            return insightFacade.performQuery({
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [ "courses_uuid" ]
                },
                "TRANSFORMATIONS": {
                    "GROUP": "courses_id",
                    "APPLY": []
                }
            }).then(function() {
                expect.fail();
            }).catch(function(err) {
                expect(err.code).to.equal(400);
            });
        });

        it("performQuery should reject queries with invalid GROUP keys", function() {
            return insightFacade.performQuery({
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [ "courses_uuid" ]
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["courses_iid", "courses_asdf"],
                    "APPLY": []
                }
            }).then(function() {
                expect.fail();
            }).catch(function(err) {
                expect(err.code).to.equal(400);
            });
        });

        /*
        it("performQuery should reject queries with invalid APPLY keys", function () {
            return insightFacade.performQuery({
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [ "courses_uuid" ]
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["courses_dept", "courses_id"],
                    "APPLY": [
                        {
                            "courseAvg": {
                                "AV": "courses_avg"
                            }
                        }
                    ]
                }
            }).then(function() {
                expect.fail();
            }).catch(function(err) {
                expect(err.code).to.equal(400);
            });
        });

        it("performQuery should reject queries with invalid APPLY blocks", function () {
            return insightFacade.performQuery({
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [ "courses_uuid" ]
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["courses_dept", "courses_id"],
                    "APPLY": [
                        {
                            "avgGrade": {
                                "AVG": "courses_avg"
                            },
                            "avgPass": {
                                "AVG": "courses_pass"
                            }
                        }
                    ]
                }
            }).then(function() {
                expect.fail();
            }).catch(function(err) {
                expect(err.code).to.equal(400);
            });
        });

        it("performQuery should reject queries with invalid APPLYKEY names", function() {
            return insightFacade.performQuery({
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [ "courses_uuid" ]
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["courses_dept", "courses_id"],
                    "APPLY": [
                        {
                            "avg_Grades": {
                                "AVG": "courses_avg"
                            }
                        }
                    ]
                }
            }).then(function() {
                expect.fail();
            }).catch(function(err) {
                expect(err.code).to.equal(400);
            });
        });

        it("performQuery should reject queries with repeating APPLYKEY names", function() {
            return insightFacade.performQuery({
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [ "courses_uuid" ]
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["courses_dept", "courses_id"],
                    "APPLY": [
                        {
                            "avgGrades": {
                                "AV": "courses_avg"
                            }
                        },
                        {
                            "avgGrades": {
                                "SUM": "courses_avg"
                            }
                        }
                    ]
                }
            }).then(function() {
                expect.fail();
            }).catch(function(err) {
                expect(err.code).to.equal(400);
            });
        });

        it("PerformQuery should reject queries with invalid SORT direction", function() {
            return insightFacade.performQuery({
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [ "courses_uuid" ],
                    "ORDER": { "dir": "DON", "keys": ["courses_avg", "courses_dept"] }
                }
            }).then(function() {
                expect.fail();
            }).catch(function(err) {
                expect(err.code).to.equal(400);
            });
        });*/
    });
});