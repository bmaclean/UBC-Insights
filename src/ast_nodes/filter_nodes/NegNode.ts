import {Node} from "../Node";
import {FilterNode} from "./FilterNode";

export abstract class NegNode extends Node {
    protected filter : FilterNode;

    public constructor(qry: any, root?: Node) {
        super(qry, root);
    }

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            this.filter = new FilterNode(this.query, this.root);
            this.filter.parse().then( function() {
                fulfill();
            }).catch( function(e) {
                reject(e);
            });
        });
    }
}