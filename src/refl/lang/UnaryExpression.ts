import { assertNever } from 'assert-never';
import { ReflObject } from '../core/ReflObject';
import { ReflNode, ReflProgram } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { UnaryOperator } from './UnaryOperator';
import { instruct, OpCode } from 'myr';
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

    // todo enable other ops?
    prelude() { return []; }
    get instructions(): ReflProgram {
        let strategy: {[key: string]: ReflProgram} = {
            // '!': 'not',
            '-': [
                instruct('dup'),
                instruct('push', {value: 2}),
                instruct('mul'),
                instruct('sub'),
             ], // 'negate',
            '()': [instruct('noop')]
        }
        return [
            ...this.operand.instructions,
            ...strategy[this.unOp],
        ];
    }
}
