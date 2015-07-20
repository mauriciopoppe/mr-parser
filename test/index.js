'use strict'

var mrParser = require('../')
var Lexer = mrParser.Lexer
var test = require('tape')

function doLex (exp) {
  return new Lexer(exp).lex()
}

test('Lexer:number', function (t) {
  t.equal(doLex('3').length, 1)
  t.equal(doLex('2.').length, 1)
  t.equal(doLex('2.3').length, 1)
  t.equal(doLex('.3').length, 1)
  t.equal(doLex('3e1').length, 1)
  t.equal(doLex('3e+1').length, 1)
  t.equal(doLex('3e-1').length, 1)

  // invalid examples
  t.throws(function () { doLex('.2e3e') })
  t.throws(function () { doLex('3.e') })
  t.throws(function () { doLex('.3e') })
  t.throws(function () { doLex('3.ee') })

  t.end()
})
