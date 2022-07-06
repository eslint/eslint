"use strict";

/**
 * Source code:
 *  abstract class Foo {
 *      public bar() {
 *          let aaa = 4,
 *          boo;
 *
 *          if (true) {
 *          boo = 3;
 *          }
 *
 *      boo = 3 + 2;
 *      }
 *  }
 */


exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        147
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 12,
            "column": 1
        }
    },
    "body": [
        {
            "type": "TSAbstractClassDeclaration",
            "range": [
                0,
                147
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 12,
                    "column": 1
                }
            },
            "id": {
                "type": "Identifier",
                "range": [
                    15,
                    18
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 15
                    },
                    "end": {
                        "line": 1,
                        "column": 18
                    }
                },
                "name": "Foo"
            },
            "body": {
                "type": "ClassBody",
                "body": [
                    {
                        "type": "MethodDefinition",
                        "range": [
                            25,
                            145
                        ],
                        "loc": {
                            "start": {
                                "line": 2,
                                "column": 4
                            },
                            "end": {
                                "line": 11,
                                "column": 5
                            }
                        },
                        "key": {
                            "type": "Identifier",
                            "range": [
                                32,
                                35
                            ],
                            "loc": {
                                "start": {
                                    "line": 2,
                                    "column": 11
                                },
                                "end": {
                                    "line": 2,
                                    "column": 14
                                }
                            },
                            "name": "bar"
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
                                    38,
                                    145
                                ],
                                "loc": {
                                    "start": {
                                        "line": 2,
                                        "column": 17
                                    },
                                    "end": {
                                        "line": 11,
                                        "column": 5
                                    }
                                },
                                "body": [
                                    {
                                        "type": "VariableDeclaration",
                                        "range": [
                                            48,
                                            73
                                        ],
                                        "loc": {
                                            "start": {
                                                "line": 3,
                                                "column": 8
                                            },
                                            "end": {
                                                "line": 4,
                                                "column": 12
                                            }
                                        },
                                        "declarations": [
                                            {
                                                "type": "VariableDeclarator",
                                                "range": [
                                                    52,
                                                    59
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 3,
                                                        "column": 12
                                                    },
                                                    "end": {
                                                        "line": 3,
                                                        "column": 19
                                                    }
                                                },
                                                "id": {
                                                    "type": "Identifier",
                                                    "range": [
                                                        52,
                                                        55
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 3,
                                                            "column": 12
                                                        },
                                                        "end": {
                                                            "line": 3,
                                                            "column": 15
                                                        }
                                                    },
                                                    "name": "aaa"
                                                },
                                                "init": {
                                                    "type": "Literal",
                                                    "range": [
                                                        58,
                                                        59
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 3,
                                                            "column": 18
                                                        },
                                                        "end": {
                                                            "line": 3,
                                                            "column": 19
                                                        }
                                                    },
                                                    "value": 4,
                                                    "raw": "4"
                                                }
                                            },
                                            {
                                                "type": "VariableDeclarator",
                                                "range": [
                                                    69,
                                                    72
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 4,
                                                        "column": 8
                                                    },
                                                    "end": {
                                                        "line": 4,
                                                        "column": 11
                                                    }
                                                },
                                                "id": {
                                                    "type": "Identifier",
                                                    "range": [
                                                        69,
                                                        72
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 4,
                                                            "column": 8
                                                        },
                                                        "end": {
                                                            "line": 4,
                                                            "column": 11
                                                        }
                                                    },
                                                    "name": "boo"
                                                },
                                                "init": null
                                            }
                                        ],
                                        "kind": "let"
                                    },
                                    {
                                        "type": "IfStatement",
                                        "range": [
                                            83,
                                            121
                                        ],
                                        "loc": {
                                            "start": {
                                                "line": 6,
                                                "column": 8
                                            },
                                            "end": {
                                                "line": 8,
                                                "column": 9
                                            }
                                        },
                                        "test": {
                                            "type": "Literal",
                                            "range": [
                                                87,
                                                91
                                            ],
                                            "loc": {
                                                "start": {
                                                    "line": 6,
                                                    "column": 12
                                                },
                                                "end": {
                                                    "line": 6,
                                                    "column": 16
                                                }
                                            },
                                            "value": true,
                                            "raw": "true"
                                        },
                                        "consequent": {
                                            "type": "BlockStatement",
                                            "range": [
                                                93,
                                                121
                                            ],
                                            "loc": {
                                                "start": {
                                                    "line": 6,
                                                    "column": 18
                                                },
                                                "end": {
                                                    "line": 8,
                                                    "column": 9
                                                }
                                            },
                                            "body": [
                                                {
                                                    "type": "ExpressionStatement",
                                                    "range": [
                                                        103,
                                                        111
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 7,
                                                            "column": 8
                                                        },
                                                        "end": {
                                                            "line": 7,
                                                            "column": 16
                                                        }
                                                    },
                                                    "expression": {
                                                        "type": "AssignmentExpression",
                                                        "range": [
                                                            103,
                                                            110
                                                        ],
                                                        "loc": {
                                                            "start": {
                                                                "line": 7,
                                                                "column": 8
                                                            },
                                                            "end": {
                                                                "line": 7,
                                                                "column": 15
                                                            }
                                                        },
                                                        "operator": "=",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "range": [
                                                                103,
                                                                106
                                                            ],
                                                            "loc": {
                                                                "start": {
                                                                    "line": 7,
                                                                    "column": 8
                                                                },
                                                                "end": {
                                                                    "line": 7,
                                                                    "column": 11
                                                                }
                                                            },
                                                            "name": "boo"
                                                        },
                                                        "right": {
                                                            "type": "Literal",
                                                            "range": [
                                                                109,
                                                                110
                                                            ],
                                                            "loc": {
                                                                "start": {
                                                                    "line": 7,
                                                                    "column": 14
                                                                },
                                                                "end": {
                                                                    "line": 7,
                                                                    "column": 15
                                                                }
                                                            },
                                                            "value": 3,
                                                            "raw": "3"
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        "alternate": null
                                    },
                                    {
                                        "type": "ExpressionStatement",
                                        "range": [
                                            127,
                                            139
                                        ],
                                        "loc": {
                                            "start": {
                                                "line": 10,
                                                "column": 4
                                            },
                                            "end": {
                                                "line": 10,
                                                "column": 16
                                            }
                                        },
                                        "expression": {
                                            "type": "AssignmentExpression",
                                            "range": [
                                                127,
                                                138
                                            ],
                                            "loc": {
                                                "start": {
                                                    "line": 10,
                                                    "column": 4
                                                },
                                                "end": {
                                                    "line": 10,
                                                    "column": 15
                                                }
                                            },
                                            "operator": "=",
                                            "left": {
                                                "type": "Identifier",
                                                "range": [
                                                    127,
                                                    130
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 10,
                                                        "column": 4
                                                    },
                                                    "end": {
                                                        "line": 10,
                                                        "column": 7
                                                    }
                                                },
                                                "name": "boo"
                                            },
                                            "right": {
                                                "type": "BinaryExpression",
                                                "range": [
                                                    133,
                                                    138
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 10,
                                                        "column": 10
                                                    },
                                                    "end": {
                                                        "line": 10,
                                                        "column": 15
                                                    }
                                                },
                                                "operator": "+",
                                                "left": {
                                                    "type": "Literal",
                                                    "range": [
                                                        133,
                                                        134
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 10,
                                                            "column": 10
                                                        },
                                                        "end": {
                                                            "line": 10,
                                                            "column": 11
                                                        }
                                                    },
                                                    "value": 3,
                                                    "raw": "3"
                                                },
                                                "right": {
                                                    "type": "Literal",
                                                    "range": [
                                                        137,
                                                        138
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 10,
                                                            "column": 14
                                                        },
                                                        "end": {
                                                            "line": 10,
                                                            "column": 15
                                                        }
                                                    },
                                                    "value": 2,
                                                    "raw": "2"
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            "range": [
                                35,
                                145
                            ],
                            "loc": {
                                "start": {
                                    "line": 2,
                                    "column": 14
                                },
                                "end": {
                                    "line": 11,
                                    "column": 5
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
                    19,
                    147
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 19
                    },
                    "end": {
                        "line": 12,
                        "column": 1
                    }
                }
            },
            "superClass": null,
            "implements": [],
            "decorators": []
        }
    ],
    "sourceType": "script",
    "tokens": [
        {
            "type": "Identifier",
            "value": "abstract",
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
            "type": "Keyword",
            "value": "class",
            "start": 9,
            "end": 14,
            "range": [
                9,
                14
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 9
                },
                "end": {
                    "line": 1,
                    "column": 14
                }
            }
        },
        {
            "type": "Identifier",
            "value": "Foo",
            "start": 15,
            "end": 18,
            "range": [
                15,
                18
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 15
                },
                "end": {
                    "line": 1,
                    "column": 18
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 19,
            "end": 20,
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
            "type": "Keyword",
            "value": "public",
            "start": 25,
            "end": 31,
            "range": [
                25,
                31
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 4
                },
                "end": {
                    "line": 2,
                    "column": 10
                }
            }
        },
        {
            "type": "Identifier",
            "value": "bar",
            "start": 32,
            "end": 35,
            "range": [
                32,
                35
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 11
                },
                "end": {
                    "line": 2,
                    "column": 14
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 35,
            "end": 36,
            "range": [
                35,
                36
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 14
                },
                "end": {
                    "line": 2,
                    "column": 15
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 36,
            "end": 37,
            "range": [
                36,
                37
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 15
                },
                "end": {
                    "line": 2,
                    "column": 16
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 38,
            "end": 39,
            "range": [
                38,
                39
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
            "type": "Keyword",
            "value": "let",
            "start": 48,
            "end": 51,
            "range": [
                48,
                51
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 8
                },
                "end": {
                    "line": 3,
                    "column": 11
                }
            }
        },
        {
            "type": "Identifier",
            "value": "aaa",
            "start": 52,
            "end": 55,
            "range": [
                52,
                55
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 12
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
            "start": 56,
            "end": 57,
            "range": [
                56,
                57
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
            "type": "Numeric",
            "value": "4",
            "start": 58,
            "end": 59,
            "range": [
                58,
                59
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 18
                },
                "end": {
                    "line": 3,
                    "column": 19
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ",",
            "start": 59,
            "end": 60,
            "range": [
                59,
                60
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 19
                },
                "end": {
                    "line": 3,
                    "column": 20
                }
            }
        },
        {
            "type": "Identifier",
            "value": "boo",
            "start": 69,
            "end": 72,
            "range": [
                69,
                72
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 8
                },
                "end": {
                    "line": 4,
                    "column": 11
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 72,
            "end": 73,
            "range": [
                72,
                73
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 11
                },
                "end": {
                    "line": 4,
                    "column": 12
                }
            }
        },
        {
            "type": "Keyword",
            "value": "if",
            "start": 83,
            "end": 85,
            "range": [
                83,
                85
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 8
                },
                "end": {
                    "line": 6,
                    "column": 10
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 86,
            "end": 87,
            "range": [
                86,
                87
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 11
                },
                "end": {
                    "line": 6,
                    "column": 12
                }
            }
        },
        {
            "type": "Boolean",
            "value": "true",
            "start": 87,
            "end": 91,
            "range": [
                87,
                91
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 12
                },
                "end": {
                    "line": 6,
                    "column": 16
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 91,
            "end": 92,
            "range": [
                91,
                92
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 16
                },
                "end": {
                    "line": 6,
                    "column": 17
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 93,
            "end": 94,
            "range": [
                93,
                94
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 18
                },
                "end": {
                    "line": 6,
                    "column": 19
                }
            }
        },
        {
            "type": "Identifier",
            "value": "boo",
            "start": 103,
            "end": 106,
            "range": [
                103,
                106
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 8
                },
                "end": {
                    "line": 7,
                    "column": 11
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "=",
            "start": 107,
            "end": 108,
            "range": [
                107,
                108
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 12
                },
                "end": {
                    "line": 7,
                    "column": 13
                }
            }
        },
        {
            "type": "Numeric",
            "value": "3",
            "start": 109,
            "end": 110,
            "range": [
                109,
                110
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 14
                },
                "end": {
                    "line": 7,
                    "column": 15
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 110,
            "end": 111,
            "range": [
                110,
                111
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 15
                },
                "end": {
                    "line": 7,
                    "column": 16
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 120,
            "end": 121,
            "range": [
                120,
                121
            ],
            "loc": {
                "start": {
                    "line": 8,
                    "column": 8
                },
                "end": {
                    "line": 8,
                    "column": 9
                }
            }
        },
        {
            "type": "Identifier",
            "value": "boo",
            "start": 127,
            "end": 130,
            "range": [
                127,
                130
            ],
            "loc": {
                "start": {
                    "line": 10,
                    "column": 4
                },
                "end": {
                    "line": 10,
                    "column": 7
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "=",
            "start": 131,
            "end": 132,
            "range": [
                131,
                132
            ],
            "loc": {
                "start": {
                    "line": 10,
                    "column": 8
                },
                "end": {
                    "line": 10,
                    "column": 9
                }
            }
        },
        {
            "type": "Numeric",
            "value": "3",
            "start": 133,
            "end": 134,
            "range": [
                133,
                134
            ],
            "loc": {
                "start": {
                    "line": 10,
                    "column": 10
                },
                "end": {
                    "line": 10,
                    "column": 11
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "+",
            "start": 135,
            "end": 136,
            "range": [
                135,
                136
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
            "type": "Numeric",
            "value": "2",
            "start": 137,
            "end": 138,
            "range": [
                137,
                138
            ],
            "loc": {
                "start": {
                    "line": 10,
                    "column": 14
                },
                "end": {
                    "line": 10,
                    "column": 15
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 138,
            "end": 139,
            "range": [
                138,
                139
            ],
            "loc": {
                "start": {
                    "line": 10,
                    "column": 15
                },
                "end": {
                    "line": 10,
                    "column": 16
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 144,
            "end": 145,
            "range": [
                144,
                145
            ],
            "loc": {
                "start": {
                    "line": 11,
                    "column": 4
                },
                "end": {
                    "line": 11,
                    "column": 5
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 146,
            "end": 147,
            "range": [
                146,
                147
            ],
            "loc": {
                "start": {
                    "line": 12,
                    "column": 0
                },
                "end": {
                    "line": 12,
                    "column": 1
                }
            }
        }
    ],
    "comments": []
});

