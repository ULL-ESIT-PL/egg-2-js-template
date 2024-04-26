const util = require('util');
const ins = x => util.inspect(x, { depth: null});
let generateJS = Object.create(null);

const ARITHM_OPERATORS = [
    "+",
    "-",
    "*",
    "/",
    "==",
    "!=",
    "<",
    ">",
    ">=",
    "<=",
    "&&",
    "||",
    "&",
    "|",
    "<<",
    ">>",
    ">>>"
  ];
  
  ARITHM_OPERATORS.forEach(op => {
    generateJS[op] = function([left, right]) {
        return `(${left} ${op} ${right})`;
      }
  });
  
generateJS['print'] = function(...args) {
   return `Egg.print(${args});`
}

generateJS['do'] = function(statements) {
  debugger;

   // fill in
  return translation;
}

generateJS['def'] = function([variable, initexpression]) {
  debugger;
  //  fill in 
  return translation;
}


generateJS['='] = generateJS['set'] = function([variable, expression]) {
  // fill in
  return translation;
}

generateJS['if'] = function([condition, valueTrue, valueFalse]) {
  // fill in
  return translation;
}

generateJS['fun'] = function(parameters) {
  // fill in
    return translation;
}

function isEggFunction(name) {
  // fill in
  return true;
}

module.exports = {
  generateJS,
  isEggFunction,
};