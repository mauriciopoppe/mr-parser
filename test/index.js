'use strict'

var mrParser = require('../')
var test = require('tape')

test('awesome:test', function (t) {
  t.ok(mrParser() === 'awesome')
  t.end()
})
