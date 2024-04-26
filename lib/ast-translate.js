const { Value, Word, Apply, json2AST } = require('eggtended-js');
const { generateJS, isEggFunction } = require('./special-translations');

class ValueTranslator extends Value {
  generateJS() {
    return this.value;
  }
}

class WordTranslator extends Word {
  generateJS() {
    return `$${this.name}`;
  }
}

class ApplyTranslator extends Apply {
  generateJS() {
  }
}

module.exports = {
  ValueTranslator,
  WordTranslator,
  ApplyTranslator,
  json2AST,
};
