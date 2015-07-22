var Node = require('./Node')

function FunctionNode (name, args) {
  this.name = name
  this.args = args
}

FunctionNode.prototype = Object.create(Node.prototype)

FunctionNode.prototype.type = 'FunctionNode'

module.exports = FunctionNode
