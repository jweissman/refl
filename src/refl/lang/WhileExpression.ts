import { ReflNode, ReflProgram } from "./ReflNode";
import { instruct, MyrBoolean } from "myr";

let whiles = 0;
export default class WhileExpression extends ReflNode {
    constructor(public test: ReflNode, public block: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        let w = whiles++;
        let labelBegin = `while-${w}-begin`,
            labelEnd   = `while-${w}-end`
        return [
            // instruct('mark'),
            instruct('noop', { label: labelBegin }),
            ...this.test.instructions, // true/false
            instruct('push', { value: new MyrBoolean(false) }),
            instruct('cmp'), 
            // stack top is zero if we are done (i.e. test expr evals => true)
            instruct("jump_if_zero", { target: labelEnd }),
            instruct('pop'),
            ...this.block.instructions,
            instruct('jump', { target: labelBegin }),
            instruct('noop', { label: labelEnd }),
            instruct('pop'),
            // instruct('sweep'),
            // instruct('sweep'),
        ];
    }

}