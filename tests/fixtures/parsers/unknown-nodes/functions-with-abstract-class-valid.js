"use strict";

/**
 * Source code:
 *  function foo() {
 *      function bar() {
 *          abstract class X {
 *              public baz() {
 *                  if (true) {
 *                      qux();
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
        196
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 11,
            "column": 1
        }
    },
    "body": [
        {
            "type": "FunctionDeclaration",
            "range": [
                0,
                196
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 11,
                    "column": 1
                }
            },
            "id": {
                "type": "Identifier",
                "range": [
                    9,
                    12
                ],
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
                "name": "foo"
            },
            "generator": false,
            "expression": false,
            "async": false,
            "params": [],
            "body": {
                "type": "BlockStatement",
                "range": [
                    15,
                    196
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 15
                    },
                    "end": {
                        "line": 11,
                        "column": 1
                    }
                },
                "body": [
                    {
                        "type": "FunctionDeclaration",
                        "range": [
                            21,
                            194
                        ],
                        "loc": {
                            "start": {
                                "line": 2,
                                "column": 4
                            },
                            "end": {
                                "line": 10,
                                "column": 5
                            }
                        },
                        "id": {
                            "type": "Identifier",
                            "range": [
                                30,
                                33
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
                            "name": "bar"
                        },
                        "generator": false,
                        "expression": false,
                        "async": false,
                        "params": [],
                        "body": {
                            "type": "BlockStatement",
                            "range": [
                                36,
                                194
                            ],
                            "loc": {
                                "start": {
                                    "line": 2,
                                    "column": 19
                                },
                                "end": {
                                    "line": 10,
                                    "column": 5
                                }
                            },
                            "body": [
                                {
                                    "type": "TSAbstractClassDeclaration",
                                    "range": [
                                        46,
                                        188
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 3,
                                            "column": 8
                                        },
                                        "end": {
                                            "line": 9,
                                            "column": 9
                                        }
                                    },
                                    "id": {
                                        "type": "Identifier",
                                        "range": [
                                            61,
                                            62
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
                                        },
                                        "name": "X"
                                    },
                                    "body": {
                                        "type": "ClassBody",
                                        "body": [
                                            {
                                                "type": "MethodDefinition",
                                                "range": [
                                                    77,
                                                    178
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 4,
                                                        "column": 12
                                                    },
                                                    "end": {
                                                        "line": 8,
                                                        "column": 13
                                                    }
                                                },
                                                "key": {
                                                    "type": "Identifier",
                                                    "range": [
                                                        84,
                                                        87
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 4,
                                                            "column": 19
                                                        },
                                                        "end": {
                                                            "line": 4,
                                                            "column": 22
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
                                                            90,
                                                            178
                                                        ],
                                                        "loc": {
                                                            "start": {
                                                                "line": 4,
                                                                "column": 25
                                                            },
                                                            "end": {
                                                                "line": 8,
                                                                "column": 13
                                                            }
                                                        },
                                                        "body": [
                                                            {
                                                                "type": "IfStatement",
                                                                "range": [
                                                                    108,
                                                                    164
                                                                ],
                                                                "loc": {
                                                                    "start": {
                                                                        "line": 5,
                                                                        "column": 16
                                                                    },
                                                                    "end": {
                                                                        "line": 7,
                                                                        "column": 17
                                                                    }
                                                                },
                                                                "test": {
                                                                    "type": "Literal",
                                                                    "range": [
                                                                        112,
                                                                        116
                                                                    ],
                                                                    "loc": {
                                                                        "start": {
                                                                            "line": 5,
                                                                            "column": 20
                                                                        },
                                                                        "end": {
                                                                            "line": 5,
                                                                            "column": 24
                                                                        }
                                                                    },
                                                                    "value": true,
                                                                    "raw": "true"
                                                                },
                                                                "consequent": {
                                                                    "type": "BlockStatement",
                                                                    "range": [
                                                                        118,
                                                                        164
                                                                    ],
                                                                    "loc": {
                                                                        "start": {
                                                                            "line": 5,
                                                                            "column": 26
                                                                        },
                                                                        "end": {
                                                                            "line": 7,
                                                                            "column": 17
                                                                        }
                                                                    },
                                                                    "body": [
                                                                        {
                                                                            "type": "ExpressionStatement",
                                                                            "range": [
                                                                                140,
                                                                                146
                                                                            ],
                                                                            "loc": {
                                                                                "start": {
                                                                                    "line": 6,
                                                                                    "column": 20
                                                                                },
                                                                                "end": {
                                                                                    "line": 6,
                                                                                    "column": 26
                                                                                }
                                                                            },
                                                                            "expression": {
                                                                                "type": "CallExpression",
                                                                                "range": [
                                                                                    140,
                                                                                    145
                                                                                ],
                                                                                "loc": {
                                                                                    "start": {
                                                                                        "line": 6,
                                                                                        "column": 20
                                                                                    },
                                                                                    "end": {
                                                                                        "line": 6,
                                                                                        "column": 25
                                                                                    }
                                                                                },
                                                                                "callee": {
                                                                                    "type": "Identifier",
                                                                                    "range": [
                                                                                        140,
                                                                                        143
                                                                                    ],
                                                                                    "loc": {
                                                                                        "start": {
                                                                                            "line": 6,
                                                                                            "column": 20
                                                                                        },
                                                                                        "end": {
                                                                                            "line": 6,
                                                                                            "column": 23
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
                                                        87,
                                                        178
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 4,
                                                            "column": 22
                                                        },
                                                        "end": {
                                                            "line": 8,
                                                            "column": 13
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
                                            63,
                                            188
                                        ],
                                        "loc": {
                                            "start": {
                                                "line": 3,
                                                "column": 25
                                            },
                                            "end": {
                                                "line": 9,
                                                "column": 9
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
    ],
    "sourceType": "script",
    "tokens": [
        {
            "type": "Keyword",
            "value": "function",
            "start": 0,
            "end": 8,
            "range": [
                0,
                8
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 8
                }
            }
        },
        {
            "type": "Identifier",
            "value": "foo",
            "start": 9,
            "end": 12,
            "range": [
                9,
                12
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 9
                },
                "end": {
                    "line": 1,
                    "column": 12
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 12,
            "end": 13,
            "range": [
                12,
                13
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 12
                },
                "end": {
                    "line": 1,
                    "column": 13
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 13,
            "end": 14,
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
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 15,
            "end": 16,
            "range": [
                15,
                16
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 15
                },
                "end": {
                    "line": 1,
                    "column": 16
                }
            }
        },
        {
            "type": "Keyword",
            "value": "function",
            "start": 21,
            "end": 29,
            "range": [
                21,
                29
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
            "value": "bar",
            "start": 30,
            "end": 33,
            "range": [
                30,
                33
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
            "start": 33,
            "end": 34,
            "range": [
                33,
                34
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
            "start": 34,
            "end": 35,
            "range": [
                34,
                35
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
            "start": 36,
            "end": 37,
            "range": [
                36,
                37
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
            "type": "Identifier",
            "value": "abstract",
            "start": 46,
            "end": 54,
            "range": [
                46,
                54
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
            "type": "Keyword",
            "value": "class",
            "start": 55,
            "end": 60,
            "range": [
                55,
                60
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 17
                },
                "end": {
                    "line": 3,
                    "column": 22
                }
            }
        },
        {
            "type": "Identifier",
            "value": "X",
            "start": 61,
            "end": 62,
            "range": [
                61,
                62
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
            "type": "Punctuator",
            "value": "{",
            "start": 63,
            "end": 64,
            "range": [
                63,
                64
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 25
                },
                "end": {
                    "line": 3,
                    "column": 26
                }
            }
        },
        {
            "type": "Keyword",
            "value": "public",
            "start": 77,
            "end": 83,
            "range": [
                77,
                83
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 12
                },
                "end": {
                    "line": 4,
                    "column": 18
                }
            }
        },
        {
            "type": "Identifier",
            "value": "baz",
            "start": 84,
            "end": 87,
            "range": [
                84,
                87
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 19
                },
                "end": {
                    "line": 4,
                    "column": 22
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 87,
            "end": 88,
            "range": [
                87,
                88
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 22
                },
                "end": {
                    "line": 4,
                    "column": 23
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 88,
            "end": 89,
            "range": [
                88,
                89
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 23
                },
                "end": {
                    "line": 4,
                    "column": 24
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 90,
            "end": 91,
            "range": [
                90,
                91
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 25
                },
                "end": {
                    "line": 4,
                    "column": 26
                }
            }
        },
        {
            "type": "Keyword",
            "value": "if",
            "start": 108,
            "end": 110,
            "range": [
                108,
                110
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 16
                },
                "end": {
                    "line": 5,
                    "column": 18
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 111,
            "end": 112,
            "range": [
                111,
                112
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 19
                },
                "end": {
                    "line": 5,
                    "column": 20
                }
            }
        },
        {
            "type": "Boolean",
            "value": "true",
            "start": 112,
            "end": 116,
            "range": [
                112,
                116
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 20
                },
                "end": {
                    "line": 5,
                    "column": 24
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 116,
            "end": 117,
            "range": [
                116,
                117
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 24
                },
                "end": {
                    "line": 5,
                    "column": 25
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 118,
            "end": 119,
            "range": [
                118,
                119
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
            "type": "Identifier",
            "value": "qux",
            "start": 140,
            "end": 143,
            "range": [
                140,
                143
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 20
                },
                "end": {
                    "line": 6,
                    "column": 23
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 143,
            "end": 144,
            "range": [
                143,
                144
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
            "type": "Punctuator",
            "value": ")",
            "start": 144,
            "end": 145,
            "range": [
                144,
                145
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 24
                },
                "end": {
                    "line": 6,
                    "column": 25
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 145,
            "end": 146,
            "range": [
                145,
                146
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 25
                },
                "end": {
                    "line": 6,
                    "column": 26
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 163,
            "end": 164,
            "range": [
                163,
                164
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 16
                },
                "end": {
                    "line": 7,
                    "column": 17
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 177,
            "end": 178,
            "range": [
                177,
                178
            ],
            "loc": {
                "start": {
                    "line": 8,
                    "column": 12
                },
                "end": {
                    "line": 8,
                    "column": 13
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 187,
            "end": 188,
            "range": [
                187,
                188
            ],
            "loc": {
                "start": {
                    "line": 9,
                    "column": 8
                },
                "end": {
                    "line": 9,
                    "column": 9
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 193,
            "end": 194,
            "range": [
                193,
                194
            ],
            "loc": {
                "start": {
                    "line": 10,
                    "column": 4
                },
                "end": {
                    "line": 10,
                    "column": 5
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 195,
            "end": 196,
            "range": [
                195,
                196
            ],
            "loc": {
                "start": {
                    "line": 11,
                    "column": 0
                },
                "end": {
                    "line": 11,
                    "column": 1
                }
            }
        }
    ],
    "comments": []
});
