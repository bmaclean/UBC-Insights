import {Node} from "../Node";
import {QueryNode} from "../QueryNode";
import {CourseSection} from "../../controller/CourseSection";
import {Room} from "../../controller/Room";
import {KeyNode} from "./KeyNode";

export class MKeyNode extends KeyNode {

    public constructor(qry: string, root?: Node) {
        super(qry, root);
    }

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            // find which dataset key belongs to
            let keyDataset: string;
            if(CourseSection.isMKey(this.query))
                keyDataset = 'courses';
            else if(Room.isMKey(this.query))
                keyDataset = 'rooms';

            //  key should belongs to one of 'courses' or 'rooms' datasets; if not, reject
            if(!keyDataset) {
                reject('Invalid query: invalid mKey: ' + this.query);

            } else {

                // check if Query has a dataset name set
                let queryDataset: string = (this.root as QueryNode).getDatasetName();
                if(!queryDataset) {
                    // dataset name not set, this is the first key encountered on the query, set dataset name
                    (this.root as QueryNode).setDatasetName(keyDataset);
                    fulfill();

                } else {
                    // dataset name is set, check if key belongs to that dataset
                    if(keyDataset === queryDataset)
                        fulfill();
                    else
                        reject('Invalid query: query contain keys from multiple datasets');
                }
            }
        });
    }

    public evaluate(): string {
        return this.query;
    }
}