"use strict";

// source code:
`
{
  await using x = makeDisposable();
}`
// obtained from https://typescript-eslint.io/play/#ts=5.4.3&showAST=es&fileType=.tsx&code=FAb2AJwQwdyhLALuArgZ3gOwObgB7gC84AtlANYCmAIvGgA4D2aUARgDaUAUAlANzAAvkA&eslintrc=N4KABGBEBOCuA2BTAzpAXGYBfEWg&tsconfig=N4KABGBEDGD2C2AHAlgGwKYCcDyiAuysAdgM6QBcYoEEkJemy0eAcgK6qoDCAFutAGsylBm3TgwAXxCSgA&tokens=false

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
                  17,
                  18
                ],
                "loc": {
                  "start": {
                    "line": 3,
                    "column": 14
                  },
                  "end": {
                    "line": 3,
                    "column": 15
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
                    21,
                    35
                  ],
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 18
                    },
                    "end": {
                      "line": 3,
                      "column": 32
                    }
                  }
                },
                "arguments": [],
                "optional": false,
                "range": [
                  21,
                  37
                ],
                "loc": {
                  "start": {
                    "line": 3,
                    "column": 18
                  },
                  "end": {
                    "line": 3,
                    "column": 34
                  }
                }
              },
              "range": [
                17,
                37
              ],
              "loc": {
                "start": {
                  "line": 3,
                  "column": 14
                },
                "end": {
                  "line": 3,
                  "column": 34
                }
              }
            }
          ],
          "declare": false,
          "kind": "await using",
          "range": [
            5,
            38
          ],
          "loc": {
            "start": {
              "line": 3,
              "column": 2
            },
            "end": {
              "line": 3,
              "column": 35
            }
          }
        }
      ],
      "range": [
        1,
        40
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
    40
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
      "value": "await",
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
      "value": "using",
      "range": [
        11,
        16
      ],
      "loc": {
        "start": {
          "line": 3,
          "column": 8
        },
        "end": {
          "line": 3,
          "column": 13
        }
      }
    },
    {
      "type": "Identifier",
      "value": "x",
      "range": [
        17,
        18
      ],
      "loc": {
        "start": {
          "line": 3,
          "column": 14
        },
        "end": {
          "line": 3,
          "column": 15
        }
      }
    },
    {
      "type": "Punctuator",
      "value": "=",
      "range": [
        19,
        20
      ],
      "loc": {
        "start": {
          "line": 3,
          "column": 16
        },
        "end": {
          "line": 3,
          "column": 17
        }
      }
    },
    {
      "type": "Identifier",
      "value": "makeDisposable",
      "range": [
        21,
        35
      ],
      "loc": {
        "start": {
          "line": 3,
          "column": 18
        },
        "end": {
          "line": 3,
          "column": 32
        }
      }
    },
    {
      "type": "Punctuator",
      "value": "(",
      "range": [
        35,
        36
      ],
      "loc": {
        "start": {
          "line": 3,
          "column": 32
        },
        "end": {
          "line": 3,
          "column": 33
        }
      }
    },
    {
      "type": "Punctuator",
      "value": ")",
      "range": [
        36,
        37
      ],
      "loc": {
        "start": {
          "line": 3,
          "column": 33
        },
        "end": {
          "line": 3,
          "column": 34
        }
      }
    },
    {
      "type": "Punctuator",
      "value": ";",
      "range": [
        37,
        38
      ],
      "loc": {
        "start": {
          "line": 3,
          "column": 34
        },
        "end": {
          "line": 3,
          "column": 35
        }
      }
    },
    {
      "type": "Punctuator",
      "value": "}",
      "range": [
        39,
        40
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
      "line": 4,
      "column": 1
    }
  },
  "parent": null
})
