import {Dataset} from "./Dataset";

export abstract class Parser {
    public abstract parse(base64content: string): Promise<Dataset<any>>;
}