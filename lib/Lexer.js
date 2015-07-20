// token types
var NumberToken = require('./tokens/Number')

// helpers

function isNumber (c) {
  return c >= '0' && c <= '9'
}

function isAnyOf (c, str) {
  return str.indexOf(c) >= 0
}

// function isIdentifier (c) {
//   return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') ||
//     c === '$' || c === '_'
// }

function isWhitespace (c) {
  return c === ' ' || c === '\r' || c === '\t' ||
    c === '\n' || c === '\v' || c === '\u00A0'
}

// e.g. 3e+3
function isExpOperator (c) {
  return c === '-' || c === '+' || isNumber(c)
}

// lexer

function Lexer (text) {
  this.text = text

  // index of the current token being analyzed
  this.index = 0

  // the character currently being analyzed
  this.ch = null

  this.tokens = []
}

Lexer.prototype.lex = function () {
  this.tokens = []
  while (this.index < this.text.length) {

    // skip whitespaces
    do {
      this.ch = this.text.charAt(this.index)
    } while (isWhitespace(this.ch))

    if (isNumber(this.ch) ||
        (isAnyOf(this.ch, '.') && isNumber(this.peek()))) {
      this.readNumber()
    } else {
      throw Error('unexpected character: ' + this.ch)
    }
  }
  return this.tokens
}

Lexer.prototype.peek = function (nth) {
  if (arguments.length < 1) {
    nth = 1
  }
  if (this.index + nth >= this.text.length) {
    return -1
  }
  return this.text.charAt(this.index + nth)
}

Lexer.prototype.consume = function () {
  var old = this.ch
  if (!old) {
    throw Error('cannot consume, the end of the input has been reached')
  }
  this.index += 1
  this.ch = this.text.charAt(this.index)
  return old
}

Lexer.prototype.readNumber = function () {
  var number = ''
  var dot = false
  var exp = false
  while (this.index < this.text.length) {
    var ch = this.text.charAt(this.index).toLowerCase()
    if (ch === '.' && !dot) {
      dot = true
      number += ch
    } else if (isNumber(ch)) {
      number += ch
    } else if (ch === 'e' && !exp && this.peek() && isExpOperator(this.peek())) {
      number += ch
      exp = true

      // parse exp operator
      ch = this.text.charAt(this.index += 1)
      number += ch
    } else {
      throw Error('invalid number')
    }
    this.index += 1
  }

  this.tokens.push(new NumberToken(number))
}

module.exports = Lexer
