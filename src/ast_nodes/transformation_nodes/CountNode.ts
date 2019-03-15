import {Node} from "../Node";
import {KeyNode} from "../key_nodes/KeyNode";
import {MKeyNode} from "../key_nodes/MKeyNode";
import {SKeyNode} from "../key_nodes/SKeyNode";
import {CourseSection} from "../../controller/CourseSection";
import {Room} from "../../controller/Room";

export class CountNode extends Node {

    private key: KeyNode;

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            if(typeof this.query !== 'string')
                reject("Invalid query: key for APPLYTOKEN should be a string");

            let key: string = this.query;
            if(CourseSection.isMKey(key) || Room.isMKey(key))
                this.key = new MKeyNode(key, this.root);
            else if(CourseSection.isSKey(key) || Room.isSKey(key))
                this.key = new SKeyNode(key, this.root);
            else
                reject("Invalid query: key for APPLYTOKEN COUNT should be a mKey or sKey");

            this.key.parse().then(() => {
                fulfill();
            }).catch((err) => {
                reject(err);
            })
        });
    }

    public evaluate(group: any[]): number {

        let keyVal: string = this.key.getKey();
        var uniqueVals: Set<any> = new Set<any>();

        for(let item of group) {
            uniqueVals.add(item[keyVal]);
        }

        return uniqueVals.size;
    }
}