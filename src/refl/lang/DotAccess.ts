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
                ...this.message.pushArgs(true),
                ...this.object.instructions,
                instruct('store', { key: 'as-self'}),
                instruct('send_attr', { key: (this.message.fn as Identifier).name }),
                instruct('load', { key: 'as-self'}),
                instruct('obj_invoke'),
            ]
        } else {
            console.trace("message wasn't an identifier", { msg: this.message })
        }
        return program;
    }
}