import { assertNever } from 'assert-never';
import { ReflObject } from '../core/ReflObject';
import { ReflNode } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { LogicalOperator } from './LogicalOperator';
export class LogicalExpression extends ReflNode {
    constructor(public logOp: LogicalOperator, public left: ReflNode, public right: ReflNode) {
        super();
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
