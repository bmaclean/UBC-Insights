import {Node} from "../Node";
import {MKeyNode} from "../key_nodes/MKeyNode";

export abstract class MCompNode extends Node {
    protected mKey: MKeyNode;
    protected val: number;

    public constructor(qry: any, root?: Node) {
        super(qry, root);
    }

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            if (Object.keys(this.query).length !== 1)
                reject('Invalid query: MCOMPARISON should have an m_key');

            let key: string = Object.keys(this.query)[0];
            this.mKey = new MKeyNode(key, this.root);

            this.mKey.parse().then(() => {

                if(typeof this.query[key] === 'number') {
                    this.val = this.query[key];
                    fulfill();
                } else
                    reject('Invalid query: value of m_key: ' + this.mKey + ' has to be a number')

            }).catch(function(err: string) {
                reject(err);
            });
        });
    }
}