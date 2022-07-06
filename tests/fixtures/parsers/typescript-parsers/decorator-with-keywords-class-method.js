"use strict";

/**
 * Parser: typescript-eslint-parser v1.0.3 (TS 2.0.6)
 * Source code:
 * class Foo { @desc({set a(value) {}, get a() {}, async c() {}}) async[foo]() {} }
 */

exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        80
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 1,
            "column": 80
        }
    },
    "body": [
        {
            "type": "ClassDeclaration",
            "range": [
                0,
                80
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 80
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
                "name": "Foo"
            },
            "body": {
                "type": "ClassBody",
                "body": [
                    {
                        "type": "MethodDefinition",
                        "range": [
                            12,
                            78
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 12
                            },
                            "end": {
                                "line": 1,
                                "column": 78
                            }
                        },
                        "key": {
                            "type": "Identifier",
                            "range": [
                                69,
                                72
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 69
                                },
                                "end": {
                                    "line": 1,
                                    "column": 72
                                }
                            },
                            "name": "foo"
                        },
                        "value": {
                            "type": "FunctionExpression",
                            "id": null,
                            "generator": false,
                            "expression": false,
                            "async": true,
                            "body": {
                                "type": "BlockStatement",
                                "range": [
                                    76,
                                    78
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 76
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 78
                                    }
                                },
                                "body": []
                            },
                            "range": [
                                73,
                                78
                            ],
                            "loc": {
                                "start": {
                                    "line": 1,
                                    "column": 73
                                },
                                "end": {
                                    "line": 1,
                                    "column": 78
                                }
                            },
                            "params": []
                        },
                        "computed": true,
                        "static": false,
                        "kind": "method",
                        "accessibility": null,
                        "decorators": [
                            {
                                "type": "CallExpression",
                                "range": [
                                    13,
                                    62
                                ],
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 13
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 62
                                    }
                                },
                                "callee": {
                                    "type": "Identifier",
                                    "range": [
                                        13,
                                        17
                                    ],
                                    "loc": {
                                        "start": {
                                            "line": 1,
                                            "column": 13
                                        },
                                        "end": {
                                            "line": 1,
                                            "column": 17
                                        }
                                    },
                                    "name": "desc"
                                },
                                "arguments": [
                                    {
                                        "type": "ObjectExpression",
                                        "range": [
                                            18,
                                            61
                                        ],
                                        "loc": {
                                            "start": {
                                                "line": 1,
                                                "column": 18
                                            },
                                            "end": {
                                                "line": 1,
                                                "column": 61
                                            }
                                        },
                                        "properties": [
                                            {
                                                "type": "Property",
                                                "range": [
                                                    19,
                                                    34
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 1,
                                                        "column": 19
                                                    },
                                                    "end": {
                                                        "line": 1,
                                                        "column": 34
                                                    }
                                                },
                                                "key": {
                                                    "type": "Identifier",
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
                                                    "name": "a"
                                                },
                                                "value": {
                                                    "type": "FunctionExpression",
                                                    "id": null,
                                                    "generator": false,
                                                    "expression": false,
                                                    "async": false,
                                                    "body": {
                                                        "type": "BlockStatement",
                                                        "range": [
                                                            32,
                                                            34
                                                        ],
                                                        "loc": {
                                                            "start": {
                                                                "line": 1,
                                                                "column": 32
                                                            },
                                                            "end": {
                                                                "line": 1,
                                                                "column": 34
                                                            }
                                                        },
                                                        "body": []
                                                    },
                                                    "range": [
                                                        24,
                                                        34
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 1,
                                                            "column": 24
                                                        },
                                                        "end": {
                                                            "line": 1,
                                                            "column": 34
                                                        }
                                                    },
                                                    "params": [
                                                        {
                                                            "type": "Identifier",
                                                            "range": [
                                                                25,
                                                                30
                                                            ],
                                                            "loc": {
                                                                "start": {
                                                                    "line": 1,
                                                                    "column": 25
                                                                },
                                                                "end": {
                                                                    "line": 1,
                                                                    "column": 30
                                                                }
                                                            },
                                                            "name": "value"
                                                        }
                                                    ]
                                                },
                                                "computed": false,
                                                "method": false,
                                                "shorthand": false,
                                                "kind": "set"
                                            },
                                            {
                                                "type": "Property",
                                                "range": [
                                                    36,
                                                    46
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 1,
                                                        "column": 36
                                                    },
                                                    "end": {
                                                        "line": 1,
                                                        "column": 46
                                                    }
                                                },
                                                "key": {
                                                    "type": "Identifier",
                                                    "range": [
                                                        40,
                                                        41
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 1,
                                                            "column": 40
                                                        },
                                                        "end": {
                                                            "line": 1,
                                                            "column": 41
                                                        }
                                                    },
                                                    "name": "a"
                                                },
                                                "value": {
                                                    "type": "FunctionExpression",
                                                    "id": null,
                                                    "generator": false,
                                                    "expression": false,
                                                    "async": false,
                                                    "body": {
                                                        "type": "BlockStatement",
                                                        "range": [
                                                            44,
                                                            46
                                                        ],
                                                        "loc": {
                                                            "start": {
                                                                "line": 1,
                                                                "column": 44
                                                            },
                                                            "end": {
                                                                "line": 1,
                                                                "column": 46
                                                            }
                                                        },
                                                        "body": []
                                                    },
                                                    "range": [
                                                        41,
                                                        46
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 1,
                                                            "column": 41
                                                        },
                                                        "end": {
                                                            "line": 1,
                                                            "column": 46
                                                        }
                                                    },
                                                    "params": []
                                                },
                                                "computed": false,
                                                "method": false,
                                                "shorthand": false,
                                                "kind": "get"
                                            },
                                            {
                                                "type": "Property",
                                                "range": [
                                                    48,
                                                    60
                                                ],
                                                "loc": {
                                                    "start": {
                                                        "line": 1,
                                                        "column": 48
                                                    },
                                                    "end": {
                                                        "line": 1,
                                                        "column": 60
                                                    }
                                                },
                                                "key": {
                                                    "type": "Identifier",
                                                    "range": [
                                                        54,
                                                        55
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 1,
                                                            "column": 54
                                                        },
                                                        "end": {
                                                            "line": 1,
                                                            "column": 55
                                                        }
                                                    },
                                                    "name": "c"
                                                },
                                                "value": {
                                                    "type": "FunctionExpression",
                                                    "id": null,
                                                    "generator": false,
                                                    "expression": false,
                                                    "async": true,
                                                    "body": {
                                                        "type": "BlockStatement",
                                                        "range": [
                                                            58,
                                                            60
                                                        ],
                                                        "loc": {
                                                            "start": {
                                                                "line": 1,
                                                                "column": 58
                                                            },
                                                            "end": {
                                                                "line": 1,
                                                                "column": 60
                                                            }
                                                        },
                                                        "body": []
                                                    },
                                                    "range": [
                                                        55,
                                                        60
                                                    ],
                                                    "loc": {
                                                        "start": {
                                                            "line": 1,
                                                            "column": 55
                                                        },
                                                        "end": {
                                                            "line": 1,
                                                            "column": 60
                                                        }
                                                    },
                                                    "params": []
                                                },
                                                "computed": false,
                                                "method": true,
                                                "shorthand": false,
                                                "kind": "init"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "range": [
                    10,
                    80
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 10
                    },
                    "end": {
                        "line": 1,
                        "column": 80
                    }
                }
            },
            "superClass": null,
            "implements": [],
            "decorators": []
        }
    ],
    "sourceType": "script",
    "tokens": [
        {
            "type": "Keyword",
            "value": "class",
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
            "value": "Foo",
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
            "value": "{",
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
            "type": "Punctuator",
            "value": "@",
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
            "value": "desc",
            "range": [
                13,
                17
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 13
                },
                "end": {
                    "line": 1,
                    "column": 17
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
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
            "type": "Punctuator",
            "value": "{",
            "range": [
                18,
                19
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 18
                },
                "end": {
                    "line": 1,
                    "column": 19
                }
            }
        },
        {
            "type": "Identifier",
            "value": "set",
            "range": [
                19,
                22
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 19
                },
                "end": {
                    "line": 1,
                    "column": 22
                }
            }
        },
        {
            "type": "Identifier",
            "value": "a",
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
            "value": "(",
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
            "type": "Identifier",
            "value": "value",
            "range": [
                25,
                30
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 25
                },
                "end": {
                    "line": 1,
                    "column": 30
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "range": [
                30,
                31
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 30
                },
                "end": {
                    "line": 1,
                    "column": 31
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "range": [
                32,
                33
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 32
                },
                "end": {
                    "line": 1,
                    "column": 33
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
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
            "value": ",",
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
            "type": "Identifier",
            "value": "get",
            "range": [
                36,
                39
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 36
                },
                "end": {
                    "line": 1,
                    "column": 39
                }
            }
        },
        {
            "type": "Identifier",
            "value": "a",
            "range": [
                40,
                41
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 40
                },
                "end": {
                    "line": 1,
                    "column": 41
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
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
            "value": ")",
            "range": [
                42,
                43
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 42
                },
                "end": {
                    "line": 1,
                    "column": 43
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
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
        },
        {
            "type": "Punctuator",
            "value": "}",
            "range": [
                45,
                46
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 45
                },
                "end": {
                    "line": 1,
                    "column": 46
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ",",
            "range": [
                46,
                47
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 46
                },
                "end": {
                    "line": 1,
                    "column": 47
                }
            }
        },
        {
            "type": "Identifier",
            "value": "async",
            "range": [
                48,
                53
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 48
                },
                "end": {
                    "line": 1,
                    "column": 53
                }
            }
        },
        {
            "type": "Identifier",
            "value": "c",
            "range": [
                54,
                55
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 54
                },
                "end": {
                    "line": 1,
                    "column": 55
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "range": [
                55,
                56
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 55
                },
                "end": {
                    "line": 1,
                    "column": 56
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "range": [
                56,
                57
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 56
                },
                "end": {
                    "line": 1,
                    "column": 57
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "range": [
                58,
                59
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 58
                },
                "end": {
                    "line": 1,
                    "column": 59
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "range": [
                59,
                60
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 59
                },
                "end": {
                    "line": 1,
                    "column": 60
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "range": [
                60,
                61
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 60
                },
                "end": {
                    "line": 1,
                    "column": 61
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "range": [
                61,
                62
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 61
                },
                "end": {
                    "line": 1,
                    "column": 62
                }
            }
        },
        {
            "type": "Identifier",
            "value": "async",
            "range": [
                63,
                68
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 63
                },
                "end": {
                    "line": 1,
                    "column": 68
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "[",
            "range": [
                68,
                69
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 68
                },
                "end": {
                    "line": 1,
                    "column": 69
                }
            }
        },
        {
            "type": "Identifier",
            "value": "foo",
            "range": [
                69,
                72
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 69
                },
                "end": {
                    "line": 1,
                    "column": 72
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "]",
            "range": [
                72,
                73
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 72
                },
                "end": {
                    "line": 1,
                    "column": 73
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "(",
            "range": [
                73,
                74
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 73
                },
                "end": {
                    "line": 1,
                    "column": 74
                }
            }
        },
        {
            "type": "Punctuator",
            "value": ")",
            "range": [
                74,
                75
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 74
                },
                "end": {
                    "line": 1,
                    "column": 75
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "range": [
                76,
                77
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 76
                },
                "end": {
                    "line": 1,
                    "column": 77
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "range": [
                77,
                78
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 77
                },
                "end": {
                    "line": 1,
                    "column": 78
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
            "range": [
                79,
                80
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 79
                },
                "end": {
                    "line": 1,
                    "column": 80
                }
            }
        }
    ],
    "comments": []
});
