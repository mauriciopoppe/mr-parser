var Token = require('./Token')
var tokenType = require('./token-type')

function NumberToken (value) {
  Token.call(this, value)
}

NumberToken.prototype = Object.create(Token)

NumberToken.prototype.type = tokenType.NUMBER

module.exports = NumberToken
