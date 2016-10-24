"use strict";

// ([ 1, 1 ]: Array<any>)

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
            "type": "Punctuator",
            "value": ",",
            "start": 4,
            "end": 5,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 4
                },
                "end": {
                    "line": 1,
                    "column": 5
                }
            },
            "range": [
                4,
                5
            ]
        },
        {
            "type": "Numeric",
            "value": "1",
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
            "value": "]",
            "start": 8,
            "end": 9,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 8
                },
                "end": {
                    "line": 1,
                    "column": 9
                }
            },
            "range": [
                8,
                9
            ]
        },
        {
            "type": "Punctuator",
            "value": ":",
            "start": 9,
            "end": 10,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 9
                },
                "end": {
                    "line": 1,
                    "column": 10
                }
            },
            "range": [
                9,
                10
            ]
        },
        {
            "type": "Identifier",
            "value": "Array",
            "start": 11,
            "end": 16,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 11
                },
                "end": {
                    "line": 1,
                    "column": 16
                }
            },
            "range": [
                11,
                16
            ]
        },
        {
            "type": "Punctuator",
            "value": "<",
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
            "value": "any",
            "start": 17,
            "end": 20,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 17
                },
                "end": {
                    "line": 1,
                    "column": 20
                }
            },
            "range": [
                17,
                20
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
                    "end": 9,
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 1
                        },
                        "end": {
                            "line": 1,
                            "column": 9
                        }
                    },
                    "elements": [
                        {
                            "type": "Literal",
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
                            "extra": {
                                "rawValue": 1,
                                "raw": "1"
                            },
                            "value": 1,
                            "range": [
                                3,
                                4
                            ],
                            "_babelType": "NumericLiteral",
                            "raw": "1"
                        },
                        {
                            "type": "Literal",
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
                            "extra": {
                                "rawValue": 1,
                                "raw": "1"
                            },
                            "value": 1,
                            "range": [
                                6,
                                7
                            ],
                            "_babelType": "NumericLiteral",
                            "raw": "1"
                        }
                    ],
                    "range": [
                        1,
                        9
                    ],
                    "_babelType": "ArrayExpression"
                },
                "typeAnnotation": {
                    "type": "TypeAnnotation",
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
                    "typeAnnotation": {
                        "type": "GenericTypeAnnotation",
                        "start": 11,
                        "end": 21,
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 11
                            },
                            "end": {
                                "line": 1,
                                "column": 21
                            }
                        },
                        "typeParameters": {
                            "type": "TypeParameterInstantiation",
                            "start": 16,
                            "end": 21,
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 16
                                },
                                "end": {
                                    "line": 1,
                                    "column": 21
                                }
                            },
                            "params": [
                                {
                                    "type": "AnyTypeAnnotation",
                                    "start": 17,
                                    "end": 20,
                                    "loc": {
                                        "start": {
                                            "line": 1,
                                            "column": 17
                                        },
                                        "end": {
                                            "line": 1,
                                            "column": 20
                                        }
                                    },
                                    "range": [
                                        17,
                                        20
                                    ],
                                    "_babelType": "AnyTypeAnnotation"
                                }
                            ],
                            "range": [
                                16,
                                21
                            ],
                            "_babelType": "TypeParameterInstantiation"
                        },
                        "id": {
                            "type": "Identifier",
                            "start": 11,
                            "end": 16,
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 11
                                },
                                "end": {
                                    "line": 1,
                                    "column": 16
                                },
                                "identifierName": "Array"
                            },
                            "name": "Array",
                            "range": [
                                11,
                                16
                            ],
                            "_babelType": "Identifier"
                        },
                        "range": [
                            11,
                            21
                        ],
                        "_babelType": "GenericTypeAnnotation"
                    },
                    "range": [
                        9,
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
