import {Node} from "./Node";
import {BodyNode} from "./BodyNode";
import {OptionsNode} from "./OptionsNode";
import {TransformationsNode} from "./TransformationsNode";
import {Dataset} from "../controller/Dataset";
import {CourseSection} from "../controller/CourseSection";
import {Room} from "../controller/Room";

export class QueryNode extends Node {
    private body: BodyNode;
    private options: OptionsNode;
    private transformations: TransformationsNode;
    private datasetName: string;

    constructor(qry: any) {
        super(qry);
    }

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            // get the number of keys in the query
            // valid queries have two (WHERE and OPTIONS) or three (WHERE, OPTIONS and TRANSFORMATIONS) keys
            // if number of keys is not one of 2, 3 reject as invalid query
            let numProps: number = Object.keys(this.query).length;
            if (numProps !== 2 && numProps !== 3)
                reject('Invalid query: Query should contain WHERE, OPTIONS and TRANSFORMATIONS (optional)');

            // all valid queries require WHERE and OPTIONS
            if (!this.query.hasOwnProperty('WHERE'))
                reject('Invalid query: Query should contain a WHERE');

            if (!this.query.hasOwnProperty('OPTIONS'))
                reject('Invalid query: Query should contain a OPTIONS');


            this.body = new BodyNode(this.query['WHERE'], this);
            this.body.parse().then( () => {

                // if there is TRANSFORMATIONS, parse it first
                if (this.query.hasOwnProperty("TRANSFORMATIONS")) {
                    this.transformations = new TransformationsNode(this.query['TRANSFORMATIONS'], this);
                    return this.transformations.parse();
                } else {
                    return null;
                }

            }).then(() => {

                // parse OPTIONS after TRANSFORMATIONS
                this.options = new OptionsNode(this.query['OPTIONS'], this.transformations, this);
                this.options.parse().then(() => {
                    fulfill();
                }).catch((err) => {
                    reject(err);
                });

            }).catch((err) => {
                // parse on TRANSFORMATIONS rejected, reject query
                reject(err);
            });
        });
    }

    public evaluate(ds: Dataset<CourseSection> | Dataset<Room>): any {
        let queryResultDs: Dataset<any> = this.body.evaluate(ds);

        if(this.transformations) {
            let transformedData: any[] = this.transformations.evaluate(queryResultDs);
            return this.options.evaluate(transformedData);

        } else {
            let queryResult: any[] = Array.from(queryResultDs.getDataset().values());
            return this.options.evaluate(queryResult);
        }
    }

    public setDatasetName(name: string): void {
        this.datasetName = name;
    }

    public getDatasetName(): string {
        return this.datasetName;
    }
}