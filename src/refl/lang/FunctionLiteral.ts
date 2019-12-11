import { ReflNode, ReflProgram } from './ReflNode';
import { instruct } from 'myr';

// dynamically defined fn, i.e., dbl = (x) => 2*x
export class FunctionLiteral extends ReflNode {
    label: string = '';

    constructor(public args: string[], public body: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        return [
            instruct('compile', { body: this }),
        ]
    }

    compile(): ReflProgram {
        let storeArgs: ReflProgram = this.args.flatMap((arg) => [
            instruct('store', { key: arg }),
            instruct('pop'),
        ])
        let result = [
            ...storeArgs,
            ...this.body.instructions,
            instruct('ret'),
        ];
        return result;
    }
}
