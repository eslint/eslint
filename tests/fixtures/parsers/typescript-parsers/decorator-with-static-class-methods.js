"use strict";

/**
 * Parser: typescript-eslint-parser v1.0.3 (TS 2.0.6)
 * Source code:
 * class Foo { @dec static qux() { } @dec static get bar() { } @dec static set baz() { } @dec static async baw() { } }
 */

exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        111
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 1,
            "column": 111
        }
    },
    "body": [
        {
            "type": "ClassDeclaration",
            "range": [
                0,
                111
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 111
                }
            },
            "id": {
                "type": "Identifier",
                "range": [
                    6,
                    9
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 6
                    },
                    "end": {
                        "line": 1,
                        "column": 9
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
                            12,
                            32
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 12
                            },
                            "end": {
                                "line": 1,
                                "column": 32
                            }
                        },
                        "key": {
                            "type": "Identifier",
                            "range": [
                                24,
                                27
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 24
                                },
                                "end": {
                                    "line": 1,
                                    "column": 27
                                }
                            },
                            "name": "qux"
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
                                    30,
                                    32
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 30
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 32
                                    }
                                },
                                "body": []
                            },
                            "range": [
                                27,
                                32
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 27
                                },
                                "end": {
                                    "line": 1,
                                    "column": 32
                                }
                            },
                            "params": []
                        },
                        "computed": false,
                        "static": true,
                        "kind": "method",
                        "accessibility": null,
                        "decorators": [
                            {
                                "type": "Identifier",
                                "range": [
                                    13,
                                    16
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 13
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 16
                                    }
                                },
                                "name": "dec"
                            }
                        ]
                    },
                    {
                        "type": "MethodDefinition",
                        "range": [
                            33,
                            57
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 33
                            },
                            "end": {
                                "line": 1,
                                "column": 57
                            }
                        },
                        "key": {
                            "type": "Identifier",
                            "range": [
                                49,
                                52
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 49
                                },
                                "end": {
                                    "line": 1,
                                    "column": 52
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
                                    55,
                                    57
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 55
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 57
                                    }
                                },
                                "body": []
                            },
                            "range": [
                                52,
                                57
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 52
                                },
                                "end": {
                                    "line": 1,
                                    "column": 57
                                }
                            },
                            "params": []
                        },
                        "computed": false,
                        "static": true,
                        "kind": "get",
                        "accessibility": null,
                        "decorators": [
                            {
                                "type": "Identifier",
                                "range": [
                                    34,
                                    37
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 34
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 37
                                    }
                                },
                                "name": "dec"
                            }
                        ]
                    },
                    {
                        "type": "MethodDefinition",
                        "range": [
                            58,
                            82
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 58
                            },
                            "end": {
                                "line": 1,
                                "column": 82
                            }
                        },
                        "key": {
                            "type": "Identifier",
                            "range": [
                                74,
                                77
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 74
                                },
                                "end": {
                                    "line": 1,
                                    "column": 77
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
                                    80,
                                    82
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 80
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 82
                                    }
                                },
                                "body": []
                            },
                            "range": [
                                77,
                                82
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 77
                                },
                                "end": {
                                    "line": 1,
                                    "column": 82
                                }
                            },
                            "params": []
                        },
                        "computed": false,
                        "static": true,
                        "kind": "set",
                        "accessibility": null,
                        "decorators": [
                            {
                                "type": "Identifier",
                                "range": [
                                    59,
                                    62
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 59
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 62
                                    }
                                },
                                "name": "dec"
                            }
                        ]
                    },
                    {
                        "type": "MethodDefinition",
                        "range": [
                            83,
                            109
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 83
                            },
                            "end": {
                                "line": 1,
                                "column": 109
                            }
                        },
                        "key": {
                            "type": "Identifier",
                            "range": [
                                101,
                                104
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 101
                                },
                                "end": {
                                    "line": 1,
                                    "column": 104
                                }
                            },
                            "name": "baw"
                        },
                        "value": {
                            "type": "FunctionExpression",
                            "id": null,
                            "generator": false,
                            "expression": false,
                            "async": true,
                            "body": {
                                "type": "BlockStatement",
                                "range": [
                                    107,
                                    109
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 107
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 109
                                    }
                                },
                                "body": []
                            },
                            "range": [
                                104,
                                109
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 104
                                },
                                "end": {
                                    "line": 1,
                                    "column": 109
                                }
                            },
                            "params": []
                        },
                        "computed": false,
                        "static": true,
                        "kind": "method",
                        "accessibility": null,
                        "decorators": [
                            {
                                "type": "Identifier",
                                "range": [
                                    84,
                                    87
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 84
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 87
                                    }
                                },
                                "name": "dec"
                            }
                        ]
                    }
                ],
                "range": [
                    10,
                    111
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 10
                    },
                    "end": {
                        "line": 1,
                        "column": 111
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
            "type": "Keyword",
            "value": "class",
            "range": [
                0,
                5
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 5
                }
            }
        },
        {
            "type": "Identifier",
            "value": "Foo",
            "range": [
                6,
                9
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 6
                },
                "end": {
                    "line": 1,
                    "column": 9
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "range": [
                10,
                11
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 10
                },
                "end": {
                    "line": 1,
                    "column": 11
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "@",
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
            "type": "Identifier",
            "value": "dec",
            "range": [
                13,
                16
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 13
                },
                "end": {
                    "line": 1,
                    "column": 16
                }
            }
        },
        {
            "type": "Keyword",
            "value": "static",
            "range": [
                17,
                23
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 17
                },
                "end": {
                    "line": 1,
                    "column": 23
                }
            }
        },
        {
            "type": "Identifier",
            "value": "qux",
            "range": [
                24,
                27
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 24
                },
                "end": {
                    "line": 1,
                    "column": 27
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
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
            "type": "Punctuator",
            "value": ")",
            "range": [
                28,
                29
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 28
                },
                "end": {
                    "line": 1,
                    "column": 29
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "range": [
                30,
                31
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 30
                },
                "end": {
                    "line": 1,
                    "column": 31
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
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
            "type": "Punctuator",
            "value": "@",
            "range": [
                33,
                34
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 33
                },
                "end": {
                    "line": 1,
                    "column": 34
                }
            }
        },
        {
            "type": "Identifier",
            "value": "dec",
            "range": [
                34,
                37
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 34
                },
                "end": {
                    "line": 1,
                    "column": 37
                }
            }
        },
        {
            "type": "Keyword",
            "value": "static",
            "range": [
                38,
                44
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 38
                },
                "end": {
                    "line": 1,
                    "column": 44
                }
            }
        },
        {
            "type": "Identifier",
            "value": "get",
            "range": [
                45,
                48
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 45
                },
                "end": {
                    "line": 1,
                    "column": 48
                }
            }
        },
        {
            "type": "Identifier",
            "value": "bar",
            "range": [
                49,
                52
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 49
                },
                "end": {
                    "line": 1,
                    "column": 52
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "range": [
                52,
                53
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 52
                },
                "end": {
                    "line": 1,
                    "column": 53
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "range": [
                53,
                54
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 53
                },
                "end": {
                    "line": 1,
                    "column": 54
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "range": [
                55,
                56
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 55
                },
                "end": {
                    "line": 1,
                    "column": 56
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "range": [
                56,
                57
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 56
                },
                "end": {
                    "line": 1,
                    "column": 57
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "@",
            "range": [
                58,
                59
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 58
                },
                "end": {
                    "line": 1,
                    "column": 59
                }
            }
        },
        {
            "type": "Identifier",
            "value": "dec",
            "range": [
                59,
                62
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 59
                },
                "end": {
                    "line": 1,
                    "column": 62
                }
            }
        },
        {
            "type": "Keyword",
            "value": "static",
            "range": [
                63,
                69
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 63
                },
                "end": {
                    "line": 1,
                    "column": 69
                }
            }
        },
        {
            "type": "Identifier",
            "value": "set",
            "range": [
                70,
                73
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 70
                },
                "end": {
                    "line": 1,
                    "column": 73
                }
            }
        },
        {
            "type": "Identifier",
            "value": "baz",
            "range": [
                74,
                77
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 74
                },
                "end": {
                    "line": 1,
                    "column": 77
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "range": [
                77,
                78
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 77
                },
                "end": {
                    "line": 1,
                    "column": 78
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "range": [
                78,
                79
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 78
                },
                "end": {
                    "line": 1,
                    "column": 79
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "range": [
                80,
                81
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 80
                },
                "end": {
                    "line": 1,
                    "column": 81
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "range": [
                81,
                82
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 81
                },
                "end": {
                    "line": 1,
                    "column": 82
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "@",
            "range": [
                83,
                84
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 83
                },
                "end": {
                    "line": 1,
                    "column": 84
                }
            }
        },
        {
            "type": "Identifier",
            "value": "dec",
            "range": [
                84,
                87
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 84
                },
                "end": {
                    "line": 1,
                    "column": 87
                }
            }
        },
        {
            "type": "Keyword",
            "value": "static",
            "range": [
                88,
                94
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 88
                },
                "end": {
                    "line": 1,
                    "column": 94
                }
            }
        },
        {
            "type": "Identifier",
            "value": "async",
            "range": [
                95,
                100
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 95
                },
                "end": {
                    "line": 1,
                    "column": 100
                }
            }
        },
        {
            "type": "Identifier",
            "value": "baw",
            "range": [
                101,
                104
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 101
                },
                "end": {
                    "line": 1,
                    "column": 104
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "range": [
                104,
                105
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 104
                },
                "end": {
                    "line": 1,
                    "column": 105
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "range": [
                105,
                106
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 105
                },
                "end": {
                    "line": 1,
                    "column": 106
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "range": [
                107,
                108
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 107
                },
                "end": {
                    "line": 1,
                    "column": 108
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "range": [
                108,
                109
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 108
                },
                "end": {
                    "line": 1,
                    "column": 109
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "range": [
                110,
                111
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 110
                },
                "end": {
                    "line": 1,
                    "column": 111
                }
            }
        }
    ],
    "comments": []
});

