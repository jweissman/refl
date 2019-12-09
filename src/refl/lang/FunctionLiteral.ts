import { ReflObject } from '../core/ReflObject';
import { ReflNode, PreludeContext, ReflProgram } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { ReflFunction } from '../core/ReflFunction';
import { Instruction, instruct } from 'myr';

export class FunctionLiteral extends ReflNode {
    label: string = '';

    constructor(public args: string[], public body: ReflNode) {
        super();
    }

    prelude(ctx: PreludeContext): ReflProgram {
        this.label = ctx.nextAnonymousFunctionLabel();
        let storeArgs: ReflProgram = this.args.flatMap((arg) => [
            instruct('store', { key: arg }),
            instruct('pop'),
        ])
        return [
            instruct('noop', { label: this.label }),
            ...storeArgs,
            ...this.body.instructions,
            instruct('ret'),
        ]
    }

    get instructions(): Instruction<number | string>[] {
        if (!this.label) {
            throw new Error("function literal wasn't prelude'd, so no label?")
        }

        return [
            // some kind of hint here?
            { op: 'push', value: this.label }, // } //new ReflFunction(this.args, this.body) }
            // just push the value of the fn???
            // we don't even have a label to WRITE in this case :/
            // { op: 'label', value: }
        ]
        // are the instructions for this a label -- and the impl? and then ret...
        // throw new Error("Method not implemented.");
    }
    evaluate(ctx: ReflContext): ReflObject {
        return new ReflFunction(this.args, this.body);
    }
}
