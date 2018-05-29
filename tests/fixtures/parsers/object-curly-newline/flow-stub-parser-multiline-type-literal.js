
/*
  AST for:

 function foo({
 a,
 b
} : { a : string, b : string }) {}

*/
exports.parse = () => ({
    "type": "Program",
    "start": 0,
    "end": 57,
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
        57
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
            "type": "Punctuator",
            "value": "{",
            "start": 26,
            "end": 27,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 4
                },
                "end": {
                    "line": 4,
                    "column": 5
                }
            },
            "range": [
                26,
                27
            ]
        },
        {
            "type": "Identifier",
            "value": "a",
            "start": 28,
            "end": 29,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 6
                },
                "end": {
                    "line": 4,
                    "column": 7
                }
            },
            "range": [
                28,
                29
            ]
        },
        {
            "type": "Punctuator",
            "value": ":",
            "start": 30,
            "end": 31,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 8
                },
                "end": {
                    "line": 4,
                    "column": 9
                }
            },
            "range": [
                30,
                31
            ]
        },
        {
            "type": "Identifier",
            "value": "string",
            "start": 32,
            "end": 38,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 10
                },
                "end": {
                    "line": 4,
                    "column": 16
                }
            },
            "range": [
                32,
                38
            ]
        },
        {
            "type": "Punctuator",
            "value": ",",
            "start": 38,
            "end": 39,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 16
                },
                "end": {
                    "line": 4,
                    "column": 17
                }
            },
            "range": [
                38,
                39
            ]
        },
        {
            "type": "Identifier",
            "value": "b",
            "start": 40,
            "end": 41,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 18
                },
                "end": {
                    "line": 4,
                    "column": 19
                }
            },
            "range": [
                40,
                41
            ]
        },
        {
            "type": "Punctuator",
            "value": ":",
            "start": 42,
            "end": 43,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 20
                },
                "end": {
                    "line": 4,
                    "column": 21
                }
            },
            "range": [
                42,
                43
            ]
        },
        {
            "type": "Identifier",
            "value": "string",
            "start": 44,
            "end": 50,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 22
                },
                "end": {
                    "line": 4,
                    "column": 28
                }
            },
            "range": [
                44,
                50
            ]
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 51,
            "end": 52,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 29
                },
                "end": {
                    "line": 4,
                    "column": 30
                }
            },
            "range": [
                51,
                52
            ]
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 52,
            "end": 53,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 30
                },
                "end": {
                    "line": 4,
                    "column": 31
                }
            },
            "range": [
                52,
                53
            ]
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 54,
            "end": 55,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 32
                },
                "end": {
                    "line": 4,
                    "column": 33
                }
            },
            "range": [
                54,
                55
            ]
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 55,
            "end": 56,
            "loc": {
                "start": {
                    "line": 4,
                    "column": 33
                },
                "end": {
                    "line": 4,
                    "column": 34
                }
            },
            "range": [
                55,
                56
            ]
        }
    ],
    "sourceType": "module",
    "body": [
        {
            "type": "FunctionDeclaration",
            "start": 0,
            "end": 56,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 4,
                    "column": 34
                }
            },
            "range": [
                0,
                56
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
                    "end": 52,
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 13
                        },
                        "end": {
                            "line": 4,
                            "column": 30
                        }
                    },
                    "range": [
                        13,
                        52
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
                        "end": 52,
                        "loc": {
                            "start": {
                                "line": 4,
                                "column": 2
                            },
                            "end": {
                                "line": 4,
                                "column": 30
                            }
                        },
                        "range": [
                            24,
                            52
                        ],
                        "typeAnnotation": {
                            "type": "ObjectTypeAnnotation",
                            "start": 26,
                            "end": 52,
                            "loc": {
                                "start": {
                                    "line": 4,
                                    "column": 4
                                },
                                "end": {
                                    "line": 4,
                                    "column": 30
                                }
                            },
                            "range": [
                                26,
                                52
                            ],
                            "callProperties": [],
                            "properties": [
                                {
                                    "type": "ObjectTypeProperty",
                                    "start": 28,
                                    "end": 38,
                                    "loc": {
                                        "start": {
                                            "line": 4,
                                            "column": 6
                                        },
                                        "end": {
                                            "line": 4,
                                            "column": 16
                                        }
                                    },
                                    "range": [
                                        28,
                                        38
                                    ],
                                    "static": false,
                                    "kind": "init",
                                    "value": {
                                        "type": "StringTypeAnnotation",
                                        "start": 32,
                                        "end": 38,
                                        "loc": {
                                            "start": {
                                                "line": 4,
                                                "column": 10
                                            },
                                            "end": {
                                                "line": 4,
                                                "column": 16
                                            }
                                        },
                                        "range": [
                                            32,
                                            38
                                        ],
                                        "_babelType": "StringTypeAnnotation"
                                    },
                                    "variance": null,
                                    "optional": false,
                                    "_babelType": "ObjectTypeProperty"
                                },
                                {
                                    "type": "ObjectTypeProperty",
                                    "start": 40,
                                    "end": 50,
                                    "loc": {
                                        "start": {
                                            "line": 4,
                                            "column": 18
                                        },
                                        "end": {
                                            "line": 4,
                                            "column": 28
                                        }
                                    },
                                    "range": [
                                        40,
                                        50
                                    ],
                                    "static": false,
                                    "kind": "init",
                                    "value": {
                                        "type": "StringTypeAnnotation",
                                        "start": 44,
                                        "end": 50,
                                        "loc": {
                                            "start": {
                                                "line": 4,
                                                "column": 22
                                            },
                                            "end": {
                                                "line": 4,
                                                "column": 28
                                            }
                                        },
                                        "range": [
                                            44,
                                            50
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
                "start": 54,
                "end": 56,
                "loc": {
                    "start": {
                        "line": 4,
                        "column": 32
                    },
                    "end": {
                        "line": 4,
                        "column": 34
                    }
                },
                "range": [
                    54,
                    56
                ],
                "body": [],
                "_babelType": "BlockStatement"
            },
            "_babelType": "FunctionDeclaration"
        }
    ]
});

