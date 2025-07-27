const {Parser} = require('../Parser')
const assert = require('assert');

const parser = new Parser();

const tests = [require('./literal-test.js'), 
               require('./statement-list-test.js'),
               require('./block-test.js'),
               require('./empty-statement.js'),
               require('./maths.js')];

function exec(){
    const program = `
      x = y + 3;
    `;

    const ast = parser.parse(program);

    console.log(JSON.stringify(ast, null, 2));
}

exec();

function test(program, expected){
    const ast = parser.parse(program);
    assert.deepEqual(ast, expected);
}

tests.forEach(testRun => {
    testRun(test)
});

console.log("All assertions passed");

