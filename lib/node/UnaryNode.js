var Node = require('./Node')

function UnaryNode (op, argument) {
  this.op = op
  this.argument = argument
}

UnaryNode.prototype = Object.create(Node.prototype)

UnaryNode.prototype.type = 'UnaryNode'

module.exports = UnaryNode
