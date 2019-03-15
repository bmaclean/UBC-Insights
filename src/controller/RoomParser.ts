import {Parser} from "./Parser";
import {Dataset} from "./Dataset";
import {Room} from "./Room";

let JSZip = require('jszip');
let http = require('http');
let parse5 = require("parse5");

export class RoomParser extends Parser {

    /*
    * take in ZIP, read index.HTM in ZIP
    * index.HTM has buildings and rooms as HTML
    * Parse JSON into query data (Rooms)
    * */

    public parse(base64content: string): Promise <Dataset<Room>> {
        return new Promise ((fulfill, reject) => {
            JSZip().loadAsync(base64content, { base64: true })
                .then( (jsZip : JSZip) => {

                    if(!jsZip.file("index.htm")) {
                        reject("No index.htm found");
                    }

                    jsZip.file("index.htm").async('text')
                        .then ((content : string) => {

                            let validBuildings: string[] = [];
                            let filePromises: Array<Promise<string>> = [];
                            let docNode: any = parse5.parse(content);

                            //get list of valid building codes
                            let validBuildingNodes: any[] = [];
                            this.findNodesByClassAndElement(docNode, "views-field views-field-field-building-code",
                                "td", validBuildingNodes);

                            for (let node of validBuildingNodes) {
                                let thisBuilding = this.removeSpaces(node.childNodes[0].value);
                                validBuildings.push(thisBuilding);
                            }

                            let folder: string = "campus/discover/buildings-and-classrooms/";
                            for (let building of validBuildings) {
                                if (jsZip.file(folder + building))
                                    filePromises.push(jsZip.file(folder + building).async('text'));
                            }

                            Promise.all(filePromises)
                                .then((fileContents: string[]) => {

                                    let validRooms: number = 0;
                                    let dataset: any = new Dataset<Room>();
                                    let buildingPromises: any[] = [];

                                    for (let i: number = 0; i < fileContents.length; i++) {
                                        buildingPromises.push(this.parseBuilding(validBuildings[i], fileContents[i], dataset));
                                    }

                                    Promise.all(buildingPromises)
                                        .then((roomsOnBlds: number[]) => {

                                            for (let noRooms of roomsOnBlds) {
                                                validRooms += noRooms;
                                            }

                                            if (validRooms > 0)
                                                fulfill(dataset);
                                            else
                                                reject('dataset is not valid, there are no rooms');
                                        })
                                        .catch((err: any) => {
                                            reject(err)
                                        });
                                })
                                .catch((err: any) => {
                                    reject(err);
                                });
                        })
                        .catch(  (err : any) => {
                            reject("invalid index.htm file: " + err);
                        });
                })
                .catch((err:any) => {
                    reject("invalid zip file: " + err);
                });
        });
    }

    private parseBuilding(bldCode: string, bldHtml: string, dataset: Dataset<Room>): Promise<number> {

        return new Promise( (fulfill, reject) => {
            let bldRoot: any = parse5.parse(bldHtml);
            let bldInfoNode: any = this.findNodeById(bldRoot, "building-info");

            if(!bldInfoNode) {
                // return if html has no div element with building name & address
                fulfill(0);
            }

            let bldName: string = this.getBldNameFromInfo(bldInfoNode);
            let bldAddress: string = this.getBldAddressFromInfo(bldInfoNode);

            this.getLatLon(bldAddress)
                .then( (latlon: any) => {

                    let lat: number = latlon.lat;
                    let lon: number = latlon.lon;

                    let roomNumRows: any[] = [];
                    let roomSizeRows: any[] = [];
                    let roomFurnitureRows: any[] = [];
                    let roomTypeRows: any[] = [];
                    let roomLinkRows: any[] = [];

                    this.findNodesByClassAndElement(bldRoot, "views-field views-field-field-room-number", "td", roomNumRows);
                    this.findNodesByClassAndElement(bldRoot, "views-field views-field-field-room-capacity", "td", roomSizeRows);
                    this.findNodesByClassAndElement(bldRoot, "views-field views-field-field-room-furniture", "td", roomFurnitureRows);
                    this.findNodesByClassAndElement(bldRoot, "views-field views-field-field-room-type", "td", roomTypeRows);
                    this.findNodesByClassAndElement(bldRoot, "views-field views-field-nothing", "td", roomLinkRows);

                    for (let i = 0; i < roomNumRows.length; i++) {

                        let roomNum: string = this.getRoomNumberFromNode(roomNumRows[i]);
                        let capacity: string = this.getTextFromNode(roomSizeRows[i]);
                        let furniture: string = this.getTextFromNode(roomFurnitureRows[i]);
                        let type: string = this.getTextFromNode(roomTypeRows[i]);
                        let href: string = this.getRoomLinkFromNode(roomLinkRows[i]);

                        let rm: Room = new Room();
                        rm.rooms_shortname = bldCode;
                        rm.rooms_fullname = bldName;
                        rm.rooms_number = roomNum;
                        rm.rooms_name = bldCode + "_" + roomNum;
                        rm.rooms_address = bldAddress;
                        rm.rooms_lat = lat;
                        rm.rooms_lon = lon;
                        rm.rooms_seats = parseInt(capacity);
                        rm.rooms_furniture = furniture;
                        rm.rooms_type = type;
                        rm.rooms_href = href;
                        dataset.set(rm.rooms_name, rm);
                    }

                    fulfill(roomNumRows.length);
                })
                .catch(() => {
                    //fulfill with 0 instead of reject, so that Promise.all doesn't fail on one file failing
                    fulfill(0);
                })
        });
    }

