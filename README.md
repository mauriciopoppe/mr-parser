# mr-parser 

[![Build Status][travis-image]][travis-url] [![npm][npm-image]][npm-url]  [![Coverage Status][coveralls-image]][coveralls-url] ![Stability][stability-image]

[stability-image]: https://img.shields.io/badge/stability-stable-green.svg
[travis-image]: https://travis-ci.org/maurizzzio/mr-parser.svg?branch=master
[travis-url]: https://travis-ci.org/maurizzzio/mr-parser
[npm-image]: https://img.shields.io/npm/v/mr-parser.svg?style=flat
[npm-url]: https://npmjs.org/package/mr-parser
[coveralls-image]: https://coveralls.io/repos/maurizzzio/mr-parser/badge.svg
[coveralls-url]: https://coveralls.io/r/maurizzzio/mr-parser

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

> Parses mathematical expressions and outputs an AST

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Description](#description)
  - [why?](#why)
  - [Grammar](#grammar)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
  - [`Parser = require('mr-parser').Parser`](#parser--requiremr-parserparser)
    - [`Parser.parse(expression)`](#parserparseexpression)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description

`mr-parser` is a lightweight mathematical parser inspired by [math.js expression parser][math-js], unlike [math.js expression parser][math-js] the AST nodes contain no info on how to compile a node which makes the parser modular

### why?

I felt that I had to make another parser because:

- [math-parser](https://www.npmjs.com/package/math-parser) is too simple for me, it just operates on numbers and has the following operators `+, -, *, / and ^` and doesn't have variable substitution
- [math.js expression parser][math-js] is perfect but it's not modularized yet, to use it one would have to include all the source code of math.js
- [math.js expression parser][math-js] AST nodes have info about how to compile a node, I think it's better to let another module do that

### Grammar

```text
program          : block (; block)*

block            : assignment

assignment       : ternary
                 | symbol `=` assignment

ternary          : logicalOR
                 | logicalOR `?` ternary `:` ternary

logicalOR        : logicalXOR
                 | logicalXOR (`||`,`or`) logicalOR

logicalXOR       : logicalAND
                 : logicalAND `xor` logicalXOR

logicalAND       : bitwiseOR
                 | bitwiseOR (`&&`,`and`) logicalAND

bitwiseOR        : bitwiseXOR
                 | bitwiseXOR `|` bitwiseOR

bitwiseXOR       : bitwiseAND
                 | bitwiseAND `^|` bitwiseXOR

bitwiseAND       : relational
                 | relational `&` bitwiseAND

relational       : shift
                 | shift (`!=` | `==` | `>` | '<' | '<=' |'>=') shift)

shift            : additive
                 | additive (`>>` | `<<` | `>>>`) shift

additive         : multiplicative
                 | multiplicative (`+` | `-`) additive

multiplicative   : unary
                 | unary (`*` | `/` | `%`) multiplicative
                 | unary symbol

unary            : pow
                 | (`-` | `+` | `~`) unary

pow              : factorial
                 | factorial (`^`, '**') unary

factorial        : symbol
                 | symbol (`!`)

symbol           : symbolToken
                 | symbolToken functionCall
                 | string

functionCall     : `(` `)`
                 | `(` ternary (, ternary)* `)`

string           : `'` (character)* `'`
                 : `"` (character)* `"`
                 | array

array            : `[` `]`
                 | `[` assignment (, assignment)* `]`
                 | number

number           : number-token
                 | parentheses

parentheses      : `(` assignment `)`
                 : end

end              : null-token
```

## Install

```sh
$ npm install --save mr-parser
```

## Usage

```js
var Parser = require('mr-parser').Parser;
Parser.parse('1 * (2 + 3) * 4')

// returns
{
  blocks:[{
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
  }]
} 

Parser.parse('2x')

// returns
{
  blocks: [{
    op: '*',
    args: [
      { value: '2', valueType: 'number' },
      { name: 'x' }
    ]
  }]
}
```

## API

### `Parser = require('mr-parser').Parser`

#### `Parser.parse(expression)`

**params**
* `expression` {string} the expression to be parsed

**returns**
* Returns an array of possibly nested nodes which is the AST that represents the expression

[math-js]: http://mathjs.org/docs/expressions/index.html

2015 MIT © [Mauricio Poppe]()
