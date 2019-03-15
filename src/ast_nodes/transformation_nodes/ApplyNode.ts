import {Node} from "../Node";
import {ApplyKeyNode} from "./ApplyKeyNode";
import {Dataset} from "../../controller/Dataset";

export class ApplyNode extends Node {

    private applyKeys: ApplyKeyNode[];

    public constructor(qry: any, root?: Node) {
        super(qry, root);
        this.applyKeys = [];
    }

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            // APPLY should be an array, can be empty
            let applyQry = this.query;
            if(!Array.isArray(applyQry)) {
                reject("Invalid query: APPLY should be an array APPLYKEY");
            }

            // parse all APPLYKEY in the APPLY array
            let applyKeyPromises: Promise<string>[] = [];

            for(let aKey of applyQry) {
                let applyKeyNode: ApplyKeyNode = new ApplyKeyNode(aKey, this, this.root);
                this.applyKeys.push(applyKeyNode);
                applyKeyPromises.push(applyKeyNode.parse());
            }

            Promise.all(applyKeyPromises).then(() => {
                fulfill();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public evaluate(ds: Dataset<any>): any {
        //return null;
    }

    // returns True if there is an ApplyKeyNode in applyKeys with the same name as keyName
    public applyKeyExists(keyName: string): boolean {

        // skip the last APPLYKEY in the array as it is the one we are checking
        for(let i = 0; i < this.applyKeys.length - 1; i++) {
            if(this.applyKeys[i].getName() === keyName)
                return true;
        }

        return false;
    }

    public getAllApplyNames(): string[] {
        let allApplyNames: string[] = [];

        for(let applyKey of this.applyKeys) {
            allApplyNames.push(applyKey.getName());
        }

        return allApplyNames;
    }

    public getAllApplyKeys(): ApplyKeyNode[] {
        return this.applyKeys;
    }
}