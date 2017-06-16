"use strict";

/**
 * Source code:
 *  namespace Unknown {
 *      function foo() {
 *          function bar() {
 *              abstract class X {
 *                  public baz() {
 *                      if (true) {
 *                          qux();
 *                      }
 *                  }
 *              }
 *          }
 *      }
 *  }
 */


exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        262
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 13,
            "column": 1
        }
    },
    "body": [
        {
            "type": "TSModuleDeclaration",
            "range": [
                0,
                262
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 13,
                    "column": 1
                }
            },
            "name": {
                "type": "Identifier",
                "range": [
                    10,
                    17
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 10
                    },
                    "end": {
                        "line": 1,
                        "column": 17
                    }
                },
                "name": "Unknown"
            },
            "body": {
                "type": "TSModuleBlock",
                "range": [
                    18,
                    262
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 18
                    },
                    "end": {
                        "line": 13,
                        "column": 1
                    }
                },
                "body": [
                    {
                        "type": "TSNamespaceFunctionDeclaration",
                        "range": [
                            24,
                            260
                        ],
                        "loc": {
                            "start": {
                                "line": 2,
                                "column": 4
                            },
                            "end": {
                                "line": 12,
                                "column": 5
                            }
                        },
                        "id": {
                            "type": "Identifier",
                            "range": [
                                33,
                                36
                            ],
                            "loc": {
                                "start": {
                                    "line": 2,
                                    "column": 13
                                },
                                "end": {
                                    "line": 2,
                                    "column": 16
                                }
                            },
                            "name": "foo"
                        },
                        "generator": false,
                        "expression": false,
                        "async": false,
                        "params": [],
                        "body": {
                            "type": "BlockStatement",
                            "range": [
                                39,
                                260
                            ],
                            "loc": {
                                "start": {
                                    "line": 2,
                                    "column": 19
                                },
                                "end": {
                                    "line": 12,
                                    "column": 5
                                }
                            },
                            "body": [
                                {
                                    "type": "FunctionDeclaration",
                                    "range": [
                                        49,
                                        254
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 3,
                                            "column": 8
                                        },
                                        "end": {
                                            "line": 11,
                                            "column": 9
                                        }
                                    },
                                    "id": {
                                        "type": "Identifier",
                                        "range": [
                                            58,
                                            61
                                        ],
                                        "loc": {
                                            "start": {
                                                "line": 3,
                                                "column": 17
                                            },
                                            "end": {
                                                "line": 3,
                                                "column": 20
                                            }
                                        },
                                        "name": "bar"
                                    },
                                    "generator": false,
                                    "expression": false,
                                    "async": false,
                                    "params": [],
                                    "body": {
                                        "type": "BlockStatement",
                                        "range": [
                                            64,
                                            254
                                        ],
                                        "loc": {
                                            "start": {
                                                "line": 3,
                                                "column": 23
                                            },
                                            "end": {
                                                "line": 11,
                                                "column": 9
                                            }
                                        },
                                        "body": [
                                            {
                                                "type": "TSAbstractClassDeclaration",
                                                "range": [
                                                    78,
                                                    244
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 4,
                                                        "column": 12
                                                    },
                                                    "end": {
                                                        "line": 10,
                                                        "column": 13
                                                    }
                                                },
                                                "id": {
                                                    "type": "Identifier",
                                                    "range": [
                                                        93,
                                                        94
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 4,
                                                            "column": 27
                                                        },
                                                        "end": {
                                                            "line": 4,
                                                            "column": 28
                                                        }
                                                    },
                                                    "name": "X"
                                                },
                                                "body": {
                                                    "type": "ClassBody",
                                                    "body": [
                                                        {
                                                            "type": "MethodDefinition",
                                                            "range": [
                                                                113,
                                                                230
                                                            ],
                                                            "loc": {
                                                                "start": {
                                                                    "line": 5,
                                                                    "column": 16
                                                                },
                                                                "end": {
                                                                    "line": 9,
                                                                    "column": 17
                                                                }
                                                            },
                                                            "key": {
                                                                "type": "Identifier",
                                                                "range": [
                                                                    120,
                                                                    123
                                                                ],
                                                                "loc": {
                                                                    "start": {
                                                                        "line": 5,
                                                                        "column": 23
                                                                    },
                                                                    "end": {
                                                                        "line": 5,
                                                                        "column": 26
                                                                    }
                                                                },
                                                                "name": "baz"
                                                            },
                                                            "value": {
                                                                "type": "FunctionExpression",
                                                                "id": null,
                                                                "generator": false,
                                                                "expression": false,
                                                                "async": false,
                                                                "body": {
                                                                    "type": "BlockStatement",
                                                                    "range": [
                                                                        126,
                                                                        230
                                                                    ],
                                                                    "loc": {
                                                                        "start": {
                                                                            "line": 5,
                                                                            "column": 29
                                                                        },
                                                                        "end": {
                                                                            "line": 9,
                                                                            "column": 17
                                                                        }
                                                                    },
                                                                    "body": [
                                                                        {
                                                                            "type": "IfStatement",
                                                                            "range": [
                                                                                148,
                                                                                212
                                                                            ],
                                                                            "loc": {
                                                                                "start": {
                                                                                    "line": 6,
                                                                                    "column": 20
                                                                                },
                                                                                "end": {
                                                                                    "line": 8,
                                                                                    "column": 21
                                                                                }
                                                                            },
                                                                            "test": {
                                                                                "type": "Literal",
                                                                                "range": [
                                                                                    152,
                                                                                    156
                                                                                ],
                                                                                "loc": {
                                                                                    "start": {
                                                                                        "line": 6,
                                                                                        "column": 24
                                                                                    },
                                                                                    "end": {
                                                                                        "line": 6,
                                                                                        "column": 28
                                                                                    }
                                                                                },
                                                                                "value": true,
                                                                                "raw": "true"
                                                                            },
                                                                            "consequent": {
                                                                                "type": "BlockStatement",
                                                                                "range": [
                                                                                    158,
                                                                                    212
                                                                                ],
                                                                                "loc": {
                                                                                    "start": {
                                                                                        "line": 6,
                                                                                        "column": 30
                                                                                    },
                                                                                    "end": {
                                                                                        "line": 8,
                                                                                        "column": 21
                                                                                    }
                                                                                },
                                                                                "body": [
                                                                                    {
                                                                                        "type": "ExpressionStatement",
                                                                                        "range": [
                                                                                            184,
                                                                                            190
                                                                                        ],
                                                                                        "loc": {
                                                                                            "start": {
                                                                                                "line": 7,
                                                                                                "column": 24
                                                                                            },
                                                                                            "end": {
                                                                                                "line": 7,
                                                                                                "column": 30
                                                                                            }
                                                                                        },
                                                                                        "expression": {
                                                                                            "type": "CallExpression",
                                                                                            "range": [
                                                                                                184,
                                                                                                189
                                                                                            ],
                                                                                            "loc": {
                                                                                                "start": {
                                                                                                    "line": 7,
                                                                                                    "column": 24
                                                                                                },
                                                                                                "end": {
                                                                                                    "line": 7,
                                                                                                    "column": 29
                                                                                                }
                                                                                            },
                                                                                            "callee": {
                                                                                                "type": "Identifier",
                                                                                                "range": [
                                                                                                    184,
                                                                                                    187
                                                                                                ],
                                                                                                "loc": {
                                                                                                    "start": {
                                                                                                        "line": 7,
                                                                                                        "column": 24
                                                                                                    },
                                                                                                    "end": {
                                                                                                        "line": 7,
                                                                                                        "column": 27
                                                                                                    }
                                                                                                },
                                                                                                "name": "qux"
                                                                                            },
                                                                                            "arguments": []
                                                                                        }
                                                                                    }
                                                                                ]
                                                                            },
                                                                            "alternate": null
                                                                        }
                                                                    ]
                                                                },
                                                                "range": [
                                                                    123,
                                                                    230
                                                                ],
                                                                "loc": {
                                                                    "start": {
                                                                        "line": 5,
                                                                        "column": 26
                                                                    },
                                                                    "end": {
                                                                        "line": 9,
                                                                        "column": 17
                                                                    }
                                                                },
                                                                "params": []
                                                            },
                                                            "computed": false,
                                                            "static": false,
                                                            "kind": "method",
                                                            "accessibility": "public",
                                                            "decorators": []
                                                        }
                                                    ],
                                                    "range": [
                                                        95,
                                                        244
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 4,
                                                            "column": 29
                                                        },
                                                        "end": {
                                                            "line": 10,
                                                            "column": 13
                                                        }
                                                    }
                                                },
                                                "superClass": null,
                                                "implements": [],
                                                "decorators": []
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ],
    "sourceType": "script",
    "tokens": [
        {
            "type": "Identifier",
            "value": "namespace",
            "start": 0,
            "end": 9,
            "range": [
                0,
                9
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 9
                }
            }
        },
        {
            "type": "Identifier",
            "value": "Unknown",
            "start": 10,
            "end": 17,
            "range": [
                10,
                17
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 10
                },
                "end": {
                    "line": 1,
                    "column": 17
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 18,
            "end": 19,
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
            "type": "Keyword",
            "value": "function",
            "start": 24,
            "end": 32,
            "range": [
                24,
                32
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 4
                },
                "end": {
                    "line": 2,
                    "column": 12
                }
            }
        },
        {
            "type": "Identifier",
            "value": "foo",
            "start": 33,
            "end": 36,
            "range": [
                33,
                36
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 13
                },
                "end": {
                    "line": 2,
                    "column": 16
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 36,
            "end": 37,
            "range": [
                36,
                37
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 16
                },
                "end": {
                    "line": 2,
                    "column": 17
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 37,
            "end": 38,
            "range": [
                37,
                38
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 17
                },
                "end": {
                    "line": 2,
                    "column": 18
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 39,
            "end": 40,
            "range": [
                39,
                40
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 19
                },
                "end": {
                    "line": 2,
                    "column": 20
                }
            }
        },
        {
            "type": "Keyword",
            "value": "function",
            "start": 49,
            "end": 57,
            "range": [
                49,
                57
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 8
                },
                "end": {
                    "line": 3,
                    "column": 16
                }
            }
        },
        {
            "type": "Identifier",
            "value": "bar",
            "start": 58,
            "end": 61,
            "range": [
                58,
                61
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 17
                },
                "end": {
                    "line": 3,
                    "column": 20
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 61,
            "end": 62,
            "range": [
                61,
                62
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 20
                },
                "end": {
                    "line": 3,
                    "column": 21
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 62,
            "end": 63,
            "range": [
                62,
                63
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 21
                },
                "end": {
                    "line": 3,
                    "column": 22
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 64,
            "end": 65,
            "range": [
                64,
                65
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 23
                },
                "end": {
                    "line": 3,
                    "column": 24
                }
            }
        },
        {
            "type": "Identifier",
            "value": "abstract",
            "start": 78,
            "end": 86,
            "range": [
                78,
                86
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 12
                },
                "end": {
                    "line": 4,
                    "column": 20
                }
            }
        },
        {
            "type": "Keyword",
            "value": "class",
            "start": 87,
            "end": 92,
            "range": [
                87,
                92
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 21
                },
                "end": {
                    "line": 4,
                    "column": 26
                }
            }
        },
        {
            "type": "Identifier",
            "value": "X",
            "start": 93,
            "end": 94,
            "range": [
                93,
                94
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 27
                },
                "end": {
                    "line": 4,
                    "column": 28
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 95,
            "end": 96,
            "range": [
                95,
                96
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 29
                },
                "end": {
                    "line": 4,
                    "column": 30
                }
            }
        },
        {
            "type": "Keyword",
            "value": "public",
            "start": 113,
            "end": 119,
            "range": [
                113,
                119
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 16
                },
                "end": {
                    "line": 5,
                    "column": 22
                }
            }
        },
        {
            "type": "Identifier",
            "value": "baz",
            "start": 120,
            "end": 123,
            "range": [
                120,
                123
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 23
                },
                "end": {
                    "line": 5,
                    "column": 26
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 123,
            "end": 124,
            "range": [
                123,
                124
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 26
                },
                "end": {
                    "line": 5,
                    "column": 27
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 124,
            "end": 125,
            "range": [
                124,
                125
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 27
                },
                "end": {
                    "line": 5,
                    "column": 28
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 126,
            "end": 127,
            "range": [
                126,
                127
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 29
                },
                "end": {
                    "line": 5,
                    "column": 30
                }
            }
        },
        {
            "type": "Keyword",
            "value": "if",
            "start": 148,
            "end": 150,
            "range": [
                148,
                150
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 20
                },
                "end": {
                    "line": 6,
                    "column": 22
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 151,
            "end": 152,
            "range": [
                151,
                152
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 23
                },
                "end": {
                    "line": 6,
                    "column": 24
                }
            }
        },
        {
            "type": "Boolean",
            "value": "true",
            "start": 152,
            "end": 156,
            "range": [
                152,
                156
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 24
                },
                "end": {
                    "line": 6,
                    "column": 28
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 156,
            "end": 157,
            "range": [
                156,
                157
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 28
                },
                "end": {
                    "line": 6,
                    "column": 29
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 158,
            "end": 159,
            "range": [
                158,
                159
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 30
                },
                "end": {
                    "line": 6,
                    "column": 31
                }
            }
        },
        {
            "type": "Identifier",
            "value": "qux",
            "start": 184,
            "end": 187,
            "range": [
                184,
                187
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 24
                },
                "end": {
                    "line": 7,
                    "column": 27
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 187,
            "end": 188,
            "range": [
                187,
                188
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 27
                },
                "end": {
                    "line": 7,
                    "column": 28
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 188,
            "end": 189,
            "range": [
                188,
                189
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 28
                },
                "end": {
                    "line": 7,
                    "column": 29
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 189,
            "end": 190,
            "range": [
                189,
                190
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 29
                },
                "end": {
                    "line": 7,
                    "column": 30
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 211,
            "end": 212,
            "range": [
                211,
                212
            ],
            "loc": {
                "start": {
                    "line": 8,
                    "column": 20
                },
                "end": {
                    "line": 8,
                    "column": 21
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 229,
            "end": 230,
            "range": [
                229,
                230
            ],
            "loc": {
                "start": {
                    "line": 9,
                    "column": 16
                },
                "end": {
                    "line": 9,
                    "column": 17
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 243,
            "end": 244,
            "range": [
                243,
                244
            ],
            "loc": {
                "start": {
                    "line": 10,
                    "column": 12
                },
                "end": {
                    "line": 10,
                    "column": 13
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 253,
            "end": 254,
            "range": [
                253,
                254
            ],
            "loc": {
                "start": {
                    "line": 11,
                    "column": 8
                },
                "end": {
                    "line": 11,
                    "column": 9
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 259,
            "end": 260,
            "range": [
                259,
                260
            ],
            "loc": {
                "start": {
                    "line": 12,
                    "column": 4
                },
                "end": {
                    "line": 12,
                    "column": 5
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 261,
            "end": 262,
            "range": [
                261,
                262
            ],
            "loc": {
                "start": {
                    "line": 13,
                    "column": 0
                },
                "end": {
                    "line": 13,
                    "column": 1
                }
            }
        }
    ],
    "comments": []
});

