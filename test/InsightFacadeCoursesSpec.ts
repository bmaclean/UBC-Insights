import {expect} from "chai";
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";
import Log from "../src/Util"
import fs = require('fs');

function getBase64StringOfFile(filename: string) : string {
    return fs.readFileSync(filename).toString('base64');
}

/**
 * Test suite: tests queries on courses dataset
 */

describe("InsightFacadeCoursesSpec", function () {

    let insightFacade: InsightFacade;

    before(function() {
        insightFacade = new InsightFacade();
        return insightFacade.addDataset('courses', getBase64StringOfFile('test-data/courses.zip'))
            .then(function() {

            }).catch(function(err: InsightResponse) {
                Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                expect.fail();
        });
    });

    after(function() {
        insightFacade = null;
    });

    it("empty WHERE should return all course sections", function() {
        return insightFacade.performQuery({
            "WHERE":{},
            "OPTIONS":{
                "COLUMNS":["courses_uuid", "courses_dept", "courses_id"]
            }
        })
            .then(function(value: InsightResponse) {
                console.log((value.body as any)['result'].length);
            })
            .catch(function(err: InsightResponse) {
                Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                expect.fail();
            });
    });

    describe("Test MCOMPARISON on courses", function() {

        describe("Test LT on courses", function() {

            it("performQuery should find all course sections below a given average", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "LT":{
                            "courses_avg": 71
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                })
                    .then(function() {

                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });

            it("performQuery should find all courses below a number of passes", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "LT":{
                            "courses_pass": 100
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_pass"
                        ],
                        "ORDER":"courses_dept"
                    }
                })
                    .then(function() {

                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });

            it("performQuery should find all courses below a given number of failures", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "LT":{
                            "courses_fail": 2
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_fail"
                        ],
                        "ORDER":"courses_dept"
                    }
                })
                    .then(function() {
                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });
        });

        describe("Test GT on courses", function() {

            it("performQuery should find all course sections above a given average", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_avg": 85
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                })
                    .then(function() {

                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });

            it("performQuery should find all courses above a given number of failures", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_fail": 20
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_fail"
                        ],
                        "ORDER":"courses_dept"
                    }
                })
                    .then(function() {

                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });

            it("performQuery should find all courses above a given number of passes", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_pass": 200
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_pass"
                        ],
                        "ORDER":"courses_dept"
                    }
                })
                    .then(function() {

                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });
        });

        describe("Test EQ on courses", function() {

            it("performQuery should find all course sections with a given average", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "EQ":{
                            "courses_avg": 80
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                })
                    .then(function() {

                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });

            it("performQuery should find all courses with a given number of failures", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "EQ":{
                            "courses_fail": 12
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_fail"
                        ],
                        "ORDER":"courses_fail"
                    }
                })
                    .then(function() {

                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });

            it("performQuery should find all courses with a given number of passes", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "EQ":{
                            "courses_pass": 100
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_pass"
                        ],
                        "ORDER": "courses_dept"
                    }
                })
                    .then(function() {

                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });

            it("performQuery should find all courses with offered in the same year", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "EQ":{
                            "courses_year": 2014
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_uuid",
                            "courses_title",
                            "courses_year"
                        ],
                        "ORDER": "courses_uuid"
                    }
                })
                    .then(function() {

                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });
        });
    });

    describe("Test SCOMPARISON on courses", function() {

        it("performQuery should return nothing when querying for empty uuid", function() {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS":{
                        "courses_uuid": ""
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_title",
                        "courses_id"
                    ],
                    "ORDER": "courses_title"
                }
            })
                .then(function() {

                })
                .catch(function(err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    expect.fail();
                });
        });

        it("performQuery should find course by department name", function() {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS":{
                        "courses_dept": "biol"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_id"

                    ],
                    "ORDER": "courses_dept"
                }
            })
                .then(function() {

                })
                .catch(function(err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    expect.fail();
                });
        });

        it("performQuery should handle string filter ending with *", function() {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS":{
                        "courses_dept": "a*"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_instructor"
                    ],
                    "ORDER": "courses_dept"
                }
            })
                .then(function() {

                })
                .catch(function(err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    expect.fail();
                });
        });

        it("performQuery should handle string filter beginning with *", function() {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS":{
                        "courses_instructor": "*son"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_instructor"
                    ],
                    "ORDER": "courses_dept"
                }
            })
                .then(function() {

                })
                .catch(function(err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    expect.fail();
                });
        });

        it("performQuery should handle string filter beginning and ending with *", function() {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS":{
                        "courses_instructor": "*an*"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_instructor"
                    ],
                    "ORDER": "courses_dept"
                }
            })
                .then(function() {

                })
                .catch(function(err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    expect.fail();
                });
        });
    });

    describe("Test LOGIC on courses", function() {

        describe("Test AND filter", function() {

            it("performQuery with simple AND on two filters", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "AND":[
                            {
                                "LT":{
                                    "courses_avg": 75
                                }
                            },
                            {
                                "IS": {
                                    "courses_dept": "biol"
                                }
                            }
                        ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept"
                        ],
                        "ORDER":"courses_dept"
                    }
                })
                    .then(function() {

                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });

            it("performQuery with simple AND on one filter", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "AND":[
                            {
                                "LT":{
                                    "courses_avg": 62
                                }
                            }]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept"
                        ],
                        "ORDER":"courses_dept"
                    }
                })
                    .then(function() {

                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });

            it("performQuery with nested AND", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "AND":[
                            {
                                "AND": [
                                    {
                                        "IS": {
                                            "courses_instructor": "johnson"
                                        }
                                    }
                                ]
                            },
                            {
                                "LT":{
                                    "courses_avg": 79
                                }
                            },
                            {
                                "IS":{
                                    "courses_dept": "math"
                                }
                            }]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept"
                        ],
                        "ORDER":"courses_dept"
                    }
                })
                    .then(function() {

                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });
        });

        describe("Test OR filter", function() {

            it("performQuery with simple OR on two filters", function() {
                return insightFacade.performQuery({
                    "WHERE": {
                        "OR": [
                            {
                                "EQ" : { "courses_avg": 75 }
                            },
                            {
                                "IS": { "courses_dept": "biol" }
                            }
                        ]
                    },
                    "OPTIONS": {
                        "COLUMNS": [ "courses_avg", "courses_dept" ],
                        "ORDER": "courses_dept"
                    }
                })
                    .then(function() {

                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });

            it("performQuery with nested OR", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "OR":[
                            {
                                "OR": [
                                    {
                                        "IS": { "courses_instructor": "johnson" }
                                    },
                                    {
                                        "GT": { "courses_avg": 79 }
                                    }
                                ]
                            },
                            {
                                "IS": { "courses_dept": "biol" }
                            }
                        ]
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_uuid",
                            "courses_dept"
                        ],
                        "ORDER":"courses_dept"
                    }
                })
                    .then(function() {

                    })
                    .catch(function(err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });
        });

    });

    describe("Test NEGATION on courses", function() {

        it("performQuery with negation on single filter", function () {
            return insightFacade.performQuery({
                "WHERE": {
                    "NOT": {
                        "GT": {
                            "courses_avg": 78
                        }
                    }
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "courses_title",
                        "courses_dept"
                    ],
                    "ORDER": "courses_dept"
                }
            })
                .then(function () {

                })
                .catch(function (err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    expect.fail();
                });
        });

        it("performQuery with negation on an AND filter", function () {
            return insightFacade.performQuery({
                "WHERE": {
                    "NOT": {
                        "AND": [
                            {
                                "GT": {
                                    "courses_avg": 65
                                }
                            },
                            {
                                "IS": {
                                    "courses_dept": "biol"
                                }
                            }
                        ]
                    }
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "courses_dept"
                    ],
                    "ORDER": "courses_dept"
                }
            })
                .then(function () {

                })
                .catch(function (err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    expect.fail();
                });
        });

        it("performQuery with double negation", function () {
            return insightFacade.performQuery({
                "WHERE": {
                    "NOT": {
                        "NOT": {
                            "GT": {
                                courses_avg: 98
                            }
                        }
                    }
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "courses_uuid",
                        "courses_dept"
                    ]
                }
            })
                .then(function() {

                }).catch(function(err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    expect.fail();
            });
        });
    });

    describe("Test basic GROUP by single key on courses", function () {

        it("performQuery with grouping by department", function () {
            return insightFacade.performQuery({
                "WHERE": {},

                "OPTIONS": {
                    "COLUMNS": ["courses_dept"]
                },

                "TRANSFORMATIONS": {
                    "GROUP": ["courses_dept"],
                    "APPLY": []
                }
            })
                .then(function (value: InsightResponse) {
                    console.log((value.body as any)['result'].length);
                    console.log((value.code));
                })
                .catch(function (err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    expect.fail();
                });
        });

        it("performQuery with grouping by instructor", function () {
            return insightFacade.performQuery({
                "WHERE": {},

                "OPTIONS": {
                    "COLUMNS": ["courses_instructor"]
                },

                "TRANSFORMATIONS": {
                    "GROUP": ["courses_instructor"],
                    "APPLY": []
                }
            })
                .then(function (value: InsightResponse) {
                    console.log((value.body as any)['result'].length);
                    console.log((value.code));
                })
                .catch(function (err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    expect.fail();
                });
        });
    });

    describe("Test APPLYKEY's on courses", function () {

        describe("Test MAX",function() {

            it("performQuery using max of course dept average", function () {
                return insightFacade.performQuery({
                    "WHERE": {
                        "GT": {
                            "courses_avg": 96.9
                        }

                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "maxAverage"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["maxAverage"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept"],
                        "APPLY": [{
                            "maxAverage": {
                                "MAX": "courses_avg"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                        console.log((value.code));
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });

        it("performQuery using highest failing course sections for each course", function () {
            return insightFacade.performQuery({
                "WHERE": {

                },
                "OPTIONS": {
                    "COLUMNS": [
                        "courses_dept",
                        "courses_id",
                        "maxFail"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxFail"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["courses_dept","courses_id"],
                    "APPLY": [{
                        "maxFail": {
                            "MAX": "courses_fail"
                        }
                    }]
                }
            })
                .then(function (value: InsightResponse) {
                    console.log((value.body as any)['result']);
                    console.log((value.code));
                })
                .catch(function (err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    expect.fail();
                });
        });
    });

        describe("Test Invalid Queries",function() {

            it("should reject invalid COUNT key", function () {
                return insightFacade.performQuery({
                    "WHERE": {
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "uniqueCourseKey"
                        ],
                        "ORDER": {
                            "dir": "UP",
                            "keys": ["uniqueCourseKey", "courses_dept"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept"],
                        "APPLY": [{
                            "uniqueCourseKey": {
                                "COUNT": "invalid_key"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                        console.log((value.code));
                        expect.fail();
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    });
            });

            it("should reject non-string COUNT key", function () {
                return insightFacade.performQuery({
                    "WHERE": {
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "uniqueCourseKey"
                        ],
                        "ORDER": {
                            "dir": "UP",
                            "keys": ["uniqueCourseKey", "courses_dept"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept"],
                        "APPLY": [{
                            "uniqueCourseKey": {
                                "COUNT": 123
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                        console.log((value.code));
                        expect.fail();
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    });
            });

            it("should reject invalid AVG key", function () {
                return insightFacade.performQuery({
                    "WHERE": {},
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "avgInvalid"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["avgInvalid"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept"],
                        "APPLY": [{
                            "avgInvalid": {
                                "AVG": "invalid_key"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                        console.log((value.code));
                        expect.fail();
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    });
            });

            it("should reject non-string AVG key", function () {
                return insightFacade.performQuery({
                    "WHERE": {},
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "avgInvalid"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["avgInvalid"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept"],
                        "APPLY": [{
                            "avgInvalid": {
                                "AVG": 333
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                        console.log((value.code));
                        expect.fail();
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    });
            });

            it("should reject non-string SUM key", function () {
                return insightFacade.performQuery({
                    "WHERE": {},
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "avgInvalid"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["avgInvalid"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept"],
                        "APPLY": [{
                            "avgInvalid": {
                                "SUM": 1
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                        console.log((value.code));
                        expect.fail();
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    });
            });

            it("should reject non-string MIN key", function () {
                return insightFacade.performQuery({
                    "WHERE": {},
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "avgInvalid"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["avgInvalid"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept"],
                        "APPLY": [{
                            "avgInvalid": {
                                "MIN": 1
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                        console.log((value.code));
                        expect.fail();
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    });
            });

            it("should reject non-string MAX key", function () {
                return insightFacade.performQuery({
                    "WHERE": {},
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "avgInvalid"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["avgInvalid"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept"],
                        "APPLY": [{
                            "avgInvalid": {
                                "MAX": 1
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                        console.log((value.code));
                        expect.fail();
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    });
            });
        });
    });


    describe("Test GROUP", function () {

            it("Test Using MKey in GROUP", function () {
                return insightFacade.performQuery({
                    "WHERE": {
                        "GT": {
                            "courses_avg": 96.9
                        }

                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "maxAverage"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["maxAverage"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept", "courses_fail"],
                        "APPLY": [{
                            "maxAverage": {
                                "MAX": "courses_avg"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                        console.log((value.code));
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });

            it("GROUP should reject invalid queries", function () {
                return insightFacade.performQuery({
                    "WHERE": {

                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_id",
                            "maxFail"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["maxFail"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept","courses_id", "invalid_key"],
                        "APPLY": [{
                            "maxFail": {
                                "MAX": "courses_fail"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                        console.log((value.code));
                        expect.fail();
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    });
            });
        });
});