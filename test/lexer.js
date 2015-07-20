'use strict'

var mrParser = require('../')
var Lexer = mrParser.Lexer
var test = require('tape')
var type = require('../lib/token-type')

function doLex (exp) {
  return new Lexer(exp).lex()
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
  t.throws(function () { doLex('.e2') })
  t.throws(function () { doLex('.e2.') })
  t.throws(function () { doLex('.e.2') })
  t.throws(function () { doLex('3.e') })
  t.throws(function () { doLex('.3e') })
  t.throws(function () { doLex('3.ee') })

  t.end()
})

test('Lexer:identifier', function (t) {
  t.deepEqual(
    doLex('mauricio'),
    [
      { value: 'mauricio', type: type.SYMBOL }
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
