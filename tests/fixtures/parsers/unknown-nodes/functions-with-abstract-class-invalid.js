"use strict";

/**
 * Source code:
 *  function foo() {
 *      function bar() {
 *          abstract class X {
 *          public baz() {
 *          if (true) {
 *          qux();
 *          }
 *          }
 *          }
 *      }
 *  }
 */


exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        160
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
                160
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
                    160
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
                            158
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
                                158
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
                                        152
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
                                                    73,
                                                    142
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 4,
                                                        "column": 8
                                                    },
                                                    "end": {
                                                        "line": 8,
                                                        "column": 9
                                                    }
                                                },
                                                "key": {
                                                    "type": "Identifier",
                                                    "range": [
                                                        80,
                                                        83
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 4,
                                                            "column": 15
                                                        },
                                                        "end": {
                                                            "line": 4,
                                                            "column": 18
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
                                                            86,
                                                            142
                                                        ],
                                                        "loc": {
                                                            "start": {
                                                                "line": 4,
                                                                "column": 21
                                                            },
                                                            "end": {
                                                                "line": 8,
                                                                "column": 9
                                                            }
                                                        },
                                                        "body": [
                                                            {
                                                                "type": "IfStatement",
                                                                "range": [
                                                                    96,
                                                                    132
                                                                ],
                                                                "loc": {
                                                                    "start": {
                                                                        "line": 5,
                                                                        "column": 8
                                                                    },
                                                                    "end": {
                                                                        "line": 7,
                                                                        "column": 9
                                                                    }
                                                                },
                                                                "test": {
                                                                    "type": "Literal",
                                                                    "range": [
                                                                        100,
                                                                        104
                                                                    ],
                                                                    "loc": {
                                                                        "start": {
                                                                            "line": 5,
                                                                            "column": 12
                                                                        },
                                                                        "end": {
                                                                            "line": 5,
                                                                            "column": 16
                                                                        }
                                                                    },
                                                                    "value": true,
                                                                    "raw": "true"
                                                                },
                                                                "consequent": {
                                                                    "type": "BlockStatement",
                                                                    "range": [
                                                                        106,
                                                                        132
                                                                    ],
                                                                    "loc": {
                                                                        "start": {
                                                                            "line": 5,
                                                                            "column": 18
                                                                        },
                                                                        "end": {
                                                                            "line": 7,
                                                                            "column": 9
                                                                        }
                                                                    },
                                                                    "body": [
                                                                        {
                                                                            "type": "ExpressionStatement",
                                                                            "range": [
                                                                                116,
                                                                                122
                                                                            ],
                                                                            "loc": {
                                                                                "start": {
                                                                                    "line": 6,
                                                                                    "column": 8
                                                                                },
                                                                                "end": {
                                                                                    "line": 6,
                                                                                    "column": 14
                                                                                }
                                                                            },
                                                                            "expression": {
                                                                                "type": "CallExpression",
                                                                                "range": [
                                                                                    116,
                                                                                    121
                                                                                ],
                                                                                "loc": {
                                                                                    "start": {
                                                                                        "line": 6,
                                                                                        "column": 8
                                                                                    },
                                                                                    "end": {
                                                                                        "line": 6,
                                                                                        "column": 13
                                                                                    }
                                                                                },
                                                                                "callee": {
                                                                                    "type": "Identifier",
                                                                                    "range": [
                                                                                        116,
                                                                                        119
                                                                                    ],
                                                                                    "loc": {
                                                                                        "start": {
                                                                                            "line": 6,
                                                                                            "column": 8
                                                                                        },
                                                                                        "end": {
                                                                                            "line": 6,
                                                                                            "column": 11
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
                                                        83,
                                                        142
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 4,
                                                            "column": 18
                                                        },
                                                        "end": {
                                                            "line": 8,
                                                            "column": 9
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
                                            152
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
            "start": 73,
            "end": 79,
            "range": [
                73,
                79
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 8
                },
                "end": {
                    "line": 4,
                    "column": 14
                }
            }
        },
        {
            "type": "Identifier",
            "value": "baz",
            "start": 80,
            "end": 83,
            "range": [
                80,
                83
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 15
                },
                "end": {
                    "line": 4,
                    "column": 18
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 83,
            "end": 84,
            "range": [
                83,
                84
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 18
                },
                "end": {
                    "line": 4,
                    "column": 19
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 84,
            "end": 85,
            "range": [
                84,
                85
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 19
                },
                "end": {
                    "line": 4,
                    "column": 20
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 86,
            "end": 87,
            "range": [
                86,
                87
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 21
                },
                "end": {
                    "line": 4,
                    "column": 22
                }
            }
        },
        {
            "type": "Keyword",
            "value": "if",
            "start": 96,
            "end": 98,
            "range": [
                96,
                98
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 8
                },
                "end": {
                    "line": 5,
                    "column": 10
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 99,
            "end": 100,
            "range": [
                99,
                100
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 11
                },
                "end": {
                    "line": 5,
                    "column": 12
                }
            }
        },
        {
            "type": "Boolean",
            "value": "true",
            "start": 100,
            "end": 104,
            "range": [
                100,
                104
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 12
                },
                "end": {
                    "line": 5,
                    "column": 16
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 104,
            "end": 105,
            "range": [
                104,
                105
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 16
                },
                "end": {
                    "line": 5,
                    "column": 17
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 106,
            "end": 107,
            "range": [
                106,
                107
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 18
                },
                "end": {
                    "line": 5,
                    "column": 19
                }
            }
        },
        {
            "type": "Identifier",
            "value": "qux",
            "start": 116,
            "end": 119,
            "range": [
                116,
                119
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 8
                },
                "end": {
                    "line": 6,
                    "column": 11
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 119,
            "end": 120,
            "range": [
                119,
                120
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
            "type": "Punctuator",
            "value": ")",
            "start": 120,
            "end": 121,
            "range": [
                120,
                121
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 12
                },
                "end": {
                    "line": 6,
                    "column": 13
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 121,
            "end": 122,
            "range": [
                121,
                122
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 13
                },
                "end": {
                    "line": 6,
                    "column": 14
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 131,
            "end": 132,
            "range": [
                131,
                132
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 8
                },
                "end": {
                    "line": 7,
                    "column": 9
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 141,
            "end": 142,
            "range": [
                141,
                142
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
            "type": "Punctuator",
            "value": "}",
            "start": 151,
            "end": 152,
            "range": [
                151,
                152
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
            "start": 157,
            "end": 158,
            "range": [
                157,
                158
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
            "start": 159,
            "end": 160,
            "range": [
                159,
                160
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
