'use strict'

var mrParser = require('../')
var Lexer = mrParser.Lexer
var Parser = mrParser.Parser
var test = require('tape')

function parse (exp) {
  return new Parser(new Lexer()).parse(exp)
}

test('parser:number', function (t) {
  t.deepEquals(parse('32'), [{
    value: '32',
    valueType: 'number'
  }])
  t.end()
})

test('parser:assignment', function (t) {
  t.deepEquals(parse('x = 1 + 2'), [{
    name: 'x',
    expr: {
      op: '+',
      args: [
        { value: '1', valueType: 'number' },
        { value: '2', valueType: 'number' }
      ]
    }
  }])
  t.end()
})

test('parser:ternary', function (t) {
  t.deepEquals(parse('1 ? a : b'), [{
    condition: { value: '1', valueType: 'number' },
    trueExpr: { name: 'a' },
    falseExpr: { name: 'b' }
  }])
  t.deepEquals(parse('"foo" === "bar" ? a : b'), [{
    condition: {
      op: '===',
      args: [
        { value: 'foo', valueType: 'string' },
        { value: 'bar', valueType: 'string' }
      ]
    },
    trueExpr: { name: 'a' },
    falseExpr: { name: 'b' }
  }])
  t.deepEquals(parse('1 ? 2 ? a : b : c'), [{
    condition: { value: '1', valueType: 'number' },
    trueExpr: {
      condition: { value: '2', valueType: 'number' },
      trueExpr: { name: 'a' },
      falseExpr: { name: 'b' }
    },
    falseExpr: { name: 'c' }
  }])
  t.end()
})

test('parser:logicalOR', function (t) {
  t.deepEquals(parse('1 || 2'), [{
    op: '||',
    args: [
      { value: '1', valueType: 'number' },
      { value: '2', valueType: 'number' }
    ]
  }])
  t.deepEquals(parse('1 || 3 || 2'), [{
    op: '||',
    args: [
      { value: '1', valueType: 'number' },
      {
        op: '||',
        args: [
          { value: '3', valueType: 'number' },
          { value: '2', valueType: 'number' }
        ]
      }
    ]
  }])
  t.end()
})

test('parser:logicalXOR', function (t) {
  t.deepEquals(parse('1 xor 2'), [{
    op: 'xor',
    args: [
      { value: '1', valueType: 'number' },
      { value: '2', valueType: 'number' }
    ]
  }])
  t.deepEquals(parse('1 xor 3 xor 2'), [{
    op: 'xor',
    args: [
      { value: '1', valueType: 'number' },
      {
        op: 'xor',
        args: [
          { value: '3', valueType: 'number' },
          { value: '2', valueType: 'number' }
        ]
      }
    ]
  }])
  t.end()
})

test('parser:logicalAND', function (t) {
  t.deepEquals(parse('1 && 2'), [{
    op: '&&',
    args: [
      { value: '1', valueType: 'number' },
      { value: '2', valueType: 'number' }
    ]
  }])
  t.deepEquals(parse('1 && 3 && 2'), [{
    op: '&&',
    args: [
      { value: '1', valueType: 'number' },
      {
        op: '&&',
        args: [
          { value: '3', valueType: 'number' },
          { value: '2', valueType: 'number' }
        ]
      }
    ]
  }])
  t.end()
})

test('parser:bitwiseOR', function (t) {
  t.deepEquals(parse('1 | 2'), [{
    op: '|',
    args: [
      { value: '1', valueType: 'number' },
      { value: '2', valueType: 'number' }
    ]
  }])
  t.deepEquals(parse('1 | 3 | 2'), [{
    op: '|',
    args: [
      { value: '1', valueType: 'number' },
      {
        op: '|',
        args: [
          { value: '3', valueType: 'number' },
          { value: '2', valueType: 'number' }
        ]
      }
    ]
  }])
  t.end()
})

test('parser:bitwiseXOR', function (t) {
  t.deepEquals(parse('1 ^| 2'), [{
    op: '^|',
    args: [
      { value: '1', valueType: 'number' },
      { value: '2', valueType: 'number' }
    ]
  }])
  t.deepEquals(parse('1 ^| 3 ^| 2'), [{
    op: '^|',
    args: [
      { value: '1', valueType: 'number' },
      {
        op: '^|',
        args: [
          { value: '3', valueType: 'number' },
          { value: '2', valueType: 'number' }
        ]
      }
    ]
  }])
  t.end()
})

test('parser:bitwiseAND', function (t) {
  t.deepEquals(parse('1 & 2'), [{
    op: '&',
    args: [
      { value: '1', valueType: 'number' },
      { value: '2', valueType: 'number' }
    ]
  }])
  t.deepEquals(parse('1 & 3 & 2'), [{
    op: '&',
    args: [
      { value: '1', valueType: 'number' },
      {
        op: '&',
        args: [
          { value: '3', valueType: 'number' },
          { value: '2', valueType: 'number' }
        ]
      }
    ]
  }])
  t.end()
})

