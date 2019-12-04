import { ReflObject } from "./ReflObject";

export default class ReflBool extends ReflObject {
    static TRUE = new ReflBool(true);
    static FALSE = new ReflBool(false);

    constructor(private value: boolean) {
        super();
    }

    and(other: ReflBool) {
        return new ReflBool(this.value && other.value);
    }

    or(other: ReflBool) {
        return new ReflBool(this.value || other.value);
    }

    not() {
        return new ReflBool(!this.value);
    }

    toJS(): boolean {
        return this.value;
    }
}