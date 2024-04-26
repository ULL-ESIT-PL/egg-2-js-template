const fs = require('fs');
const { Eggvm } = require('eggtended-js');
const { Parser } = require('./parser.js');
const { json2AST } = require('./json2AST');

class Eggvm2JS extends Eggvm {

    evm2js(file) {
        debugger;
        const rawData = fs.readFileSync(file);
        let json = JSON.parse(rawData);
    
        const tree = json2AST(json)

        let js = tree.generateJS();
        return `
const Egg = require("../lib/runtime-support.js");
${js}
`;
    }

    static evm2js(file) {
        return new Eggvm2JS().evm2js(file);
    }

}

module.exports = {
    Eggvm: Eggvm2JS
};
