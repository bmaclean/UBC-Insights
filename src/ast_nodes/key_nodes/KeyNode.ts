import {Node} from "../Node";

export abstract class KeyNode extends Node {

    public constructor(qry: string, root?: Node) {
        super(qry, root);
    }

    public getKey(): string {
        return this.query;
    }
}