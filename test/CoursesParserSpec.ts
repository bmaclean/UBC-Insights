import {expect} from 'chai';
import {CoursesParser} from "../src/controller/CoursesParser";
import {Dataset} from "../src/controller/Dataset";
import {CourseSection} from "../src/controller/CourseSection";

let fs = require('fs');

describe("CoursesParserSpec", function() {

    let parser: CoursesParser;
    before(function() {
        parser = new CoursesParser();
    });

    describe("Test parse", function () {

        it("parse should reject on empty string input", function () {
            return parser.parse('').then(function () {
                expect.fail();
            }).catch(function (err) {
                expect(err).to.deep.equal('dataset is not a valid zip file');
            });
        });

        it("parse should reject when input is not a zip file", function () {
            return parser.parse(getBase64StringOfFile('test-data/text-file.txt'))
                .then(function () {
                    expect.fail();
                }).catch(function (err) {
                    expect(err).to.deep.equal('dataset is not a valid zip file');
                });
        });

        it("parse should reject when input zip contains an empty folders", function () {
            return parser.parse(getBase64StringOfFile('test-data/zip-with-empty-folders.zip'))
                .then(function () {
                    expect.fail();
                }).catch(function (err) {
                    expect(err).to.deep.equal('dataset is not valid');
                });
        });

        it("parse should reject when input contains an empty file", function () {
            return parser.parse(getBase64StringOfFile('test-data/zip-with-empty-file.zip'))
                .then(function () {
                    expect.fail();
                }).catch(function (err) {
                    expect(err).to.deep.equal('dataset is not valid');
                });
        });

        it("parse should reject when input contains file with invalid json", function () {
            return parser.parse(getBase64StringOfFile('test-data/zip-with-invalid-json-file.zip'))
                .then(function () {
                    expect.fail();
                }).catch(function (err) {
                    expect(err).to.deep.equal('dataset is not valid');
                });
        });

        it("parse should reject when when input contains multiple files with invalid json", function () {
            return parser.parse(getBase64StringOfFile('test-data/zip-with-multiple-invalid-json.zip'))
                .then(function () {
                    expect.fail();
                }).catch(function (err) {
                    expect(err).to.deep.equal('dataset is not valid');
                });
        });

        it("parse should reject when input contains valid json files with unrelated data", function () {
            return parser.parse(getBase64StringOfFile('test-data/zip-with-valid-unrelated-json.zip'))
                .then(function () {
                    expect.fail();
                }).catch(function (err) {
                    expect(err).to.deep.equal('dataset is not valid');
                });
        });

        it("parse should reject when input files 'reslut' array is empty", function () {
            return parser.parse(getBase64StringOfFile('test-data/zip-empty-result.zip'))
                .then(function () {
                    expect.fail();
                }).catch(function (err) {
                    expect(err).to.deep.equal('dataset is not valid');
                });
        });

        it("parse should reject when input contains course section with no unique id", function() {
            return parser.parse(getBase64StringOfFile('test-data/zip-with-course-no-id.zip'))
                .then(function () {
                    expect.fail();
                }).catch(function (err) {
                    expect(err).to.deep.equal('dataset is not valid');
                });
        });

        it("parse should fulfill when input contains one valid data file with one course section", function () {
            return parser.parse(getBase64StringOfFile('test-data/zip-with-valid-course-section.zip'))
                .then(function (ds: Dataset<CourseSection>) {
                    expect(ds.getSize()).to.equal(1);

                    // the input's "Section":"overall" property is set, so courses_year should be 1900
                    let cs_expected: CourseSection = {
                        courses_uuid: '25851',
                        courses_dept: 'rhsc', courses_id: '585', courses_instructor: '', courses_title: 'directed studies',
                        courses_avg: 87.5, courses_pass: 4, courses_fail: 0, courses_audit: 0, courses_year: 1900
                    };

                    // check if parsed section is correct
                    let cs_parsed: CourseSection = ds.get('25851');
                    expect(cs_parsed).to.not.be.undefined;
                    expect(cs_parsed).to.not.equal(null);
                    expect(cs_parsed.courses_uuid).to.deep.equal('25851');
                    expect(cs_parsed).to.deep.equal(cs_expected);

                }).catch(function () {
                    expect.fail();
                });
        });

        it("parse should fulfill when input contains one valid data file with multiple course sections", function () {
            return parser.parse(getBase64StringOfFile('test-data/zip-with-valid-course-sections-single-file.zip'))
                .then(function (ds: Dataset<CourseSection>) {
                    expect(ds.getSize()).to.equal(223);

                    let cs_expected: CourseSection = {
                        courses_uuid: '60574', courses_dept: 'germ', courses_id: '100',
                        courses_instructor: 'coordinator;revell, stephanie;struch, gela', courses_title: 'begin germ i',
                        courses_avg: 76.11, courses_pass: 27, courses_fail: 0, courses_audit: 0, courses_year: 2010
                    };

                    let cs_parsed: CourseSection = ds.get('60574');
                    expect(cs_parsed).to.not.be.undefined;
                    expect(cs_parsed).to.not.equal(null);
                    expect(cs_parsed.courses_uuid).to.deep.equal('60574');
                    expect(cs_parsed).to.deep.equal(cs_expected);

                }).catch(function () {
                    expect.fail();
                });
        });

        it("parse should fulfill when input zip contains valid data", function() {
            return parser.parse(getBase64StringOfFile('test-data/courses-lite.zip'))
                .then(function(ds: Dataset<CourseSection>) {
                    expect(ds.getSize()).to.equal(2668);
                }).catch(function() {
                    expect.fail();
                });
        });

        it("parseDataset should fulfill when input contains is complete valid dataset", function() {
            return parser.parse(getBase64StringOfFile('test-data/courses.zip'))
                .then(function(ds: Dataset<CourseSection>) {
                    expect(ds.getSize()).to.equal(64612);

                    let cs_expected: CourseSection = {
                        courses_uuid: '97330', courses_dept: 'engl', courses_id: '110', courses_avg: 76.42,
                        courses_instructor: 'phillips, noelle', courses_title: 'intro literature', courses_pass: 36,
                        courses_fail: 0, courses_audit: 0, courses_year: 2014
                    };

                    let cs_parsed: CourseSection = ds.get('97330');
                    expect(cs_parsed).to.not.be.undefined;
                    expect(cs_parsed).to.not.equal(null);
                    expect(cs_parsed.courses_uuid).to.deep.equal('97330');
                    expect(cs_parsed).to.deep.equal(cs_expected);

                }).catch(function () {
                    expect.fail();
                });
        });
    });
});

function getBase64StringOfFile(filename: string) : string {
    return fs.readFileSync(filename).toString('base64');
}