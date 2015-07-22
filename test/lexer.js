'use strict'

var mrParser = require('../')
var Lexer = mrParser.Lexer
var test = require('tape')
var type = require('../lib/token-type')

function doLex (exp) {
  var tokens = new Lexer().lex(exp)
  // remove the last token which is EOF
  tokens.pop()
  return tokens
}

// function getNumber(token) {
//   return token.text
// }

// t.deepEqual(
//   doLex(''),
//   [
//     { value: '', type: type.SYMBOL }
//   ]
// )

test('Lexer:number', function (t) {
  t.deepEqual(
    doLex('2.3e-2'),
    [
      { value: '2.3e-2', type: type.NUMBER }
    ]
  )
  t.equal(doLex('2.').length, 1)
  t.equal(doLex('2.3').length, 1)
  t.equal(doLex('.3').length, 1)
  t.equal(doLex('3e1').length, 1)
  t.equal(doLex('3e+1').length, 1)
  t.equal(doLex('3e-1').length, 1)

  // invalid examples
  t.throws(function () { doLex('.e') })
  t.throws(function () { doLex('.e2') })
  t.throws(function () { doLex('.e2.') })
  t.throws(function () { doLex('.e.2') })
  t.throws(function () { doLex('3.e') })
  t.throws(function () { doLex('.3e') })
  t.throws(function () { doLex('3.ee') })
  t.throws(function () { doLex('3.e+q') })

  t.end()
})

test('Lexer:string', function (t) {
  t.deepEqual(
    doLex('"123"'),
    [{ value: '123', type: type.STRING }]
  )

  t.deepEqual(
    doLex('"f\'x"'),
    [{ value: 'f\'x', type: type.STRING }]
  )

  // invalid
  t.throws(function () { doLex('"qqq') })
  t.throws(function () { doLex('qqq"') })

  t.end()
})

test('Lexer:identifier', function (t) {
  t.deepEqual(
    doLex('foo'),
    [
      { value: 'foo', type: type.SYMBOL }
    ]
  )
  t.deepEqual(
    doLex('a b $_ _3'),
    [
      { value: 'a', type: type.SYMBOL },
      { value: 'b', type: type.SYMBOL },
      { value: '$_', type: type.SYMBOL },
      { value: '_3', type: type.SYMBOL }
    ]
  )
  t.end()
})

test('Lexer:lex', function (t) {
  t.equal(doLex('1+2+3').length, 5)
  t.deepEqual(
    doLex('2x'),
    [
      { value: '2', type: type.NUMBER },
      { value: 'x', type: type.SYMBOL }
    ]
  )
  t.deepEqual(
    doLex('a + b = c'),
    [
      { value: 'a', type: type.SYMBOL },
      { value: '+', type: type.DELIMITER },
      { value: 'b', type: type.SYMBOL },
      { value: '=', type: type.DELIMITER },
      { value: 'c', type: type.SYMBOL }
    ]
  )
  t.end()
})
