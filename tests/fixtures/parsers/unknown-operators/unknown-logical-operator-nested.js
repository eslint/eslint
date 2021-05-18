/**
 * The output AST has been modified to represent an unknown operator
 * (replaced ?? with %%)
 *
 * Parser: babel-eslint v8.2.3
 * (with this fix for tokens: https://github.com/babel/babel-eslint/pull/632)
 * Source code:
 * foo && bar ?? baz
 */

exports.parse = () => ({
    type: "Program",
    start: 0,
    end: 17,
    loc: {
        start: {
            line: 1,
            column: 0
        },
        end: {
            line: 1,
            column: 17
        }
    },
    range: [0, 17],
    comments: [],
    tokens: [
        {
            type: "Identifier",
            value: "foo",
            start: 0,
            end: 3,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 3
                }
            },
            range: [0, 3]
        },
        {
            type: "Punctuator",
            value: "&&",
            start: 4,
            end: 6,
            loc: {
                start: {
                    line: 1,
                    column: 4
                },
                end: {
                    line: 1,
                    column: 6
                }
            },
            range: [4, 6]
        },
        {
            type: "Identifier",
            value: "bar",
            start: 7,
            end: 10,
            loc: {
                start: {
                    line: 1,
                    column: 7
                },
                end: {
                    line: 1,
                    column: 10
                }
            },
            range: [7, 10]
        },
        {
            type: "Punctuator",
            value: "%%",
            start: 11,
            end: 13,
            loc: {
                start: {
                    line: 1,
                    column: 11
                },
                end: {
                    line: 1,
                    column: 13
                }
            },
            range: [11, 13]
        },
        {
            type: "Identifier",
            value: "baz",
            start: 14,
            end: 17,
            loc: {
                start: {
                    line: 1,
                    column: 14
                },
                end: {
                    line: 1,
                    column: 17
                }
            },
            range: [14, 17]
        }
    ],
    sourceType: "module",
    body: [
        {
            type: "ExpressionStatement",
            start: 0,
            end: 17,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 17
                }
            },
            range: [0, 17],
            expression: {
                type: "LogicalExpression",
                start: 0,
                end: 17,
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 17
                    }
                },
                range: [0, 17],
                left: {
                    type: "LogicalExpression",
                    start: 0,
                    end: 10,
                    loc: {
                        start: {
                            line: 1,
                            column: 0
                        },
                        end: {
                            line: 1,
                            column: 10
                        }
                    },
                    range: [0, 10],
                    left: {
                        type: "Identifier",
                        start: 0,
                        end: 3,
                        loc: {
                            start: {
                                line: 1,
                                column: 0
                            },
                            end: {
                                line: 1,
                                column: 3
                            },
                            identifierName: "foo"
                        },
                        range: [0, 3],
                        name: "foo",
                        _babelType: "Identifier"
                    },
                    operator: "&&",
                    right: {
                        type: "Identifier",
                        start: 7,
                        end: 10,
                        loc: {
                            start: {
                                line: 1,
                                column: 7
                            },
                            end: {
                                line: 1,
                                column: 10
                            },
                            identifierName: "bar"
                        },
                        range: [7, 10],
                        name: "bar",
                        _babelType: "Identifier"
                    },
                    _babelType: "LogicalExpression"
                },
                operator: "%%",
                right: {
                    type: "Identifier",
                    start: 14,
                    end: 17,
                    loc: {
                        start: {
                            line: 1,
                            column: 14
                        },
                        end: {
                            line: 1,
                            column: 17
                        },
                        identifierName: "baz"
                    },
                    range: [14, 17],
                    name: "baz",
                    _babelType: "Identifier"
                },
                _babelType: "LogicalExpression"
            },
            _babelType: "ExpressionStatement"
        }
    ]
});
