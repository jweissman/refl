import { ReflNode, ReflProgram } from './ReflNode';
import { instruct } from 'myr';
import { Identifier } from './Identifier';

// dynamically defined fn, i.e., dbl = (x) => 2*x
export class FunctionLiteral extends ReflNode {
    label: string = '';

    constructor(public args: ReflNode[], public body: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        return [
            instruct('compile', { body: this }),
        ]
    }

    compile(): ReflProgram {
        let storeArgs: ReflProgram = this.args.flatMap((arg) => {
            if (arg instanceof Identifier) {
                return [
                    instruct('store', { key: arg.name }),
                    instruct('pop'),
                ]
            } else {
                throw new Error("Can only compile functions with identifier arguments")
            }
            //else if (arg instanceof Ellipsis) {
            //    return [
            //        // gather as list until ellipsis-tombstone... and store as arg
            //        instruct('gather', {key: arg}),
            //        instruct('pop'),
            //    ]
            //}
        })
        let result = [
            ...storeArgs,
            ...this.body.instructions,
            instruct('ret'),
        ];
        return result;
    }
}
