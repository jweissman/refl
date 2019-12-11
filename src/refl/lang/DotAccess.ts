import { ReflNode, ReflProgram } from "./ReflNode";
import { Identifier } from "./Identifier";
import { instruct, MyrString } from "myr";
import { FunctionInvocation } from "./FunctionInvocation";

export class DotAccess extends ReflNode {
    constructor(public object: ReflNode, public message: ReflNode) { super(); }

    get instructions(): ReflProgram {
        // console.log("Assemble instructions for dot access...", {
        //     obj: this.object,
        //     msg: this.message
        // })

        let program: ReflProgram = []

        if (this.message instanceof Identifier) {
            program = [
                ...this.object.instructions,
                instruct('push', { value: new MyrString(this.message.name)}),
                instruct('hash_get'),
            ];
        } else {
            console.trace("message wasn't an identifier?")
            program = []
        }

        // console.log("DotAccess", { program })
        return program;
    }
}