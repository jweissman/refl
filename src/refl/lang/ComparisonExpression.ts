import { assertNever } from 'assert-never';
import { ReflObject } from '../core/ReflObject';
import { ReflNode } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { ComparatorOp } from './ComparatorOp';
export class ComparisonExpression extends ReflNode {
    constructor(public cmpOp: ComparatorOp, public left: ReflObject, public right: ReflObject) {
        super();
    }
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
