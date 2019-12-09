import { ReflObject } from '../core/ReflObject';
import { ReflNode } from './ReflNode';
import { ReflContext } from "../ReflContext";
// import { ReflInstruction } from '../ReflInterpreter';
import { ReflString } from '../core/ReflString';
import { instruct, Instruction } from 'myr';

export class Identifier extends ReflNode {
    constructor(public name: string) {
        super();
    }

    evaluate(ctx: ReflContext): ReflObject {
        if (ctx.hasDefinition(this.name)) {
            return ctx.retrieve(this.name);
        } else {
            throw new Error(`Undefined identifier ${this.name}`);
        }
    }

    prelude() { return []; }
    get instructions(): Instruction<number>[] {
        let instruction: Instruction<number> = instruct('load', { key: this.name })
        return [instruction];
    }
}
