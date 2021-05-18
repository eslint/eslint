"use strict";

/**
 * Parser: typescript-eslint-parser v1.0.3 (TS 2.0.6)
 * Source code:
 * @dec class Foo { }
 */

exports.parse = () => ({
    "type": "Program",
    "range": [
        0,
        18
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 1,
            "column": 18
        }
    },
    "body": [
        {
            "type": "ClassDeclaration",
            "range": [
                0,
                18
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 18
                }
            },
            "id": {
                "type": "Identifier",
                "range": [
                    11,
                    14
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 11
                    },
                    "end": {
                        "line": 1,
                        "column": 14
                    }
                },
                "name": "Foo"
            },
            "body": {
                "type": "ClassBody",
                "body": [],
                "range": [
                    15,
                    18
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 15
                    },
                    "end": {
                        "line": 1,
                        "column": 18
                    }
                }
            },
            "superClass": null,
            "implements": [],
            "decorators": [
                {
                    "type": "Identifier",
                    "range": [
                        1,
                        4
                    ],
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 1
                        },
                        "end": {
                            "line": 1,
                            "column": 4
                        }
                    },
                    "name": "dec"
                }
            ]
        }
    ],
    "sourceType": "script",
    "tokens": [
        {
            "type": "Punctuator",
            "value": "@",
            "range": [
                0,
                1
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 1
                }
            }
        },
        {
            "type": "Identifier",
            "value": "dec",
            "range": [
                1,
                4
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 1
                },
                "end": {
                    "line": 1,
                    "column": 4
                }
            }
        },
        {
            "type": "Keyword",
            "value": "class",
            "range": [
                5,
                10
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 5
                },
                "end": {
                    "line": 1,
                    "column": 10
                }
            }
        },
        {
            "type": "Identifier",
            "value": "Foo",
            "range": [
                11,
                14
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 11
                },
                "end": {
                    "line": 1,
                    "column": 14
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "{",
            "range": [
                15,
                16
            ],
            "loc": {
                "start": {
                    "line": 1,
                    "column": 15
                },
                "end": {
                    "line": 1,
                    "column": 16
                }
            }
        },
        {
            "type": "Punctuator",
            "value": "}",
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
        }
    ],
    "comments": []
});
