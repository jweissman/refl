import { ReflNode, ReflProgram } from './ReflNode';

export class Program extends ReflNode {
    get instructions(): ReflProgram {
        return this.lines.flatMap(line => line.instructions)
    }

    constructor(public lines: ReflNode[]) {
        super();
    }
}
