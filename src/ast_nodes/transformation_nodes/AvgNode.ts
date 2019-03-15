import {Node} from "../Node";
import {MKeyNode} from "../key_nodes/MKeyNode";
let Decimal = require('decimal.js');

export class AvgNode extends Node {

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
        let valsToAvg: number[] = [];

        for(let item of group) {
            valsToAvg.push(item[keyVal]);
        }

        let avg: number = Number(
            (valsToAvg.map(val => <any> new Decimal(val))
                .reduce((a,b) => a.plus(b)).toNumber() / valsToAvg.length).toFixed(2));

        return avg;
    }
}