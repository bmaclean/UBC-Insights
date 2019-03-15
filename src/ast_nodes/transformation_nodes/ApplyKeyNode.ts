import {Node} from "../Node";
import {ApplyTokenNode} from "./ApplyTokenNode";
import {Dataset} from "../../controller/Dataset";
import {ApplyNode} from "./ApplyNode";

export class ApplyKeyNode extends Node {

    private applyNode: ApplyNode;

    private keyName: string;
    private applyToken: ApplyTokenNode;

    public constructor(qry: any, apply: ApplyNode, root?: Node) {
        super(qry, root);
        this.applyNode = apply;
    }

    public parse(): Promise<string> {

        return new Promise((fulfill, reject) => {

            if(Object.keys(this.query).length !== 1)
                reject("Invalid query: APPLYKEY can have only one APPLYTOKEN");

            // get the name of the APPLYKEY
            let name: string = Object.keys(this.query)[0];

            // APPLYKEY name has to be non-empty string, and it can't contain _ (underscore)
            if(name.length === 0 || name.indexOf('_') > 0)
                reject("Invalid query: APPLYKEY should have a non-empty name without _ character");

            this.keyName = name;

            // check if there is already an APPLYKEY with the same name
            if(this.applyNode.applyKeyExists(this.keyName))
                reject("Invalid query: each APPLYKEY should have a unique name");


            // parse the APPLYTOKEN
            this.applyToken = new ApplyTokenNode(this.query[name], this.root);
            this.applyToken.parse().then(() => {
                fulfill();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public evaluate(group: any[]): number {
        return this.applyToken.evaluate(group);
    }

    public getName(): string {
        return this.keyName;
    }
}