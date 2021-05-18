
/*
  AST for:

function foo({ a, b } : { a : string, b : string }) {}

*/
exports.parse = () => ({
    "type": "Program",
    "start": 0,
    "end": 55,
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
        55
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
            "type": "Punctuator",
            "value": "{",
            "start": 24,
            "end": 25,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 24
                },
                "end": {
                    "line": 1,
                    "column": 25
                }
            },
            "range": [
                24,
                25
            ]
        },
        {
            "type": "Identifier",
            "value": "a",
            "start": 26,
            "end": 27,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 26
                },
                "end": {
                    "line": 1,
                    "column": 27
                }
            },
            "range": [
                26,
                27
            ]
        },
        {
            "type": "Punctuator",
            "value": ":",
            "start": 28,
            "end": 29,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 28
                },
                "end": {
                    "line": 1,
                    "column": 29
                }
            },
            "range": [
                28,
                29
            ]
        },
        {
            "type": "Identifier",
            "value": "string",
            "start": 30,
            "end": 36,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 30
                },
                "end": {
                    "line": 1,
                    "column": 36
                }
            },
            "range": [
                30,
                36
            ]
        },
        {
            "type": "Punctuator",
            "value": ",",
            "start": 36,
            "end": 37,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 36
                },
                "end": {
                    "line": 1,
                    "column": 37
                }
            },
            "range": [
                36,
                37
            ]
        },
        {
            "type": "Identifier",
            "value": "b",
            "start": 38,
            "end": 39,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 38
                },
                "end": {
                    "line": 1,
                    "column": 39
                }
            },
            "range": [
                38,
                39
            ]
        },
        {
            "type": "Punctuator",
            "value": ":",
            "start": 40,
            "end": 41,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 40
                },
                "end": {
                    "line": 1,
                    "column": 41
                }
            },
            "range": [
                40,
                41
            ]
        },
        {
            "type": "Identifier",
            "value": "string",
            "start": 42,
            "end": 48,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 42
                },
                "end": {
                    "line": 1,
                    "column": 48
                }
            },
            "range": [
                42,
                48
            ]
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 49,
            "end": 50,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 49
                },
                "end": {
                    "line": 1,
                    "column": 50
                }
            },
            "range": [
                49,
                50
            ]
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 50,
            "end": 51,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 50
                },
                "end": {
                    "line": 1,
                    "column": 51
                }
            },
            "range": [
                50,
                51
            ]
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 52,
            "end": 53,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 52
                },
                "end": {
                    "line": 1,
                    "column": 53
                }
            },
            "range": [
                52,
                53
            ]
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 53,
            "end": 54,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 53
                },
                "end": {
                    "line": 1,
                    "column": 54
                }
            },
            "range": [
                53,
                54
            ]
        }
    ],
    "sourceType": "module",
    "body": [
        {
            "type": "FunctionDeclaration",
            "start": 0,
            "end": 54,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 54
                }
            },
            "range": [
                0,
                54
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
                    "end": 50,
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 13
                        },
                        "end": {
                            "line": 1,
                            "column": 50
                        }
                    },
                    "range": [
                        13,
                        50
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
                        "end": 50,
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 22
                            },
                            "end": {
                                "line": 1,
                                "column": 50
                            }
                        },
                        "range": [
                            22,
                            50
                        ],
                        "typeAnnotation": {
                            "type": "ObjectTypeAnnotation",
                            "start": 24,
                            "end": 50,
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 24
                                },
                                "end": {
                                    "line": 1,
                                    "column": 50
                                }
                            },
                            "range": [
                                24,
                                50
                            ],
                            "callProperties": [],
                            "properties": [
                                {
                                    "type": "ObjectTypeProperty",
                                    "start": 26,
                                    "end": 36,
                                    "loc": {
                                        "start": {
                                            "line": 1,
                                            "column": 26
                                        },
                                        "end": {
                                            "line": 1,
                                            "column": 36
                                        }
                                    },
                                    "range": [
                                        26,
                                        36
                                    ],
                                    "static": false,
                                    "kind": "init",
                                    "value": {
                                        "type": "StringTypeAnnotation",
                                        "start": 30,
                                        "end": 36,
                                        "loc": {
                                            "start": {
                                                "line": 1,
                                                "column": 30
                                            },
                                            "end": {
                                                "line": 1,
                                                "column": 36
                                            }
                                        },
                                        "range": [
                                            30,
                                            36
                                        ],
                                        "_babelType": "StringTypeAnnotation"
                                    },
                                    "variance": null,
                                    "optional": false,
                                    "_babelType": "ObjectTypeProperty"
                                },
                                {
                                    "type": "ObjectTypeProperty",
                                    "start": 38,
                                    "end": 48,
                                    "loc": {
                                        "start": {
                                            "line": 1,
                                            "column": 38
                                        },
                                        "end": {
                                            "line": 1,
                                            "column": 48
                                        }
                                    },
                                    "range": [
                                        38,
                                        48
                                    ],
                                    "static": false,
                                    "kind": "init",
                                    "value": {
                                        "type": "StringTypeAnnotation",
                                        "start": 42,
                                        "end": 48,
                                        "loc": {
                                            "start": {
                                                "line": 1,
                                                "column": 42
                                            },
                                            "end": {
                                                "line": 1,
                                                "column": 48
                                            }
                                        },
                                        "range": [
                                            42,
                                            48
                                        ],
                                        "_babelType": "StringTypeAnnotation"
                                    },
                                    "variance": null,
                                    "optional": false,
                                    "_babelType": "ObjectTypeProperty"
                                }
                            ],
                            "indexers": [],
                            "exact": false,
                            "_babelType": "ObjectTypeAnnotation"
                        },
                        "_babelType": "TypeAnnotation"
                    },
                    "_babelType": "ObjectPattern"
                }
            ],
            "body": {
                "type": "BlockStatement",
                "start": 52,
                "end": 54,
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 52
                    },
                    "end": {
                        "line": 1,
                        "column": 54
                    }
                },
                "range": [
                    52,
                    54
                ],
                "body": [],
                "_babelType": "BlockStatement"
            },
            "_babelType": "FunctionDeclaration"
        }
    ]
});

