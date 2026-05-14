"use strict";

/**
 * Parser: @typescript-eslint/parser v2.6.1
 * Source code:
 * await foo();
 */

exports.parse = () => ({
    type: "Program",
    body: [
        {
            type: "ExpressionStatement",
            expression: {
                type: "AwaitExpression",
                argument: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: "foo",
                        range: [6, 9],
                        loc: {
                            start: {
                                line: 1,
                                column: 6
                            },
                            end: {
                                line: 1,
                                column: 9
                            }
                        }
                    },
                    arguments: [],
                    optional: false,
                    range: [6, 11],
                    loc: {
                        start: {
                            line: 1,
                            column: 6
                        },
                        end: {
                            line: 1,
                            column: 11
                        }
                    }
                },
                range: [0, 11],
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            range: [0, 12],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 12
                }
            }
        }
    ],
    sourceType: "module",
    range: [0, 12],
    loc: {
        start: {
            line: 1,
            column: 0
        },
        end: {
            line: 1,
            column: 12
        }
    },
    tokens: [
        {
            type: "Identifier",
            value: "await",
            range: [0, 5],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 5
                }
            }
        },
        {
            type: "Identifier",
            value: "foo",
            range: [6, 9],
            loc: {
                start: {
                    line: 1,
                    column: 6
                },
                end: {
                    line: 1,
                    column: 9
                }
            }
        },
        {
            type: "Punctuator",
            value: "(",
            range: [9, 10],
            loc: {
                start: {
                    line: 1,
                    column: 9
                },
                end: {
                    line: 1,
                    column: 10
                }
            }
        },
        {
            type: "Punctuator",
            value: ")",
            range: [10, 11],
            loc: {
                start: {
                    line: 1,
                    column: 10
                },
                end: {
                    line: 1,
                    column: 11
                }
            }
        },
        {
            type: "Punctuator",
            value: ";",
            range: [11, 12],
            loc: {
                start: {
                    line: 1,
                    column: 11
                },
                end: {
                    line: 1,
                    column: 12
                }
            }
        }
    ],
    comments: []
});
