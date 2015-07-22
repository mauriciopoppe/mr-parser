var tokenType = require('./token-type')

var ConstantNode = require('./node/ConstantNode')
var OperatorNode = require('./node/OperatorNode')
var SymbolNode = require('./node/SymbolNode')
var FunctionNode = require('./node/FunctionNode')

/**
 * Grammar DSL:
 *
 * program          : block (; block)*
 *
 * block            : assignment
 *
 * assignment       : ternary
 *                  | symbol `=` assignment
 *
 * ternary          : logicalOR
 *                  | logicalOR `?` ternary `:` ternary
 *
 * logicalOR        : logicalXOR
 *                  | logicalXOR (`||`,`or`) logicalOR
 *
 * logicalXOR       : logicalAND
 *                  : logicalAND `xor` logicalXOR
 *
 * logicalAND       : bitwiseOR
 *                  | bitwiseOR (`&&`,`and`) logicalAND
 *
 * bitwiseOR        : bitwiseXOR
 *                  | bitwiseXOR `|` bitwiseOR
 *
 * bitwiseXOR       : bitwiseAND
 *                  | bitwiseAND `^|` bitwiseXOR
 *
 * bitwiseAND       : relational
 *                  | relational `&` bitwiseAND
 *
 * relational       : shift
 *                  | shift (`!=` | `==` | `>` | '<' | '<=' |'>=') shift)
 *
 * shift            : additive
 *                  | additive (`>>` | `<<` | `>>>`) additive
 *
 * additive         : multiplicative
 *                  | multiplicative (`+` | `-`) additive
 *
 * multiplicative   : unary
 *                  | unary (`*` | `/` | `%` | `mod`) multiplicative
 *                  | unary symbol
 *
 * unary            : pow
 *                  | (`-` | `+` | `~` | `not`) unary
 *
 * pow              : factorial
 *                  | factorial (`^`) unary
 *
 * factorial        : symbol
 *                  | symbol (`!`)
 *
 * symbol           : symbolToken
 *                  | symbolToken functionCall
 *                  | string
 *
 * functionCall     : `(` `)`
 *                  | `(` ternary (, ternary)* `)`
 *
 * string           : `'` (character)* `'`
 *                  : `"` (character)* `"`
 *                  | array
 *
 * array            : `[` `]`
 *                  | `[` assignment (, assignment)* `]`
 *                  | number
 *
 * number           : number-token
 *                  | parentheses
 *
 * parentheses      : `(` assignment `)`
 *                  : end
 *
 * end              : NULL
 *
 * @param {[type]} lexer [description]
 */
function Parser (lexer) {
  this.lexer = lexer
  this.tokens = null
}

Parser.prototype.current = function () {
  return this.tokens[0]
}

Parser.prototype.next = function () {
  return this.tokens[1]
}

Parser.prototype.peek = function () {
  if (this.tokens.length) {
    var first = this.tokens[0]
    for (var i = 0; i < arguments.length; i += 1) {
      if (first.value === arguments[i]) {
        return true
      }
    }
  }
}

Parser.prototype.consume = function (e) {
  return this.tokens.shift()
}

Parser.prototype.expect = function (e) {
  if (!this.peek(e)) {
    throw Error('expected ' + e)
  }
  return this.consume()
}

Parser.prototype.isEOF = function () {
  return this.current().type === tokenType.EOF
}

Parser.prototype.parse = function (text) {
  this.tokens = this.lexer.lex(text)
  return this.program()
}

Parser.prototype.program = function () {
  var blocks = []
  while (!this.isEOF()) {
    blocks.push(this.assignment())
    if (this.peek(';')) {
      this.consume()
    }
  }
  this.end()
  return blocks
}

Parser.prototype.assignment = function () {
  return this.additive()
}

Parser.prototype.additive = function () {
  var left = this.multiplicative()
  if (this.peek('+', '-')) {
    var op = this.consume()
    var right = this.additive()
    return new OperatorNode(op.value, [left, right])
  }
  return left
}

Parser.prototype.multiplicative = function () {
  var op, right
  var left = this.unary()
  if (this.peek('*', '/', '%')) {
    op = this.consume()
    right = this.multiplicative()
    return new OperatorNode(op.value, [left, right])
  }

  // implicit multiplication
  // - 2 x
  // - 2(x)
  // - (2)2
  if (this.current().type === tokenType.SYMBOL ||
      this.peek('(') ||
      (!(left.type instanceof ConstantNode) && this.current().type === tokenType.NUMBER)
      ) {
    right = this.multiplicative()
    return new OperatorNode('*', [left, right])
  }

  return left
}

Parser.prototype.unary = function () {
  if (this.peek('-', '+')) {
    var op = this.consume()
    var right = this.unary()
    return new OperatorNode(op.value, [right])
  }
  return this.pow()
}

Parser.prototype.pow = function () {
  var left = this.factorial()
  if (this.peek('^')) {
    var op = this.consume()
    var right = this.unary()
    return new OperatorNode(op.value, [left, right])
  }
  return left
}

Parser.prototype.factorial = function () {
  var left = this.symbol()
  if (this.peek('!')) {
    var op = this.consume()
    return new OperatorNode(op.value, [left])
  }
  return left
}

Parser.prototype.symbol = function () {
  var current = this.current()
  if (current.type === tokenType.SYMBOL) {
    var symbol = this.consume()
    var node = this.functionCall(symbol)
    return node
  }
  return this.string()
}

Parser.prototype.functionCall = function (symbolToken) {
  var name = symbolToken.value
  if (this.peek('(')) {
    this.consume()
    var params = []
    while (!this.peek(')') && !this.isEOF()) {
      params.push(this.assignment())
      if (this.peek(',')) {
        this.consume()
      }
    }
    this.expect(')')
    return new FunctionNode(name, params)
  }
  return new SymbolNode(name)
}

Parser.prototype.string = function () {
  if (this.current().type === tokenType.STRING) {
    return new ConstantNode(this.consume().value, 'string')
  }
  return this.number()
}

Parser.prototype.number = function () {
  var token = this.current()
  if (token.type === tokenType.NUMBER) {
    return new ConstantNode(this.consume().value, 'number')
  }
  return this.parentheses()
}

Parser.prototype.parentheses = function () {
  var token = this.current()
  if (token.value === '(') {
    this.consume()
    var left = this.assignment()
    this.expect(')')
    return left
  }
  return this.end()
}

Parser.prototype.end = function () {
  var token = this.current()
  if (token.type !== tokenType.EOF) {
    throw Error('unexpected end of expression')
  }
}

module.exports = Parser
