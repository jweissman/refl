import { ReflNode, ReflProgram } from "./ReflNode";
import { instruct } from "myr";

let whiles = 0;
export default class WhileExpression extends ReflNode {
    constructor(public test: ReflNode, public block: ReflNode) {
        super();
    }

    prelude(): ReflProgram {
        return [];
    }

    get instructions(): ReflProgram {
        let w = whiles++;
        let labelBegin = `while-${whiles}-begin`,
            labelEnd   = `while-${whiles}-end`
        return [
            instruct('noop', { label: labelBegin }),
            ...this.test.instructions, // true/false
            instruct('push', { value: false }),
            instruct('cmp'), 
            // stack top is zero if we are done (i.e. test expr evals => true)
            instruct("jump_if_zero", { target: labelEnd }),
            ...this.block.instructions,
            instruct('jump', { target: labelBegin }),
            instruct('noop', { label: labelEnd }),
        ];
    }

}