import { ReflNode, ReflProgram } from "./ReflNode";
import { Identifier } from "./Identifier";
import { instruct } from "myr";
import { FunctionInvocation } from "./FunctionInvocation";

export class DotAccess extends ReflNode {
    constructor(public object: ReflNode, public message: ReflNode) { super(); }

    get instructions(): ReflProgram {
        let program: ReflProgram = []
        if (this.message instanceof Identifier) {
            program = [
                ...this.object.instructions,
                instruct('send_attr', { key: this.message.name }),
            ];
        } else if (this.message instanceof FunctionInvocation) {
            program = [
                // gather params...? (okay, yes... but how do we know the arity?? apparently doesn't matter...?)
                // it is going to matter :/
                ...this.message.pushArgs(true),
                ...this.object.instructions,
                // hmm assumes message fn is an id??
                instruct('send_call', { key: (this.message.fn as Identifier).name }),
            ]
        } else {
            console.trace("message wasn't an identifier or fn invocation?", { msg: this.message })
            program = []
        }
        return program;
    }
}