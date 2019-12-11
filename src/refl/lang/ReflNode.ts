import { Instruction } from 'myr';

export type ReflInstruction = Instruction;
export type ReflProgram = ReflInstruction[];

export abstract class ReflNode {
    abstract get instructions(): ReflProgram;
    compile(): ReflProgram {
        throw new Error("Method not implemented.");
    }
}