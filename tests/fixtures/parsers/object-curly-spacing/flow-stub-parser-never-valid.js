"use strict";

/* This returns AST of:

function foo ({a, b}: Props) {
}

*/

exports.parse = () => ({
    "type": "Program",
    "start": 0,
    "end": 32,
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 2,
            "column": 1
        }
    },
    "sourceType": "module",
    "body": [
        {
            "type": "FunctionDeclaration",
            "start": 0,
            "end": 32,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 2,
                    "column": 1
                }
            },
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
                    }
                },
                "name": "foo",
                "range": [
                    9,
                    12
                ],
                "_babelType": "Identifier"
            },
            "generator": false,
            "expression": false,
            "async": false,
            "params": [
                {
                    "type": "ObjectPattern",
                    "start": 14,
                    "end": 27,
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 14
                        },
                        "end": {
                            "line": 1,
                            "column": 27
                        }
                    },
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
                            "method": false,
                            "shorthand": true,
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
                                    }
                                },
                                "name": "a",
                                "range": [
                                    15,
                                    16
                                ],
                                "_babelType": "Identifier"
                            },
                            "kind": "init",
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
                                    }
                                },
                                "name": "a",
                                "range": [
                                    15,
                                    16
                                ],
                                "_babelType": "Identifier"
                            },
                            "range": [
                                15,
                                16
                            ],
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
                            "method": false,
                            "shorthand": true,
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
                                    }
                                },
                                "name": "b",
                                "range": [
                                    18,
                                    19
                                ],
                                "_babelType": "Identifier"
                            },
                            "kind": "init",
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
                                    }
                                },
                                "name": "b",
                                "range": [
                                    18,
                                    19
                                ],
                                "_babelType": "Identifier"
                            },
                            "range": [
                                18,
                                19
                            ],
                            "_babelType": "Property"
                        }
                    ],
                    "typeAnnotation": {
                        "type": "TypeAnnotation",
                        "start": 20,
                        "end": 27,
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 20
                            },
                            "end": {
                                "line": 1,
                                "column": 27
                            }
                        },
                        "typeAnnotation": {
                            "type": "GenericTypeAnnotation",
                            "start": 22,
                            "end": 27,
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 22
                                },
                                "end": {
                                    "line": 1,
                                    "column": 27
                                }
                            },
                            "typeParameters": null,
                            "id": {
                                "type": "Identifier",
                                "start": 22,
                                "end": 27,
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 22
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 27
                                    }
                                },
                                "name": "Props",
                                "range": [
                                    22,
                                    27
                                ],
                                "_babelType": "Identifier"
                            },
                            "range": [
                                22,
                                27
                            ],
                            "_babelType": "GenericTypeAnnotation"
                        },
                        "range": [
                            20,
                            27
                        ],
                        "_babelType": "TypeAnnotation"
                    },
                    "range": [
                        14,
                        27
                    ],
                    "_babelType": "ObjectPattern"
                }
            ],
            "body": {
                "type": "BlockStatement",
                "start": 29,
                "end": 32,
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 29
                    },
                    "end": {
                        "line": 2,
                        "column": 1
                    }
                },
                "body": [],
                "range": [
                    29,
                    32
                ],
                "_babelType": "BlockStatement"
            },
            "range": [
                0,
                32
            ],
            "_babelType": "FunctionDeclaration"
        }
    ],
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
            "type": "Punctuator",
            "value": "{",
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
            "start": 19,
            "end": 20,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 19
                },
                "end": {
                    "line": 1,
                    "column": 20
                }
            },
            "range": [
                19,
                20
            ]
        },
        {
            "type": "Punctuator",
            "value": ":",
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
            "type": "Identifier",
            "value": "Props",
            "start": 22,
            "end": 27,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 22
                },
                "end": {
                    "line": 1,
                    "column": 27
                }
            },
            "range": [
                22,
                27
            ]
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 27,
            "end": 28,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 27
                },
                "end": {
                    "line": 1,
                    "column": 28
                }
            },
            "range": [
                27,
                28
            ]
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 29,
            "end": 30,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 29
                },
                "end": {
                    "line": 1,
                    "column": 30
                }
            },
            "range": [
                29,
                30
            ]
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 31,
            "end": 32,
            "loc": {
                "start": {
                    "line": 2,
                    "column": 0
                },
                "end": {
                    "line": 2,
                    "column": 1
                }
            },
            "range": [
                31,
                32
            ]
        },
        {
            "type": {
                "label": "eof",
                "beforeExpr": false,
                "startsExpr": false,
                "rightAssociative": false,
                "isLoop": false,
                "isAssign": false,
                "prefix": false,
                "postfix": false,
                "binop": null,
                "updateContext": null
            },
            "start": 32,
            "end": 32,
            "loc": {
                "start": {
                    "line": 2,
                    "column": 1
                },
                "end": {
                    "line": 2,
                    "column": 1
                }
            },
            "range": [
                32,
                32
            ]
        }
    ],
    "comments": [],
    "range": [
        0,
        32
    ]
});
