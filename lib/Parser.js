var tokenType = require('./token-type')

var ConstantNode = require('./node/ConstantNode')
var OperatorNode = require('./node/OperatorNode')

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
 *
 * unary            : pow
 *                  | (`-` | `+` | `~` | `not`) unary
 *
 * pow              : leftHand
 *                  | leftHand (`^`) unary
 *
 * leftHand         : symbol
 *                  | symbol (`!`)
 *
 * symbol           : symbol
 *                  | symbol functionCall
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

Parser.prototype.parse = function (text) {
  this.tokens = this.lexer.lex(text)
  return this.program()
}

Parser.prototype.program = function () {
  var blocks = []
  do {
    blocks.push(this.additive())
  } while (this.peek(';'))
  return blocks
}

Parser.prototype.assignment = function () {
  // TODO
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
  var left = this.number()
  if (this.peek('*', '/', '%')) {
    var op = this.consume()
    var right = this.multiplicative()
    return new OperatorNode(op.value, [left, right])
  }
  return left
}

Parser.prototype.number = function () {
  if (this.peek('(')) {

  }
  var token = this.consume()
  return new ConstantNode(token.value, 'number')
}

module.exports = Parser
