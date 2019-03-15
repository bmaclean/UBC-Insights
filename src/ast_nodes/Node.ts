import {Dataset} from "../controller/Dataset"

export abstract class Node {
    protected query: any;
    protected root: Node;

    public constructor(qry: any, root?: Node) {
        this.query = qry;
        this.root = root;
    }

    public abstract parse(): Promise<string>;

    public abstract evaluate(val: any): any;
}