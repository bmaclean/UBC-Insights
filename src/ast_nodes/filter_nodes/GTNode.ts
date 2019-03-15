import {MCompNode} from "./MCompNode";
import {Node} from "../Node";
import {Dataset} from "../../controller/Dataset";

export class GTNode extends MCompNode {

    public evaluate(ds: Dataset<any>): Dataset<any> {

        let result: Dataset<any> = new Dataset<any>();
        let key: string = this.mKey.evaluate();

        ds.getDataset().forEach((item: any, index: string) => {
            if(item[key] > this.val) {
                result.set(index, item);
            }
        });

        return result;
    }
}