/**
 * Source code:
 * type Foo = 'bar' | "baz"
 */

exports.parse = () => ({
    "type": "Program",
    "body": [
        {
            "type": "TSTypeAliasDeclaration",
            "id": {
                "type": "Identifier",
                "name": "Foo",
                "range": [
                    5,
                    8
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 5
                    },
                    "end": {
                        "line": 1,
                        "column": 8
                    }
                }
            },
            "typeAnnotation": {
                "type": "TSUnionType",
                "types": [
                    {
                        "type": "TSLiteralType",
                        "literal": {
                            "type": "Literal",
                            "raw": "'bar'",
                            "value": "bar",
                            "range": [
                                11,
                                16
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 11
                                },
                                "end": {
                                    "line": 1,
                                    "column": 16
                                }
                            }
                        },
                        "range": [
                            11,
                            16
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 11
                            },
                            "end": {
                                "line": 1,
                                "column": 16
                            }
                        }
                    },
                    {
                        "type": "TSLiteralType",
                        "literal": {
                            "type": "Literal",
                            "raw": "\"baz\"",
                            "value": "baz",
                            "range": [
                                19,
                                24
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 19
                                },
                                "end": {
                                    "line": 1,
                                    "column": 24
                                }
                            }
                        },
                        "range": [
                            19,
                            24
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 19
                            },
                            "end": {
                                "line": 1,
                                "column": 24
                            }
                        }
                    }
                ],
                "range": [
                    11,
                    24
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 11
                    },
                    "end": {
                        "line": 1,
                        "column": 24
                    }
                }
            },
            "range": [
                0,
                24
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 24
                }
            }
        }
    ],
    "sourceType": "module",
    "range": [
        0,
        24
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 1,
            "column": 24
        }
    },
    "tokens": [
        {
            "type": "Identifier",
            "value": "type",
            "range": [
                0,
                4
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 4
                }
            }
        },
        {
            "type": "Identifier",
            "value": "Foo",
            "range": [
                5,
                8
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 5
                },
                "end": {
                    "line": 1,
                    "column": 8
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "=",
            "range": [
                9,
                10
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 9
                },
                "end": {
                    "line": 1,
                    "column": 10
                }
            }
        },
        {
            "type": "String",
            "value": "'bar'",
            "range": [
                11,
                16
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 11
                },
                "end": {
                    "line": 1,
                    "column": 16
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "|",
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
        },
        {
            "type": "String",
            "value": "\"baz\"",
            "range": [
                19,
                24
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 19
                },
                "end": {
                    "line": 1,
                    "column": 24
                }
            }
        }
    ],
    "comments": []
});
