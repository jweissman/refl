import { assertNever } from 'assert-never';
import { ReflObject } from '../core/ReflObject';
import { ReflNode, ReflProgram, PreludeContext } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { ComparatorOp } from './ComparatorOp';
import { instruct, OpCode } from 'myr';

export class ComparisonExpression extends ReflNode {
    constructor(public cmpOp: ComparatorOp, public left: ReflObject, public right: ReflObject) {
        super();
    }

    get instructions(): ReflProgram {
        let compare = instruct(`cmp_${this.operation}` as OpCode);
        return [
            ...this.left.instructions,
            ...this.right.instructions,
            compare,
            // instruct('cmp'),
            // instruct('jump_gt', { value: 0, label: 'gt'})
            // instruct('jump_lt', { value: 0, label: 'lt'})
            // instruct('push', { value: 0 }),
            // instruct('jump', { label: })
        ]
        throw new Error("Method not implemented.");
    }

    prelude(): ReflProgram { return []; }

    evaluate(ctx: ReflContext): ReflObject {
        let left = this.left.evaluate(ctx);
        let right = this.right.evaluate(ctx);
        return left.send(this.operation, [right]);
    }
    private get operation(): string {
        let message;
        switch (this.cmpOp) {
            case '>':
                message = 'gt';
                break;
            case '<':
                message = 'lt';
                break;
            case '==':
                message = 'eq';
                break;
            case '>=':
                message = 'gte';
                break;
            case '<=':
                message = 'lte';
                break;
            default: assertNever(this.cmpOp);
        }
        return message as string;
    }
}