test('parser:relational', function (t) {
  t.deepEquals(parse('1 != 2'), [{
    op: '!=',
    args: [
      { value: '1', valueType: 'number' },
      { value: '2', valueType: 'number' }
    ]
  }])
  t.end()
})

test('parser:shift', function (t) {
  t.deepEquals(parse('1 << 2'), [{
    op: '<<',
    args: [
      { value: '1', valueType: 'number' },
      { value: '2', valueType: 'number' }
    ]
  }])
  t.deepEquals(parse('1 << 3 >> 2'), [{
    op: '<<',
    args: [
      { value: '1', valueType: 'number' },
      {
        op: '>>',
        args: [
          { value: '3', valueType: 'number' },
          { value: '2', valueType: 'number' }
        ]
      }
    ]
  }])
  t.end()
})

test('parser:additive', function (t) {
  t.deepEquals(parse('32 + 3'), [{
    op: '+',
    args: [
      { value: '32', valueType: 'number' },
      { value: '3', valueType: 'number' }
    ]
  }])
  t.deepEquals(parse('1 + 2 - 3'), [{
    op: '+',
    args: [{
      value: '1',
      valueType: 'number'
    }, {
      op: '-',
      args: [
        { value: '2', valueType: 'number' },
        { value: '3', valueType: 'number' }
      ]
    }]
  }])
  t.throws(function () { parse('1 + 2 -') })
  t.throws(function () { parse('1 + 2 - *') })
  t.end()
})

test('parser:multiplicative', function (t) {
  t.deepEquals(parse('32 * 3'), [{
    op: '*',
    args: [
      { value: '32', valueType: 'number' },
      { value: '3', valueType: 'number' }
    ]
  }])
  t.deepEquals(parse('1 * 2 * 3'), [{
    op: '*',
    args: [{
      value: '1',
      valueType: 'number'
    }, {
      op: '*',
      args: [
        { value: '2', valueType: 'number' },
        { value: '3', valueType: 'number' }
      ]
    }]
  }])
  t.deepEquals(parse('1 * 2 + 3'), [{
    op: '+',
    args: [{
      op: '*',
      args: [
        { value: '1', valueType: 'number' },
        { value: '2', valueType: 'number' }
      ]
    }, {
      value: '3',
      valueType: 'number'
    }]
  }])
  t.deepEquals(parse('1 + 2 * 3'), [{
    op: '+',
    args: [{
      value: '1',
      valueType: 'number'
    }, {
      op: '*',
      args: [
        { value: '2', valueType: 'number' },
        { value: '3', valueType: 'number' }
      ]
    }]
  }])
  t.deepEquals(parse('1 * 2 + 3 * 4'), [{
    op: '+',
    args: [{
      op: '*',
      args: [
        { value: '1', valueType: 'number' },
        { value: '2', valueType: 'number' }
      ]
    }, {
      op: '*',
      args: [
        { value: '3', valueType: 'number' },
        { value: '4', valueType: 'number' }
      ]
    }]
  }])
  t.deepEquals(parse('1 % 2 + 3 / 4 + 5'), [{
    op: '+',
    args: [{
      op: '%',
      args: [
        { value: '1', valueType: 'number' },
        { value: '2', valueType: 'number' }
      ]
    }, {
      op: '+',
      args: [{
        op: '/',
        args: [
          { value: '3', valueType: 'number' },
          { value: '4', valueType: 'number' }
        ]
      },
        { value: '5', valueType: 'number' }
      ]
    }]
  }])
  t.deepEquals(parse('2x'), [{
    op: '*',
    args: [
      { value: '2', valueType: 'number' },
      { name: 'x' }
    ]
  }])
  t.deepEquals(parse('2 x'), [{
    op: '*',
    args: [
      { value: '2', valueType: 'number' },
      { name: 'x' }
    ]
  }])
  t.deepEquals(parse('2(x)'), [{
    op: '*',
    args: [
      { value: '2', valueType: 'number' },
      { name: 'x' }
    ]
  }])
  t.deepEquals(parse('(2)(x)'), [{
    op: '*',
    args: [
      { value: '2', valueType: 'number' },
      { name: 'x' }
    ]
  }])
  t.deepEquals(parse('(2)2'), [{
    op: '*',
    args: [
      { value: '2', valueType: 'number' },
      { value: '2', valueType: 'number' }
    ]
  }])
  t.deepEquals(parse('2 x y'), [{
    op: '*',
    args: [
      { value: '2', valueType: 'number' },
      {
        op: '*',
        args: [
          { name: 'x' },
          { name: 'y' }
        ]
      }
    ]
  }])
  // xor is a reserved words
  t.throws(function () { parse('2xor') })
  t.end()
})

