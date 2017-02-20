"use strict";

/**
 * Parser: typescript-eslint-parser v1.0.3 (TS 2.0.6)
 * Source code:
 * symbol => 4;
 */

exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        12
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 1,
            "column": 12
        }
    },
    "body": [
        {
            "type": "ExpressionStatement",
            "range": [
                0,
                12
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 12
                }
            },
            "expression": {
                "type": "ArrowFunctionExpression",
                "range": [
                    0,
                    11
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 11
                    }
                },
                "generator": false,
                "id": null,
                "params": [
                    {
                        "type": "Identifier",
                        "range": [
                            0,
                            6
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 0
                            },
                            "end": {
                                "line": 1,
                                "column": 6
                            }
                        },
                        "name": "symbol"
                    }
                ],
                "body": {
                    "type": "Literal",
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
                    },
                    "value": 4,
                    "raw": "4"
                },
                "async": false,
                "expression": true
            }
        }
    ],
    "sourceType": "script",
    "tokens": [
        {
            "type": "Keyword",
            "value": "symbol",
            "range": [
                0,
                6
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 6
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "=>",
            "range": [
                7,
                9
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 7
                },
                "end": {
                    "line": 1,
                    "column": 9
                }
            }
        },
        {
            "type": "Numeric",
            "value": "4",
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
            "value": ";",
            "range": [
                11,
                12
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 11
                },
                "end": {
                    "line": 1,
                    "column": 12
                }
            }
        }
    ],
    "comments": []
});
