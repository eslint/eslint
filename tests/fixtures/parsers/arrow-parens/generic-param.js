"use strict";

/*
 * Parsed on astexplorer.net using @typescript-eslint/parser-2.6.1
 *
 * Source:
 * <T extends Array>(param: T) => { return param }
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
          "params": [
            {
              "type": "Identifier",
              "name": "param",
              "range": [
                18,
                26
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 18
                },
                "end": {
                  "line": 1,
                  "column": 26
                }
              },
              "typeAnnotation": {
                "type": "TSTypeAnnotation",
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 23
                  },
                  "end": {
                    "line": 1,
                    "column": 26
                  }
                },
                "range": [
                  23,
                  26
                ],
                "typeAnnotation": {
                  "type": "TSTypeReference",
                  "typeName": {
                    "type": "Identifier",
                    "name": "T",
                    "range": [
                      25,
                      26
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 25
                      },
                      "end": {
                        "line": 1,
                        "column": 26
                      }
                    }
                  },
                  "range": [
                    25,
                    26
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 25
                    },
                    "end": {
                      "line": 1,
                      "column": 26
                    }
                  }
                }
              }
            }
          ],
          "body": {
            "type": "BlockStatement",
            "body": [
              {
                "type": "ReturnStatement",
                "argument": {
                  "type": "Identifier",
                  "name": "param",
                  "range": [
                    40,
                    45
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 40
                    },
                    "end": {
                      "line": 1,
                      "column": 45
                    }
                  }
                },
                "range": [
                  33,
                  45
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 33
                  },
                  "end": {
                    "line": 1,
                    "column": 45
                  }
                }
              }
            ],
            "range": [
              31,
              47
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 31
              },
              "end": {
                "line": 1,
                "column": 47
              }
            }
          },
          "async": false,
          "expression": false,
          "range": [
            0,
            47
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 1,
              "column": 47
            }
          },
          "typeParameters": {
            "type": "TSTypeParameterDeclaration",
            "range": [
              0,
              17
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 0
              },
              "end": {
                "line": 1,
                "column": 17
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
                    "name": "Array",
                    "range": [
                      11,
                      16
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 11
                      },
                      "end": {
                        "line": 1,
                        "column": 16
                      }
                    }
                  },
                  "range": [
                    11,
                    16
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 11
                    },
                    "end": {
                      "line": 1,
                      "column": 16
                    }
                  }
                },
                "range": [
                  1,
                  16
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 1
                  },
                  "end": {
                    "line": 1,
                    "column": 16
                  }
                }
              }
            ]
          }
        },
        "range": [
          0,
          47
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 47
          }
        }
      }
    ],
    "sourceType": "module",
    "range": [
      0,
      47
    ],
    "loc": {
      "start": {
        "line": 1,
        "column": 0
      },
      "end": {
        "line": 1,
        "column": 47
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
        "value": "Array",
        "range": [
          11,
          16
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 11
          },
          "end": {
            "line": 1,
            "column": 16
          }
        }
      },
      {
        "type": "Punctuator",
        "value": ">",
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
        "type": "Punctuator",
        "value": "(",
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
        "type": "Identifier",
        "value": "param",
        "range": [
          18,
          23
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 18
          },
          "end": {
            "line": 1,
            "column": 23
          }
        }
      },
      {
        "type": "Punctuator",
        "value": ":",
        "range": [
          23,
          24
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 23
          },
          "end": {
            "line": 1,
            "column": 24
          }
        }
      },
      {
        "type": "Identifier",
        "value": "T",
        "range": [
          25,
          26
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 25
          },
          "end": {
            "line": 1,
            "column": 26
          }
        }
      },
      {
        "type": "Punctuator",
        "value": ")",
        "range": [
          26,
          27
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 26
          },
          "end": {
            "line": 1,
            "column": 27
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "=>",
        "range": [
          28,
          30
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 28
          },
          "end": {
            "line": 1,
            "column": 30
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "{",
        "range": [
          31,
          32
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 31
          },
          "end": {
            "line": 1,
            "column": 32
          }
        }
      },
      {
        "type": "Keyword",
        "value": "return",
        "range": [
          33,
          39
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 33
          },
          "end": {
            "line": 1,
            "column": 39
          }
        }
      },
      {
        "type": "Identifier",
        "value": "param",
        "range": [
          40,
          45
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 40
          },
          "end": {
            "line": 1,
            "column": 45
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "}",
        "range": [
          46,
          47
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 46
          },
          "end": {
            "line": 1,
            "column": 47
          }
        }
      }
    ],
    "comments": []
  }
)