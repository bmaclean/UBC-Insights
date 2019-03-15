import {expect} from 'chai';
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";
import Log from "../src/Util"
import fs = require('fs');

function getBase64StringOfFile(filename: string) : string {
    return fs.readFileSync(filename).toString('base64');
}

/**
 * Test suite: tests queries on rooms dateset
 */

describe("InsightFacadeRoomsSpec", function() {

    let insightFacade: InsightFacade;

    before(function() {
        insightFacade = new InsightFacade();
        return insightFacade.addDataset('rooms', getBase64StringOfFile('test-data/rooms.zip'))
            .then(function(value: InsightResponse) {
                console.log(value);
            }).catch(function(err: InsightResponse) {
                Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                expect.fail();
        });
    });

    after(function() {
        insightFacade = null;
    });

    it("empty WHERE should return all rooms", function() {
        return insightFacade.performQuery({
            "WHERE":{},
            "OPTIONS":{
                "COLUMNS":["rooms_name", "rooms_seats"]
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

    describe("Test MCOMPARISON on rooms", function() {

        describe("Test LT on rooms", function() {

            it("performQuery should find all rooms below a given capacity", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "LT":{
                            "rooms_seats": 50
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_name",
                            "rooms_seats"
                        ],
                        "ORDER":"rooms_seats"
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

            it("performQuery should find all rooms with latitude below given value", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "LT":{
                            "rooms_lat": 49.265
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_name",
                            "rooms_number"
                        ],
                        "ORDER":"rooms_number"
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

            it("performQuery should find all rooms with longitude below a given value", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "LT":{
                            "rooms_lon": -123.25
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_name",
                            "rooms_number"
                        ],
                        "ORDER":"rooms_name"
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
        });

        describe("Test GT on rooms", function () {

            it("performQuery should find all rooms above a given capacity", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "GT":{
                            "rooms_seats": 50
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_name",
                            "rooms_seats"
                        ],
                        "ORDER":"rooms_seats"
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

            it("performQuery should find all rooms with latitude above given value", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "GT":{
                            "rooms_lat": 49.265
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_name",
                            "rooms_number"
                        ],
                        "ORDER":"rooms_number"
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

            it("performQuery should find all rooms with longitude above a given value", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "GT":{
                            "rooms_lon": -123.25
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_name",
                            "rooms_number"
                        ],
                        "ORDER":"rooms_name"
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
        });

        describe("Test EQ on rooms", function() {

            it("performQuery should find all rooms with a given capacity", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "EQ":{
                            "rooms_seats": 40
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_name",
                            "rooms_seats"
                        ],
                        "ORDER":"rooms_seats"
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
        });
    });

    describe("Test SCOMPARISON on rooms", function() {

        it("performQuery should return nothing when querying for empty room name", function() {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS":{
                        "rooms_name": ""
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_name",
                        "rooms_fullname"
                    ],
                    "ORDER": "rooms_name"
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

        it("performQuery should find rooms by exact address", function() {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS":{
                        "rooms_address": "6245 Agronomy Road V6T 1Z4"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_name",
                        "rooms_address"

                    ],
                    "ORDER": "rooms_name"
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

        it("performQuery should find rooms by partial uri", function () {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS":{
                        "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD*"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_name",
                        "rooms_href"

                    ],
                    "ORDER": "rooms_name"
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

        it("performQuery should handle string filter ending with wildcard *", function() {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS":{
                        "rooms_name": "ALRD_*"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_name",
                        "rooms_fullname"
                    ],
                    "ORDER": "rooms_name"
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

        it("performQuery should handle string filter beginning with wildcard *", function() {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS":{
                        "rooms_address": "*East Mall"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_name",
                        "rooms_address",
                        "rooms_lat",
                        "rooms_lon"
                    ],
                    "ORDER": "rooms_lat"
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

        it("performQuery should handle string filter beginning and ending with wildcard *", function() {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS":{
                        "rooms_furniture": "*Fixed Tables*"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_name",
                        "rooms_furniture"
                    ],
                    "ORDER": "rooms_name"
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
    });

    describe("Test LOGIC filters on rooms", function() {

        describe("Test AND filter", function() {

            it("performQuery with simple AND on two filters", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "AND":[
                            {
                                "LT":{
                                    "rooms_seats": 50
                                }
                            },
                            {
                                "IS": {
                                    "rooms_type": "*General Purpose*"
                                }
                            }
                        ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_name",
                            "rooms_seats"
                        ],
                        "ORDER":"rooms_name"
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

            it("performQuery with simple AND on one filter", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "AND":[
                            {
                                "IS":{
                                    "rooms_shortname": "BUCH"
                                }
                            }]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_name",
                            "rooms_shortname"
                        ],
                        "ORDER":"rooms_shortname"
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

            it("performQuery with nested AND", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "AND":[
                            {
                                "AND": [
                                    { "IS": { "rooms_address": "*West Mall*" } },
                                    { "GT": { "rooms_seats": 50 } }
                                ]
                            },
                            { "IS":{ "rooms_number": "1*" } },
                            { "IS":{ "rooms_type": "*Open Design*" }}
                            ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_name"
                        ],
                        "ORDER":"rooms_name"
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
        });

        describe("Test OR filter", function() {

            it("performQuery with simple OR on two filters", function() {
                return insightFacade.performQuery({
                    "WHERE": {
                        "OR": [
                            {
                                "GT" : { "rooms_seats": 75 }
                            },
                            {
                                "IS": { "rooms_shortname": "BUCH" }
                            }
                        ]
                    },
                    "OPTIONS": {
                        "COLUMNS": [ "rooms_name", "rooms_seats" ],
                        "ORDER": "rooms_seats"
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

            it("performQuery with nested OR", function() {
                return insightFacade.performQuery({
                    "WHERE":{
                        "OR":[
                            {
                                "OR": [
                                    { "IS": { "rooms_address": "1822 East Mall" } },
                                    { "GT": { "rooms_lat": 49.249 } }
                                ]
                            },
                            {
                                "IS": { "rooms_name": "AERL_*" }
                            }
                        ]
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_name"
                        ]
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
        });

        it("performQuery with both AND and OR filters", function() {
            return insightFacade.performQuery({
                "WHERE": {
                    "AND": [
                        { "GT": { "rooms_seats": 30 }},
                        { "OR":
                            [
                            { "IS": { "rooms_address": "*West Mall*" }},
                            { "IS": { "rooms_address": "*East Mall*" }}
                            ]
                        },
                        {"IS": { "rooms_number": "2*" }}
                    ]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_name"
                    ],
                    "ORDER": "rooms_name"
                }
            }).then(function(value: InsightResponse) {
                console.log((value.body as any)['result'].length);
            }).catch(function(err) {
                Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                expect.fail();
            });
        });
    });

    describe("Test NEGATION on rooms", function() {

        it("performQuery with simple negation on single a filter", function () {
            return insightFacade.performQuery({
                "WHERE": {
                    "NOT": {
                        "GT": {
                            "rooms_seats": 100
                        }
                    }
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_name",
                        "rooms_seats"
                    ],
                    "ORDER": "rooms_seats"
                }
            })
                .then(function (value: InsightResponse) {
                    console.log((value.body as any)['result'].length);
                })
                .catch(function (err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    expect.fail();
                });
        });

        it("performQuery with double negation", function() {
            return insightFacade.performQuery({
                "WHERE": {
                    "NOT": {
                        "NOT": {
                            "GT": {
                                "rooms_seats": 100
                            }
                        }
                    }
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_name",
                        "rooms_seats"
                    ],
                    "ORDER": "rooms_name"
                }
            }).then(function(value: InsightResponse) {
                console.log((value.body as any)['result'].length);
            }).catch(function(err) {
                Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                expect.fail();
            });
        });

        it("performQuery with negation on AND and OR", function () {
            return insightFacade.performQuery({
                "WHERE": {
                    "NOT": {
                        "AND": [
                            { "GT": { "rooms_seats": 30 }},
                            { "OR":
                                [
                                    { "IS": { "rooms_address": "*West Mall*" }},
                                    { "IS": { "rooms_address": "*East Mall*" }}
                                ]
                            },
                            {"IS": { "rooms_number": "2*" }}
                        ]
                    }
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_name", "rooms_seats"
                    ]
                }
            }).then(function(value: InsightResponse) {
                console.log((value.body as any)['result'].length);
            }).catch(function(err) {
                Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                expect.fail();
            });
        });
    });

    describe("Test basic GROUP by single key on rooms", function () {

        it("performQuery with grouping by building code", function () {
            return insightFacade.performQuery({
                "WHERE": {},

                "OPTIONS": {
                    "COLUMNS": ["rooms_shortname"]
                },

                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": []
                }
            })
                .then(function (value: InsightResponse) {
                    console.log((value.body as any)['result'].length);
                })
                .catch(function (err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    expect.fail();
                });
        });

        it("performQuery with grouping by furniture type", function () {
            return insightFacade.performQuery({
                "WHERE": {},

                "OPTIONS": {
                    "COLUMNS": ["rooms_furniture"]
                },

                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_furniture"],
                    "APPLY": []
                }
            })
                .then(function (value: InsightResponse) {
                    console.log((value.body as any)['result'].length);
                })
                .catch(function (err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    expect.fail();
                });
        });
    });

    describe("Test APPLY on rooms", function() {
        it("Should reject APPLY is non-array value", function () {
            return insightFacade.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "maxSeats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxSeats", "rooms_fullname"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": {
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }
                }
            })
                .then(function (value: InsightResponse) {
                    expect.fail();
                })
                .catch(function (err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                });
        });

        it("Should reject APPLY with multiple tokens", function () {
            return insightFacade.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "maxSeats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxSeats", "rooms_fullname"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats",
                            "MIN": "rooms_seats"
                        }
                    }]
                }
            })
                .then(function (value: InsightResponse) {
                    expect.fail();
                })
                .catch(function (err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                });
        });

        it("Should reject APPLY with invalid APPLYKEY name", function () {
            return insightFacade.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "maxSeats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxSeats", "rooms_fullname"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{
                        "": {
                            "MAX": "rooms_seats"
                        }
                    }]
                }
            })
                .then(function (value: InsightResponse) {
                    expect.fail();
                })
                .catch(function (err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                });
        });

        it("Should reject APPLY with duplicate APPLYKEY name", function () {
            return insightFacade.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "maxSeats",
                        "minSeats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxSeats", "minSeats", "rooms_fullname"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    },
                        {
                            "minSeats": {
                                "MIN": "rooms_seats"
                            }
                        }]
                }
            })
                .then(function (value: InsightResponse) {
                    expect.fail();
                })
                .catch(function (err: InsightResponse) {
                    Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                });
        });
    });

    describe("Test APPLYKEY's on rooms", function () {

        describe("Test Invalid Queries",function() {

            it("Should reject when keys in ORDER don't match those specified in COLUMNS", function () {
                return insightFacade.performQuery({
                    "WHERE": {
                        "AND": [{
                            "IS": {
                                "rooms_furniture": "*Tables*"
                            }
                        }, {
                            "GT": {
                                "rooms_seats": 300
                            }
                        }]
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_shortname",
                            "maxSeats"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["maxSeats", "rooms_fullname"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_shortname"],
                        "APPLY": [{
                            "maxSeats": {
                                "MAX": "rooms_seats"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        expect.fail();
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    });
            });

            it("Should reject when MAX APPLYKEY takes invalid key", function () {
                return insightFacade.performQuery({
                    "WHERE": {
                        "AND": [{
                            "IS": {
                                "rooms_furniture": "*Tables*"
                            }
                        }, {
                            "GT": {
                                "rooms_seats": 300
                            }
                        }]
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_shortname",
                            "maxSeats"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["maxSeats", "rooms_fullname"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_shortname"],
                        "APPLY": [{
                            "maxSeats": {
                                "MAX": "invalid_key"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        expect.fail();
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    });
            });

            it("Should reject when MIN APPLYKEY takes invalid key", function () {
                return insightFacade.performQuery({
                    "WHERE": {
                        "LT": {
                            "rooms_seats": 50
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_shortname",
                            "minSeats"
                        ],
                        "ORDER": {
                            "dir": "UP",
                            "keys": ["minSeats"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_shortname"],
                        "APPLY": [{
                            "minSeats": {
                                "MIN": "invalid_key"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                        expect.fail();
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    });
            });

            it("Should reject when COUNT APPLYKEY takes invalid key", function () {
                return insightFacade.performQuery({
                    "WHERE": {
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_shortname",
                            "uniqueRoomSeats"
                        ],
                        "ORDER": {
                            "dir": "UP",
                            "keys": ["uniqueRoomSeats"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_shortname"],
                        "APPLY": [{
                            "uniqueRoomSeats": {
                                "COUNT": "invalid_key"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                        expect.fail();
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    });
            });

            it("Should reject when SUM APPLYKEY takes invalid key", function () {
                return insightFacade.performQuery({
                    "WHERE": {
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_shortname",
                            "totalSeats"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["totalSeats"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_shortname"],
                        "APPLY": [{
                            "totalSeats": {
                                "SUM": "invalid_key"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                        expect.fail();
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    });
            });

            it("Should reject when AVG APPLYKEY takes invalid key", function () {
                return insightFacade.performQuery({
                    "WHERE": {},
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_shortname",
                            "avgSeats"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["avgSeats"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_shortname"],
                        "APPLY": [{
                            "avgSeats": {
                                "AVG": "rooms_seats"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                        expect.fail();
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                    });
            });
        });

        describe("Test MAX",function() {

            it("performQuery using max of building shortname with at least 300 seats", function () {
                return insightFacade.performQuery({
                    "WHERE": {
                        "AND": [{
                            "IS": {
                                "rooms_furniture": "*Tables*"
                            }
                        }, {
                            "GT": {
                                "rooms_seats": 300
                            }
                        }]
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_shortname",
                            "maxSeats"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["maxSeats"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_shortname"],
                        "APPLY": [{
                            "maxSeats": {
                                "MAX": "rooms_seats"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });
        });

        describe("Test MIN",function() {

            it("performQuery using max of building shortname with at least 300 seats", function () {
                return insightFacade.performQuery({
                    "WHERE": {
                            "LT": {
                                "rooms_seats": 50
                            }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_shortname",
                            "minSeats"
                        ],
                        "ORDER": {
                            "dir": "UP",
                            "keys": ["minSeats"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_shortname"],
                        "APPLY": [{
                            "minSeats": {
                                "MIN": "rooms_seats"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });
        });

        describe("Test COUNT",function() {

            it("performQuery using max of building shortname with at least 300 seats", function () {
                return insightFacade.performQuery({
                    "WHERE": {
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_shortname",
                            "uniqueRoomSeats"
                        ],
                        "ORDER": {
                            "dir": "UP",
                            "keys": ["uniqueRoomSeats", "rooms_shortname"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_shortname"],
                        "APPLY": [{
                            "uniqueRoomSeats": {
                                "COUNT": "rooms_seats"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });
        });

        describe("Test SUM",function() {

            it("performQuery using max of building shortname with at least 300 seats", function () {
                return insightFacade.performQuery({
                    "WHERE": {
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_shortname",
                            "totalSeats"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["totalSeats"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_shortname"],
                        "APPLY": [{
                            "totalSeats": {
                                "SUM": "rooms_seats"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result'].length);
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });
        });

        describe("Test AVG",function() {

            it("performQuery using max of building shortname with at least 300 seats", function () {
                return insightFacade.performQuery({
                    "WHERE": {},
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_shortname",
                            "avgSeats"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["avgSeats"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_shortname"],
                        "APPLY": [{
                            "avgSeats": {
                                "AVG": "rooms_seats"
                            }
                        }]
                    }
                })
                    .then(function (value: InsightResponse) {
                        console.log((value.body as any)['result']);
                    })
                    .catch(function (err: InsightResponse) {
                        Log.error('Error: ' + err.code + ": " + JSON.stringify(err.body));
                        expect.fail();
                    });
            });
        });

    });

});