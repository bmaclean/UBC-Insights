import {Node} from "./Node";
import {Dataset} from "../controller/Dataset";
import {CourseSection} from "../controller/CourseSection";
import {Room} from "../controller/Room";
import {QueryNode} from "./QueryNode";
import {SortNode} from "./SortNode";
import {TransformationsNode} from "./TransformationsNode";

export class OptionsNode extends Node {

    private columns: string[];
    // private order: string;
    private sort: SortNode;

    private transformations: TransformationsNode;

    public constructor(qry: any, transformations: TransformationsNode, root?: Node) {
        super(qry, root);
        this.columns = [];
        this.transformations = transformations;
    }

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            if (!this.query.hasOwnProperty('COLUMNS'))
                reject('Invalid query: Query should contain COLUMNS');

            // COLUMNS should be a non-empty array
            if(!Array.isArray(this.query['COLUMNS']))
                reject('Invalid query: COLUMNS should contain an array of strings');

            let columnsQry = this.query['COLUMNS'];
            if(columnsQry.length === 0)
                reject('Invalid query: COLUMNS should be a non-empty array of strings');


            if(this.transformations) {

                // if transformations is given in the query,
                // valid COLUMNS values are either group terms or terms defined in APPLY
                let possibleColumnNames: string[] = this.transformations.getAllPossibleColumnNames();

                for(let col of columnsQry) {
                    if(typeof col !== 'string')
                        reject('Invalid query: COLUMNS array should only contain strings');
                    else {
                        let colStr = col.toString();
                        if (possibleColumnNames.includes(colStr))
                            this.columns.push(colStr);
                        else
                            reject('Invalid query: COLUMNS contain an invalid item: ' + colStr);
                    }
                }

            } else {

                // if there are no transformations,
                // COLUMNS values are valid keys from a single dataset
                for(let col of columnsQry) {
                    if(typeof col !== 'string')
                        reject('Invalid query: COLUMNS array should only contain string keys');
                    else {
                        let colStr = col.toString();
                        if (CourseSection.isKey(colStr) || Room.isKey(colStr)) {
                            this.columns.push(colStr);
                            this.setDatasetName(colStr);
                        } else
                            reject('Invalid query: COLUMNS contain an invalid key: ' + colStr);
                    }
                }
            }

            if(this.query.hasOwnProperty('ORDER')) {

                this.sort = new SortNode(this.query['ORDER'], this, this.root);
                this.sort.parse().then(() => {
                    fulfill();
                }).catch((err) => {
                    reject(err);
                });

            } else
                fulfill();


            /*
                let orderVal: string = this.query['ORDER'];
                if((CourseSection.isKey(orderVal) || Room.isKey(orderVal)) && this.columns.includes(orderVal)) {
                    this.order = orderVal;
                    fulfill();
                } else
                    reject('Invalid query: ORDER contains an invalid key or a key not added to COLUMNS:' + orderVal);
                */
        });
    }

    /*
    public evaluate(queryResult: CourseDataset): any {
        queryResult.sort(this.order);

        console.log(this.columns.length);
        let result: any[] = [];
        for(let section of queryResult.getDataset()) {
            let cs: any = {};
            for(let column of this.columns) {
                cs[column] = section[column];
            }
            result.push(cs);
        }

        return {result: result};
    }*/

    public evaluate(items: any[]): any {

        let result: any[] = [];
        for(let item of items) {
            let cs: any = {};
            for (let column of this.columns) {
                cs[column] = item[column];
            }
            result.push(cs);
        }

        if(this.sort)
            result = this.sort.evaluate(result);

        return {result: result};
    }

    private setDatasetName(key: string): void {
        if(CourseSection.isKey(key))
            (this.root as QueryNode).setDatasetName("courses");
        else if (Room.isKey(key))
            (this.root as QueryNode).setDatasetName("rooms")
    }

    public getColumns(): string[] {
        return this.columns;
    }
}