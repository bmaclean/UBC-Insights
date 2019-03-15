import {Node} from "../Node";
import {MaxNode} from "./MaxNode";
import {MinNode} from "./MinNode";
import {AvgNode} from "./AvgNode";
import {CountNode} from "./CountNode";
import {SumNode} from "./SumNode";

export class ApplyTokenNode extends Node {

    private maxNode: MaxNode;
    private minNode: MinNode;
    private avgNode: AvgNode;
    private countNode: CountNode;
    private sumNode: SumNode;

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            if(Object.keys(this.query).length !== 1)
                reject("Invalid query: APPLYTOKEN can have only one of MAX, MIN, AVG, COUNT, SUM");

            // the get APPLYTOKEN and check if it is a valid one
            let token: string = Object.keys(this.query)[0];
            switch(token) {
                case "MAX":
                    this.maxNode = new MaxNode(this.query['MAX'], this.root);
                    break;
                case "MIN":
                    this.minNode = new MinNode(this.query['MIN'], this.root);
                    break;
                case "AVG":
                    this.avgNode = new AvgNode(this.query['AVG'], this.root);
                    break;
                case "COUNT":
                    this.countNode = new CountNode(this.query['COUNT'], this.root);
                    break;
                case "SUM":
                    this.sumNode = new SumNode(this.query['SUM'], this.root);
                    break;
                default:
                    reject("Invalid query: APPLYTOKEN can have only one of MAX, MIN, AVG, COUNT, SUM")
            }

            // prase the appropriate APPLYTOKEN
            let toParse: Node;
            if(this.maxNode)
                toParse = this.maxNode;
            else if(this.minNode)
                toParse = this.minNode
            else if(this.avgNode)
                toParse = this.avgNode;
            else if(this.countNode)
                toParse = this.countNode;
            else if(this.sumNode)
                toParse = this.sumNode;

            toParse.parse().then(() => {
                fulfill();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public evaluate(group: any[]): number {

        let toEval: Node;
        if(this.maxNode)
            toEval = this.maxNode;
        else if(this.minNode)
            toEval = this.minNode
        else if(this.avgNode)
            toEval = this.avgNode;
        else if(this.countNode)
            toEval = this.countNode;
        else if(this.sumNode)
            toEval = this.sumNode;

        return toEval.evaluate(group);
    }
}