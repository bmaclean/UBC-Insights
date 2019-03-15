import {LogicNode} from "./LogicNode";
import {Dataset} from "../../controller/Dataset";

export class ORNode extends LogicNode {

    public evaluate(ds: Dataset<any>): Dataset<any> {

        let filterResults: Dataset<any>[] = [];
        for (let filter of this.filters) {
            filterResults.push(filter.evaluate(ds));
        }

        let result: Dataset<any> = new Dataset<any>();
        for(let filterResult of filterResults) {
            filterResult.getDataset().forEach(function(item, index: string) {
                if(!result.has(index)) {
                    result.set(index, item);
                }
            });
        }

        return result;
    }
}