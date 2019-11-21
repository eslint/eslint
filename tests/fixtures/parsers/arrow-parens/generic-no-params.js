"use strict";

/*
 * Parsed on astexplorer.net using @typescript-eslint/parser-2.6.1
 *
 * Source:
 * <T extends Object>(): T => { return 1 }
 */

exports.parse = () => (
  {
    "type": "Program",
    "body": [
      {
        "type": "ExpressionStatement",
        "expression": {
          "type": "ArrowFunctionExpression",
          "generator": false,
          "id": null,
          "params": [],
          "body": {
            "type": "BlockStatement",
            "body": [
              {
                "type": "ReturnStatement",
                "argument": {
                  "type": "Literal",
                  "value": 1,
                  "raw": "1",
                  "range": [
                    36,
                    37
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 36
                    },
                    "end": {
                      "line": 1,
                      "column": 37
                    }
                  }
                },
                "range": [
                  29,
                  37
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 29
                  },
                  "end": {
                    "line": 1,
                    "column": 37
                  }
                }
              }
            ],
            "range": [
              27,
              39
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 27
              },
              "end": {
                "line": 1,
                "column": 39
              }
            }
          },
          "async": false,
          "expression": false,
          "range": [
            0,
            39
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 1,
              "column": 39
            }
          },
          "returnType": {
            "type": "TSTypeAnnotation",
            "loc": {
              "start": {
                "line": 1,
                "column": 20
              },
              "end": {
                "line": 1,
                "column": 23
              }
            },
            "range": [
              20,
              23
            ],
            "typeAnnotation": {
              "type": "TSTypeReference",
              "typeName": {
                "type": "Identifier",
                "name": "T",
                "range": [
                  22,
                  23
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 22
                  },
                  "end": {
                    "line": 1,
                    "column": 23
                  }
                }
              },
              "range": [
                22,
                23
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 22
                },
                "end": {
                  "line": 1,
                  "column": 23
                }
              }
            }
          },
          "typeParameters": {
            "type": "TSTypeParameterDeclaration",
            "range": [
              0,
              18
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 0
              },
              "end": {
                "line": 1,
                "column": 18
              }
            },
            "params": [
              {
                "type": "TSTypeParameter",
                "name": {
                  "type": "Identifier",
                  "name": "T",
                  "range": [
                    1,
                    2
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 1
                    },
                    "end": {
                      "line": 1,
                      "column": 2
                    }
                  }
                },
                "constraint": {
                  "type": "TSTypeReference",
                  "typeName": {
                    "type": "Identifier",
                    "name": "Object",
                    "range": [
                      11,
                      17
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 11
                      },
                      "end": {
                        "line": 1,
                        "column": 17
                      }
                    }
                  },
                  "range": [
                    11,
                    17
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 11
                    },
                    "end": {
                      "line": 1,
                      "column": 17
                    }
                  }
                },
                "range": [
                  1,
                  17
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 1
                  },
                  "end": {
                    "line": 1,
                    "column": 17
                  }
                }
              }
            ]
          }
        },
        "range": [
          0,
          39
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 39
          }
        }
      }
    ],
    "sourceType": "module",
    "range": [
      0,
      39
    ],
    "loc": {
      "start": {
        "line": 1,
        "column": 0
      },
      "end": {
        "line": 1,
        "column": 39
      }
    },
    "tokens": [
      {
        "type": "Punctuator",
        "value": "<",
        "range": [
          0,
          1
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 1
          }
        }
      },
      {
        "type": "Identifier",
        "value": "T",
        "range": [
          1,
          2
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 1
          },
          "end": {
            "line": 1,
            "column": 2
          }
        }
      },
      {
        "type": "Keyword",
        "value": "extends",
        "range": [
          3,
          10
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 3
          },
          "end": {
            "line": 1,
            "column": 10
          }
        }
      },
      {
        "type": "Identifier",
        "value": "Object",
        "range": [
          11,
          17
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 11
          },
          "end": {
            "line": 1,
            "column": 17
          }
        }
      },
      {
        "type": "Punctuator",
        "value": ">",
        "range": [
          17,
          18
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 17
          },
          "end": {
            "line": 1,
            "column": 18
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "(",
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
        "value": ")",
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
      },
      {
        "type": "Punctuator",
        "value": ":",
        "range": [
          20,
          21
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 20
          },
          "end": {
            "line": 1,
            "column": 21
          }
        }
      },
      {
        "type": "Identifier",
        "value": "T",
        "range": [
          22,
          23
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 22
          },
          "end": {
            "line": 1,
            "column": 23
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "=>",
        "range": [
          24,
          26
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 24
          },
          "end": {
            "line": 1,
            "column": 26
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "{",
        "range": [
          27,
          28
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 27
          },
          "end": {
            "line": 1,
            "column": 28
          }
        }
      },
      {
        "type": "Keyword",
        "value": "return",
        "range": [
          29,
          35
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 29
          },
          "end": {
            "line": 1,
            "column": 35
          }
        }
      },
      {
        "type": "Numeric",
        "value": "1",
        "range": [
          36,
          37
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 36
          },
          "end": {
            "line": 1,
            "column": 37
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "}",
        "range": [
          38,
          39
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 38
          },
          "end": {
            "line": 1,
            "column": 39
          }
        }
      }
    ],
    "comments": []
  }
)