module.exports = test => {
    test(`x = 42;`, {
        type: "Program",
        body: [
            {
                type: "ExpressionStatement",
                expression: "AssignmentExpression",
                operator: "=",
                left: {
                    type: "Identifier",
                    value: "x"
                },
                right: {
                    type: "NumericLiteral",
                    value: 42
                }
            }
        ]
    });

    test(`x = y = 42;`, {
        type: "Program",
        body: [
            {
                type: "ExpressionStatement",
                expression: "AssignmentExpression",
                operator: "=",
                left: {
                    type: "Identifier",
                    value: "x"
                },
                right: {
                     type: "ExpressionStatement",
                    expression: "AssignmentExpression",
                    operator: "=",
                    left: {
                        type: "Identifier",
                        value: "y"
                    },
                    right: {
                        type: "NumericLiteral",
                        value: 42,
                    }
                }
            }
        ]
    });
}