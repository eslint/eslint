/**
 * The output AST has been modified to represent an unknown operator
 * (replaced ?? with %%)
 *
 * Parser: babel-eslint v8.2.3
 * (with this fix for tokens: https://github.com/babel/babel-eslint/pull/632)
 * Source code:
 * null ?? 'foo'
 */

exports.parse = () => ({
    type: "Program",
    start: 0,
    end: 13,
    loc: {
        start: {
            line: 1,
            column: 0
        },
        end: {
            line: 1,
            column: 13
        }
    },
    range: [0, 13],
    comments: [],
    tokens: [
        {
            type: "Null",
            value: "null",
            start: 0,
            end: 4,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 4
                }
            },
            range: [0, 4]
        },
        {
            type: "Punctuator",
            value: "%%",
            start: 5,
            end: 7,
            loc: {
                start: {
                    line: 1,
                    column: 5
                },
                end: {
                    line: 1,
                    column: 7
                }
            },
            range: [5, 7]
        },
        {
            type: "String",
            value: "'foo'",
            start: 8,
            end: 13,
            loc: {
                start: {
                    line: 1,
                    column: 8
                },
                end: {
                    line: 1,
                    column: 13
                }
            },
            range: [8, 13]
        }
    ],
    sourceType: "script",
    body: [
        {
            type: "ExpressionStatement",
            start: 0,
            end: 13,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 13
                }
            },
            range: [0, 13],
            expression: {
                type: "LogicalExpression",
                start: 0,
                end: 13,
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 13
                    }
                },
                range: [0, 13],
                left: {
                    type: "Literal",
                    start: 0,
                    end: 4,
                    loc: {
                        start: {
                            line: 1,
                            column: 0
                        },
                        end: {
                            line: 1,
                            column: 4
                        }
                    },
                    range: [0, 4],
                    value: null,
                    raw: "null",
                    _babelType: "Literal"
                },
                operator: "%%",
                right: {
                    type: "Literal",
                    start: 8,
                    end: 13,
                    loc: {
                        start: {
                            line: 1,
                            column: 8
                        },
                        end: {
                            line: 1,
                            column: 13
                        }
                    },
                    range: [8, 13],
                    value: "foo",
                    raw: "'foo'",
                    _babelType: "Literal"
                },
                _babelType: "LogicalExpression"
            },
            _babelType: "ExpressionStatement"
        }
    ]
});
