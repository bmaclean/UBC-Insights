import {Node} from "../Node";
import {MKeyNode} from "../key_nodes/MKeyNode";

export class MinNode extends Node {

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

        let keyVal:string = this.key.getKey();
        let minVal: number = group[0][keyVal];

        for(let item of group) {
            if(item[keyVal] < minVal)
                minVal = item[keyVal]
        }
        return minVal;
    }
}