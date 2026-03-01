"use strict";

/*
 * Parsed on astexplorer.net using @typescript-eslint/parser@1.4.2
 *
 * Source:
 * declare var foo = 2;
 */

exports.parse = () => ({
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
              12,
              15
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 12
              },
              "end": {
                "line": 1,
                "column": 15
              }
            }
          },
          "init": {
            "type": "Literal",
            "value": 2,
            "raw": "2",
            "range": [
              18,
              19
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 18
              },
              "end": {
                "line": 1,
                "column": 19
              }
            }
          },
          "range": [
            12,
            19
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 12
            },
            "end": {
              "line": 1,
              "column": 19
            }
          }
        }
      ],
      "kind": "var",
      "range": [
        0,
        20
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 1,
          "column": 20
        }
      },
      "declare": true
    }
  ],
  "sourceType": "module",
  "range": [
    0,
    20
  ],
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 1,
      "column": 20
    }
  },
  "tokens": [
    {
      "type": "Identifier",
      "value": "declare",
      "range": [
        0,
        7
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 1,
          "column": 7
        }
      }
    },
    {
      "type": "Keyword",
      "value": "var",
      "range": [
        8,
        11
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 8
        },
        "end": {
          "line": 1,
          "column": 11
        }
      }
    },
    {
      "type": "Identifier",
      "value": "foo",
      "range": [
        12,
        15
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 12
        },
        "end": {
          "line": 1,
          "column": 15
        }
      }
    },
    {
      "type": "Punctuator",
      "value": "=",
      "range": [
        16,
        17
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 16
        },
        "end": {
          "line": 1,
          "column": 17
        }
      }
    },
    {
      "type": "Numeric",
      "value": "2",
      "range": [
        18,
        19
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 18
        },
        "end": {
          "line": 1,
          "column": 19
        }
      }
    },
    {
      "type": "Punctuator",
      "value": ";",
      "range": [
        19,
        20
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 19
        },
        "end": {
          "line": 1,
          "column": 20
        }
      }
    }
  ],
  "comments": []
});
