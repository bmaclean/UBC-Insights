import {Node} from "../Node";
import {KeyNode} from "../key_nodes/KeyNode";
import {SKeyNode} from "../key_nodes/SKeyNode";
import {MKeyNode} from "../key_nodes/MKeyNode";
import {CourseSection} from "../../controller/CourseSection";
import {Room} from "../../controller/Room";
import {Dataset} from "../../controller/Dataset";

export class GroupNode extends Node {

    private groupBy: KeyNode[];

    public constructor(qry: any, root?: Node) {
        super(qry, root);
        this.groupBy = [];
    }

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            // GROUP should be a non-empty array of keys
            let groupQry = this.query;
            if(!Array.isArray(groupQry) || groupQry.length === 0) {
                reject("Invalid query: GROUP should be an non-empty array of keys");
            }

            // parse all groupBy keys to verify they belong to one dataset
            let groupKeyPromise: Promise<string>[] = [];

            for(let gKey of groupQry) {

                if(CourseSection.isMKey(gKey) || Room.isMKey(gKey)) {
                    let key: KeyNode = new MKeyNode(gKey, this.root);
                    this.groupBy.push(key);
                    groupKeyPromise.push(key.parse());
                }
                else if(CourseSection.isSKey(gKey) || Room.isSKey(gKey)) {
                    let key: KeyNode = new SKeyNode(gKey, this.root);
                    this.groupBy.push(key);
                    groupKeyPromise.push(key.parse());
                }
                else {
                    reject("Invalid query: GROUP should only contain keys");
                }
            }

            Promise.all(groupKeyPromise).then(() => {
                fulfill();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public evaluate(ds: Dataset<any>): any[][] {

        if(ds.getSize() === 0)
            return [];

        else {

            let queryResult: any[] = Array.from(ds.getDataset().values());

            // sort queryResult by the group by keys
            queryResult.sort(this.multiSortCompareFunc.bind(this));

            let groups: any[][] = [];
            let groupKey = this.groupBy[0].getKey();

            let i = 0;
            let group = 0;

            // create initial group for first item in queryResult
            groups[group] = [];
            groups[group].push(queryResult[i]);
            let groupVals = this.getGroupVals(queryResult[i]);

            i++;
            while (i < queryResult.length) {

                // for each next item in queryResult check if its value of groupKey is
                // same as the previous one, if so add it to the same group
                if (this.compareGroupVals(this.getGroupVals(queryResult[i]), groupVals)) {
                    groups[group].push(queryResult[i]);

                } else {

                    // if not, that item goes to the next group
                    // create a new group for item and add item to new group
                    group++;
                    groups[group] = [];
                    groups[group].push(queryResult[i]);

                    // update groupVal, each next item will be checked to see if it has the
                    // same value for groupKey to see if it goes into the same group
                    groupVals = this.getGroupVals(queryResult[i]);
                }

                i++;
            }

            return groups;
        }
    }

    public getAllGroupByKeys(): string[] {
        let keys: string[] = [];
        for(let groupKey of this.groupBy) {
            keys.push(groupKey.getKey());
        }

        return keys;
    }

    private multiSortCompareFunc(a: CourseSection | Room, b: CourseSection | Room): number {
        return this.multiSortCompareFuncHelper(a, b, 0);
    }

    private multiSortCompareFuncHelper(a: CourseSection | Room, b: CourseSection | Room, i: number): number {

        let sortKey: string = this.groupBy[i].getKey();

        if (a[sortKey] < b[sortKey])
            return -1;
        else if(a[sortKey] === b[sortKey]) {
            if(i === this.groupBy.length-1)
                return 0;
            else
                return this.multiSortCompareFuncHelper(a, b, ++i);
        } else
            return 1;
    }

    private getGroupVals(item: any): any[] {
        let vals: any[] = [];
        for(let group of this.groupBy) {
            vals.push(item[group.getKey()]);
        }

        return vals;
    }

    private compareGroupVals(itemVals: any[], groupVals: any[]): boolean {
        if(itemVals.length !== groupVals.length)
            return false;

        for(let i = 0; i < itemVals.length; i++) {
            if(itemVals[i] !== groupVals[i])
                return false;
        }

        return true;
    }
}