"use strict";

// ([1, 1]: Array< any >)

exports.parse = () => ({
    "type": "Program",
    "start": 0,
    "end": 22,
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 1,
            "column": 22
        }
    },
    "comments": [],
    "tokens": [
        {
            "type": "Punctuator",
            "value": "(",
            "start": 0,
            "end": 1,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 1
                }
            },
            "range": [
                0,
                1
            ]
        },
        {
            "type": "Punctuator",
            "value": "[",
            "start": 1,
            "end": 2,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 1
                },
                "end": {
                    "line": 1,
                    "column": 2
                }
            },
            "range": [
                1,
                2
            ]
        },
        {
            "type": "Numeric",
            "value": "1",
            "start": 2,
            "end": 3,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 2
                },
                "end": {
                    "line": 1,
                    "column": 3
                }
            },
            "range": [
                2,
                3
            ]
        },
        {
            "type": "Punctuator",
            "value": ",",
            "start": 3,
            "end": 4,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 3
                },
                "end": {
                    "line": 1,
                    "column": 4
                }
            },
            "range": [
                3,
                4
            ]
        },
        {
            "type": "Numeric",
            "value": "1",
            "start": 5,
            "end": 6,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 5
                },
                "end": {
                    "line": 1,
                    "column": 6
                }
            },
            "range": [
                5,
                6
            ]
        },
        {
            "type": "Punctuator",
            "value": "]",
            "start": 6,
            "end": 7,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 6
                },
                "end": {
                    "line": 1,
                    "column": 7
                }
            },
            "range": [
                6,
                7
            ]
        },
        {
            "type": "Punctuator",
            "value": ":",
            "start": 7,
            "end": 8,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 7
                },
                "end": {
                    "line": 1,
                    "column": 8
                }
            },
            "range": [
                7,
                8
            ]
        },
        {
            "type": "Identifier",
            "value": "Array",
            "start": 9,
            "end": 14,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 9
                },
                "end": {
                    "line": 1,
                    "column": 14
                }
            },
            "range": [
                9,
                14
            ]
        },
        {
            "type": "Punctuator",
            "value": "<",
            "start": 14,
            "end": 15,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 14
                },
                "end": {
                    "line": 1,
                    "column": 15
                }
            },
            "range": [
                14,
                15
            ]
        },
        {
            "type": "Identifier",
            "value": "any",
            "start": 16,
            "end": 19,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 16
                },
                "end": {
                    "line": 1,
                    "column": 19
                }
            },
            "range": [
                16,
                19
            ]
        },
        {
            "type": "Punctuator",
            "value": ">",
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
            "value": ")",
            "start": 21,
            "end": 22,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 21
                },
                "end": {
                    "line": 1,
                    "column": 22
                }
            },
            "range": [
                21,
                22
            ]
        }
    ],
    "range": [
        0,
        22
    ],
    "sourceType": "module",
    "body": [
        {
            "type": "ExpressionStatement",
            "start": 0,
            "end": 22,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 22
                }
            },
            "expression": {
                "type": "TypeCastExpression",
                "start": 1,
                "end": 21,
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 1
                    },
                    "end": {
                        "line": 1,
                        "column": 21
                    }
                },
                "expression": {
                    "type": "ArrayExpression",
                    "start": 1,
                    "end": 7,
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 1
                        },
                        "end": {
                            "line": 1,
                            "column": 7
                        }
                    },
                    "elements": [
                        {
                            "type": "Literal",
                            "start": 2,
                            "end": 3,
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 2
                                },
                                "end": {
                                    "line": 1,
                                    "column": 3
                                }
                            },
                            "extra": {
                                "rawValue": 1,
                                "raw": "1"
                            },
                            "value": 1,
                            "range": [
                                2,
                                3
                            ],
                            "_babelType": "NumericLiteral",
                            "raw": "1"
                        },
                        {
                            "type": "Literal",
                            "start": 5,
                            "end": 6,
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 5
                                },
                                "end": {
                                    "line": 1,
                                    "column": 6
                                }
                            },
                            "extra": {
                                "rawValue": 1,
                                "raw": "1"
                            },
                            "value": 1,
                            "range": [
                                5,
                                6
                            ],
                            "_babelType": "NumericLiteral",
                            "raw": "1"
                        }
                    ],
                    "range": [
                        1,
                        7
                    ],
                    "_babelType": "ArrayExpression"
                },
                "typeAnnotation": {
                    "type": "TypeAnnotation",
                    "start": 7,
                    "end": 21,
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 7
                        },
                        "end": {
                            "line": 1,
                            "column": 21
                        }
                    },
                    "typeAnnotation": {
                        "type": "GenericTypeAnnotation",
                        "start": 9,
                        "end": 21,
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 9
                            },
                            "end": {
                                "line": 1,
                                "column": 21
                            }
                        },
                        "typeParameters": {
                            "type": "TypeParameterInstantiation",
                            "start": 14,
                            "end": 21,
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 14
                                },
                                "end": {
                                    "line": 1,
                                    "column": 21
                                }
                            },
                            "params": [
                                {
                                    "type": "AnyTypeAnnotation",
                                    "start": 16,
                                    "end": 19,
                                    "loc": {
                                        "start": {
                                            "line": 1,
                                            "column": 16
                                        },
                                        "end": {
                                            "line": 1,
                                            "column": 19
                                        }
                                    },
                                    "range": [
                                        16,
                                        19
                                    ],
                                    "_babelType": "AnyTypeAnnotation"
                                }
                            ],
                            "range": [
                                14,
                                21
                            ],
                            "_babelType": "TypeParameterInstantiation"
                        },
                        "id": {
                            "type": "Identifier",
                            "start": 9,
                            "end": 14,
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 9
                                },
                                "end": {
                                    "line": 1,
                                    "column": 14
                                },
                                "identifierName": "Array"
                            },
                            "name": "Array",
                            "range": [
                                9,
                                14
                            ],
                            "_babelType": "Identifier"
                        },
                        "range": [
                            9,
                            21
                        ],
                        "_babelType": "GenericTypeAnnotation"
                    },
                    "range": [
                        7,
                        21
                    ],
                    "_babelType": "TypeAnnotation"
                },
                "extra": {
                    "parenthesized": true,
                    "parenStart": 0
                },
                "range": [
                    1,
                    21
                ],
                "_babelType": "TypeCastExpression"
            },
            "range": [
                0,
                22
            ],
            "_babelType": "ExpressionStatement"
        }
    ]
});
