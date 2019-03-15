import {expect} from 'chai';
import {Dataset} from "../src/controller/Dataset";
import {CourseSection} from "../src/controller/CourseSection";
import {Room} from "../src/controller/Room";

describe("DatasetSpec", function() {
    let ds_cs: Dataset<CourseSection>;
    let ds_room: Dataset<Room>;

    beforeEach(function() {
        ds_cs = new Dataset<CourseSection>();
        ds_room = new Dataset<Room>();

    });

    afterEach(function() {
        ds_cs = null;
        ds_room = null;
    });

    describe("test set", function() {
        it("dataset should be empty when created", function() {
            expect(ds_cs.getSize()).to.equal(0);
            expect(ds_cs.getSize()).to.equal(0);
        });

        it("set should pass for adding one item to empty dataset", function () {
            expect(ds_cs.getSize()).to.equal(0);
            ds_cs.set(cs1.courses_uuid, cs1);
            expect(ds_cs.getSize()).to.equal(1);

            expect(ds_room.getSize()).to.equal(0);
            ds_room.set(rm1.rooms_name, rm1);
            expect(ds_room.getSize()).to.equal(1);
        });

        it("set should pass for adding more than one item", function() {
            expect(ds_cs.getSize()).to.equal(0);
            ds_cs.set(cs1.courses_uuid, cs1);
            ds_cs.set(cs2.courses_uuid, cs2);
            ds_cs.set(cs3.courses_uuid, cs3);
            expect(ds_cs.getSize()).to.equal(3);

            expect(ds_cs.get(cs1.courses_uuid)).to.deep.equal(cs1);
            expect(ds_cs.get(cs2.courses_uuid)).to.deep.equal(cs2);
            expect(ds_cs.get(cs3.courses_uuid)).to.deep.equal(cs3);

            expect(ds_room.getSize()).to.equal(0);
            ds_room.set(rm1.rooms_name, rm1);
            ds_room.set(rm2.rooms_name, rm2);
            ds_room.set(rm3.rooms_name, rm3);
            expect(ds_room.getSize()).to.equal(3);

            expect(ds_room.get(rm1.rooms_name)).to.deep.equal(rm1);
            expect(ds_room.get(rm2.rooms_name)).to.deep.equal(rm2);
            expect(ds_room.get(rm3.rooms_name)).to.deep.equal(rm3);
        });

        it("set should overwrite values with same key", function() {
            expect(ds_cs.getSize()).to.equal(0);
            ds_cs.set(cs1.courses_uuid, cs1);
            ds_cs.set(cs1.courses_uuid, cs1);
            expect(ds_cs.getSize()).to.equal(1);

            expect(ds_room.getSize()).to.equal(0);
            ds_room.set(rm1.rooms_name, rm1);
            ds_room.set(rm1.rooms_name, rm1);
            expect(ds_room.getSize()).to.equal(1);
        });
    });

    describe("test get", function() {
        it("get should return undefined when used on empty dataset", function() {
            let found_cs: CourseSection = ds_cs.get(cs1.courses_uuid);
            expect(found_cs).to.be.undefined;

            let found_room: Room = ds_room.get(rm1.rooms_name);
            expect(found_room).to.be.undefined;
        });

        it("get should return correct object for the give key", function() {

            ds_cs.set(cs1.courses_uuid, cs1);
            ds_cs.set(cs2.courses_uuid, cs2);
            ds_cs.set(cs3.courses_uuid, cs3);

            let found_cs: CourseSection = ds_cs.get(cs2.courses_uuid);
            expect(found_cs).to.deep.equal(cs2);

            ds_room.set(rm1.rooms_name, rm1);
            ds_room.set(rm2.rooms_name, rm2);
            ds_room.set(rm3.rooms_name, rm3);

            let found_room: Room = ds_room.get(rm2.rooms_name);
            expect(found_room).to.deep.equal(rm2);
        });
    });

    describe("test has", function() {
        it("has should return true for item in the dataset", function() {

            ds_cs.set(cs1.courses_uuid, cs1);
            ds_cs.set(cs2.courses_uuid, cs2);
            expect(ds_cs.has(cs2.courses_uuid)).to.equal(true);

            ds_room.set(rm1.rooms_name, rm1);
            ds_room.set(rm2.rooms_name, rm2);
            expect(ds_room.has(rm2.rooms_name)).to.equal(true);
        });

        it("has should return false for items not in the dataset", function () {

            ds_cs.set(cs1.courses_uuid, cs1);
            expect(ds_cs.has(cs2.courses_uuid)).to.equal(false);

            ds_room.set(rm1.rooms_name, rm1);
            expect(ds_room.has(rm2.rooms_name)).to.equal(false);
        });
    });

    describe("Test remove", function() {
        it("remove should delete item from the dataset when it exits", function() {

            ds_cs.set(cs1.courses_uuid, cs1);
            ds_cs.set(cs2.courses_uuid, cs2);
            expect(ds_cs.getSize()).to.equal(2);
            ds_cs.remove(cs2.courses_uuid);
            expect(ds_cs.getSize()).to.equal(1);
            expect(ds_cs.has(cs2.courses_uuid)).to.equal(false);

            ds_room.set(rm1.rooms_name, rm1);
            ds_room.set(rm2.rooms_name, rm2);
            expect(ds_room.getSize()).to.equal(2);
            ds_room.remove(rm2.rooms_name);
            expect(ds_room.getSize()).to.equal(1);
            expect(ds_room.has(rm2.rooms_name)).to.equal(false);
        });

        it("remove should do nothing when called with a key not in the dataset", function() {

            ds_cs.set(cs1.courses_uuid, cs1);
            ds_cs.set(cs2.courses_uuid, cs2);
            expect(ds_cs.getSize()).to.equal(2);
            ds_cs.remove(cs3.courses_uuid);
            expect(ds_cs.getSize()).to.equal(2);

            ds_room.set(rm1.rooms_name, rm1);
            ds_room.set(rm2.rooms_name, rm2);
            expect(ds_room.getSize()).to.equal(2);
            ds_room.remove(rm3.rooms_name);
            expect(ds_room.getSize()).to.equal(2);
        });
    });

    let cs1: CourseSection = {
        courses_dept: 'math', courses_id: '101', courses_avg: 80.74,
        courses_instructor: '', courses_title: 'Calculus', courses_pass: 45,
        courses_fail: 2, courses_audit: 1, courses_uuid: '3452', courses_year: 2012
    };

    let cs2: CourseSection = {
        courses_dept: 'cpsc', courses_id: '234', courses_avg: 50.74,
        courses_instructor: 'me', courses_title: 'Programming C++', courses_pass: 55,
        courses_fail: 2, courses_audit: 0, courses_uuid: '1234', courses_year: 2005
    };

    let cs3: CourseSection = {
        courses_dept: 'math', courses_id: '201', courses_avg: 90.74,
        courses_instructor: '', courses_title: 'Calculus II', courses_pass: 145,
        courses_fail: 2, courses_audit: 1, courses_uuid: '4857', courses_year: 1900
    };

    let rm1: Room = {
        rooms_fullname: 'Hugh Dempster Pavilion', rooms_shortname: 'DMP', rooms_number: '110',
        rooms_name: 'DMP_110', rooms_address: '6245 Agronomy Road V6T 1Z4', rooms_lat: 49.261223,
        rooms_lon: -123.248081, rooms_seats: 120, rooms_type: 'Tiered Classroom', rooms_furniture: 'Fixed Tables',
        rooms_href: 'https://learningspaces.ubc.ca/classrooms/dmp-110'
    };

    let rm2: Room = {
        rooms_fullname: 'Aquatic Ecosystems Research Laboratory',
        rooms_shortname: 'AERL', rooms_number: '120', rooms_name: 'AERL_120', rooms_address: '2202 Main Mall',
        rooms_lat: 49.263725, rooms_lon: -123.251047, rooms_seats: 144, rooms_type: 'Tiered Classroom',
        rooms_furniture: 'Fixed Tables', rooms_href: 'https://learningspaces.ubc.ca/classrooms/aerl-120'
    };

    let rm3: Room = {
        rooms_fullname: 'Allard Hall',
        rooms_shortname: 'ALRD', rooms_number: '112', rooms_name: 'ALRD_112', rooms_address: '1822 East Mall',
        rooms_lat: 49.270079, rooms_lon: -123.253360, rooms_seats: 20, rooms_type: '',
        rooms_furniture: 'Moveable Tables', rooms_href: 'https://learningspaces.ubc.ca/classrooms/alrd-112'
    }
});