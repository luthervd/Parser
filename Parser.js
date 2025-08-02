
const {Tokenizer} = require('./Tokenizer');

class Parser{

    constructor(){
        this._string = '';
        this._tokenizer = new Tokenizer();
    }

    parse(string){
        this._string = string;
        this._tokenizer.init(string);

        this._lookahead = this._tokenizer.getNextToken();

        return this.Program();
    }


    Program(){
        return {
            type: "Program",
            body: this.StatementList(),
        }
    }


    StatementList(stopLookAhead = null){
        const statementList = [this.Statement()];

        while(this._lookahead != null && this._lookahead.type !== stopLookAhead){
            statementList.push(this.Statement());
        }
        return statementList;
    }

    /****
     * Statement
     * : ExpressionStatement
     * | Blockstatement
     */
    Statement(){
        switch(this._lookahead.type){
            case ';':
                return this.EmptyStatement();
            case '{':
                return this.BlockStatement();
            case 'let':
                return this.VariableStatement();
            default:
                return this.ExpressionStatement();
        }

    }


    EmptyStatement(){
        this._eat(';');
        return {
            type: 'EmptyStatement',
        }
    }

    BlockStatement(){
        this._eat('{');
        const body = this._lookahead.type !== '}' ? this.StatementList('}') : [];
        this._eat('}');
        return {
            type: 'BlockStatement',
            body
        }
    }

    VariableStatement(){
        this._eat('let');
        const declarations = this.VariableDeclarationsList();
        this._eat(';');
        return {
            type: 'VariableStatement',
            declarations,
        }

    }

    VariableDeclarationsList(){
        const declarations = [];
        do{
            declarations.push(this.VariableDeclaration())
        }
        while(this._lookahead.type === ',' && this._eat(','));
        return declarations;
    }

    VariableDeclaration(){
        const id = this.Identifier();
        
        const init = this._lookahead.type !== ';' && this._lookahead.type !== ',' ?
        this.VariableInitializer() : null;
        return {
            type: 'VariableDeclaration',
            id : {
                type: 'Identifier',
                name: id
            },
            init,
        }
    }

    VariableInitializer(){
        this._eat('SIMPLE_ASSIGN');
        return this.AssignmentExpression();
    }

    ExpressionStatement(){
        const expression = this.Expression();
        this._eat(';');
        return {
            type: 'ExpressionStatement',
            expression: expression,
        }
    }

    Expression(){
        return this.AssignmentExpression();
    }

    AssignmentExpression(){
        const left = this.AdditiveExpression();

        if(!this._isAssigmentOperator(this._lookahead.type)){
            return left;
        }

        return {
            type: 'AssignmentExpression',
            operator: this.AssignmentOperator().value,
            left: this._checkValidAssignmentTarget(left),
            right: this.AssignmentExpression(),
        }
    }

    LeftHandSideExpression(){
        const identifier =  this.Identifier();
        return {
            type: 'Identifier',
            identifier,
        }
    }

    Identifier(){
        const name = this._eat('IDENTIFIER').value;
        return name;
    }

    AssignmentOperator(){
        if(this._lookahead.type === 'SIMPLE_ASSIGN'){
            return this._eat("SIMPLE_ASSIGN");
        }
        return this._eat("COMPLEX_ASSIGN");
    }

    _isAssigmentOperator(tokenType){
        return tokenType === "SIMPLE_ASSIGN" || tokenType === "COMPLEX_ASSIGN";
    }

    _checkValidAssignmentTarget(node){
        if(node.type === "Identifier"){
            return node;
        }
        throw new SyntaxError("Invalid left-hand side in assignment expression");
    }

    AdditiveExpression(){
        return this._BinaryExpression(
            'MultiplicativeExpression',
            'ADDITIVE_OPERATOR');
    }

    MultiplicativeExpression(){
        return this._BinaryExpression(
            'PrimaryExpression',
            'MULTIPLICATIVE_OPERATOR');
    }

    _BinaryExpression(builderName, operatorToken){
        let left = this[builderName]();

        while(this._lookahead.type === operatorToken) {
            const operator = this._eat(operatorToken).value;

            const right = this[builderName]();

            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right
            }
        }

        return left;
    }

    PrimaryExpression(){
        if(this._isLiteral(this._lookahead.type)){
            return this.Literal();
        }
        switch(this._lookahead.type){
            case '(':
                return this.ParenthesizedExpression();
            default:
                return this.LeftHandSideExpression();
        }
        
    }

    _isLiteral(tokenType){
        return tokenType === "NUMBER" || tokenType === "STRING";
    }

    ParenthesizedExpression(){
        this._eat('(');
        const expression = this.Expression();
        this._eat(')');
        return expression;
    }

    Literal(){
        switch(this._lookahead.type){
            case 'NUMBER': return this.NumericLiteral();
            case 'STRING': return this.StringLiteral();
            case 'ADDITIVE_OPERATOR': return this.AdditiveExpression();
        }
        throw new SyntaxError(`Literal: unexpected literal production ${this._lookahead.value}`);
    }

    NumericLiteral(){
        const token = this._eat('NUMBER');
        return {
            type: "NumericLiteral",
            value: Number(token.value)
        }
    }

    StringLiteral(){
        const token = this._eat('STRING');
        return {
            type: "StringLiteral",
            value: token.value.slice(1, -1),
        }
    }

    _eat(tokenType) {
        const token = this._lookahead;

        if(token == null){
            throw new SyntaxError(`Unexpected end of input: expected: "${tokenType}"`,
            );
        }

        if(token.type !== tokenType){
            throw new SyntaxError(`Unexpected token: "${token.value}", expected: "${tokenType}"`,
            );
        }

        this._lookahead = this._tokenizer.getNextToken();

        return token;
    }
}

module.exports =  {
    Parser,
}