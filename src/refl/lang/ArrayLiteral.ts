import { ReflNode, ReflProgram } from "./ReflNode";
import { instruct, MyrArray, MyrNumeric } from "myr";
import { FunctionInvocation } from "./FunctionInvocation";
import { Identifier } from "./Identifier";

let arrCount = 0;
export class ArrayLiteral extends ReflNode {
    constructor(public elements: ReflNode[]) {
        super();
    }

    get instructions(): ReflProgram {
        let key = `arr-${arrCount++}`
        let loadArr = instruct('load', { key })
        let addElems = this.elements.flatMap((element, index) => [
            instruct('push', { value: new MyrNumeric(index) }),
            ...element.instructions,
            instruct('arr_put'),
            loadArr,
        ]);
        let construct = [
            instruct('push', { value: new MyrArray() }),
            // instruct('dup'),
            instruct('store', { key }),
            ...addElems,
        ]
        return construct;
    }
}