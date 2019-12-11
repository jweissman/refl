import { ReflNode, ReflProgram } from "./ReflNode";
import { Identifier } from "./Identifier";
import { instruct } from "myr";
import { FunctionInvocation } from "./FunctionInvocation";

export class DotAccess extends ReflNode {
    constructor(public object: ReflNode, public message: ReflNode) { super(); }

    get instructions(): ReflProgram {
        console.log("Assemble instructions for dot access...", {
            obj: this.object,
            msg: this.message
        })
        return [];
        // let pushObj = this.object.instructions;
        // if(this.message instanceof Identifier) {
        //     return [
        //         ...pushObj,
        //         instruct('send', { key: this.message.name })
        //     ]
        // } else if (this.message instanceof FunctionInvocation) {
        //     let fnMsg = [
        //         ...this.message.pushArgs(true),
        //         ...pushObj,
        //         instruct('send', { key: this.message.id.name })
        //     ]
        //     console.log("FN INVOKE MSG", fnMsg)
        //     return fnMsg;
        // } else {
        //     throw new Error("expected message to be an id or fn?")
        // }
    }
}