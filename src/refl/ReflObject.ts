export abstract class ReflObject {
    [method: string]: any;
    send(message: string, args: ReflObject[]): ReflObject {
        // console.debug("ReflObject.send", { message, args });
        let receive = this[message];
        if (!!receive) {
            return this[message](...args);
        }
        else {
            throw new Error(`Undefined method '${message}' called on ${this.constructor.name}`);
        }
    }
    abstract toJS(): number | string;
}
