import {Node} from "../Node";
import {MKeyNode} from "../key_nodes/MKeyNode";

export class SumNode extends Node {

    private key: MKeyNode;

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            if(typeof this.query !== 'string')
                reject("Invalid query: key for APPLYTOKEN should be a string");

            this.key = new MKeyNode(this.query, this.root);
            this.key.parse().then(() => {
                fulfill();
            }).catch((err) => {
                reject(err);
            })
        });
    }

    public evaluate(group: any[]): number {

        let keyVal: string = this.key.getKey();
        let sum: number = 0;

        for(let item of group) {
            sum += item[keyVal];
        }
        return sum;
    }
}