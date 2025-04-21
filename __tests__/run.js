const {Parser} = require('../Parser')
const assert = require('assert');

const parser = new Parser();

const tests = [require('./literal-test.js'), 
               require('./statement-list-test.js')];

function test(program, expected){
    const ast = parser.parse(program);
    assert.deepEqual(ast, expected);
}

tests.forEach(testRun => testRun(test));

console.log("All assertions passed");

