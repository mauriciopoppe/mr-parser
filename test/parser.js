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
  t.end()
})
