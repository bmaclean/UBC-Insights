import {Node} from "./Node";
import {GroupNode} from "./transformation_nodes/GroupNode";
import {ApplyNode} from "./transformation_nodes/ApplyNode";
import {Dataset} from "../controller/Dataset";

export class TransformationsNode extends Node {

    private group: GroupNode;
    private apply: ApplyNode;

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            // All valid TRANSFORMATIONS nodes should have both GROUP and APPLY
            if (Object.keys(this.query).length !== 2 ) {
                reject("Invalid query: TRANSFORMATIONS should contain GROUP and APPLY")
            }

            if (!this.query.hasOwnProperty('GROUP'))
                reject('Invalid query: TRANSFORMATIONS should contain a GROUP');

            if (!this.query.hasOwnProperty('APPLY'))
                reject('Invalid query: TRANSFORMATIONS should contain an APPLY');

            // parse GROUP
            this.group = new GroupNode(this.query['GROUP'], this.root);
            this.group.parse().then(() => {

                // parse APPLY
                this.apply = new ApplyNode(this.query['APPLY'], this.root);
                this.apply.parse().then(() => {
                    fulfill();
                }).catch((err) => {
                    reject(err);
                })

            }).catch((err) => {
                reject(err);
            })
        });
    }

    public evaluate(ds: Dataset<any>): any {

        let groups: any[][] = this.group.evaluate(ds);
        let transformedDataset: any[] = [];

        for(let group of groups) {
            let item: any = {};

            for(let groupKey of this.group.getAllGroupByKeys()) {
                item[groupKey] = group[0][groupKey];
            }

            for(let applyKey of this.apply.getAllApplyKeys()) {
                item[applyKey.getName()] = applyKey.evaluate(group);
            }

            transformedDataset.push(item);
        }

        return transformedDataset;
    }

    public getAllPossibleColumnNames(): string[] {
        let possibleColumns: string[] = [];
        possibleColumns = possibleColumns.concat(this.group.getAllGroupByKeys());
        possibleColumns = possibleColumns.concat(this.apply.getAllApplyNames());

        return possibleColumns;
    }
}