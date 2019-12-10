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
        let strategy: { [key in LogicalOperator]: ReflProgram } = {
            '&&': [instruct('and')],
            '||': [instruct('or')],
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
