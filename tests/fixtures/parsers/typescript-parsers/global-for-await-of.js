"use strict";

/**
 * Parser: @typescript-eslint/parser v2.6.1
 * Source code:
for await (let num of asyncIterable) {
  console.log(num);
}
 */

exports.parse = () => ({
    type: "Program",
    body: [
        {
            type: "ForOfStatement",
            left: {
                type: "VariableDeclaration",
                declarations: [
                    {
                        type: "VariableDeclarator",
                        id: {
                            type: "Identifier",
                            name: "num",
                            range: [15, 18],
                            loc: {
                                start: {
                                    line: 1,
                                    column: 15
                                },
                                end: {
                                    line: 1,
                                    column: 18
                                }
                            }
                        },
                        init: null,
                        range: [15, 18],
                        loc: {
                            start: {
                                line: 1,
                                column: 15
                            },
                            end: {
                                line: 1,
                                column: 18
                            }
                        }
                    }
                ],
                kind: "let",
                range: [11, 18],
                loc: {
                    start: {
                        line: 1,
                        column: 11
                    },
                    end: {
                        line: 1,
                        column: 18
                    }
                }
            },
            right: {
                type: "Identifier",
                name: "asyncIterable",
                range: [22, 35],
                loc: {
                    start: {
                        line: 1,
                        column: 22
                    },
                    end: {
                        line: 1,
                        column: 35
                    }
                }
            },
            body: {
                type: "BlockStatement",
                body: [
                    {
                        type: "ExpressionStatement",
                        expression: {
                            type: "CallExpression",
                            callee: {
                                type: "MemberExpression",
                                object: {
                                    type: "Identifier",
                                    name: "console",
                                    range: [41, 48],
                                    loc: {
                                        start: {
                                            line: 2,
                                            column: 2
                                        },
                                        end: {
                                            line: 2,
                                            column: 9
                                        }
                                    }
                                },
                                property: {
                                    type: "Identifier",
                                    name: "log",
                                    range: [49, 52],
                                    loc: {
                                        start: {
                                            line: 2,
                                            column: 10
                                        },
                                        end: {
                                            line: 2,
                                            column: 13
                                        }
                                    }
                                },
                                computed: false,
                                optional: false,
                                range: [41, 52],
                                loc: {
                                    start: {
                                        line: 2,
                                        column: 2
                                    },
                                    end: {
                                        line: 2,
                                        column: 13
                                    }
                                }
                            },
                            arguments: [
                                {
                                    type: "Identifier",
                                    name: "num",
                                    range: [53, 56],
                                    loc: {
                                        start: {
                                            line: 2,
                                            column: 14
                                        },
                                        end: {
                                            line: 2,
                                            column: 17
                                        }
                                    }
                                }
                            ],
                            optional: false,
                            range: [41, 57],
                            loc: {
                                start: {
                                    line: 2,
                                    column: 2
                                },
                                end: {
                                    line: 2,
                                    column: 18
                                }
                            }
                        },
                        range: [41, 58],
                        loc: {
                            start: {
                                line: 2,
                                column: 2
                            },
                            end: {
                                line: 2,
                                column: 19
                            }
                        }
                    }
                ],
                range: [37, 60],
                loc: {
                    start: {
                        line: 1,
                        column: 37
                    },
                    end: {
                        line: 3,
                        column: 1
                    }
                }
            },
            await: true,
            range: [0, 60],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 3,
                    column: 1
                }
            }
        }
    ],
    sourceType: "module",
    range: [0, 60],
    loc: {
        start: {
            line: 1,
            column: 0
        },
        end: {
            line: 3,
            column: 1
        }
    },
    tokens: [
        {
            type: "Keyword",
            value: "for",
            range: [0, 3],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 3
                }
            }
        },
        {
            type: "Identifier",
            value: "await",
            range: [4, 9],
            loc: {
                start: {
                    line: 1,
                    column: 4
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
            type: "Keyword",
            value: "let",
            range: [11, 14],
            loc: {
                start: {
                    line: 1,
                    column: 11
                },
                end: {
                    line: 1,
                    column: 14
                }
            }
        },
        {
            type: "Identifier",
            value: "num",
            range: [15, 18],
            loc: {
                start: {
                    line: 1,
                    column: 15
                },
                end: {
                    line: 1,
                    column: 18
                }
            }
        },
        {
            type: "Identifier",
            value: "of",
            range: [19, 21],
            loc: {
                start: {
                    line: 1,
                    column: 19
                },
                end: {
                    line: 1,
                    column: 21
                }
            }
        },
        {
            type: "Identifier",
            value: "asyncIterable",
            range: [22, 35],
            loc: {
                start: {
                    line: 1,
                    column: 22
                },
                end: {
                    line: 1,
                    column: 35
                }
            }
        },
        {
            type: "Punctuator",
            value: ")",
            range: [35, 36],
            loc: {
                start: {
                    line: 1,
                    column: 35
                },
                end: {
                    line: 1,
                    column: 36
                }
            }
        },
        {
            type: "Punctuator",
            value: "{",
            range: [37, 38],
            loc: {
                start: {
                    line: 1,
                    column: 37
                },
                end: {
                    line: 1,
                    column: 38
                }
            }
        },
        {
            type: "Identifier",
            value: "console",
            range: [41, 48],
            loc: {
                start: {
                    line: 2,
                    column: 2
                },
                end: {
                    line: 2,
                    column: 9
                }
            }
        },
        {
            type: "Punctuator",
            value: ".",
            range: [48, 49],
            loc: {
                start: {
                    line: 2,
                    column: 9
                },
                end: {
                    line: 2,
                    column: 10
                }
            }
        },
        {
            type: "Identifier",
            value: "log",
            range: [49, 52],
            loc: {
                start: {
                    line: 2,
                    column: 10
                },
                end: {
                    line: 2,
                    column: 13
                }
            }
        },
        {
            type: "Punctuator",
            value: "(",
            range: [52, 53],
            loc: {
                start: {
                    line: 2,
                    column: 13
                },
                end: {
                    line: 2,
                    column: 14
                }
            }
        },
        {
            type: "Identifier",
            value: "num",
            range: [53, 56],
            loc: {
                start: {
                    line: 2,
                    column: 14
                },
                end: {
                    line: 2,
                    column: 17
                }
            }
        },
        {
            type: "Punctuator",
            value: ")",
            range: [56, 57],
            loc: {
                start: {
                    line: 2,
                    column: 17
                },
                end: {
                    line: 2,
                    column: 18
                }
            }
        },
        {
            type: "Punctuator",
            value: ";",
            range: [57, 58],
            loc: {
                start: {
                    line: 2,
                    column: 18
                },
                end: {
                    line: 2,
                    column: 19
                }
            }
        },
        {
            type: "Punctuator",
            value: "}",
            range: [59, 60],
            loc: {
                start: {
                    line: 3,
                    column: 0
                },
                end: {
                    line: 3,
                    column: 1
                }
            }
        }
    ],
    comments: []
});
