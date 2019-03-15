import {LogicNode} from "./LogicNode";
import {Node} from "../Node";
import {Dataset} from "../../controller/Dataset";

export class ANDNode extends LogicNode {

    public evaluate(ds: Dataset<any>): Dataset<any> {

        let filterResults: Dataset<any>[] = [];
        for (let filter of this.filters) {
            filterResults.push(filter.evaluate(ds));
        }

        // find the smallest result dataset
        let minResult: number = filterResults[0].getSize();
        let minResultIndex: number = 0;
        for (let i = 1; i < filterResults.length; i++) {
            if(filterResults[i].getSize() < minResult) {
                minResult = filterResults[i].getSize();
                minResultIndex = i;
            }
        }

        // all result datasets should have every element in the smallest dataset for AND
        // from the smallest dataset, remove each element that is not in all other result datasets

        let result: Dataset<any> = filterResults[minResultIndex];
        filterResults.splice(minResultIndex, 1);

        result.getDataset().forEach((item: any, index: string) => {
            for(let filterResult of filterResults) {
                if(!filterResult.has(index)) {
                    result.remove(index);
                    break;
                }
            }
        });

        return result;
    }
}