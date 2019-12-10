import { assertNever } from 'assert-never';
import { ReflObject } from '../core/ReflObject';
import { ReflNode, ReflProgram, PreludeContext } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { LogicalOperator } from './LogicalOperator';
import { instruct } from 'myr';

export class LogicalExpression extends ReflNode {
    constructor(public logOp: LogicalOperator, public left: ReflNode, public right: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        // throw new Error("Method not implemented.");
        let strategy: { [key in LogicalOperator]: ReflProgram } = {
            '&&': [instruct('and')],
            '||': [instruct('or')],
            // '!':  [instruct('not')],
            // '!': 'not',
            // '-': [
            //     instruct('dup'),
            //     instruct('push', {value: 2}),
            //     instruct('mul'),
            //     instruct('sub'),
            //  ], // 'negate',
            // '()': [instruct('noop')]
        }
        return [
            ...this.left.instructions,
            ...this.right.instructions,
            ...strategy[this.logOp],
        ];

    }

    prelude(preludeContext: PreludeContext): ReflProgram {
        return [];
    }

    evaluate(ctx: ReflContext): ReflObject {
        let left = this.left.evaluate(ctx);
        let right = this.right.evaluate(ctx);
        return left.send(this.operation, [right]);
    }
    private get operation(): string {
        let message;
        switch (this.logOp) {
            case '&&':
                message = 'and';
                break;
            case '||':
                message = 'or';
                break;
            default: assertNever(this.logOp);
        }
        return message as string;
    }
}
