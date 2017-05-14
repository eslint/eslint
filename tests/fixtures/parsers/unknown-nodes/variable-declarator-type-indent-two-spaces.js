"use strict";

/**
 * Source code:
 * type httpMethod = 'GET'
 *   | 'POST'
 *   | 'PUT';
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
            "line": 3,
            "column": 10
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
                    "line": 3,
                    "column": 10
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
                            44
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 18
                            },
                            "end": {
                                "line": 3,
                                "column": 9
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
                                    28,
                                    34
                                ],
                                "loc": {
                                    "start": {
                                        "line": 2,
                                        "column": 4
                                    },
                                    "end": {
                                        "line": 2,
                                        "column": 10
                                    }
                                },
                                "literal": {
                                    "type": "Literal",
                                    "range": [
                                        28,
                                        34
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 2,
                                            "column": 4
                                        },
                                        "end": {
                                            "line": 2,
                                            "column": 10
                                        }
                                    },
                                    "value": "POST",
                                    "raw": "'POST'"
                                }
                            },
                            {
                                "type": "TSLastTypeNode",
                                "range": [
                                    39,
                                    44
                                ],
                                "loc": {
                                    "start": {
                                        "line": 3,
                                        "column": 4
                                    },
                                    "end": {
                                        "line": 3,
                                        "column": 9
                                    }
                                },
                                "literal": {
                                    "type": "Literal",
                                    "range": [
                                        39,
                                        44
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 3,
                                            "column": 4
                                        },
                                        "end": {
                                            "line": 3,
                                            "column": 9
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
                        45
                    ],
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 5
                        },
                        "end": {
                            "line": 3,
                            "column": 10
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
            "start": 26,
            "end": 27,
            "range": [
                26,
                27
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 2
                },
                "end": {
                    "line": 2,
                    "column": 3
                }
            }
        },
        {
            "type": "String",
            "value": "'POST'",
            "start": 28,
            "end": 34,
            "range": [
                28,
                34
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 4
                },
                "end": {
                    "line": 2,
                    "column": 10
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "|",
            "start": 37,
            "end": 38,
            "range": [
                37,
                38
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 2
                },
                "end": {
                    "line": 3,
                    "column": 3
                }
            }
        },
        {
            "type": "String",
            "value": "'PUT'",
            "start": 39,
            "end": 44,
            "range": [
                39,
                44
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 4
                },
                "end": {
                    "line": 3,
                    "column": 9
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
                    "line": 3,
                    "column": 9
                },
                "end": {
                    "line": 3,
                    "column": 10
                }
            }
        }
    ],
    "comments": []
});
