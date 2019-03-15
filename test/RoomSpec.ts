import {expect} from 'chai'
import {Room} from "../src/controller/Room";

describe("RoomSpec", function() {

    it("test initializing CourseSection objects", function() {

        let rm1: Room = new Room('Hugh Dempster Pavilion');
        rm1.rooms_lat = 4.458;
        rm1.rooms_lon = 51.32;
        expect(rm1.rooms_lat).to.equal(4.458);
        expect(rm1.rooms_lon).to.equal(51.32);

        let rm2: Room = new Room();
        rm2.rooms_shortname = 'MXML';
        expect(rm2.rooms_shortname).to.deep.equal('MXML');

        let rm3: Room = {
            rooms_fullname: 'Hugh Dempster Pavilion', rooms_shortname: 'DMP', rooms_number: '110',
            rooms_name: 'DMP_110', rooms_address: '6245 Agronomy Road V6T 1Z4', rooms_lat: 49.261223,
            rooms_lon: -123.248081, rooms_seats: 120, rooms_type: 'Tiered Classroom', rooms_furniture: 'Fixed Tables',
            rooms_href: 'https://learningspaces.ubc.ca/classrooms/dmp-110'
        };
        expect(rm3.rooms_fullname).to.deep.equal('Hugh Dempster Pavilion');
        expect(rm3.rooms_name).to.deep.equal('DMP_110');
    });

    it("isKey should test for valid keys", function() {
        expect(Room.isKey('rooms_name')).to.equal(true);
        expect(Room.isKey('rooms_seats')).to.equal(true);
        expect(Room.isKey('rooms_href')).to.equal(true);

        expect(Room.isKey('')).to.equal(false);
        expect(Room.isKey('asdf@ue&*(')).to.equal(false);
        expect(Room.isKey('course_avg')).to.equal(false);
    });

    it("isMKey should test for valid numeric keys", function() {

        expect(Room.isMKey('rooms_lat')).to.equal(true);
        expect(Room.isMKey('rooms_lon')).to.equal(true);
        expect(Room.isMKey('rooms_seats')).to.equal(true);

        expect(Room.isMKey('')).to.equal(false);
        expect(Room.isMKey('asdf@ue&*(')).to.equal(false);
        expect(Room.isMKey('a kljsdf a')).to.equal(false);

        expect(Room.isMKey('rooms_fullname')).to.equal(false);
        expect(Room.isMKey('rooms_shortname')).to.equal(false);
        expect(Room.isMKey('rooms_number')).to.equal(false);
        expect(Room.isMKey('rooms_name')).to.equal(false);
        expect(Room.isMKey('rooms_address')).to.equal(false);
        expect(Room.isMKey('rooms_type')).to.equal(false);
        expect(Room.isMKey('rooms_furniture')).to.equal(false);
        expect(Room.isMKey('rooms_href')).to.equal(false);
    });

    it("isSkey should test for valid string keys", function() {

        expect(Room.isSKey('rooms_fullname')).to.equal(true);
        expect(Room.isSKey('rooms_shortname')).to.equal(true);
        expect(Room.isSKey('rooms_number')).to.equal(true);
        expect(Room.isSKey('rooms_name')).to.equal(true);
        expect(Room.isSKey('rooms_address')).to.equal(true);
        expect(Room.isSKey('rooms_type')).to.equal(true);
        expect(Room.isSKey('rooms_furniture')).to.equal(true);
        expect(Room.isSKey('rooms_href')).to.equal(true);


        expect(Room.isSKey('')).to.equal(false);
        expect(Room.isSKey('asdf lkjd f kdjf')).to.equal(false);
        expect(Room.isSKey('(*)(*)(*')).to.equal(false);

        expect(Room.isSKey('rooms_lat')).to.equal(false);
        expect(Room.isSKey('rooms_lon')).to.equal(false);
        expect(Room.isSKey('rooms_seats')).to.equal(false);
    });
});