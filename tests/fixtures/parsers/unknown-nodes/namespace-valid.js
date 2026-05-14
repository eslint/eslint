"use strict";

/**
 * Source code:
 *  namespace Boo {
 *      const bar = 3,
 *          baz = 2;
 *
 *      if (true) {
 *          const bax = 3;
 *      }
 *  }
 */


exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        99
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
                99
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
                    99
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
                            51
                        ],
                        "loc": {
                            "start": {
                                "line": 2,
                                "column": 4
                            },
                            "end": {
                                "line": 3,
                                "column": 16
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
                                    43,
                                    50
                                ],
                                "loc": {
                                    "start": {
                                        "line": 3,
                                        "column": 8
                                    },
                                    "end": {
                                        "line": 3,
                                        "column": 15
                                    }
                                },
                                "id": {
                                    "type": "Identifier",
                                    "range": [
                                        43,
                                        46
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 3,
                                            "column": 8
                                        },
                                        "end": {
                                            "line": 3,
                                            "column": 11
                                        }
                                    },
                                    "name": "baz"
                                },
                                "init": {
                                    "type": "Literal",
                                    "range": [
                                        49,
                                        50
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 3,
                                            "column": 14
                                        },
                                        "end": {
                                            "line": 3,
                                            "column": 15
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
                            57,
                            97
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
                                61,
                                65
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
                                67,
                                97
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
                                        77,
                                        91
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 6,
                                            "column": 8
                                        },
                                        "end": {
                                            "line": 6,
                                            "column": 22
                                        }
                                    },
                                    "declarations": [
                                        {
                                            "type": "VariableDeclarator",
                                            "range": [
                                                83,
                                                90
                                            ],
                                            "loc": {
                                                "start": {
                                                    "line": 6,
                                                    "column": 14
                                                },
                                                "end": {
                                                    "line": 6,
                                                    "column": 21
                                                }
                                            },
                                            "id": {
                                                "type": "Identifier",
                                                "range": [
                                                    83,
                                                    86
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 6,
                                                        "column": 14
                                                    },
                                                    "end": {
                                                        "line": 6,
                                                        "column": 17
                                                    }
                                                },
                                                "name": "bax"
                                            },
                                            "init": {
                                                "type": "Literal",
                                                "range": [
                                                    89,
                                                    90
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 6,
                                                        "column": 20
                                                    },
                                                    "end": {
                                                        "line": 6,
                                                        "column": 21
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
            "start": 43,
            "end": 46,
            "range": [
                43,
                46
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 8
                },
                "end": {
                    "line": 3,
                    "column": 11
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "=",
            "start": 47,
            "end": 48,
            "range": [
                47,
                48
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 12
                },
                "end": {
                    "line": 3,
                    "column": 13
                }
            }
        },
        {
            "type": "Numeric",
            "value": "2",
            "start": 49,
            "end": 50,
            "range": [
                49,
                50
            ],
            "loc": {
                "start": {
                    "line": 3,
                    "column": 14
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
            "start": 50,
            "end": 51,
            "range": [
                50,
                51
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
            "type": "Keyword",
            "value": "if",
            "start": 57,
            "end": 59,
            "range": [
                57,
                59
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
            "start": 60,
            "end": 61,
            "range": [
                60,
                61
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
            "start": 61,
            "end": 65,
            "range": [
                61,
                65
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
            "start": 65,
            "end": 66,
            "range": [
                65,
                66
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
            "start": 67,
            "end": 68,
            "range": [
                67,
                68
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
            "start": 77,
            "end": 82,
            "range": [
                77,
                82
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 8
                },
                "end": {
                    "line": 6,
                    "column": 13
                }
            }
        },
        {
            "type": "Identifier",
            "value": "bax",
            "start": 83,
            "end": 86,
            "range": [
                83,
                86
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 14
                },
                "end": {
                    "line": 6,
                    "column": 17
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "=",
            "start": 87,
            "end": 88,
            "range": [
                87,
                88
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 18
                },
                "end": {
                    "line": 6,
                    "column": 19
                }
            }
        },
        {
            "type": "Numeric",
            "value": "3",
            "start": 89,
            "end": 90,
            "range": [
                89,
                90
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 20
                },
                "end": {
                    "line": 6,
                    "column": 21
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ";",
            "start": 90,
            "end": 91,
            "range": [
                90,
                91
            ],
            "loc": {
                "start": {
                    "line": 6,
                    "column": 21
                },
                "end": {
                    "line": 6,
                    "column": 22
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "start": 96,
            "end": 97,
            "range": [
                96,
                97
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
            "start": 98,
            "end": 99,
            "range": [
                98,
                99
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
