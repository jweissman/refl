var fs = require('fs');
var ohm = require('ohm-js');
var contents = fs.readFileSync('./src/refl/lang/Refl.ohm');
var grammar = ohm.grammar(contents);

export default grammar;
