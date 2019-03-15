import {Node} from "../Node";
import {FilterNode} from "./FilterNode";

export abstract class LogicNode extends Node {
    protected filters : FilterNode[];

    public constructor(qry: any, root?: Node) {
        super(qry, root);
        this.filters = [];
    }

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            if (!Array.isArray(this.query)) {
                reject("Invalid query: LOGIC should have an array of FILTER statements");
            }

            let qryArr = this.query;
            if (qryArr.length < 1) {
                reject("Invalid query: LOGIC should have at least one FILTER");
            }

            let parseFiltersPromises: Promise<string>[] = [];
            for (let qry of qryArr) {
                let filter: FilterNode = new FilterNode(qry, this.root);
                this.filters.push(filter);
                parseFiltersPromises.push(filter.parse());
            }

            Promise.all(parseFiltersPromises).then(() => {
                fulfill();
            }).catch(function(err) {
                reject(err);
            });
        });
    }
}