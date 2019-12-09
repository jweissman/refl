import { ReflObject } from '../core/ReflObject';
import { ReflContext } from '../ReflContext';
import { Instruction } from 'myr';
// import { Instruction, ReflInstruction } from '../ReflInterpreter';

export type ReflInstruction = Instruction<number | string | boolean>;
export type ReflProgram = ReflInstruction[];
export type PreludeContext = {
    nextAnonymousFunctionLabel: Function,
    nextConditionalLabel: Function,
}

export abstract class ReflNode {
    abstract evaluate(ctx: ReflContext): ReflObject;
    abstract get instructions(): ReflProgram;
    abstract prelude(preludeContext: PreludeContext): ReflProgram;
}
