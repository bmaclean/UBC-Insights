import {Node} from "../Node";
import {SKeyNode} from "../key_nodes/SKeyNode";

export abstract class SCompNode extends Node {
    protected sKey: SKeyNode;
    protected inputString: string;

    public constructor(qry: any, root?: Node) {
        super(qry, root);
    }

    public parse() : Promise<String> {
        return new Promise((fulfill, reject) => {

            // check that key is non-empty
            if (Object.keys(this.query).length !== 1)
                reject('Invalid query: SCOMPARISON should have an s_key');

            // key specified in query (i.e. dept)
            let key: string = Object.keys(this.query)[0].toString();
            this.sKey = new SKeyNode(key, this.root);

            this.sKey.parse().then(() => {

                if(typeof this.query[key] === 'string') {
                    this.inputString = this.query[key];
                    fulfill();
                } else
                    reject('Invalid query: value of s_key: ' + this.sKey + ' has to be a string');

            }).catch(function(err) {
                reject(err);
            });
        });
    }
}