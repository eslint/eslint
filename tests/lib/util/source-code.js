/**
 * @fileoverview Abstraction of JavaScript source code.
 * @author Nicholas C. Zakas
 * @copyright 2015 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    eslint = require("../../../lib/eslint"),
    SourceCode = require("../../../lib/util/source-code");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/* eslint-disable indent*/
// let foo = bar;
var AST = {
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "foo",
            "range": [
              4,
              7
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 4
              },
              "end": {
                "line": 1,
                "column": 7
              }
            }
          },
          "init": {
            "type": "Identifier",
            "name": "bar",
            "range": [
              10,
              13
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 10
              },
              "end": {
                "line": 1,
                "column": 13
              }
            }
          },
          "range": [
            4,
            13
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 4
            },
            "end": {
              "line": 1,
              "column": 13
            }
          }
        }
      ],
      "kind": "let",
      "range": [
        0,
        14
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 1,
          "column": 14
        }
      }
    }
  ],
  "sourceType": "module",
  "range": [
    0,
    14
  ],
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 1,
      "column": 14
    }
  },
  "tokens": [
    {
      "type": "Keyword",
      "value": "let",
      "range": [
        0,
        3
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 1,
          "column": 3
        }
      }
    },
    {
      "type": "Identifier",
      "value": "foo",
      "range": [
        4,
        7
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 4
        },
        "end": {
          "line": 1,
          "column": 7
        }
      }
    },
    {
      "type": "Punctuator",
      "value": "=",
      "range": [
        8,
        9
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 8
        },
        "end": {
          "line": 1,
          "column": 9
        }
      }
    },
    {
      "type": "Identifier",
      "value": "bar",
      "range": [
        10,
        13
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 10
        },
        "end": {
          "line": 1,
          "column": 13
        }
      }
    },
    {
      "type": "Punctuator",
      "value": ";",
      "range": [
        13,
        14
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 13
        },
        "end": {
          "line": 1,
          "column": 14
        }
      }
    }
  ],
  "comments": []
};
/* eslint-enable indent */

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SourceCode", function() {

    describe("new SourceCode()", function() {

        it("should create a new instance when called with valid data", function() {
            var ast = { comments: [], tokens: [], loc: {}, range: [] };
            var sourceCode = new SourceCode("foo;", ast);

            assert.isObject(sourceCode);
            assert.equal(sourceCode.text, "foo;");
            assert.equal(sourceCode.ast, ast);
        });

        it("should split text into lines when called with valid data", function() {
            var ast = { comments: [], tokens: [], loc: {}, range: [] };
            var sourceCode = new SourceCode("foo;\nbar;", ast);

            assert.isObject(sourceCode);
            assert.equal(sourceCode.lines.length, 2);
            assert.equal(sourceCode.lines[0], "foo;");
            assert.equal(sourceCode.lines[1], "bar;");
        });

        /* eslint-disable no-new */

        it("should throw an error when called with an AST that's missing tokens", function() {

            assert.throws(function() {
                new SourceCode("foo;", { comments: [], loc: {}, range: [] });
            }, /missing the tokens array/);

        });

        it("should throw an error when called with an AST that's missing comments", function() {

            assert.throws(function() {
                new SourceCode("foo;", { tokens: [], loc: {}, range: [] });
            }, /missing the comments array/);

        });

        it("should throw an error when called with an AST that's missing comments", function() {

            assert.throws(function() {
                new SourceCode("foo;", { comments: [], tokens: [], range: [] });
            }, /missing location information/);

        });

        it("should throw an error when called with an AST that's missing comments", function() {

            assert.throws(function() {
                new SourceCode("foo;", { comments: [], tokens: [], loc: {} });
            }, /missing range information/);
        });


    });

    describe("eslint.verify()", function() {

        var CONFIG = {
            ecmaFeatures: {
                blockBindings: true
            }
        };

        it("should work when passed a SourceCode object", function() {
            var sourceCode = new SourceCode("let foo = bar;", AST),
                messages = eslint.verify(sourceCode, CONFIG);

            assert.equal(messages.length, 0);
        });

        it("should report an error when blockBindings is false", function() {
            var sourceCode = new SourceCode("let foo = bar;", AST),
                messages = eslint.verify(sourceCode, {
                    ecmaFeatures: { blockBindings: true },
                    rules: { "no-unused-vars": 2 }
                });

            assert.equal(messages.length, 1);
            assert.equal(messages[0].message, "\"foo\" is defined but never used");
        });
    });
});
