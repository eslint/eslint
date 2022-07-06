/**
 * Source code:
 * var foo: Bar = '';
 */

exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        18
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 1,
            "column": 18
        }
    },
    "body": [
        {
            "type": "VariableDeclaration",
            "range": [
                0,
                18
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 18
                }
            },
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "range": [
                        4,
                        17
                    ],
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 4
                        },
                        "end": {
                            "line": 1,
                            "column": 17
                        }
                    },
                    "id": {
                        "type": "Identifier",
                        "range": [
                            4,
                            7
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 4
                            },
                            "end": {
                                "line": 1,
                                "column": 7
                            }
                        },
                        "name": "foo",
                        "typeAnnotation": {
                            "type": "TypeAnnotation",
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
                            ],
                            "typeAnnotation": {
                                "type": "TypeReference",
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
                                "typeName": {
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
                                    "name": "Bar"
                                }
                            }
                        }
                    },
                    "init": {
                        "type": "Literal",
                        "range": [
                            15,
                            17
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 15
                            },
                            "end": {
                                "line": 1,
                                "column": 17
                            }
                        },
                        "value": "",
                        "raw": "''"
                    }
                }
            ],
            "kind": "var"
        }
    ],
    "sourceType": "script",
    "tokens": [
        {
            "type": "Keyword",
            "value": "var",
            "start": 0,
            "end": 3,
            "range": [
                0,
                3
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 3
                }
            }
        },
        {
            "type": "Identifier",
            "value": "foo",
            "start": 4,
            "end": 7,
            "range": [
                4,
                7
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 4
                },
                "end": {
                    "line": 1,
                    "column": 7
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ":",
            "start": 7,
            "end": 8,
            "range": [
                7,
                8
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 7
                },
                "end": {
                    "line": 1,
                    "column": 8
                }
            }
        },
        {
            "type": "Identifier",
            "value": "Bar",
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
            "value": "=",
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
            "type": "String",
            "value": "''",
            "start": 15,
            "end": 17,
            "range": [
                15,
                17
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 15
                },
                "end": {
                    "line": 1,
                    "column": 17
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 17,
            "end": 18,
            "range": [
                17,
                18
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 17
                },
                "end": {
                    "line": 1,
                    "column": 18
                }
            }
        }
    ],
    "comments": []
});
