"use strict";

/*
 * Parsed on astexplorer.net using @typescript-eslint/parser@4.1.0
 *
 * Source:
 * declare class A { constructor(options: any); }
 */

exports.parse = () => ({
  "type": "Program",
  "body": [
    {
      "type": "ClassDeclaration",
      "id": {
        "type": "Identifier",
        "name": "A",
        "range": [
          14,
          15
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 14
          },
          "end": {
            "line": 1,
            "column": 15
          }
        }
      },
      "body": {
        "type": "ClassBody",
        "body": [
          {
            "type": "MethodDefinition",
            "key": {
              "type": "Identifier",
              "name": "constructor",
              "range": [
                18,
                29
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 18
                },
                "end": {
                  "line": 1,
                  "column": 29
                }
              }
            },
            "value": {
              "type": "TSEmptyBodyFunctionExpression",
              "id": null,
              "params": [
                {
                  "type": "Identifier",
                  "name": "options",
                  "range": [
                    30,
                    42
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 30
                    },
                    "end": {
                      "line": 1,
                      "column": 42
                    }
                  },
                  "typeAnnotation": {
                    "type": "TSTypeAnnotation",
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 37
                      },
                      "end": {
                        "line": 1,
                        "column": 42
                      }
                    },
                    "range": [
                      37,
                      42
                    ],
                    "typeAnnotation": {
                      "type": "TSAnyKeyword",
                      "range": [
                        39,
                        42
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 39
                        },
                        "end": {
                          "line": 1,
                          "column": 42
                        }
                      }
                    }
                  }
                }
              ],
              "generator": false,
              "expression": false,
              "async": false,
              "body": null,
              "range": [
                29,
                44
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 29
                },
                "end": {
                  "line": 1,
                  "column": 44
                }
              }
            },
            "computed": false,
            "static": false,
            "kind": "constructor",
            "range": [
              18,
              44
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 18
              },
              "end": {
                "line": 1,
                "column": 44
              }
            }
          }
        ],
        "range": [
          16,
          46
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 16
          },
          "end": {
            "line": 1,
            "column": 46
          }
        }
      },
      "superClass": null,
      "range": [
        0,
        46
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 1,
          "column": 46
        }
      },
      "declare": true
    }
  ],
  "sourceType": "module",
  "range": [
    0,
    46
  ],
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 1,
      "column": 46
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
      "value": "class",
      "range": [
        8,
        13
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 8
        },
        "end": {
          "line": 1,
          "column": 13
        }
      }
    },
    {
      "type": "Identifier",
      "value": "A",
      "range": [
        14,
        15
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 14
        },
        "end": {
          "line": 1,
          "column": 15
        }
      }
    },
    {
      "type": "Punctuator",
      "value": "{",
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
      "type": "Identifier",
      "value": "constructor",
      "range": [
        18,
        29
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 18
        },
        "end": {
          "line": 1,
          "column": 29
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
          "line": 1,
          "column": 29
        },
        "end": {
          "line": 1,
          "column": 30
        }
      }
    },
    {
      "type": "Identifier",
      "value": "options",
      "range": [
        30,
        37
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 30
        },
        "end": {
          "line": 1,
          "column": 37
        }
      }
    },
    {
      "type": "Punctuator",
      "value": ":",
      "range": [
        37,
        38
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 37
        },
        "end": {
          "line": 1,
          "column": 38
        }
      }
    },
    {
      "type": "Identifier",
      "value": "any",
      "range": [
        39,
        42
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 39
        },
        "end": {
          "line": 1,
          "column": 42
        }
      }
    },
    {
      "type": "Punctuator",
      "value": ")",
      "range": [
        42,
        43
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 42
        },
        "end": {
          "line": 1,
          "column": 43
        }
      }
    },
    {
      "type": "Punctuator",
      "value": ";",
      "range": [
        43,
        44
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 43
        },
        "end": {
          "line": 1,
          "column": 44
        }
      }
    },
    {
      "type": "Punctuator",
      "value": "}",
      "range": [
        45,
        46
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 45
        },
        "end": {
          "line": 1,
          "column": 46
        }
      }
    }
  ],
  "comments": []
});