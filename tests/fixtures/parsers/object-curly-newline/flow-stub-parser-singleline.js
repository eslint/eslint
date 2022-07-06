
/*
  AST for:

function foo({ a, b } : MyType) {}

*/
exports.parse = () => ({
    "type": "Program",
    "start": 0,
    "end": 35,
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 2,
            "column": 0
        }
    },
    "range": [
        0,
        35
    ],
    "comments": [],
    "tokens": [
        {
            "type": "Keyword",
            "value": "function",
            "start": 0,
            "end": 8,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 8
                }
            },
            "range": [
                0,
                8
            ]
        },
        {
            "type": "Identifier",
            "value": "foo",
            "start": 9,
            "end": 12,
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
            "range": [
                9,
                12
            ]
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 12,
            "end": 13,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 12
                },
                "end": {
                    "line": 1,
                    "column": 13
                }
            },
            "range": [
                12,
                13
            ]
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 13,
            "end": 14,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 13
                },
                "end": {
                    "line": 1,
                    "column": 14
                }
            },
            "range": [
                13,
                14
            ]
        },
        {
            "type": "Identifier",
            "value": "a",
            "start": 15,
            "end": 16,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 15
                },
                "end": {
                    "line": 1,
                    "column": 16
                }
            },
            "range": [
                15,
                16
            ]
        },
        {
            "type": "Punctuator",
            "value": ",",
            "start": 16,
            "end": 17,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 16
                },
                "end": {
                    "line": 1,
                    "column": 17
                }
            },
            "range": [
                16,
                17
            ]
        },
        {
            "type": "Identifier",
            "value": "b",
            "start": 18,
            "end": 19,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 18
                },
                "end": {
                    "line": 1,
                    "column": 19
                }
            },
            "range": [
                18,
                19
            ]
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 20,
            "end": 21,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 20
                },
                "end": {
                    "line": 1,
                    "column": 21
                }
            },
            "range": [
                20,
                21
            ]
        },
        {
            "type": "Punctuator",
            "value": ":",
            "start": 22,
            "end": 23,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 22
                },
                "end": {
                    "line": 1,
                    "column": 23
                }
            },
            "range": [
                22,
                23
            ]
        },
        {
            "type": "Identifier",
            "value": "MyType",
            "start": 24,
            "end": 30,
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
            "range": [
                24,
                30
            ]
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 30,
            "end": 31,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 30
                },
                "end": {
                    "line": 1,
                    "column": 31
                }
            },
            "range": [
                30,
                31
            ]
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 32,
            "end": 33,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 32
                },
                "end": {
                    "line": 1,
                    "column": 33
                }
            },
            "range": [
                32,
                33
            ]
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 33,
            "end": 34,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 33
                },
                "end": {
                    "line": 1,
                    "column": 34
                }
            },
            "range": [
                33,
                34
            ]
        }
    ],
    "sourceType": "module",
    "body": [
        {
            "type": "FunctionDeclaration",
            "start": 0,
            "end": 34,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 34
                }
            },
            "range": [
                0,
                34
            ],
            "id": {
                "type": "Identifier",
                "start": 9,
                "end": 12,
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 9
                    },
                    "end": {
                        "line": 1,
                        "column": 12
                    },
                    "identifierName": "foo"
                },
                "range": [
                    9,
                    12
                ],
                "name": "foo",
                "_babelType": "Identifier"
            },
            "generator": false,
            "expression": false,
            "async": false,
            "params": [
                {
                    "type": "ObjectPattern",
                    "start": 13,
                    "end": 30,
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 13
                        },
                        "end": {
                            "line": 1,
                            "column": 30
                        }
                    },
                    "range": [
                        13,
                        30
                    ],
                    "properties": [
                        {
                            "type": "Property",
                            "start": 15,
                            "end": 16,
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 15
                                },
                                "end": {
                                    "line": 1,
                                    "column": 16
                                }
                            },
                            "range": [
                                15,
                                16
                            ],
                            "method": false,
                            "computed": false,
                            "key": {
                                "type": "Identifier",
                                "start": 15,
                                "end": 16,
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 15
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 16
                                    },
                                    "identifierName": "a"
                                },
                                "range": [
                                    15,
                                    16
                                ],
                                "name": "a",
                                "_babelType": "Identifier"
                            },
                            "shorthand": true,
                            "value": {
                                "type": "Identifier",
                                "start": 15,
                                "end": 16,
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 15
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 16
                                    },
                                    "identifierName": "a"
                                },
                                "range": [
                                    15,
                                    16
                                ],
                                "name": "a",
                                "_babelType": "Identifier"
                            },
                            "kind": "init",
                            "extra": {
                                "shorthand": true
                            },
                            "_babelType": "Property"
                        },
                        {
                            "type": "Property",
                            "start": 18,
                            "end": 19,
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 18
                                },
                                "end": {
                                    "line": 1,
                                    "column": 19
                                }
                            },
                            "range": [
                                18,
                                19
                            ],
                            "method": false,
                            "computed": false,
                            "key": {
                                "type": "Identifier",
                                "start": 18,
                                "end": 19,
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 18
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 19
                                    },
                                    "identifierName": "b"
                                },
                                "range": [
                                    18,
                                    19
                                ],
                                "name": "b",
                                "_babelType": "Identifier"
                            },
                            "shorthand": true,
                            "value": {
                                "type": "Identifier",
                                "start": 18,
                                "end": 19,
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 18
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 19
                                    },
                                    "identifierName": "b"
                                },
                                "range": [
                                    18,
                                    19
                                ],
                                "name": "b",
                                "_babelType": "Identifier"
                            },
                            "kind": "init",
                            "extra": {
                                "shorthand": true
                            },
                            "_babelType": "Property"
                        }
                    ],
                    "typeAnnotation": {
                        "type": "TypeAnnotation",
                        "start": 22,
                        "end": 30,
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 22
                            },
                            "end": {
                                "line": 1,
                                "column": 30
                            }
                        },
                        "range": [
                            22,
                            30
                        ],
                        "typeAnnotation": {
                            "type": "GenericTypeAnnotation",
                            "start": 24,
                            "end": 30,
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
                            "range": [
                                24,
                                30
                            ],
                            "typeParameters": null,
                            "id": {
                                "type": "Identifier",
                                "start": 24,
                                "end": 30,
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 24
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 30
                                    },
                                    "identifierName": "MyType"
                                },
                                "range": [
                                    24,
                                    30
                                ],
                                "name": "MyType",
                                "_babelType": "Identifier"
                            },
                            "_babelType": "GenericTypeAnnotation"
                        },
                        "_babelType": "TypeAnnotation"
                    },
                    "_babelType": "ObjectPattern"
                }
            ],
            "body": {
                "type": "BlockStatement",
                "start": 32,
                "end": 34,
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 32
                    },
                    "end": {
                        "line": 1,
                        "column": 34
                    }
                },
                "range": [
                    32,
                    34
                ],
                "body": [],
                "_babelType": "BlockStatement"
            },
            "_babelType": "FunctionDeclaration"
        }
    ]
});

