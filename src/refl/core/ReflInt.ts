import { ReflObject } from './ReflObject';
import ReflBool from './ReflBool';
export class ReflInt extends ReflObject {
    constructor(public value: number) {
        super();
    }

    plus(other: ReflInt): ReflInt {
        return this.compute(other, (a,b) => a+b)
    }

    minus(other: ReflInt): ReflInt {
        return this.compute(other, (a,b) => a-b)
    }

    times(other: ReflInt): ReflInt {
        return this.compute(other, (a,b) => a*b)
    }

    div(other: ReflInt): ReflInt {
        return this.compute(other, (a,b) => a/b)
    }

    pow(other: ReflInt): ReflInt {
        return this.compute(other, Math.pow)
    }

    gt(other: ReflInt): ReflBool {
        if (this.value > other.value) {
            return ReflBool.TRUE;
        }
        return ReflBool.FALSE;
    }

    lt(other: ReflInt): ReflBool {
        if (this.value < other.value) {
            return ReflBool.TRUE;
        }
        return ReflBool.FALSE;
    }

    eq(other: ReflInt): ReflBool {
        if (this.value == other.value) {
            return ReflBool.TRUE;
        }
        return ReflBool.FALSE;
    }

    lte(other: ReflInt): ReflBool {
        if (this.value <= other.value) {
            return ReflBool.TRUE;
        }
        return ReflBool.FALSE;
    }

    gte(other: ReflInt): ReflBool {
        if (this.value >= other.value) {
            return ReflBool.TRUE;
        }
        return ReflBool.FALSE;
    }

    toJS(): number {
        return this.value;
    }

    private compute(
        other: ReflInt,
        calculate: (a: number, b: number) => number
    ) {
        let result = calculate(this.value, other.value);
        return new ReflInt(result);
    }
}
