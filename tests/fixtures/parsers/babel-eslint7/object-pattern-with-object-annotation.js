/**
 * Parser: babel-eslint v7.2.3
 * Source code:
 * ({
 *     foo
 *     }: {}) => baz
 */

exports.parse = () => ({
    type: "Program",
    start: 0,
    end: 28,
    loc: {
        start: {
            line: 1,
            column: 0
        },
        end: {
            line: 3,
            column: 17
        }
    },
    comments: [],
    tokens: [
        {
            type: "Punctuator",
            value: "(",
            start: 0,
            end: 1,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 1
                }
            },
            range: [
                0,
                1
            ]
        },
        {
            type: "Punctuator",
            value: "{",
            start: 1,
            end: 2,
            loc: {
                start: {
                    line: 1,
                    column: 1
                },
                end: {
                    line: 1,
                    column: 2
                }
            },
            range: [
                1,
                2
            ]
        },
        {
            type: "Identifier",
            value: "foo",
            start: 7,
            end: 10,
            loc: {
                start: {
                    line: 2,
                    column: 4
                },
                end: {
                    line: 2,
                    column: 7
                }
            },
            range: [
                7,
                10
            ]
        },
        {
            type: "Punctuator",
            value: "}",
            start: 15,
            end: 16,
            loc: {
                start: {
                    line: 3,
                    column: 4
                },
                end: {
                    line: 3,
                    column: 5
                }
            },
            range: [
                15,
                16
            ]
        },
        {
            type: "Punctuator",
            value: ":",
            start: 16,
            end: 17,
            loc: {
                start: {
                    line: 3,
                    column: 5
                },
                end: {
                    line: 3,
                    column: 6
                }
            },
            range: [
                16,
                17
            ]
        },
        {
            type: "Punctuator",
            value: "{",
            start: 18,
            end: 19,
            loc: {
                start: {
                    line: 3,
                    column: 7
                },
                end: {
                    line: 3,
                    column: 8
                }
            },
            range: [
                18,
                19
            ]
        },
        {
            type: "Punctuator",
            value: "}",
            start: 19,
            end: 20,
            loc: {
                start: {
                    line: 3,
                    column: 8
                },
                end: {
                    line: 3,
                    column: 9
                }
            },
            range: [
                19,
                20
            ]
        },
        {
            type: "Punctuator",
            value: ")",
            start: 20,
            end: 21,
            loc: {
                start: {
                    line: 3,
                    column: 9
                },
                end: {
                    line: 3,
                    column: 10
                }
            },
            range: [
                20,
                21
            ]
        },
        {
            type: "Punctuator",
            value: "=>",
            start: 22,
            end: 24,
            loc: {
                start: {
                    line: 3,
                    column: 11
                },
                end: {
                    line: 3,
                    column: 13
                }
            },
            range: [
                22,
                24
            ]
        },
        {
            type: "Identifier",
            value: "baz",
            start: 25,
            end: 28,
            loc: {
                start: {
                    line: 3,
                    column: 14
                },
                end: {
                    line: 3,
                    column: 17
                }
            },
            range: [
                25,
                28
            ]
        }
    ],
    range: [
        0,
        28
    ],
    sourceType: "module",
    body: [
        {
            type: "ExpressionStatement",
            start: 0,
            end: 28,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 3,
                    column: 17
                }
            },
            expression: {
                type: "ArrowFunctionExpression",
                start: 0,
                end: 28,
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 3,
                        column: 17
                    }
                },
                id: null,
                generator: false,
                expression: true,
                async: false,
                params: [
                    {
                        type: "ObjectPattern",
                        start: 1,
                        end: 20,
                        loc: {
                            start: {
                                line: 1,
                                column: 1
                            },
                            end: {
                                line: 3,
                                column: 9
                            }
                        },
                        properties: [
                            {
                                type: "Property",
                                start: 7,
                                end: 10,
                                loc: {
                                    start: {
                                        line: 2,
                                        column: 4
                                    },
                                    end: {
                                        line: 2,
                                        column: 7
                                    }
                                },
                                method: false,
                                shorthand: true,
                                computed: false,
                                key: {
                                    type: "Identifier",
                                    start: 7,
                                    end: 10,
                                    loc: {
                                        start: {
                                            line: 2,
                                            column: 4
                                        },
                                        end: {
                                            line: 2,
                                            column: 7
                                        },
                                        identifierName: "foo"
                                    },
                                    name: "foo",
                                    range: [
                                        7,
                                        10
                                    ],
                                    _babelType: "Identifier"
                                },
                                value: {
                                    type: "Identifier",
                                    start: 7,
                                    end: 10,
                                    loc: {
                                        start: {
                                            line: 2,
                                            column: 4
                                        },
                                        end: {
                                            line: 2,
                                            column: 7
                                        },
                                        identifierName: "foo"
                                    },
                                    name: "foo",
                                    range: [
                                        7,
                                        10
                                    ],
                                    _babelType: "Identifier"
                                },
                                extra: {
                                    shorthand: true
                                },
                                range: [
                                    7,
                                    10
                                ],
                                _babelType: "ObjectProperty",
                                kind: "init"
                            }
                        ],
                        typeAnnotation: {
                            type: "TypeAnnotation",
                            start: 16,
                            end: 20,
                            loc: {
                                start: {
                                    line: 3,
                                    column: 5
                                },
                                end: {
                                    line: 3,
                                    column: 9
                                }
                            },
                            typeAnnotation: {
                                type: "ObjectTypeAnnotation",
                                start: 18,
                                end: 20,
                                loc: {
                                    start: {
                                        line: 3,
                                        column: 7
                                    },
                                    end: {
                                        line: 3,
                                        column: 9
                                    }
                                },
                                callProperties: [],
                                properties: [],
                                indexers: [],
                                exact: false,
                                range: [
                                    18,
                                    20
                                ],
                                _babelType: "ObjectTypeAnnotation"
                            },
                            range: [
                                16,
                                20
                            ],
                            _babelType: "TypeAnnotation"
                        },
                        range: [
                            1,
                            20
                        ],
                        _babelType: "ObjectPattern"
                    }
                ],
                body: {
                    type: "Identifier",
                    start: 25,
                    end: 28,
                    loc: {
                        start: {
                            line: 3,
                            column: 14
                        },
                        end: {
                            line: 3,
                            column: 17
                        },
                        identifierName: "baz"
                    },
                    name: "baz",
                    range: [
                        25,
                        28
                    ],
                    _babelType: "Identifier"
                },
                range: [
                    0,
                    28
                ],
                _babelType: "ArrowFunctionExpression",
                defaults: []
            },
            range: [
                0,
                28
            ],
            _babelType: "ExpressionStatement"
        }
    ]
});
