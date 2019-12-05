import { ReflObject } from '../core/ReflObject';
import { ReflNode } from './ReflNode';
import { ReflContext } from "../ReflContext";
export class Identifier extends ReflNode {
    constructor(public name: string) {
        super();
    }
    evaluate(ctx: ReflContext): ReflObject {
        if (ctx.hasDefinition(this.name)) {
            return ctx.retrieve(this.name);
        }
        else {
            throw new Error(`Undefined identifier ${this.name}`);
        }
    }
}
