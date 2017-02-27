"use strict";

/**
 * Parser: typescript-eslint-parser v1.0.3 (TS 2.0.6)
 * Source code:
 * class Foo { @dec get bar() { } @dec set baz() { } @dec async baw() { } }
 */

exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        72
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 1,
            "column": 72
        }
    },
    "body": [
        {
            "type": "ClassDeclaration",
            "range": [
                0,
                72
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 72
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
                            30
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 12
                            },
                            "end": {
                                "line": 1,
                                "column": 30
                            }
                        },
                        "key": {
                            "type": "Identifier",
                            "range": [
                                21,
                                24
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 21
                                },
                                "end": {
                                    "line": 1,
                                    "column": 24
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
                                    27,
                                    30
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 27
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 30
                                    }
                                },
                                "body": []
                            },
                            "range": [
                                24,
                                30
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 24
                                },
                                "end": {
                                    "line": 1,
                                    "column": 30
                                }
                            },
                            "params": []
                        },
                        "computed": false,
                        "static": false,
                        "kind": "get",
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
                            31,
                            49
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 31
                            },
                            "end": {
                                "line": 1,
                                "column": 49
                            }
                        },
                        "key": {
                            "type": "Identifier",
                            "range": [
                                40,
                                43
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 40
                                },
                                "end": {
                                    "line": 1,
                                    "column": 43
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
                                    46,
                                    49
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 46
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 49
                                    }
                                },
                                "body": []
                            },
                            "range": [
                                43,
                                49
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 43
                                },
                                "end": {
                                    "line": 1,
                                    "column": 49
                                }
                            },
                            "params": []
                        },
                        "computed": false,
                        "static": false,
                        "kind": "set",
                        "accessibility": null,
                        "decorators": [
                            {
                                "type": "Identifier",
                                "range": [
                                    32,
                                    35
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 32
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 35
                                    }
                                },
                                "name": "dec"
                            }
                        ]
                    },
                    {
                        "type": "MethodDefinition",
                        "range": [
                            50,
                            70
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 50
                            },
                            "end": {
                                "line": 1,
                                "column": 70
                            }
                        },
                        "key": {
                            "type": "Identifier",
                            "range": [
                                61,
                                64
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 61
                                },
                                "end": {
                                    "line": 1,
                                    "column": 64
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
                                    67,
                                    70
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 67
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 70
                                    }
                                },
                                "body": []
                            },
                            "range": [
                                64,
                                70
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 64
                                },
                                "end": {
                                    "line": 1,
                                    "column": 70
                                }
                            },
                            "params": []
                        },
                        "computed": false,
                        "static": false,
                        "kind": "method",
                        "accessibility": null,
                        "decorators": [
                            {
                                "type": "Identifier",
                                "range": [
                                    51,
                                    54
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 51
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 54
                                    }
                                },
                                "name": "dec"
                            }
                        ]
                    }
                ],
                "range": [
                    10,
                    72
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 10
                    },
                    "end": {
                        "line": 1,
                        "column": 72
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
            "type": "Identifier",
            "value": "get",
            "range": [
                17,
                20
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 17
                },
                "end": {
                    "line": 1,
                    "column": 20
                }
            }
        },
        {
            "type": "Identifier",
            "value": "bar",
            "range": [
                21,
                24
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 21
                },
                "end": {
                    "line": 1,
                    "column": 24
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "range": [
                24,
                25
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 24
                },
                "end": {
                    "line": 1,
                    "column": 25
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
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
            "type": "Punctuator",
            "value": "}",
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
            "type": "Punctuator",
            "value": "@",
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
            "type": "Identifier",
            "value": "dec",
            "range": [
                32,
                35
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 32
                },
                "end": {
                    "line": 1,
                    "column": 35
                }
            }
        },
        {
            "type": "Identifier",
            "value": "set",
            "range": [
                36,
                39
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 36
                },
                "end": {
                    "line": 1,
                    "column": 39
                }
            }
        },
        {
            "type": "Identifier",
            "value": "baz",
            "range": [
                40,
                43
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 40
                },
                "end": {
                    "line": 1,
                    "column": 43
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
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
            "value": ")",
            "range": [
                44,
                45
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 44
                },
                "end": {
                    "line": 1,
                    "column": 45
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
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
        },
        {
            "type": "Punctuator",
            "value": "}",
            "range": [
                48,
                49
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 48
                },
                "end": {
                    "line": 1,
                    "column": 49
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "@",
            "range": [
                50,
                51
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 50
                },
                "end": {
                    "line": 1,
                    "column": 51
                }
            }
        },
        {
            "type": "Identifier",
            "value": "dec",
            "range": [
                51,
                54
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 51
                },
                "end": {
                    "line": 1,
                    "column": 54
                }
            }
        },
        {
            "type": "Identifier",
            "value": "async",
            "range": [
                55,
                60
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 55
                },
                "end": {
                    "line": 1,
                    "column": 60
                }
            }
        },
        {
            "type": "Identifier",
            "value": "baw",
            "range": [
                61,
                64
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 61
                },
                "end": {
                    "line": 1,
                    "column": 64
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "range": [
                64,
                65
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 64
                },
                "end": {
                    "line": 1,
                    "column": 65
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "range": [
                65,
                66
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 65
                },
                "end": {
                    "line": 1,
                    "column": 66
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "range": [
                67,
                68
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 67
                },
                "end": {
                    "line": 1,
                    "column": 68
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "range": [
                69,
                70
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 69
                },
                "end": {
                    "line": 1,
                    "column": 70
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "range": [
                71,
                72
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 71
                },
                "end": {
                    "line": 1,
                    "column": 72
                }
            }
        }
    ],
    "comments": []
});

