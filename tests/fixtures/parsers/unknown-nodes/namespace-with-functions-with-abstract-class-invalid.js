"use strict";

/**
 * Source code:
 *  namespace Unknown {
 *      function foo() {
 *      function bar() {
 *              abstract class X {
 *                  public baz() {
 *                      if (true) {
 *                     qux();
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
        254
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
                254
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
                    254
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
                            252
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
                                252
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
                                        45,
                                        246
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 3,
                                            "column": 4
                                        },
                                        "end": {
                                            "line": 11,
                                            "column": 9
                                        }
                                    },
                                    "id": {
                                        "type": "Identifier",
                                        "range": [
                                            54,
                                            57
                                        ],
                                        "loc": {
                                            "start": {
                                                "line": 3,
                                                "column": 13
                                            },
                                            "end": {
                                                "line": 3,
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
                                            60,
                                            246
                                        ],
                                        "loc": {
                                            "start": {
                                                "line": 3,
                                                "column": 19
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
                                                    74,
                                                    236
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
                                                        89,
                                                        90
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
                                                                109,
                                                                222
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
                                                                    116,
                                                                    119
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
                                                                        122,
                                                                        222
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
                                                                                144,
                                                                                204
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
                                                                                    148,
                                                                                    152
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
                                                                                    154,
                                                                                    204
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
                                                                                            176,
                                                                                            182
                                                                                        ],
                                                                                        "loc": {
                                                                                            "start": {
                                                                                                "line": 7,
                                                                                                "column": 20
                                                                                            },
                                                                                            "end": {
                                                                                                "line": 7,
                                                                                                "column": 26
                                                                                            }
                                                                                        },
                                                                                        "expression": {
                                                                                            "type": "CallExpression",
                                                                                            "range": [
                                                                                                176,
                                                                                                181
                                                                                            ],
                                                                                            "loc": {
                                                                                                "start": {
                                                                                                    "line": 7,
                                                                                                    "column": 20
                                                                                                },
                                                                                                "end": {
                                                                                                    "line": 7,
                                                                                                    "column": 25
                                                                                                }
                                                                                            },
                                                                                            "callee": {
                                                                                                "type": "Identifier",
                                                                                                "range": [
                                                                                                    176,
                                                                                                    179
                                                                                                ],
                                                                                                "loc": {
                                                                                                    "start": {
                                                                                                        "line": 7,
                                                                                                        "column": 20
                                                                                                    },
                                                                                                    "end": {
                                                                                                        "line": 7,
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
                                                                    119,
                                                                    222
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
                                                        91,
                                                        236
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
            "start": 45,
            "end": 53,
            "range": [
                45,
                53
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 4
                },
                "end": {
                    "line": 3,
                    "column": 12
                }
            }
        },
        {
            "type": "Identifier",
            "value": "bar",
            "start": 54,
            "end": 57,
            "range": [
                54,
                57
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 13
                },
                "end": {
                    "line": 3,
                    "column": 16
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 57,
            "end": 58,
            "range": [
                57,
                58
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
            "type": "Punctuator",
            "value": ")",
            "start": 58,
            "end": 59,
            "range": [
                58,
                59
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 17
                },
                "end": {
                    "line": 3,
                    "column": 18
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 60,
            "end": 61,
            "range": [
                60,
                61
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
            "value": "abstract",
            "start": 74,
            "end": 82,
            "range": [
                74,
                82
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
            "start": 83,
            "end": 88,
            "range": [
                83,
                88
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
            "start": 89,
            "end": 90,
            "range": [
                89,
                90
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
            "start": 91,
            "end": 92,
            "range": [
                91,
                92
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
            "start": 109,
            "end": 115,
            "range": [
                109,
                115
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
            "start": 116,
            "end": 119,
            "range": [
                116,
                119
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
            "start": 119,
            "end": 120,
            "range": [
                119,
                120
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
            "start": 120,
            "end": 121,
            "range": [
                120,
                121
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
            "start": 122,
            "end": 123,
            "range": [
                122,
                123
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
            "start": 144,
            "end": 146,
            "range": [
                144,
                146
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
            "start": 147,
            "end": 148,
            "range": [
                147,
                148
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
            "start": 148,
            "end": 152,
            "range": [
                148,
                152
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
            "start": 152,
            "end": 153,
            "range": [
                152,
                153
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
            "start": 154,
            "end": 155,
            "range": [
                154,
                155
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
            "start": 176,
            "end": 179,
            "range": [
                176,
                179
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 20
                },
                "end": {
                    "line": 7,
                    "column": 23
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 179,
            "end": 180,
            "range": [
                179,
                180
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 23
                },
                "end": {
                    "line": 7,
                    "column": 24
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 180,
            "end": 181,
            "range": [
                180,
                181
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 24
                },
                "end": {
                    "line": 7,
                    "column": 25
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 181,
            "end": 182,
            "range": [
                181,
                182
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 25
                },
                "end": {
                    "line": 7,
                    "column": 26
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 203,
            "end": 204,
            "range": [
                203,
                204
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
            "start": 221,
            "end": 222,
            "range": [
                221,
                222
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
            "start": 235,
            "end": 236,
            "range": [
                235,
                236
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
            "start": 245,
            "end": 246,
            "range": [
                245,
                246
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
            "start": 251,
            "end": 252,
            "range": [
                251,
                252
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
            "start": 253,
            "end": 254,
            "range": [
                253,
                254
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
