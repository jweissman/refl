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
        let given = (this.path as StringLiteral).value;
        if (!given.endsWith(ext)) { given += ext; }
        let paths = [
            __dirname + "\\..\\lib\\" + given,
            // given,
            process.cwd() + "\\" + given,
        ];
        let path = paths.find(p => fs.existsSync(p))
        if (path) {
            let contents: string = fs.readFileSync(path).toString();
            let ast = Refl.tree(contents);
            return [
                instruct('mark'),
                ...(new Program(ast)).instructions,
                instruct('sweep'),
            ];
        } else {
            console.debug("checked paths", { paths, given })
            throw new Error("Could not find " + given)
        }
    }
}