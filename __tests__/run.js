const {Parser} = require('../Parser')
const assert = require('assert');
const util = require('util');

const parser = new Parser();

const tests = [require('./literal-test.js'), 
               require('./statement-list-test.js'),
               require('./block-test.js'),
               require('./empty-statement.js'),
               require('./maths.js'),
               require('./variable-test.js')];

function exec(){
    const program = `
      let x = 3;
    `;

    const ast = parser.parse(program);

    console.log(util.inspect(ast, { depth: null, colors: true }));
}

exec();

function test(program, expected){
    const ast = parser.parse(program);
    
    try {
    assert.deepStrictEqual(ast, expected);
    } catch (e) {
    console.log('Assertion failed:');
    console.log(util.inspect(e.actual, { depth: null, colors: true }));
    console.log(util.inspect(e.expected, { depth: null, colors: true }));
    }
}

tests.forEach(testRun => {
    testRun(test)
});

console.log("All assertions passed");

