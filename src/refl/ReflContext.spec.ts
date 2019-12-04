import { ReflContext } from "./ReflContext";
import { ReflInt } from "./core/ReflInt";
import { ReflString } from "./core/ReflString";

describe(ReflContext, () => {
    let context: ReflContext;
    beforeEach(() => { context = new ReflContext(); });
    it("stores and retreive values by identifiers", () => {
        context.assign('hello', new ReflInt(1));
        expect(context.hasDefinition('hello')).toBeTruthy();
        expect(context.retrieve('hello')).toEqual(new ReflInt(1));
    });

    it('creates a clone of itself', () => {
        context.assign('hello', new ReflString("world"));

        let clonedContext = context.clone();

        // i can see variables from outside :)
        expect(clonedContext.hasDefinition('hello')).toBeTruthy();
        expect(clonedContext.retrieve('hello').value).toEqual("world")

        // i can set variables without affecting the outside
        clonedContext.assign('count', new ReflInt(-1));
        expect(clonedContext.retrieve('count').value).toEqual(-1);
        expect(context.hasDefinition('count')).toBeFalsy();
    });

});