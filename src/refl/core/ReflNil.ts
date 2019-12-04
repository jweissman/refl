import { ReflObject } from "./ReflObject";

export class ReflNil extends ReflObject {
    toJS(): string | number | null {
        return null;
    }

}