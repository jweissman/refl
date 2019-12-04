import { ReflContext } from "./ReflContext";
import { ReflInt } from "./ReflInt";

describe(ReflContext, () => {
    let context: ReflContext;
    beforeEach(() => { context = new ReflContext(); });
    it("stores and retreive values by identifiers", () => {
        context.assign('hello', new ReflInt(1));
        expect(context.hasDefinition('hello')).toBeTruthy();
        expect(context.retrieve('hello')).toEqual(new ReflInt(1));
    });
});