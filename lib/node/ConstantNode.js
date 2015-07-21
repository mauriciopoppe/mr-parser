var Node = require('./Node')

var SUPPORTED_TYPES = {
  number: true,
  string: true,
  'boolean': true,
  'undefined': true,
  'null': true
}

function ConstantNode (value, type) {
  if (!SUPPORTED_TYPES[type]) {
    throw Error('unsupported type \'' + type + '\'')
  }
  this.value = value
  this.valueType = type
}

ConstantNode.prototype = Object.create(Node.prototype)

ConstantNode.prototype.type = 'ConstantNode'

module.exports = ConstantNode
