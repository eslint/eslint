/**
 * Source code:
 * function foo(a: number = 0) { }
 */

exports.parse = () => ({
      "type": "Program",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 1,
          "column": 31
        }
      },
      "range": [
        0,
        31
      ],
      "body": [
        {
          "type": "FunctionDeclaration",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 1,
              "column": 31
            }
          },
          "range": [
            0,
            31
          ],
          "id": {
            "type": "Identifier",
            "loc": {
              "source": null,
              "start": {
                "line": 1,
                "column": 9
              },
              "end": {
                "line": 1,
                "column": 12
              }
            },
            "range": [
              9,
              12
            ],
            "name": "foo",
            "typeAnnotation": null,
            "optional": false
          },
          "params": [
            {
              "type": "Identifier",
              "loc": {
                "source": null,
                "start": {
                  "line": 1,
                  "column": 13
                },
                "end": {
                  "line": 1,
                  "column": 22
                }
              },
              "range": [
                13,
                22
              ],
              "name": "a",
              "typeAnnotation": {
                "type": "TypeAnnotation",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 1,
                    "column": 14
                  },
                  "end": {
                    "line": 1,
                    "column": 22
                  }
                },
                "range": [
                  14,
                  22
                ],
                "typeAnnotation": {
                  "type": "NumberTypeAnnotation",
                  "loc": {
                    "source": null,
                    "start": {
                      "line": 1,
                      "column": 16
                    },
                    "end": {
                      "line": 1,
                      "column": 22
                    }
                  },
                  "range": [
                    16,
                    22
                  ]
                }
              },
              "optional": false
            }
          ],
          "defaults": [
            {
              "type": "Literal",
              "loc": {
                "source": null,
                "start": {
                  "line": 1,
                  "column": 25
                },
                "end": {
                  "line": 1,
                  "column": 26
                }
              },
              "range": [
                25,
                26
              ],
              "value": 0,
              "raw": "0"
            }
          ],
          "rest": null,
          "body": {
            "type": "BlockStatement",
            "loc": {
              "source": null,
              "start": {
                "line": 1,
                "column": 28
              },
              "end": {
                "line": 1,
                "column": 31
              }
            },
            "range": [
              28,
              31
            ],
            "body": []
          },
          "async": false,
          "generator": false,
          "expression": false,
          "returnType": null,
          "typeParameters": null
        }
      ],
      "comments": [],
      "errors": [],
    "tokens": [
        {
          "type": "Keyword",
          "value": "function",
          "start": 0,
          "end": 8,
          "loc": {
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 1,
              "column": 8
            }
          },
          "range": [
            0,
            8
          ]
        },
        {
          "type": "Identifier",
          "value": "foo",
          "start": 9,
          "end": 12,
          "loc": {
            "start": {
              "line": 1,
              "column": 9
            },
            "end": {
              "line": 1,
              "column": 12
            }
          },
          "range": [
            9,
            12
          ]
        },
        {
          "type": "Punctuator",
          "value": "(",
          "start": 12,
          "end": 13,
          "loc": {
            "start": {
              "line": 1,
              "column": 12
            },
            "end": {
              "line": 1,
              "column": 13
            }
          },
          "range": [
            12,
            13
          ]
        },
        {
          "type": "Identifier",
          "value": "a",
          "start": 13,
          "end": 14,
          "loc": {
            "start": {
              "line": 1,
              "column": 13
            },
            "end": {
              "line": 1,
              "column": 14
            }
          },
          "range": [
            13,
            14
          ]
        },
        {
          "type": "Punctuator",
          "value": ":",
          "start": 15,
          "end": 16,
          "loc": {
            "start": {
              "line": 1,
              "column": 15
            },
            "end": {
              "line": 1,
              "column": 16
            }
          },
          "range": [
            15,
            16
          ]
        },
        {
          "type": "Identifier",
          "value": "string",
          "start": 16,
          "end": 22,
          "loc": {
            "start": {
              "line": 1,
              "column": 16
            },
            "end": {
              "line": 1,
              "column": 22
            }
          },
          "range": [
            16,
            22
          ]
        },
        {
          "type": "Punctuator",
          "value": "=",
          "start": 24,
          "end": 25,
          "loc": {
            "start": {
              "line": 1,
              "column": 24
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "range": [
            24,
            25
          ]
        },
        {
          "type": "Numeric",
          "value": "0",
          "start": 26,
          "end": 27,
          "loc": {
            "start": {
              "line": 1,
              "column": 26
            },
            "end": {
              "line": 1,
              "column": 27
            }
          },
          "range": [
            26,
            27
          ]
        },
        {
          "type": "Punctuator",
          "value": ")",
          "start": 27,
          "end": 28,
          "loc": {
            "start": {
              "line": 1,
              "column": 27
            },
            "end": {
              "line": 1,
              "column": 28
            }
          },
          "range": [
            27,
            28
          ]
        },
        {
          "type": "Punctuator",
          "value": "{",
          "start": 29,
          "end": 30,
          "loc": {
            "start": {
              "line": 1,
              "column": 29
            },
            "end": {
              "line": 1,
              "column": 30
            }
          },
          "range": [
            29,
            30
          ]
        },
        {
          "type": "Punctuator",
          "value": "}",
          "start": 31,
          "end": 32,
          "loc": {
            "start": {
              "line": 1,
              "column": 31
            },
            "end": {
              "line": 1,
              "column": 32
            }
          },
          "range": [
            31,
            32
          ]
        }
      ]
});
