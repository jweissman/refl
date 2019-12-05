import { ReflObject } from '../core/ReflObject';
import { ReflNode } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { ReflNil } from '../core/ReflNil';
import ReflReturn from '../core/ReflReturn';
export class Program extends ReflNode {
    constructor(public lines: ReflNode[]) {
        super();
    }
    evaluate(ctx: ReflContext): ReflObject {
        let result = null;
        for (const line of this.lines) {
            result = line.evaluate(ctx);
            if (result instanceof ReflReturn) {
                return result.wrapped;
            }
        }
        return result || new ReflNil();
    }
}
