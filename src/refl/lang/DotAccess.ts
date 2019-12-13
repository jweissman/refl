import { ReflNode, ReflProgram } from "./ReflNode";
import { Identifier } from "./Identifier";
import { instruct, MyrString } from "myr";
import { FunctionInvocation } from "./FunctionInvocation";

export class DotAccess extends ReflNode {
    constructor(public object: ReflNode, public message: ReflNode) { super(); }

    get instructions(): ReflProgram {
        let program: ReflProgram = []
        if (this.message instanceof Identifier) {
            program = [
                ...this.object.instructions,
                // instruct('push', { value: new MyrString(this.message.name)}),
                instruct('send', { key: this.message.name }),
            ];
        } else if (this.message instanceof FunctionInvocation) {
            program = [
                // gather params...? (okay, yes... but how do we know the arity?? apparently doesn't matter...?)
                ...this.message.pushArgs(true),
                ...this.object.instructions,
                // instruct('dump', { key: `send-${this.message.id.name}`}),
                instruct('send', { key: this.message.id.name }),
            ]
        } else {
            console.trace("message wasn't an identifier or fn invocation?", { msg: this.message })
            program = []
        }

        // console.log("DotAccess", { program })
        return program;
    }
}