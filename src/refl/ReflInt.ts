import { ReflObject } from './ReflObject';
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
