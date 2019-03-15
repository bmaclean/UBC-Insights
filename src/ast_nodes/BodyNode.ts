import {Node} from "./Node";
import {FilterNode} from "./filter_nodes/FilterNode";
import {Dataset} from "../controller/Dataset";

export class BodyNode extends Node {
    private filter: FilterNode;

    constructor(qry: any, root?: Node) {
        super(qry, root);
    }

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            if(Object.keys(this.query).length === 0) {
                fulfill();
                // reject('Invalid query: Query BODY should contain a FILTER');
            } else {

                this.filter = new FilterNode(this.query, this.root);

                this.filter.parse().then(function () {
                    fulfill();
                }).catch(function (err: string) {
                    reject(err);
                });
            }
        });
    }

    public evaluate(ds: Dataset<any>): Dataset<any> {
        if(this.filter)
            return this.filter.evaluate(ds);
        else
            return ds;
    }
}