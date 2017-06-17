/**
 * Source code:
 * function foo(a: number=0): Foo { }
 */

exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        34
    ],
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
    "body": [
        {
            "type": "FunctionDeclaration",
            "range": [
                0,
                34
            ],
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
            "params": [
                {
                    "type": "AssignmentPattern",
                    "range": [
                        13,
                        24
                    ],
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 13
                        },
                        "end": {
                            "line": 1,
                            "column": 24
                        }
                    },
                    "left": {
                        "type": "Identifier",
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
                        },
                        "name": "a",
                        "typeAnnotation": {
                            "type": "TypeAnnotation",
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 16
                                },
                                "end": {
                                    "line": 1,
                                    "column": 22
                                }
                            },
                            "range": [
                                16,
                                22
                            ],
                            "typeAnnotation": {
                                "type": "NumberKeyword",
                                "range": [
                                    16,
                                    22
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 16
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 22
                                    }
                                }
                            }
                        }
                    },
                    "right": {
                        "type": "Literal",
                        "range": [
                            23,
                            24
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 23
                            },
                            "end": {
                                "line": 1,
                                "column": 24
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
                    31,
                    34
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 31
                    },
                    "end": {
                        "line": 1,
                        "column": 34
                    }
                },
                "body": []
            },
            "returnType": {
                "type": "TypeAnnotation",
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 27
                    },
                    "end": {
                        "line": 1,
                        "column": 30
                    }
                },
                "range": [
                    27,
                    30
                ],
                "typeAnnotation": {
                    "type": "TypeReference",
                    "range": [
                        27,
                        30
                    ],
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 27
                        },
                        "end": {
                            "line": 1,
                            "column": 30
                        }
                    },
                    "typeName": {
                        "type": "Identifier",
                        "range": [
                            27,
                            30
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 27
                            },
                            "end": {
                                "line": 1,
                                "column": 30
                            }
                        },
                        "name": "Foo"
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
            "type": "Identifier",
            "value": "a",
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
            "value": "number",
            "start": 16,
            "end": 22,
            "range": [
                16,
                22
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 16
                },
                "end": {
                    "line": 1,
                    "column": 22
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "=",
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
            "type": "Numeric",
            "value": "0",
            "start": 23,
            "end": 24,
            "range": [
                23,
                24
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 23
                },
                "end": {
                    "line": 1,
                    "column": 24
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 24,
            "end": 25,
            "range": [
                24,
                25
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 24
                },
                "end": {
                    "line": 1,
                    "column": 25
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ":",
            "start": 25,
            "end": 26,
            "range": [
                25,
                26
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 25
                },
                "end": {
                    "line": 1,
                    "column": 26
                }
            }
        },
        {
            "type": "Identifier",
            "value": "Foo",
            "start": 27,
            "end": 30,
            "range": [
                27,
                30
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 27
                },
                "end": {
                    "line": 1,
                    "column": 30
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
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
            "type": "Punctuator",
            "value": "}",
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
        }
    ],
    "comments": []
});