    private findNodeById(rootNode: any, id: string): any {

        if(rootNode.childNodes) {
            for (let node of rootNode.childNodes) {

                if (node.attrs && node.attrs.length > 0) {
                    for (let attr of node.attrs) {
                        if (attr.name && attr.name === 'id' && attr.value && attr.value === id)
                            return node;
                    }
                }

                let foundChild: any = this.findNodeById(node, id);
                if(foundChild)
                    return foundChild;
            }
        }

        return null;
    }

    /*
    private findNodesByClass(rootNode: any, className: string, items: any[]): void {
        if(rootNode.childNodes) {
            for(let node of rootNode.childNodes) {

                if(//(node.nodeName === 'td' || node.nodeName === 'tr') &&
                    node.attrs && node.attrs.length > 0) {
                    for(let attr of node.attrs) {
                        if(attr.name && attr.name === 'class' && attr.value && attr.value === className) {
                            items.push(node);
                        }
                    }
                }

                this.findNodesByClass(node, className, items);
            }
        }
    }*/

    private findNodesByClassAndElement(rootNode: any, className: string, element:string, items: any[]): void {

        if(rootNode.childNodes) {
            for(let node of rootNode.childNodes) {

                if(node.nodeName && node.nodeName === element && node.attrs && node.attrs.length > 0) {
                    for(let attr of node.attrs) {
                        if(attr.name && attr.name === 'class' && attr.value && attr.value === className) {
                            items.push(node);
                        }
                    }
                }

                this.findNodesByClassAndElement(node, className, element, items);
            }
        }
    }

    private getBldNameFromInfo(bldInfoNode: any): string {

        if (bldInfoNode.childNodes && bldInfoNode.childNodes.length > 0) {
            for (let node of bldInfoNode.childNodes) {
                if (node.tagName === "h2") {
                    if (node.childNodes && node.childNodes.length > 0) {
                        let spanNode = node.childNodes[0];
                        if (spanNode.childNodes && spanNode.childNodes.length > 0 && spanNode.childNodes[0].value)
                            return spanNode.childNodes[0].value;
                    }
                }
            }
        }

        return "";
    }

    private getBldAddressFromInfo(bldInfoNode: any): string {
        let fieldDivs: any[] = [];
        this.findNodesByClassAndElement(bldInfoNode,"field-content", "div", fieldDivs);

        if(fieldDivs.length > 0) {
            if(fieldDivs[0].childNodes && fieldDivs[0].childNodes.length > 0 && fieldDivs[0].childNodes[0].value)
                return fieldDivs[0].childNodes[0].value;
        }

        return "";
    }

    private getRoomNumberFromNode(roomNumNode: any): string {

        if(roomNumNode.childNodes && roomNumNode.childNodes.length > 0) {
            for(let node of roomNumNode.childNodes) {
                if(node.tagName === "a")
                    if(node.childNodes && node.childNodes.length > 0)
                        return (node.childNodes[0].value).trim();
            }
        }
        return "";
    }

    private getRoomLinkFromNode(roomLinkNode: any): string {
        if(roomLinkNode.childNodes && roomLinkNode.childNodes.length > 0) {
            let node = roomLinkNode.childNodes[1];
            if(node.attrs && node.attrs.length > 0)
                return (node.attrs[0].value).trim();
        }

        return "";
    }

    private getTextFromNode(node: any): string {
        if(node.childNodes && node.childNodes.length > 0)
            return (node.childNodes[0].value).trim();

        return "";
    }

    private getLatLon(address: string): Promise<any> {
        return new Promise((fulfill, reject) => {

            let endpoint: string = 'http://skaha.cs.ubc.ca:11316/api/v1/team140/';

            http.get(endpoint + encodeURIComponent(address), (response: any) => {

                // A successful response will have status code 200, so if its not 200, reject
                if(response.statusCode != 200)
                    reject("getLatLon failed, status code: " + response.statusCode);

                let rawData: any = '';
                response.on('data', (chunk: any) => {
                    // collect data stream as it comes
                    rawData += chunk;
                });

                response.on('end', () => {
                    if(rawData.error)
                        reject(rawData.error);
                    else {
                        // console.log("fulfilling lat/lon:" + rawData);
                        fulfill(JSON.parse(rawData));
                    }
                });

            }).on('error', (err: any) => {
                // http.get request caused an error, reject
                reject(err);
            });
        });
    }

    private removeSpaces(str: any) {
        str = str.replace(/^\s+|\s+$/g, "");
        return str;
    }
}