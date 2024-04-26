const { ValueTranslator, WordTranslator, ApplyTranslator, } = require("./ast-translate");

const json2AST = tree => {
  let obj = null;

  if (tree.type == "apply") {
    obj = new ApplyTranslator(tree);
    obj.operator = json2AST(tree.operator);
    obj.args = tree.args.map(arg => json2AST(arg));
  } else if (tree.type == "word") {
    obj = new WordTranslator(tree);
    obj.name = tree.name;
  } else if (tree.type == "value") {
    obj = new ValueTranslator(tree);
  } else {
    throw new SyntaxError(`Unrecognized token ${utils.ins(tree)}`);
  }

  return obj;
};

module.exports = {
  json2AST
};
