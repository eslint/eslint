
/*
  AST for:

function foo({
 a,
 b
} : MyType) {}

*/
exports.parse = () => ({
    "type": "Program",
    "start": 0,
    "end": 37,
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 5,
            "column": 0
        }
    },
    "range": [
        0,
        37
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
            "start": 16,
            "end": 17,
            "loc": {
                "start": {
                    "line": 2,
                    "column": 1
                },
                "end": {
                    "line": 2,
                    "column": 2
                }
            },
            "range": [
                16,
                17
            ]
        },
        {
            "type": "Punctuator",
            "value": ",",
            "start": 17,
            "end": 18,
            "loc": {
                "start": {
                    "line": 2,
                    "column": 2
                },
                "end": {
                    "line": 2,
                    "column": 3
                }
            },
            "range": [
                17,
                18
            ]
        },
        {
            "type": "Identifier",
            "value": "b",
            "start": 20,
            "end": 21,
            "loc": {
                "start": {
                    "line": 3,
                    "column": 1
                },
                "end": {
                    "line": 3,
                    "column": 2
                }
            },
            "range": [
                20,
                21
            ]
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 22,
            "end": 23,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 0
                },
                "end": {
                    "line": 4,
                    "column": 1
                }
            },
            "range": [
                22,
                23
            ]
        },
        {
            "type": "Punctuator",
            "value": ":",
            "start": 24,
            "end": 25,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 2
                },
                "end": {
                    "line": 4,
                    "column": 3
                }
            },
            "range": [
                24,
                25
            ]
        },
        {
            "type": "Identifier",
            "value": "MyType",
            "start": 26,
            "end": 32,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 4
                },
                "end": {
                    "line": 4,
                    "column": 10
                }
            },
            "range": [
                26,
                32
            ]
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 32,
            "end": 33,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 10
                },
                "end": {
                    "line": 4,
                    "column": 11
                }
            },
            "range": [
                32,
                33
            ]
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 34,
            "end": 35,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 12
                },
                "end": {
                    "line": 4,
                    "column": 13
                }
            },
            "range": [
                34,
                35
            ]
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 35,
            "end": 36,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 13
                },
                "end": {
                    "line": 4,
                    "column": 14
                }
            },
            "range": [
                35,
                36
            ]
        }
    ],
    "sourceType": "module",
    "body": [
        {
            "type": "FunctionDeclaration",
            "start": 0,
            "end": 36,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 4,
                    "column": 14
                }
            },
            "range": [
                0,
                36
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
                    "end": 32,
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 13
                        },
                        "end": {
                            "line": 4,
                            "column": 10
                        }
                    },
                    "range": [
                        13,
                        32
                    ],
                    "properties": [
                        {
                            "type": "Property",
                            "start": 16,
                            "end": 17,
                            "loc": {
                                "start": {
                                    "line": 2,
                                    "column": 1
                                },
                                "end": {
                                    "line": 2,
                                    "column": 2
                                }
                            },
                            "range": [
                                16,
                                17
                            ],
                            "method": false,
                            "computed": false,
                            "key": {
                                "type": "Identifier",
                                "start": 16,
                                "end": 17,
                                "loc": {
                                    "start": {
                                        "line": 2,
                                        "column": 1
                                    },
                                    "end": {
                                        "line": 2,
                                        "column": 2
                                    },
                                    "identifierName": "a"
                                },
                                "range": [
                                    16,
                                    17
                                ],
                                "name": "a",
                                "_babelType": "Identifier"
                            },
                            "shorthand": true,
                            "value": {
                                "type": "Identifier",
                                "start": 16,
                                "end": 17,
                                "loc": {
                                    "start": {
                                        "line": 2,
                                        "column": 1
                                    },
                                    "end": {
                                        "line": 2,
                                        "column": 2
                                    },
                                    "identifierName": "a"
                                },
                                "range": [
                                    16,
                                    17
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
                            "start": 20,
                            "end": 21,
                            "loc": {
                                "start": {
                                    "line": 3,
                                    "column": 1
                                },
                                "end": {
                                    "line": 3,
                                    "column": 2
                                }
                            },
                            "range": [
                                20,
                                21
                            ],
                            "method": false,
                            "computed": false,
                            "key": {
                                "type": "Identifier",
                                "start": 20,
                                "end": 21,
                                "loc": {
                                    "start": {
                                        "line": 3,
                                        "column": 1
                                    },
                                    "end": {
                                        "line": 3,
                                        "column": 2
                                    },
                                    "identifierName": "b"
                                },
                                "range": [
                                    20,
                                    21
                                ],
                                "name": "b",
                                "_babelType": "Identifier"
                            },
                            "shorthand": true,
                            "value": {
                                "type": "Identifier",
                                "start": 20,
                                "end": 21,
                                "loc": {
                                    "start": {
                                        "line": 3,
                                        "column": 1
                                    },
                                    "end": {
                                        "line": 3,
                                        "column": 2
                                    },
                                    "identifierName": "b"
                                },
                                "range": [
                                    20,
                                    21
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
                        "start": 24,
                        "end": 32,
                        "loc": {
                            "start": {
                                "line": 4,
                                "column": 2
                            },
                            "end": {
                                "line": 4,
                                "column": 10
                            }
                        },
                        "range": [
                            24,
                            32
                        ],
                        "typeAnnotation": {
                            "type": "GenericTypeAnnotation",
                            "start": 26,
                            "end": 32,
                            "loc": {
                                "start": {
                                    "line": 4,
                                    "column": 4
                                },
                                "end": {
                                    "line": 4,
                                    "column": 10
                                }
                            },
                            "range": [
                                26,
                                32
                            ],
                            "typeParameters": null,
                            "id": {
                                "type": "Identifier",
                                "start": 26,
                                "end": 32,
                                "loc": {
                                    "start": {
                                        "line": 4,
                                        "column": 4
                                    },
                                    "end": {
                                        "line": 4,
                                        "column": 10
                                    },
                                    "identifierName": "MyType"
                                },
                                "range": [
                                    26,
                                    32
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
                "start": 34,
                "end": 36,
                "loc": {
                    "start": {
                        "line": 4,
                        "column": 12
                    },
                    "end": {
                        "line": 4,
                        "column": 14
                    }
                },
                "range": [
                    34,
                    36
                ],
                "body": [],
                "_babelType": "BlockStatement"
            },
            "_babelType": "FunctionDeclaration"
        }
    ]
});

