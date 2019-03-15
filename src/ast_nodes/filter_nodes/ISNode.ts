import {SCompNode} from "./SCompNode";
import {Dataset} from "../../controller/Dataset";
import {Node} from "../Node";

export class ISNode extends SCompNode {

    public evaluate(ds: Dataset<any>): Dataset<any> {
        let result : Dataset<any> = new Dataset<any>();
        let key: string = this.sKey.evaluate();

        ds.getDataset().forEach((item: any, index: string) => {

            if ((this.inputString[0] == "*") && (this.inputString[this.inputString.length-1] == "*")) {
                if (ISNode.matchesMiddle(item[key], this.inputString)) {
                    result.set(index, item);
                }
            }

            else if (this.inputString[0] == "*") {
                if (ISNode.matchesSuffix(item[key], this.inputString)) {
                    result.set(index, item);
                }
            }

            else if (this.inputString[this.inputString.length-1] == "*") {
                if (ISNode.matchesPrefix(item[key], this.inputString)) {
                    result.set(index, item);
                }
            }

            else if (item[key] === (this.inputString)) {
                result.set(index, item);
            }
        });

        return result;
    };

    private static matchesPrefix (str : string, prefix : string): boolean {
        let prefixString = prefix.substring(0, prefix.length-1);
        return str.startsWith(prefixString);
    }

    private static matchesSuffix (str : string, suffix : string): boolean {
        let suffixString = suffix.substring(1, suffix.length);
        return str.endsWith(suffixString);
    }

    private static matchesMiddle (str : string, middle : string): boolean {
        let middleString = middle.substring(1, middle.length - 1);
        return str.includes(middleString);
    }
}