"use strict";

// source code:
`
{
  using x = makeDisposable();
}`
// obtained from https://typescript-eslint.io/play/#ts=5.4.3&showAST=es&fileType=.tsx&code=FAb2AJwVwZwSwHYHNwA9wF5wFsCGBrAUwBE4YAHAexlwCMAbQgCgEoBuYAXyA&eslintrc=N4KABGBEBOCuA2BTAzpAXGYBfEWg&tsconfig=N4KABGBEDGD2C2AHAlgGwKYCcDyiAuysAdgM6QBcYoEEkJemy0eAcgK6qoDCAFutAGsylBm3TgwAXxCSgA&tokens=false

exports.parse = () => ({
  "type": "Program",
  "body": [
    {
      "type": "BlockStatement",
      "body": [
        {
          "type": "VariableDeclaration",
          "declarations": [
            {
              "type": "VariableDeclarator",
              "definite": false,
              "id": {
                "type": "Identifier",
                "decorators": [],
                "name": "x",
                "optional": false,
                "range": [
                  11,
                  12
                ],
                "loc": {
                  "start": {
                    "line": 3,
                    "column": 8
                  },
                  "end": {
                    "line": 3,
                    "column": 9
                  }
                }
              },
              "init": {
                "type": "CallExpression",
                "callee": {
                  "type": "Identifier",
                  "decorators": [],
                  "name": "makeDisposable",
                  "optional": false,
                  "range": [
                    15,
                    29
                  ],
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 12
                    },
                    "end": {
                      "line": 3,
                      "column": 26
                    }
                  }
                },
                "arguments": [],
                "optional": false,
                "range": [
                  15,
                  31
                ],
                "loc": {
                  "start": {
                    "line": 3,
                    "column": 12
                  },
                  "end": {
                    "line": 3,
                    "column": 28
                  }
                }
              },
              "range": [
                11,
                31
              ],
              "loc": {
                "start": {
                  "line": 3,
                  "column": 8
                },
                "end": {
                  "line": 3,
                  "column": 28
                }
              }
            }
          ],
          "declare": false,
          "kind": "using",
          "range": [
            5,
            32
          ],
          "loc": {
            "start": {
              "line": 3,
              "column": 2
            },
            "end": {
              "line": 3,
              "column": 29
            }
          }
        }
      ],
      "range": [
        1,
        34
      ],
      "loc": {
        "start": {
          "line": 2,
          "column": 0
        },
        "end": {
          "line": 4,
          "column": 1
        }
      }
    }
  ],
  "comments": [],
  "range": [
    1,
    35
  ],
  "sourceType": "script",
  "tokens": [
    {
      "type": "Punctuator",
      "value": "{",
      "range": [
        1,
        2
      ],
      "loc": {
        "start": {
          "line": 2,
          "column": 0
        },
        "end": {
          "line": 2,
          "column": 1
        }
      }
    },
    {
      "type": "Identifier",
      "value": "using",
      "range": [
        5,
        10
      ],
      "loc": {
        "start": {
          "line": 3,
          "column": 2
        },
        "end": {
          "line": 3,
          "column": 7
        }
      }
    },
    {
      "type": "Identifier",
      "value": "x",
      "range": [
        11,
        12
      ],
      "loc": {
        "start": {
          "line": 3,
          "column": 8
        },
        "end": {
          "line": 3,
          "column": 9
        }
      }
    },
    {
      "type": "Punctuator",
      "value": "=",
      "range": [
        13,
        14
      ],
      "loc": {
        "start": {
          "line": 3,
          "column": 10
        },
        "end": {
          "line": 3,
          "column": 11
        }
      }
    },
    {
      "type": "Identifier",
      "value": "makeDisposable",
      "range": [
        15,
        29
      ],
      "loc": {
        "start": {
          "line": 3,
          "column": 12
        },
        "end": {
          "line": 3,
          "column": 26
        }
      }
    },
    {
      "type": "Punctuator",
      "value": "(",
      "range": [
        29,
        30
      ],
      "loc": {
        "start": {
          "line": 3,
          "column": 26
        },
        "end": {
          "line": 3,
          "column": 27
        }
      }
    },
    {
      "type": "Punctuator",
      "value": ")",
      "range": [
        30,
        31
      ],
      "loc": {
        "start": {
          "line": 3,
          "column": 27
        },
        "end": {
          "line": 3,
          "column": 28
        }
      }
    },
    {
      "type": "Punctuator",
      "value": ";",
      "range": [
        31,
        32
      ],
      "loc": {
        "start": {
          "line": 3,
          "column": 28
        },
        "end": {
          "line": 3,
          "column": 29
        }
      }
    },
    {
      "type": "Punctuator",
      "value": "}",
      "range": [
        33,
        34
      ],
      "loc": {
        "start": {
          "line": 4,
          "column": 0
        },
        "end": {
          "line": 4,
          "column": 1
        }
      }
    }
  ],
  "loc": {
    "start": {
      "line": 2,
      "column": 0
    },
    "end": {
      "line": 5,
      "column": 0
    }
  },
  "parent": null
})
