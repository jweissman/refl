import { ReflObject } from '../core/ReflObject';
import { ReflContext } from '../ReflContext';
import { Instruction } from 'myr';
// import { Instruction, ReflInstruction } from '../ReflInterpreter';

export type PreludeContext = {
    nextAnonymousFunctionLabel: Function,
    nextConditionalLabel: Function,
}

export type ReflInstruction = Instruction;
export type ReflProgram = ReflInstruction[];

export abstract class ReflNode {

    // abstract evaluate(ctx: ReflContext): ReflObject;
    abstract get instructions(): ReflProgram;
    abstract prelude(preludeContext: PreludeContext): ReflProgram;

    compile(): ReflProgram {
        throw new Error("Method not implemented.");
    }

}