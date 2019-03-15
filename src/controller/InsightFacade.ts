/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";
import Log from "../Util";
import {Parser} from "./Parser";
import {CoursesParser} from "./CoursesParser";
import {RoomParser} from "./RoomParser";
import {Dataset} from "./Dataset";
import {CourseSection} from "./CourseSection";
import {Room} from "./Room";
import {QueryNode} from "../ast_nodes/QueryNode";

let fs = require("fs");

export default class InsightFacade implements IInsightFacade {

    private datasets: any;

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
        this.datasets = {};
        this.loadDiskCache();
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        return new Promise((fulfill, reject) => {

            let parser: Parser;

            if (id === "courses") {
                parser = new CoursesParser();
            }
            else if (id === "rooms") {
                parser = new RoomParser();
            }

            if(parser) {
                parser.parse(content).then((ds: Dataset<CourseSection> | Dataset<Room>) => {

                    // check if we are overwriting an existing id
                    let overwrite = false;
                    if(this.datasets.hasOwnProperty(id))
                        overwrite = true;

                    this.datasets[id] = ds;

                    if(this.updateDiskCache()) {
                        fulfill({
                            code: overwrite ? 201 : 204,
                            body: { "msg": "successfully parsed " + ds.getSize() + " items from file" }
                        });
                    } else {
                        reject({
                            code: 400,
                            body: { "error": "failed to cache dataset to disk" }
                        });
                    }
                }).catch(function(err) {
                    reject({
                        code: 400,
                        body: { "error": err }
                    });
                });
            } else {
                reject({
                    code: 400,
                    body: { "error": "no matching parser for id: " + id }
                });
            }
        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise((fulfill, reject) => {

            if(this.datasets.hasOwnProperty(id)) {
                delete this.datasets[id];
                fs.unlinkSync('cache-data/' + id);
                fulfill({
                    code: 204,
                    body: {"msg": "dataset " + id + " removed"}
                });

            } else {
                reject({
                    code: 404,
                    body: { "error": "no dataset with id: " + id +" found" }
                })
            }
        });
    }

    //ASSUMPTION: if the query is an object, the JSON syntax is valid
    performQuery(query: any): Promise <InsightResponse> {

        return new Promise((fulfill, reject) => {

            if(!query) {
                reject({
                    code: 400,
                    body: { "error": "empty query" }
                });
            }
            else {
                let qryAST : QueryNode = new QueryNode(query);
                qryAST.parse().then(() => {

                    let datasetName: string = qryAST.getDatasetName();

                    if(this.datasets.hasOwnProperty(datasetName)) {
                        let result: any = qryAST.evaluate(this.datasets[datasetName]);
                        fulfill({
                            code: 200,
                            body: result
                        });
                    } else {
                        reject({
                            code: 424,
                            body: { "error": "no datasets with id: " + datasetName + " to perform query" }
                        });
                    }

                }).catch(function(err) {
                    console.log("query rejected: " + err);
                    reject({
                        code: 400,
                        body: { "error": err }
                    });
                });
            }
        });
    }

    private loadDiskCache(): void {

        let cacheDir = 'cache-data/';
        try {
            fs.readdirSync(cacheDir).forEach((filename: string) => {
                let data: any = JSON.parse(fs.readFileSync(cacheDir + filename));

                // read datast from file based on id (filename)
                if(filename === 'courses') {

                    let ds: Dataset<CourseSection> = new Dataset<CourseSection>();
                    for(let key of Object.keys(data)) {
                        let cs: CourseSection = data[key];
                        ds.set(cs.courses_uuid, cs);
                    }
                    this.datasets[filename] = ds;
                }
                else if(filename === 'rooms') {

                    let ds: Dataset<Room> = new Dataset<Room>();
                    for(let key of Object.keys(data)) {
                        let rm: Room = data[key];
                        ds.set(rm.rooms_name, rm);
                    }
                    this.datasets[filename] = ds;

                } else {
                    // skip if filename (id) is not rooms or courses
                    Log.warn("File with unrecognized dataset id in cache data");
                }
            });
        } catch(e) {
            Log.info('No cache data found');
        }
    }

    private updateDiskCache(): boolean {
        // write datasets to cache-data dir on local disk
        try {
            // create dir cache-data if it doesn't exist
            if(!fs.existsSync('cache-data'))
               fs.mkdirSync('cache-data');

            for (let id in this.datasets)
                fs.writeFileSync('cache-data/' + id, JSON.stringify(this.datasets[id].toJSON()));
            return true;

        } catch(e) {
            Log.warn('Error writing to cache');
            return false;
        }
    }
}
