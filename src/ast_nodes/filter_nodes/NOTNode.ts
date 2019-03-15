import {NegNode} from "./NegNode";
import {Dataset} from "../../controller/Dataset";

export class NOTNode extends NegNode {

    public evaluate(ds: Dataset<any>): Dataset<any> {

        let result: Dataset<any> = new Dataset<any>();
        let resultFilter: Dataset<any> = this.filter.evaluate(ds);

        ds.getDataset().forEach(function(item: any, index: string) {
            if(!resultFilter.has(index)){
                result.set(index, item);
            }
        });

        return result;
    }
}