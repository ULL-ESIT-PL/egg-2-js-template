#!/usr/bin/env node
const beautify = require('js-beautify').js;
const fs = require('fs');
const commander = require('commander');
const process = require('process');
const { exec } = require('child_process');
const {Parser} = require('../lib/parser.js');
const {Eggvm} = require('../lib/eggvm-translate');

function egg2evm(fileName) {
  let noExtension = fileName.replace(/\.egg$/,'');

  const tree = Parser.parseFromFile(noExtension+'.egg');

  const json = JSON.stringify(tree, null, '  ');
  fs.writeFileSync(noExtension + '.evm', json);
  //console.log(json);
}

function generateJS(fileName, verbose) {
  debugger;
  //console.log(fileName);
  let noExtension = fileName.replace(/\.egg$/,'');
  //console.log(noExtension);
  egg2evm(noExtension+'.egg');
  const output = Eggvm.evm2js(noExtension+'.evm');
  const beauty = beautify(output);
  if (verbose) console.log(`Return value:\n${beauty}`);
  fs.writeFileSync(noExtension + '.js', beauty);
}

commander
  .version(require('../package.json').version)
  .option('-r --run <fileName>', 'compiles the input infix program and runs it')
  .option('-c --compile <fileName>', 'compile the infix program to produce a JSON \
    containing the input egg AST')
  .option('-i --interpret <fileName>', 'interprets the egg AST')
  .option('-j --egg2js <fileName>', 'translates the egg to JS')
  .option('-v --verbose', 'verbose mode')
  .parse(process.argv);

if(commander.run) {
  console.log(commander.run);
  let noExtension = commander.run.replace(/\.egg$/,'');

  generateJS(commander.run);
  exec('node '+noExtension+'.js', (err, stdout,stderr) => {
       if (err) {
        console.error(err);
        return;
      } 
      console.log(stdout);
    });

} else if(commander.egg2evm) {
  egg2evm(commander.egg2evm);
} else if(commander.interpret) {
  const output = Eggvm.runFromEVM(commander.interpret);
  //console.log(`Return value: ${output}`);
} else if(commander.egg2js) {
  debugger;
  generateJS(commander.egg2js, commander.verbose);
} else {
  commander.help();
}
