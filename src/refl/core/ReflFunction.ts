import { ReflObject } from "./ReflObject";
import { ReflNode } from "../lang/ReflNode";

export class ReflFunction extends ReflObject {
    constructor(public args: string[], public body: ReflNode) { super();}

    toJS(): never {
        console.warn("Can't convert ReflFunction to pure JS yet")
        throw new Error("Method not implemented.");
    }
}