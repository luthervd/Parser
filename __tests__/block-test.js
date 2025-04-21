module.exports = test => {
    test(`{ 
        42;
        'Hello';
        }`,{
        type: 'Program',
        body: [{
            type: 'BlockStatement',
            body: [{
                type: 'ExpressionStatement',
                expression:{
                    type: 'NumericLiteral',
                    value: 42
                }
            },
            {
                type: 'ExpressionStatement',
                expression:{
                    type: 'StringLiteral',
                    value: 'Hello'
                }
            }
         ]
        }]
    }),
    test('{}',{
        type: 'Program',
        body: [
            { 
                type: 'BlockStatement', 
                body: [] 
            } ]
    })
    test('{{ 42 ;}}',{
        type: 'Program',
        body: [
            { 
                type: 'BlockStatement', 
                body: [{
                    type: 'BlockStatement',
                    body: [{
                        type: 'ExpressionStatement',
                        expression:{
                            type: 'NumericLiteral',
                            value: 42
                        }
                    }]
                }] 
            } ]
    })
}