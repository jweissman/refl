import { ReflObject } from "./ReflObject";
import { ReflNode } from "../ReflNode";

export class ReflFunction extends ReflObject {
    constructor(public args: string[], public body: ReflNode) { super();}

    toJS(): never {
        throw new Error("Method not implemented.");
    }
}