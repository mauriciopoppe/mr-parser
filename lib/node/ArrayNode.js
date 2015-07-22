var Node = require('./Node')

function ArrayNode (nodes) {
  this.nodes = nodes
}

ArrayNode.prototype = Object.create(Node.prototype)

ArrayNode.prototype.type = 'ArrayNode'

module.exports = ArrayNode
