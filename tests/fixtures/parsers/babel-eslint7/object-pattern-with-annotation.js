/**
 * Parser: babel-eslint v7.2.3
 * Source code:
 * ({
 *     foo
 *     }: bar) => baz
 */

exports.parse = () => ({
    type: "Program",
    start: 0,
    end: 29,
    loc: {
        start: {
            line: 1,
            column: 0
        },
        end: {
            line: 3,
            column: 18
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
            type: "Identifier",
            value: "bar",
            start: 18,
            end: 21,
            loc: {
                start: {
                    line: 3,
                    column: 7
                },
                end: {
                    line: 3,
                    column: 10
                }
            },
            range: [
                18,
                21
            ]
        },
        {
            type: "Punctuator",
            value: ")",
            start: 21,
            end: 22,
            loc: {
                start: {
                    line: 3,
                    column: 10
                },
                end: {
                    line: 3,
                    column: 11
                }
            },
            range: [
                21,
                22
            ]
        },
        {
            type: "Punctuator",
            value: "=>",
            start: 23,
            end: 25,
            loc: {
                start: {
                    line: 3,
                    column: 12
                },
                end: {
                    line: 3,
                    column: 14
                }
            },
            range: [
                23,
                25
            ]
        },
        {
            type: "Identifier",
            value: "baz",
            start: 26,
            end: 29,
            loc: {
                start: {
                    line: 3,
                    column: 15
                },
                end: {
                    line: 3,
                    column: 18
                }
            },
            range: [
                26,
                29
            ]
        }
    ],
    range: [
        0,
        29
    ],
    sourceType: "module",
    body: [
        {
            type: "ExpressionStatement",
            start: 0,
            end: 29,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 3,
                    column: 18
                }
            },
            expression: {
                type: "ArrowFunctionExpression",
                start: 0,
                end: 29,
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 3,
                        column: 18
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
                        end: 21,
                        loc: {
                            start: {
                                line: 1,
                                column: 1
                            },
                            end: {
                                line: 3,
                                column: 10
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
                            end: 21,
                            loc: {
                                start: {
                                    line: 3,
                                    column: 5
                                },
                                end: {
                                    line: 3,
                                    column: 10
                                }
                            },
                            typeAnnotation: {
                                type: "GenericTypeAnnotation",
                                start: 18,
                                end: 21,
                                loc: {
                                    start: {
                                        line: 3,
                                        column: 7
                                    },
                                    end: {
                                        line: 3,
                                        column: 10
                                    }
                                },
                                typeParameters: null,
                                id: {
                                    type: "Identifier",
                                    start: 18,
                                    end: 21,
                                    loc: {
                                        start: {
                                            line: 3,
                                            column: 7
                                        },
                                        end: {
                                            line: 3,
                                            column: 10
                                        },
                                        identifierName: "bar"
                                    },
                                    name: "bar",
                                    range: [
                                        18,
                                        21
                                    ],
                                    _babelType: "Identifier"
                                },
                                range: [
                                    18,
                                    21
                                ],
                                _babelType: "GenericTypeAnnotation"
                            },
                            range: [
                                16,
                                21
                            ],
                            _babelType: "TypeAnnotation"
                        },
                        range: [
                            1,
                            21
                        ],
                        _babelType: "ObjectPattern"
                    }
                ],
                body: {
                    type: "Identifier",
                    start: 26,
                    end: 29,
                    loc: {
                        start: {
                            line: 3,
                            column: 15
                        },
                        end: {
                            line: 3,
                            column: 18
                        },
                        identifierName: "baz"
                    },
                    name: "baz",
                    range: [
                        26,
                        29
                    ],
                    _babelType: "Identifier"
                },
                range: [
                    0,
                    29
                ],
                _babelType: "ArrowFunctionExpression",
                defaults: []
            },
            range: [
                0,
                29
            ],
            _babelType: "ExpressionStatement"
        }
    ]
});
