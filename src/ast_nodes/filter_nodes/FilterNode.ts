import {Node} from "../Node";
import {MCompNode} from "./MCompNode";
import {SCompNode} from "./SCompNode";
import {GTNode} from "./GTNode";
import {LTNode} from "./LTNode";
import {EQNode} from "./EQNode";
import {ISNode} from "./ISNode";
import {LogicNode} from "./LogicNode";
import {ANDNode} from "./ANDNode";
import {ORNode} from "./ORNode";
import {NegNode} from "./NegNode";
import {NOTNode} from "./NOTNode";
import {Dataset} from "../../controller/Dataset";

export class FilterNode extends Node {
    private mComp: MCompNode;
    private sComp: SCompNode;
    private lComp: LogicNode;
    private negation: NegNode;

    public constructor(qry: any, root?: Node) {
        super(qry, root);
    }

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            if (Object.keys(this.query).length !== 1)
                reject('Invalid query: Query FILTER should contain only one ' +
                    'of LOGICCOMPARISON, MCOMPARISON, SCOMPARISON, NEGATION');

            let keyQry: string =Object.keys(this.query)[0];

            switch(keyQry) {
                case "LT":
                    this.mComp = new LTNode(this.query['LT'], this.root);
                    break;
                case "GT":
                    this.mComp = new GTNode(this.query['GT'], this.root);
                    break;
                case "EQ":
                    this.mComp = new EQNode(this.query['EQ'], this.root);
                    break;
                case "IS":
                    this.sComp = new ISNode(this.query['IS'], this.root);
                    break;
                case "AND":
                    this.lComp = new ANDNode(this.query['AND'], this.root);
                    break;
                case "OR":
                    this.lComp = new ORNode(this.query['OR'], this.root);
                    break;
                case "NOT":
                    this.negation = new NOTNode(this.query['NOT'], this.root);
                    break;
                default:
                    reject('Invalid query: Query FILTER should be one of ' +
                        'LOGICCOMPARISON | MCOMPARISON | SCOMPARISON | NEGATION');
            }

            let toParse: Node;

            if (this.mComp)
                toParse = this.mComp;
            else if (this.sComp)
                toParse = this.sComp;
            else if (this.lComp)
                toParse = this.lComp;
            else if (this.negation)
                toParse = this.negation;

            toParse.parse().then(function() {
                fulfill();
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    public evaluate(ds: Dataset<any>): Dataset<any> {

        let toEval: Node;

        if (this.mComp)
            toEval = this.mComp;
        else if (this.sComp)
            toEval = this.sComp;
        else if (this.lComp)
            toEval = this.lComp;
        else if (this.negation)
            toEval = this.negation;

        return toEval.evaluate(ds);
    }
}