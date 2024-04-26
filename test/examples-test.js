const fs = require('fs');
const should = require('should');
const sinon = require('sinon');

const {Parser} = require('../lib/parser.js');
const {Eggvm} = require('eggtended-js');

describe('Testing programs from \'examples/\' folder', () => {

  // Spy calls to 'console.log'
  beforeEach(() => {
    this.logSpy = sinon.spy(console, 'log');
  });

  afterEach(() => {
    this.logSpy.restore();
  });

  // Method to test the number and values of 'logSpy' calls
  const assertOutput = (outs) => {
    this.logSpy.callCount.should.be.eql(outs.length);
    outs.forEach((output, index) => {
      this.logSpy.getCall(index).calledWithExactly(output).should.be.true();
    });
  };

  // Method for creating and executing the dynamic tests
  const executeTests = (tests) => {
    tests.forEach((outputs, file) => {

      // Path to the related .evm file
      const fileEVM = file + '.evm';

      describe(`Test for ${file}`, () => {

        // -- TEST PARSING --
        it('should be parsed correctly', () => {
          const rawData = fs.readFileSync(fileEVM);
          const expectedTree = JSON.parse(rawData);

          Parser.parseFromFile(file).should.match(expectedTree);
        });


        // -- TEST EXECUTION --
        if(Array.isArray(outputs)) {
          it('should print the expected output after execution', () => {
            // Eggvm.runFromEVM(fileEVM);
            Eggvm.runFromEVM(fileEVM);
            assertOutput(outputs);
          });

        } else {
          it(`should throw an exception of type ${outputs.name}`, () => {
            should.throws(() => {Eggvm.runFromEVM(fileEVM);}, outputs);
          });
        }

      });
    });
  };

  const tests = new Map();

  tests.set('examples/hello-examen.egg', [0.0345, "this is a string", true]);
  tests.set('examples/hello-word.egg', [4, 10]);

  executeTests(tests);
});
