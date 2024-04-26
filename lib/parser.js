const fs = require('fs');
const parser = require("./grammar.js").parser;

class Parser {
  static parse(program) {
    const tree = parser.parse(program);

    return tree;
  }

  static parseFromFile(file) {
    const program = fs.readFileSync(file, 'utf-8');

    return Parser.parse(program);
  }
}

module.exports = {
  Parser
}
