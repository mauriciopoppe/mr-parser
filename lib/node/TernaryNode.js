var Node = require('./Node')

function TernaryNode (predicate, truthy, falsy) {
  this.condition = predicate
  this.trueExpr = truthy
  this.falseExpr = falsy
}

TernaryNode.prototype = Object.create(Node.prototype)

TernaryNode.prototype.type = 'TernaryNode'

module.exports = TernaryNode
