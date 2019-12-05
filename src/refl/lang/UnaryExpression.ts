import { assertNever } from 'assert-never';
import { ReflObject } from '../core/ReflObject';
import { ReflNode } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { UnaryOperator } from './UnaryOperator';
export class UnaryExpression extends ReflNode {
    constructor(public unOp: UnaryOperator, public operand: ReflNode) { super(); }
    evaluate(ctx: ReflContext): ReflObject {
        return this.operand.evaluate(ctx).send(this.operation, []);
    }
    private get operation(): string {
        let message;
        switch (this.unOp) {
            case '!':
                message = 'not';
                break;
            case '-':
                message = 'negate';
                break;
            case '()':
                message = 'self';
                break;
            default: assertNever(this.unOp);
        }
        return message as string;
    }
}
