import { ReflNode, ReflProgram } from "./ReflNode";
import { instruct, arrayClass, MyrNumeric } from "myr";

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
            instruct('load', { key: arrayClass.name }),
            instruct('send_call', { key: 'new' }),
            instruct('store', { key }),
            ...addElems,
        ]
        return construct;
    }
}