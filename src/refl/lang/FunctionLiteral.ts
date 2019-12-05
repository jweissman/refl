import { ReflObject } from '../core/ReflObject';
import { ReflNode } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { ReflFunction } from '../core/ReflFunction';
export class FunctionLiteral extends ReflNode {
    constructor(public args: string[], public body: ReflNode) {
        super();
    }
    evaluate(ctx: ReflContext): ReflObject {
        return new ReflFunction(this.args, this.body);
    }
}
