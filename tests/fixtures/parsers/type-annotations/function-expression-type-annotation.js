/**
 * Source code:
 * const foo = function(a: number = 0): Bar { };
 */

exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        45
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 1,
            "column": 45
        }
    },
    "body": [
        {
            "type": "VariableDeclaration",
            "range": [
                0,
                45
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 45
                }
            },
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "range": [
                        6,
                        44
                    ],
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 6
                        },
                        "end": {
                            "line": 1,
                            "column": 44
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
                        "name": "foo"
                    },
                    "init": {
                        "type": "FunctionExpression",
                        "range": [
                            12,
                            44
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 12
                            },
                            "end": {
                                "line": 1,
                                "column": 44
                            }
                        },
                        "id": null,
                        "generator": false,
                        "params": [
                            {
                                "type": "AssignmentPattern",
                                "range": [
                                    21,
                                    34
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 21
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 34
                                    }
                                },
                                "left": {
                                    "type": "Identifier",
                                    "range": [
                                        21,
                                        22
                                    ],
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
                                    "name": "a",
                                    "typeAnnotation": {
                                        "type": "TypeAnnotation",
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
                                        "typeAnnotation": {
                                            "type": "NumberKeyword",
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
                                            }
                                        }
                                    }
                                },
                                "right": {
                                    "type": "Literal",
                                    "range": [
                                        33,
                                        34
                                    ],
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
                                    "value": 0,
                                    "raw": "0"
                                }
                            }
                        ],
                        "body": {
                            "type": "BlockStatement",
                            "range": [
                                41,
                                44
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 41
                                },
                                "end": {
                                    "line": 1,
                                    "column": 44
                                }
                            },
                            "body": []
                        },
                        "async": false,
                        "expression": false,
                        "returnType": {
                            "type": "TypeAnnotation",
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 37
                                },
                                "end": {
                                    "line": 1,
                                    "column": 40
                                }
                            },
                            "range": [
                                37,
                                40
                            ],
                            "typeAnnotation": {
                                "type": "TypeReference",
                                "range": [
                                    37,
                                    40
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 37
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 40
                                    }
                                },
                                "typeName": {
                                    "type": "Identifier",
                                    "range": [
                                        37,
                                        40
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 1,
                                            "column": 37
                                        },
                                        "end": {
                                            "line": 1,
                                            "column": 40
                                        }
                                    },
                                    "name": "Bar"
                                }
                            }
                        }
                    }
                }
            ],
            "kind": "const"
        }
    ],
    "sourceType": "script",
    "tokens": [
        {
            "type": "Keyword",
            "value": "const",
            "start": 0,
            "end": 5,
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
            "value": "foo",
            "start": 6,
            "end": 9,
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
            "value": "=",
            "start": 10,
            "end": 11,
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
            "type": "Keyword",
            "value": "function",
            "start": 12,
            "end": 20,
            "range": [
                12,
                20
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 12
                },
                "end": {
                    "line": 1,
                    "column": 20
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
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
            "type": "Identifier",
            "value": "a",
            "start": 21,
            "end": 22,
            "range": [
                21,
                22
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 21
                },
                "end": {
                    "line": 1,
                    "column": 22
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ":",
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
        },
        {
            "type": "Identifier",
            "value": "number",
            "start": 24,
            "end": 30,
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
            }
        },
        {
            "type": "Punctuator",
            "value": "=",
            "start": 31,
            "end": 32,
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
            "type": "Numeric",
            "value": "0",
            "start": 33,
            "end": 34,
            "range": [
                33,
                34
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 33
                },
                "end": {
                    "line": 1,
                    "column": 34
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 34,
            "end": 35,
            "range": [
                34,
                35
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 34
                },
                "end": {
                    "line": 1,
                    "column": 35
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ":",
            "start": 35,
            "end": 36,
            "range": [
                35,
                36
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 35
                },
                "end": {
                    "line": 1,
                    "column": 36
                }
            }
        },
        {
            "type": "Identifier",
            "value": "Bar",
            "start": 37,
            "end": 40,
            "range": [
                37,
                40
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 37
                },
                "end": {
                    "line": 1,
                    "column": 40
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 41,
            "end": 42,
            "range": [
                41,
                42
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 41
                },
                "end": {
                    "line": 1,
                    "column": 42
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 43,
            "end": 44,
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
            "value": ";",
            "start": 44,
            "end": 45,
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
        }
    ],
    "comments": []
});

