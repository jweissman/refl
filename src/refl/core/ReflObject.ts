export abstract class ReflObject {
    [method: string]: any;

    abstract toJS(): boolean | number | string | null;

    send(message: string, args: ReflObject[]): ReflObject {
        if (!!this[message]) {
            return this[message](...args);
        } else {
            throw new Error(this.methodMissingWarning(message));
        }
    }

    self() { return this; }

    private methodMissingWarning(message: string) {
        return `Undefined method '${message}' called on ${this.constructor.name}`
    }
}
