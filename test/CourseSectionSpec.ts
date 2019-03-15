import {expect} from 'chai'
import {CourseSection} from "../src/controller/CourseSection"

describe("CourseSectionSpec", function() {

    it("test initializing CourseSection objects", function() {

        let cs1: CourseSection = new CourseSection('123');
        cs1.courses_pass = 4;
        cs1.courses_avg = 51.32;
        expect(cs1.courses_pass).to.equal(4);
        expect(cs1.courses_avg).to.equal(51.32);

        let cs2: CourseSection = new CourseSection();
        cs2.courses_avg = 45.54;
        cs2.courses_pass = 34;
        cs2.courses_instructor = 'tom';
        expect(cs2.courses_avg).to.equal(45.54);
        expect(cs2.courses_instructor).to.deep.equal('tom');
        expect(cs2.courses_uuid).to.be.undefined;

        let cs3: CourseSection = {
            courses_uuid: '4567', courses_dept: 'math', courses_id: '400', courses_avg: 78.84,
            courses_instructor: 'jones, tom', courses_title: 'advance calculus',
            courses_pass: 40, courses_fail: 2, courses_audit: 1, courses_year: 2004
        };
        expect(cs3.courses_instructor).to.deep.equal('jones, tom');
        expect(cs3.courses_title).to.deep.equal('advance calculus');
    });

    it("isKey should test for valid keys", function() {
        expect(CourseSection.isKey('courses_avg')).to.equal(true);
        expect(CourseSection.isKey('courses_uuid')).to.equal(true);
        expect(CourseSection.isKey('courses_audit')).to.equal(true);

        expect(CourseSection.isKey('')).to.equal(false);
        expect(CourseSection.isKey('asdf@ue&*(')).to.equal(false);
        expect(CourseSection.isKey('course_avg')).to.equal(false);
    });

    it("isMKey should test for valid numeric keys", function() {

        expect(CourseSection.isMKey('courses_avg')).to.equal(true);
        expect(CourseSection.isMKey('courses_pass')).to.equal(true);
        expect(CourseSection.isMKey('courses_fail')).to.equal(true);
        expect(CourseSection.isMKey('courses_audit')).to.equal(true);
        expect(CourseSection.isMKey('courses_year')).to.equal(true);

        expect(CourseSection.isMKey('')).to.equal(false);
        expect(CourseSection.isMKey('asdf@ue&*(')).to.equal(false);
        expect(CourseSection.isMKey('a kljsdf a')).to.equal(false);

        expect(CourseSection.isMKey('courses_uuid')).to.equal(false);
        expect(CourseSection.isMKey('courses_dept')).to.equal(false);
        expect(CourseSection.isMKey('courses_id')).to.equal(false);
        expect(CourseSection.isMKey('courses_instructor')).to.equal(false);
        expect(CourseSection.isMKey('courses_title')).to.equal(false);
    });

    it("isSkey should test for valid string keys", function() {

        expect(CourseSection.isSKey('courses_uuid')).to.equal(true);
        expect(CourseSection.isSKey('courses_dept')).to.equal(true);
        expect(CourseSection.isSKey('courses_id')).to.equal(true);
        expect(CourseSection.isSKey('courses_instructor')).to.equal(true);
        expect(CourseSection.isSKey('courses_title')).to.equal(true);

        expect(CourseSection.isSKey('')).to.equal(false);
        expect(CourseSection.isSKey('asdf lkjd f kdjf')).to.equal(false);
        expect(CourseSection.isSKey('(*)(*)(*')).to.equal(false);

        expect(CourseSection.isSKey('courses_avg')).to.equal(false);
        expect(CourseSection.isSKey('courses_pass')).to.equal(false);
        expect(CourseSection.isSKey('courses_fail')).to.equal(false);
        expect(CourseSection.isSKey('courses_audit')).to.equal(false);
        expect(CourseSection.isSKey('courses_year')).to.equal(false);
    });
});