"use strict";

/**
 * Source code:
 *  namespace Boo {
 *      const bar = 3,
 *      baz = 2;
 *
 *      if (true) {
 *      const bax = 3;
 *      }
 *  }
 */


exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        91
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 8,
            "column": 1
        }
    },
    "body": [
        {
            "type": "TSModuleDeclaration",
            "range": [
                0,
                91
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 8,
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
                "name": "Boo"
            },
            "body": {
                "type": "TSModuleBlock",
                "range": [
                    14,
                    91
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 14
                    },
                    "end": {
                        "line": 8,
                        "column": 1
                    }
                },
                "statements": [
                    {
                        "type": "VariableDeclaration",
                        "range": [
                            20,
                            47
                        ],
                        "loc": {
                            "start": {
                                "line": 2,
                                "column": 4
                            },
                            "end": {
                                "line": 3,
                                "column": 12
                            }
                        },
                        "declarations": [
                            {
                                "type": "VariableDeclarator",
                                "range": [
                                    26,
                                    33
                                ],
                                "loc": {
                                    "start": {
                                        "line": 2,
                                        "column": 10
                                    },
                                    "end": {
                                        "line": 2,
                                        "column": 17
                                    }
                                },
                                "id": {
                                    "type": "Identifier",
                                    "range": [
                                        26,
                                        29
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 2,
                                            "column": 10
                                        },
                                        "end": {
                                            "line": 2,
                                            "column": 13
                                        }
                                    },
                                    "name": "bar"
                                },
                                "init": {
                                    "type": "Literal",
                                    "range": [
                                        32,
                                        33
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 2,
                                            "column": 16
                                        },
                                        "end": {
                                            "line": 2,
                                            "column": 17
                                        }
                                    },
                                    "value": 3,
                                    "raw": "3"
                                }
                            },
                            {
                                "type": "VariableDeclarator",
                                "range": [
                                    39,
                                    46
                                ],
                                "loc": {
                                    "start": {
                                        "line": 3,
                                        "column": 4
                                    },
                                    "end": {
                                        "line": 3,
                                        "column": 11
                                    }
                                },
                                "id": {
                                    "type": "Identifier",
                                    "range": [
                                        39,
                                        42
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
                                "init": {
                                    "type": "Literal",
                                    "range": [
                                        45,
                                        46
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 3,
                                            "column": 10
                                        },
                                        "end": {
                                            "line": 3,
                                            "column": 11
                                        }
                                    },
                                    "value": 2,
                                    "raw": "2"
                                }
                            }
                        ],
                        "kind": "const"
                    },
                    {
                        "type": "IfStatement",
                        "range": [
                            53,
                            89
                        ],
                        "loc": {
                            "start": {
                                "line": 5,
                                "column": 4
                            },
                            "end": {
                                "line": 7,
                                "column": 5
                            }
                        },
                        "test": {
                            "type": "Literal",
                            "range": [
                                57,
                                61
                            ],
                            "loc": {
                                "start": {
                                    "line": 5,
                                    "column": 8
                                },
                                "end": {
                                    "line": 5,
                                    "column": 12
                                }
                            },
                            "value": true,
                            "raw": "true"
                        },
                        "consequent": {
                            "type": "BlockStatement",
                            "range": [
                                63,
                                89
                            ],
                            "loc": {
                                "start": {
                                    "line": 5,
                                    "column": 14
                                },
                                "end": {
                                    "line": 7,
                                    "column": 5
                                }
                            },
                            "body": [
                                {
                                    "type": "VariableDeclaration",
                                    "range": [
                                        69,
                                        83
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 6,
                                            "column": 4
                                        },
                                        "end": {
                                            "line": 6,
                                            "column": 18
                                        }
                                    },
                                    "declarations": [
                                        {
                                            "type": "VariableDeclarator",
                                            "range": [
                                                75,
                                                82
                                            ],
                                            "loc": {
                                                "start": {
                                                    "line": 6,
                                                    "column": 10
                                                },
                                                "end": {
                                                    "line": 6,
                                                    "column": 17
                                                }
                                            },
                                            "id": {
                                                "type": "Identifier",
                                                "range": [
                                                    75,
                                                    78
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 6,
                                                        "column": 10
                                                    },
                                                    "end": {
                                                        "line": 6,
                                                        "column": 13
                                                    }
                                                },
                                                "name": "bax"
                                            },
                                            "init": {
                                                "type": "Literal",
                                                "range": [
                                                    81,
                                                    82
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 6,
                                                        "column": 16
                                                    },
                                                    "end": {
                                                        "line": 6,
                                                        "column": 17
                                                    }
                                                },
                                                "value": 3,
                                                "raw": "3"
                                            }
                                        }
                                    ],
                                    "kind": "const"
                                }
                            ]
                        },
                        "alternate": null
                    }
                ]
            }
        }
    ],
    "sourceType": "script",
    "tokens": [
        {
            "type": "Identifier",
            "value": "namespace",
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
            "value": "Boo",
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
            "type": "Keyword",
            "value": "const",
            "start": 20,
            "end": 25,
            "range": [
                20,
                25
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 4
                },
                "end": {
                    "line": 2,
                    "column": 9
                }
            }
        },
        {
            "type": "Identifier",
            "value": "bar",
            "start": 26,
            "end": 29,
            "range": [
                26,
                29
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 10
                },
                "end": {
                    "line": 2,
                    "column": 13
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "=",
            "start": 30,
            "end": 31,
            "range": [
                30,
                31
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 14
                },
                "end": {
                    "line": 2,
                    "column": 15
                }
            }
        },
        {
            "type": "Numeric",
            "value": "3",
            "start": 32,
            "end": 33,
            "range": [
                32,
                33
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 16
                },
                "end": {
                    "line": 2,
                    "column": 17
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ",",
            "start": 33,
            "end": 34,
            "range": [
                33,
                34
            ],
            "loc": {
                "start": {
                    "line": 2,
                    "column": 17
                },
                "end": {
                    "line": 2,
                    "column": 18
                }
            }
        },
        {
            "type": "Identifier",
            "value": "baz",
            "start": 39,
            "end": 42,
            "range": [
                39,
                42
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
            "value": "=",
            "start": 43,
            "end": 44,
            "range": [
                43,
                44
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 8
                },
                "end": {
                    "line": 3,
                    "column": 9
                }
            }
        },
        {
            "type": "Numeric",
            "value": "2",
            "start": 45,
            "end": 46,
            "range": [
                45,
                46
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 10
                },
                "end": {
                    "line": 3,
                    "column": 11
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 46,
            "end": 47,
            "range": [
                46,
                47
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 11
                },
                "end": {
                    "line": 3,
                    "column": 12
                }
            }
        },
        {
            "type": "Keyword",
            "value": "if",
            "start": 53,
            "end": 55,
            "range": [
                53,
                55
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 4
                },
                "end": {
                    "line": 5,
                    "column": 6
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "start": 56,
            "end": 57,
            "range": [
                56,
                57
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 7
                },
                "end": {
                    "line": 5,
                    "column": 8
                }
            }
        },
        {
            "type": "Boolean",
            "value": "true",
            "start": 57,
            "end": 61,
            "range": [
                57,
                61
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 8
                },
                "end": {
                    "line": 5,
                    "column": 12
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "start": 61,
            "end": 62,
            "range": [
                61,
                62
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 12
                },
                "end": {
                    "line": 5,
                    "column": 13
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "start": 63,
            "end": 64,
            "range": [
                63,
                64
            ],
            "loc": {
                "start": {
                    "line": 5,
                    "column": 14
                },
                "end": {
                    "line": 5,
                    "column": 15
                }
            }
        },
        {
            "type": "Keyword",
            "value": "const",
            "start": 69,
            "end": 74,
            "range": [
                69,
                74
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 4
                },
                "end": {
                    "line": 6,
                    "column": 9
                }
            }
        },
        {
            "type": "Identifier",
            "value": "bax",
            "start": 75,
            "end": 78,
            "range": [
                75,
                78
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 10
                },
                "end": {
                    "line": 6,
                    "column": 13
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "=",
            "start": 79,
            "end": 80,
            "range": [
                79,
                80
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 14
                },
                "end": {
                    "line": 6,
                    "column": 15
                }
            }
        },
        {
            "type": "Numeric",
            "value": "3",
            "start": 81,
            "end": 82,
            "range": [
                81,
                82
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 16
                },
                "end": {
                    "line": 6,
                    "column": 17
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 82,
            "end": 83,
            "range": [
                82,
                83
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 17
                },
                "end": {
                    "line": 6,
                    "column": 18
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 88,
            "end": 89,
            "range": [
                88,
                89
            ],
            "loc": {
                "start": {
                    "line": 7,
                    "column": 4
                },
                "end": {
                    "line": 7,
                    "column": 5
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 90,
            "end": 91,
            "range": [
                90,
                91
            ],
            "loc": {
                "start": {
                    "line": 8,
                    "column": 0
                },
                "end": {
                    "line": 8,
                    "column": 1
                }
            }
        }
    ],
    "comments": []
});
