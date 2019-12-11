import { ReflNode, ReflProgram } from './ReflNode';
import { instruct } from 'myr';

export class Identifier extends ReflNode {
    constructor(public name: string) { super(); }
    get instructions(): ReflProgram {
        return [instruct('load', { key: this.name })];
    }
}
