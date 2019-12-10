import { ReflObject } from '../core/ReflObject';
import { ReflNode, PreludeContext, ReflProgram } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { ReflNil } from '../core/ReflNil';
// import ReflReturn from '../core/ReflReturn';
// import { ReflInstruction } from '../ReflInterpreter';

export class Program extends ReflNode {
    prelude(ctx: PreludeContext) { 
        return this.lines.flatMap(line => line.prelude(ctx))
    }

    get instructions(): ReflProgram {
        return this.lines.flatMap(line => line.instructions)
    }

    constructor(public lines: ReflNode[], private isFunction: boolean = false) {
        super();
    }
}
