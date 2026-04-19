"use strict";

/**
 * Source code:
 * interface Foo { bar: string; baz: number; }
 */


exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        51
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 4,
            "column": 1
        }
    },
    "body": [
        {
            "type": "TSInterfaceDeclaration",
            "range": [
                0,
                51
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 4,
                    "column": 1
                }
            },
            "name": {
                "type": "Identifier",
                "range": [
                    10,
                    13
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 10
                    },
                    "end": {
                        "line": 1,
                        "column": 13
                    }
                },
                "name": "Foo"
            },
            "members": [
                {
                    "type": "TSPropertySignature",
                    "range": [
                        20,
                        32
                    ],
                    "loc": {
                        "start": {
                            "line": 2,
                            "column": 4
                        },
                        "end": {
                            "line": 2,
                            "column": 16
                        }
                    },
                    "name": {
                        "type": "Identifier",
                        "range": [
                            20,
                            23
                        ],
                        "loc": {
                            "start": {
                                "line": 2,
                                "column": 4
                            },
                            "end": {
                                "line": 2,
                                "column": 7
                            }
                        },
                        "name": "bar"
                    },
                    "typeAnnotation": {
                        "type": "TypeAnnotation",
                        "loc": {
                            "start": {
                                "line": 2,
                                "column": 9
                            },
                            "end": {
                                "line": 2,
                                "column": 15
                            }
                        },
                        "range": [
                            25,
                            31
                        ],
                        "typeAnnotation": {
                            "type": "TSStringKeyword",
                            "range": [
                                25,
                                31
                            ],
                            "loc": {
                                "start": {
                                    "line": 2,
                                    "column": 9
                                },
                                "end": {
                                    "line": 2,
                                    "column": 15
                                }
                            }
                        }
                    }
                },
                {
                    "type": "TSPropertySignature",
                    "range": [
                        37,
                        49
                    ],
                    "loc": {
                        "start": {
                            "line": 3,
                            "column": 4
                        },
                        "end": {
                            "line": 3,
                            "column": 16
                        }
                    },
                    "name": {
                        "type": "Identifier",
                        "range": [
                            37,
                            40
                        ],
                        "loc": {
                            "start": {
                                "line": 3,
                                "column": 4
                            },
                            "end": {
                                "line": 3,
                                "column": 7
                            }
                        },
                        "name": "baz"
                    },
                    "typeAnnotation": {
                        "type": "TypeAnnotation",
                        "loc": {
                            "start": {
                                "line": 3,
                                "column": 9
                            },
                            "end": {
                                "line": 3,
                                "column": 15
                            }
                        },
                        "range": [
                            42,
                            48
                        ],
                        "typeAnnotation": {
                            "type": "TSNumberKeyword",
                            "range": [
                                42,
                                48
                            ],
                            "loc": {
                                "start": {
                                    "line": 3,
                                    "column": 9
                                },
                                "end": {
                                    "line": 3,
                                    "column": 15
                                }
                            }
                        }
                    }
                }
            ]
        }
    ],
    "sourceType": "script",
    "tokens": [
        {
            "type": "Keyword",
            "value": "interface",
            "start": 0,
            "end": 9,
            "range": [
                0,
                9
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 9
                }
            }
        },
        {
            "type": "Identifier",
            "value": "Foo",
            "start": 10,
            "end": 13,
            "range": [
                10,
                13
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 10
                },
                "end": {
                    "line": 1,
                    "column": 13
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
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
            "value": "bar",
            "start": 20,
            "end": 23,
            "range": [
                20,
                23
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 4
                },
                "end": {
                    "line": 2,
                    "column": 7
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ":",
            "start": 23,
            "end": 24,
            "range": [
                23,
                24
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 7
                },
                "end": {
                    "line": 2,
                    "column": 8
                }
            }
        },
        {
            "type": "Identifier",
            "value": "string",
            "start": 25,
            "end": 31,
            "range": [
                25,
                31
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 9
                },
                "end": {
                    "line": 2,
                    "column": 15
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 31,
            "end": 32,
            "range": [
                31,
                32
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 15
                },
                "end": {
                    "line": 2,
                    "column": 16
                }
            }
        },
        {
            "type": "Identifier",
            "value": "baz",
            "start": 37,
            "end": 40,
            "range": [
                37,
                40
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 4
                },
                "end": {
                    "line": 3,
                    "column": 7
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ":",
            "start": 40,
            "end": 41,
            "range": [
                40,
                41
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 7
                },
                "end": {
                    "line": 3,
                    "column": 8
                }
            }
        },
        {
            "type": "Identifier",
            "value": "number",
            "start": 42,
            "end": 48,
            "range": [
                42,
                48
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 9
                },
                "end": {
                    "line": 3,
                    "column": 15
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 48,
            "end": 49,
            "range": [
                48,
                49
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 15
                },
                "end": {
                    "line": 3,
                    "column": 16
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 50,
            "end": 51,
            "range": [
                50,
                51
            ],
            "loc": {
                "start": {
                    "line": 4,
                    "column": 0
                },
                "end": {
                    "line": 4,
                    "column": 1
                }
            }
        }
    ],
    "comments": []
});
