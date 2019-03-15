import {Node} from "./Node";
import {OptionsNode} from "./OptionsNode";
import {CourseSection} from "../controller/CourseSection";
import {Room} from "../controller/Room";

export class SortNode extends Node {

    private sort_key: string;

    private direction: string;
    private keys: string[];
    private options: OptionsNode;

    public constructor(qry: string, options: OptionsNode, root?: Node) {
        super(qry, root);
        this.options = options;
        this.keys = [];
    }

    public parse(): Promise<string> {
        return new Promise((fulfill, reject) => {

            // SORT can be either a string or an object
            if(typeof this.query !== 'string' && typeof this.query !=='object')
                reject("Invalid query: value of ORDER has to be a string or a object");

            // if SORT is a string, check it is a valid key and listed in columns
            if(typeof this.query === 'string' && this.options.getColumns().includes(this.query)) {
                this.sort_key = this.query;
                fulfill();
            }
            else if(typeof this.query === 'object') {

                // if SORT is an object, it should have two properties, dir and keys
                if (Object.keys(this.query).length !== 2)
                    reject('Invalid query: ORDER should contain dir and keys');

                if (!this.query.hasOwnProperty('dir'))
                    reject('Invalid query: ORDER should contain a dir');

                if (!this.query.hasOwnProperty('keys'))
                    reject('Invalid query: ORDER should contain a keys');

                // dir has to be UP or DOWN
                let dir: string = this.query['dir'];
                if(dir !== 'UP' && dir !== 'DOWN')
                    reject("Invalid query: DIRECTION should be one of UP, DOWN");

                this.direction = dir;

                // ORDER keys should be a non-empry array
                let keys = this.query['keys'];
                if(!Array.isArray(keys) || keys.length === 0)
                    reject("Invalid query: ORDER keys should be a non-empry array of strings");

                // ORDER keys can only be items listed in COLUMNS
                let cols: string[] = this.options.getColumns();
                for(let key of keys) {
                    if(cols.includes(key))
                       this.keys.push(key);
                    else
                        reject("Invalid query: ORDER keys can only be items listed in COLUMNS");
                }

                fulfill();
            }
            else {
                reject("Invalid query: invalid ORDER");
            }
        });
    }

    public evaluate(data: any[]): any {

        // if sort_key is defined, sort by single key
        if(this.sort_key) {
            data.sort((a: CourseSection | Room, b: CourseSection | Room): number => {
                if (a[this.sort_key] < b[this.sort_key])
                    return -1;
                if (a[this.sort_key] > b[this.sort_key])
                    return 1;
                return 0;
            });
            return data;

        } else {
            // complex sort based on direction and keys

            if(this.direction === "UP")
                data.sort(this.sortUpCompFunc.bind(this));
            else
                data.sort(this.sortDownCompFunc.bind(this));

            return data;
        }
    }

    private sortUpCompFunc(a: CourseSection | Room, b: CourseSection | Room): number {
        return this.sortUpCompHelper(a, b, 0);
    }

    private sortUpCompHelper(a: CourseSection | Room, b: CourseSection | Room, i: number): number {

        let sortKey: string = this.keys[i];

        if (a[sortKey] < b[sortKey])
            return -1;
        else if (a[sortKey] > b[sortKey])
            return 1;
        else {
            if(i === this.keys.length-1)
                return 0;
            else
                return this.sortUpCompHelper(a, b, ++i);
        }
    }

    private sortDownCompFunc(a: CourseSection | Room, b: CourseSection | Room): number {
        return this.sortDownCompHelper(a, b, 0);
    }

    private sortDownCompHelper(a: CourseSection | Room, b: CourseSection | Room, i: number): number {

        let sortKey: string = this.keys[i];

        if (a[sortKey] < b[sortKey])
            return 1;
        else if (a[sortKey] > b[sortKey])
            return -1;
        else {
            if(i === this.keys.length-1)
                return 0;
            else
                return this.sortDownCompHelper(a, b, ++i);
        }
    }
}