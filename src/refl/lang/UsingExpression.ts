import { instruct } from 'myr';
import fs from 'fs';
import { ReflNode, ReflProgram } from "./ReflNode";
import { StringLiteral } from './StringLiteral';
import { Refl } from '../Refl';
import { Program } from './Program';

export class UsingExpression extends ReflNode {
    constructor(public path: ReflNode) { super();}
    get instructions(): ReflProgram {
        let ext = Refl.fileExtension
        let given = (this.path as StringLiteral).value + ".refl";
        if (!given.endsWith(".refl")) { given }
        let path = // [
            __dirname + "\\..\\lib\\" + given;
            // given,
        // ];
        let contents: string = fs.readFileSync(path).toString();
        let ast = Refl.tree(contents);
        return [
            instruct('mark'),
            ...(new Program(ast)).instructions,
            instruct('sweep'),
        ];
    }
}