test('parser:unary', function (t) {
  t.deepEquals(parse('1 + -2'), [{
    op: '+',
    args: [{
      value: '1',
      valueType: 'number'
    }, {
      op: '-',
      args: [
        { value: '2', valueType: 'number' }
      ]
    }]
  }])
  t.deepEquals(parse('+-+2'), [{
    op: '+',
    args: [{
      op: '-',
      args: [{
        op: '+',
        args: [{
          value: '2', valueType: 'number'
        }]
      }]
    }]
  }])
  t.deepEquals(parse('-1 - -2'), [{
    op: '-',
    args: [{
      op: '-',
      args: [
        { value: '1', valueType: 'number' }
      ]
    }, {
      op: '-',
      args: [
        { value: '2', valueType: 'number' }
      ]
    }]
  }])
  t.deepEquals(parse('-(3 - -2)'), [{
    op: '-',
    args: [{
      op: '-',
      args: [
        { value: '3', valueType: 'number' },
        {
          op: '-',
          args: [
            { value: '2', valueType: 'number' }
          ]
        }
      ]
    }]
  }])
  t.end()
})

test('parser:pow', function (t) {
  t.deepEquals(parse('2^3'), [{
    op: '^',
    args: [{
      value: '2',
      valueType: 'number'
    }, {
      value: '3',
      valueType: 'number'
    }]
  }])
  t.deepEquals(parse('1 ^ -2'), [{
    op: '^',
    args: [{
      value: '1',
      valueType: 'number'
    }, {
      op: '-',
      args: [
        { value: '2', valueType: 'number' }
      ]
    }]
  }])
  t.end()
})

test('parser:factorial', function (t) {
  t.deepEquals(parse('2!'), [{
    op: '!',
    args: [{
      value: '2',
      valueType: 'number'
    }]
  }])
  t.end()
})

test('parser:symbol', function (t) {
  t.deepEquals(parse('asd'), [{
    name: 'asd'
  }])
  t.deepEquals(parse('$3'), [{
    name: '$3'
  }])
  t.deepEquals(parse('_4$'), [{
    name: '_4$'
  }])
  t.end()
})

test('parser:functionCall', function (t) {
  t.deepEquals(parse('f()'), [{
    name: 'f',
    args: []
  }])
  t.deepEquals(parse('f(x)'), [{
    name: 'f',
    args: [
      { name: 'x' }
    ]
  }])
  t.deepEquals(parse('f(x, y)'), [{
    name: 'f',
    args: [
      { name: 'x' },
      { name: 'y' }
    ]
  }])
  t.throws(function () {
    parse('f(x, y')
  })
  t.end()
})

test('parser:string', function (t) {
  t.deepEquals(parse('"asd"'), [{
    value: 'asd', valueType: 'string'
  }])
  t.deepEquals(parse('\'asd\''), [{
    value: 'asd', valueType: 'string'
  }])
  t.end()
})

test('parser:array', function (t) {
  t.deepEquals(parse('[]'), [{
    nodes: []
  }])
  t.deepEquals(parse('[2, 3]'), [{
    nodes: [
      { value: '2', valueType: 'number' },
      { value: '3', valueType: 'number' }
    ]
  }])
  t.deepEquals(parse('[2, 3] + [3, 2]'), [{
    op: '+',
    args: [{
      nodes: [
        { value: '2', valueType: 'number' },
        { value: '3', valueType: 'number' }
      ]
    }, {
      nodes: [
        { value: '3', valueType: 'number' },
        { value: '2', valueType: 'number' }
      ]
    }]
  }])
  t.throws(function () { parse('[') })
  t.throws(function () { parse('[2, 2[]') })
  t.throws(function () { parse(']') })
  t.end()
})

test('parser:parentheses', function (t) {
  t.deepEquals(parse('(32)'), [{
    value: '32',
    valueType: 'number'
  }])
  t.deepEquals(parse('(1 + 2 - 3)'), [{
    op: '+',
    args: [{
      value: '1',
      valueType: 'number'
    }, {
      op: '-',
      args: [
        { value: '2', valueType: 'number' },
        { value: '3', valueType: 'number' }
      ]
    }]
  }])
  t.deepEquals(parse('(1 + 2) - 3'), [{
    op: '-',
    args: [{
      op: '+',
      args: [
        { value: '1', valueType: 'number' },
        { value: '2', valueType: 'number' }
      ]
    }, {
      value: '3',
      valueType: 'number'
    }]
  }])
  t.deepEquals(parse('1 * (2 + 3) * 4'), [{
    op: '*',
    args: [{
      value: '1',
      valueType: 'number'
    }, {
      op: '*',
      args: [{
        op: '+',
        args: [
          { value: '2', valueType: 'number' },
          { value: '3', valueType: 'number' }
        ]
      }, {
        value: '4',
        valueType: 'number'
      }]
    }]
  }])
  t.throws(function () {
    parse('1 + (2 + 3')
  })
  t.throws(function () {
    parse('1 + 2 + 3)')
  })
  t.end()
})

test('parser:block', function (t) {
  t.deepEquals(parse('1;'), [{
    value: '1',
    valueType: 'number'
  }])
  t.deepEquals(parse('1;2;'), [{
    value: '1',
    valueType: 'number'
  }, {
    value: '2',
    valueType: 'number'
  }])
  t.deepEquals(parse('1;2;'), [{
    value: '1',
    valueType: 'number'
  }, {
    value: '2',
    valueType: 'number'
  }])
  t.end()
})
