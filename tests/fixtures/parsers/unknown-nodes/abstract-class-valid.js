"use strict";

/**
 * Source code:
 *  abstract class Foo {
 *      public bar() {
 *          let aaa = 4,
 *              boo;
 *
 *          if (true) {
 *              boo = 3;
 *          }
 *
 *          boo = 3 + 2;
 *      }
 *  }
 */


exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        159
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
                159
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
                            157
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
                                    157
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
                                            77
                                        ],
                                        "loc": {
                                            "start": {
                                                "line": 3,
                                                "column": 8
                                            },
                                            "end": {
                                                "line": 4,
                                                "column": 16
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
                                                    73,
                                                    76
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 4,
                                                        "column": 12
                                                    },
                                                    "end": {
                                                        "line": 4,
                                                        "column": 15
                                                    }
                                                },
                                                "id": {
                                                    "type": "Identifier",
                                                    "range": [
                                                        73,
                                                        76
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 4,
                                                            "column": 12
                                                        },
                                                        "end": {
                                                            "line": 4,
                                                            "column": 15
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
                                            87,
                                            129
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
                                                91,
                                                95
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
                                                97,
                                                129
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
                                                        111,
                                                        119
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 7,
                                                            "column": 12
                                                        },
                                                        "end": {
                                                            "line": 7,
                                                            "column": 20
                                                        }
                                                    },
                                                    "expression": {
                                                        "type": "AssignmentExpression",
                                                        "range": [
                                                            111,
                                                            118
                                                        ],
                                                        "loc": {
                                                            "start": {
                                                                "line": 7,
                                                                "column": 12
                                                            },
                                                            "end": {
                                                                "line": 7,
                                                                "column": 19
                                                            }
                                                        },
                                                        "operator": "=",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "range": [
                                                                111,
                                                                114
                                                            ],
                                                            "loc": {
                                                                "start": {
                                                                    "line": 7,
                                                                    "column": 12
                                                                },
                                                                "end": {
                                                                    "line": 7,
                                                                    "column": 15
                                                                }
                                                            },
                                                            "name": "boo"
                                                        },
                                                        "right": {
                                                            "type": "Literal",
                                                            "range": [
                                                                117,
                                                                118
                                                            ],
                                                            "loc": {
                                                                "start": {
                                                                    "line": 7,
                                                                    "column": 18
                                                                },
                                                                "end": {
                                                                    "line": 7,
                                                                    "column": 19
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
                                            139,
                                            151
                                        ],
                                        "loc": {
                                            "start": {
                                                "line": 10,
                                                "column": 8
                                            },
                                            "end": {
                                                "line": 10,
                                                "column": 20
                                            }
                                        },
                                        "expression": {
                                            "type": "AssignmentExpression",
                                            "range": [
                                                139,
                                                150
                                            ],
                                            "loc": {
                                                "start": {
                                                    "line": 10,
                                                    "column": 8
                                                },
                                                "end": {
                                                    "line": 10,
                                                    "column": 19
                                                }
                                            },
                                            "operator": "=",
                                            "left": {
                                                "type": "Identifier",
                                                "range": [
                                                    139,
                                                    142
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 10,
                                                        "column": 8
                                                    },
                                                    "end": {
                                                        "line": 10,
                                                        "column": 11
                                                    }
                                                },
                                                "name": "boo"
                                            },
                                            "right": {
                                                "type": "BinaryExpression",
                                                "range": [
                                                    145,
                                                    150
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 10,
                                                        "column": 14
                                                    },
                                                    "end": {
                                                        "line": 10,
                                                        "column": 19
                                                    }
                                                },
                                                "operator": "+",
                                                "left": {
                                                    "type": "Literal",
                                                    "range": [
                                                        145,
                                                        146
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
                                                    "value": 3,
                                                    "raw": "3"
                                                },
                                                "right": {
                                                    "type": "Literal",
                                                    "range": [
                                                        149,
                                                        150
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 10,
                                                            "column": 18
                                                        },
                                                        "end": {
                                                            "line": 10,
                                                            "column": 19
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
                                157
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
                    159
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
            "start": 73,
            "end": 76,
            "range": [
                73,
                76
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 12
                },
                "end": {
                    "line": 4,
                    "column": 15
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 76,
            "end": 77,
            "range": [
                76,
                77
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 15
                },
                "end": {
                    "line": 4,
                    "column": 16
                }
            }
        },
        {
            "type": "Keyword",
            "value": "if",
            "start": 87,
            "end": 89,
            "range": [
                87,
                89
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
            "start": 90,
            "end": 91,
            "range": [
                90,
                91
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
            "start": 91,
            "end": 95,
            "range": [
                91,
                95
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
            "start": 95,
            "end": 96,
            "range": [
                95,
                96
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
            "start": 97,
            "end": 98,
            "range": [
                97,
                98
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
            "start": 111,
            "end": 114,
            "range": [
                111,
                114
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 12
                },
                "end": {
                    "line": 7,
                    "column": 15
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "=",
            "start": 115,
            "end": 116,
            "range": [
                115,
                116
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
            "type": "Numeric",
            "value": "3",
            "start": 117,
            "end": 118,
            "range": [
                117,
                118
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 18
                },
                "end": {
                    "line": 7,
                    "column": 19
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 118,
            "end": 119,
            "range": [
                118,
                119
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 19
                },
                "end": {
                    "line": 7,
                    "column": 20
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 128,
            "end": 129,
            "range": [
                128,
                129
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
            "start": 139,
            "end": 142,
            "range": [
                139,
                142
            ],
            "loc": {
                "start": {
                    "line": 10,
                    "column": 8
                },
                "end": {
                    "line": 10,
                    "column": 11
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "=",
            "start": 143,
            "end": 144,
            "range": [
                143,
                144
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
            "value": "3",
            "start": 145,
            "end": 146,
            "range": [
                145,
                146
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
            "value": "+",
            "start": 147,
            "end": 148,
            "range": [
                147,
                148
            ],
            "loc": {
                "start": {
                    "line": 10,
                    "column": 16
                },
                "end": {
                    "line": 10,
                    "column": 17
                }
            }
        },
        {
            "type": "Numeric",
            "value": "2",
            "start": 149,
            "end": 150,
            "range": [
                149,
                150
            ],
            "loc": {
                "start": {
                    "line": 10,
                    "column": 18
                },
                "end": {
                    "line": 10,
                    "column": 19
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 150,
            "end": 151,
            "range": [
                150,
                151
            ],
            "loc": {
                "start": {
                    "line": 10,
                    "column": 19
                },
                "end": {
                    "line": 10,
                    "column": 20
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 156,
            "end": 157,
            "range": [
                156,
                157
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
            "start": 158,
            "end": 159,
            "range": [
                158,
                159
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
