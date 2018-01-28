/**
 * Source code:
 * function foo(): Bar { }
 */

exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        23
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 1,
            "column": 23
        }
    },
    "body": [
        {
            "type": "FunctionDeclaration",
            "range": [
                0,
                23
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 23
                }
            },
            "id": {
                "type": "Identifier",
                "range": [
                    9,
                    12
                ],
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
                "name": "foo"
            },
            "generator": false,
            "expression": false,
            "async": false,
            "params": [],
            "body": {
                "type": "BlockStatement",
                "range": [
                    20,
                    23
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 20
                    },
                    "end": {
                        "line": 1,
                        "column": 23
                    }
                },
                "body": []
            },
            "returnType": {
                "type": "TypeAnnotation",
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
                "typeAnnotation": {
                    "type": "TypeReference",
                    "range": [
                        16,
                        19
                    ],
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
                    "typeName": {
                        "type": "Identifier",
                        "range": [
                            16,
                            19
                        ],
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
                        "name": "Bar"
                    }
                }
            }
        }
    ],
    "sourceType": "script",
    "tokens": [
        {
            "type": "Keyword",
            "value": "function",
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
            "type": "Identifier",
            "value": "foo",
            "start": 9,
            "end": 12,
            "range": [
                9,
                12
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 9
                },
                "end": {
                    "line": 1,
                    "column": 12
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 12,
            "end": 13,
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
            "type": "Punctuator",
            "value": ")",
            "start": 13,
            "end": 14,
            "range": [
                13,
                14
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 13
                },
                "end": {
                    "line": 1,
                    "column": 14
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ":",
            "start": 14,
            "end": 15,
            "range": [
                14,
                15
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 14
                },
                "end": {
                    "line": 1,
                    "column": 15
                }
            }
        },
        {
            "type": "Identifier",
            "value": "Bar",
            "start": 16,
            "end": 19,
            "range": [
                16,
                19
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 16
                },
                "end": {
                    "line": 1,
                    "column": 19
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 20,
            "end": 21,
            "range": [
                20,
                21
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 20
                },
                "end": {
                    "line": 1,
                    "column": 21
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 22,
            "end": 23,
            "range": [
                22,
                23
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 22
                },
                "end": {
                    "line": 1,
                    "column": 23
                }
            }
        }
    ],
    "comments": []
});
