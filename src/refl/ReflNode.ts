import { ReflObject } from './core/ReflObject';
import { ReflContext } from './ReflContext';
export abstract class ReflNode {
    abstract evaluate(ctx: ReflContext): ReflObject;
}
