function Token (value) {
  this.value = value
}

Object.defineProperty(Token, 'type', {
  get: function () {
    throw Error('token type property must be overriden')
  }
})

module.exports = Token
