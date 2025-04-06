const {Parser} = require('../Parser')

const parser = new Parser();

const program = ` 

// comment

/**
 * Another comments
 */
42;
"string";
`;

const ast = parser.parse(program);

console.log(JSON.stringify(ast, null, 2));
