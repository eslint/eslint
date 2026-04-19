"use strict";

/**
 * Source code:
 * type httpMethod = 'GET'
 * | 'POST'
 * | 'PUT';
 */


exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        41
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 3,
            "column": 8
        }
    },
    "body": [
        {
            "type": "VariableDeclaration",
            "range": [
                0,
                41
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 3,
                    "column": 8
                }
            },
            "kind": "type",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "range": [
                            5,
                            15
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 5
                            },
                            "end": {
                                "line": 1,
                                "column": 15
                            }
                        },
                        "name": "httpMethod"
                    },
                    "init": {
                        "type": "TSUnionType",
                        "range": [
                            18,
                            40
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 18
                            },
                            "end": {
                                "line": 3,
                                "column": 7
                            }
                        },
                        "types": [
                            {
                                "type": "TSLastTypeNode",
                                "range": [
                                    18,
                                    23
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 18
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 23
                                    }
                                },
                                "literal": {
                                    "type": "Literal",
                                    "range": [
                                        18,
                                        23
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 1,
                                            "column": 18
                                        },
                                        "end": {
                                            "line": 1,
                                            "column": 23
                                        }
                                    },
                                    "value": "GET",
                                    "raw": "'GET'"
                                }
                            },
                            {
                                "type": "TSLastTypeNode",
                                "range": [
                                    26,
                                    32
                                ],
                                "loc": {
                                    "start": {
                                        "line": 2,
                                        "column": 2
                                    },
                                    "end": {
                                        "line": 2,
                                        "column": 8
                                    }
                                },
                                "literal": {
                                    "type": "Literal",
                                    "range": [
                                        26,
                                        32
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 2,
                                            "column": 2
                                        },
                                        "end": {
                                            "line": 2,
                                            "column": 8
                                        }
                                    },
                                    "value": "POST",
                                    "raw": "'POST'"
                                }
                            },
                            {
                                "type": "TSLastTypeNode",
                                "range": [
                                    35,
                                    40
                                ],
                                "loc": {
                                    "start": {
                                        "line": 3,
                                        "column": 2
                                    },
                                    "end": {
                                        "line": 3,
                                        "column": 7
                                    }
                                },
                                "literal": {
                                    "type": "Literal",
                                    "range": [
                                        35,
                                        40
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 3,
                                            "column": 2
                                        },
                                        "end": {
                                            "line": 3,
                                            "column": 7
                                        }
                                    },
                                    "value": "PUT",
                                    "raw": "'PUT'"
                                }
                            }
                        ]
                    },
                    "range": [
                        5,
                        41
                    ],
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 5
                        },
                        "end": {
                            "line": 3,
                            "column": 8
                        }
                    }
                }
            ]
        }
    ],
    "sourceType": "script",
    "tokens": [
        {
            "type": "Identifier",
            "value": "type",
            "start": 0,
            "end": 4,
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
            "value": "httpMethod",
            "start": 5,
            "end": 15,
            "range": [
                5,
                15
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 5
                },
                "end": {
                    "line": 1,
                    "column": 15
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "=",
            "start": 16,
            "end": 17,
            "range": [
                16,
                17
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 16
                },
                "end": {
                    "line": 1,
                    "column": 17
                }
            }
        },
        {
            "type": "String",
            "value": "'GET'",
            "start": 18,
            "end": 23,
            "range": [
                18,
                23
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 18
                },
                "end": {
                    "line": 1,
                    "column": 23
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "|",
            "start": 24,
            "end": 25,
            "range": [
                24,
                25
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 0
                },
                "end": {
                    "line": 2,
                    "column": 1
                }
            }
        },
        {
            "type": "String",
            "value": "'POST'",
            "start": 26,
            "end": 32,
            "range": [
                26,
                32
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 2
                },
                "end": {
                    "line": 2,
                    "column": 8
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "|",
            "start": 33,
            "end": 34,
            "range": [
                33,
                34
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 0
                },
                "end": {
                    "line": 3,
                    "column": 1
                }
            }
        },
        {
            "type": "String",
            "value": "'PUT'",
            "start": 35,
            "end": 40,
            "range": [
                35,
                40
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 2
                },
                "end": {
                    "line": 3,
                    "column": 7
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
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
        }
    ],
    "comments": []
});
