"use strict";

/**
 * Parsed on astexplorer.net using @typescript-eslint/parser@2.6.1
 *
 * Source:
 */
// const x = aaaa<
//   test
// >/*
// test
// */`foo`

exports.parse = () => ({
    type: "Program",
    body: [
        {
            type: "VariableDeclaration",
            declarations: [
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "x",
                        range: [6, 7],
                        loc: {
                            start: {
                                line: 1,
                                column: 6
                            },
                            end: {
                                line: 1,
                                column: 7
                            }
                        }
                    },
                    init: {
                        type: "TaggedTemplateExpression",
                        typeParameters: {
                            type: "TSTypeParameterInstantiation",
                            range: [14, 24],
                            loc: {
                                start: {
                                    line: 1,
                                    column: 14
                                },
                                end: {
                                    line: 3,
                                    column: 1
                                }
                            },
                            params: [
                                {
                                    type: "TSTypeReference",
                                    typeName: {
                                        type: "Identifier",
                                        name: "test",
                                        range: [18, 22],
                                        loc: {
                                            start: {
                                                line: 2,
                                                column: 2
                                            },
                                            end: {
                                                line: 2,
                                                column: 6
                                            }
                                        }
                                    },
                                    range: [18, 22],
                                    loc: {
                                        start: {
                                            line: 2,
                                            column: 2
                                        },
                                        end: {
                                            line: 2,
                                            column: 6
                                        }
                                    }
                                }
                            ]
                        },
                        tag: {
                            type: "Identifier",
                            name: "aaaa",
                            range: [10, 14],
                            loc: {
                                start: {
                                    line: 1,
                                    column: 10
                                },
                                end: {
                                    line: 1,
                                    column: 14
                                }
                            }
                        },
                        quasi: {
                            type: "TemplateLiteral",
                            quasis: [
                                {
                                    type: "TemplateElement",
                                    value: {
                                        raw: "foo",
                                        cooked: "foo"
                                    },
                                    tail: true,
                                    range: [34, 39],
                                    loc: {
                                        start: {
                                            line: 5,
                                            column: 2
                                        },
                                        end: {
                                            line: 5,
                                            column: 7
                                        }
                                    }
                                }
                            ],
                            expressions: [],
                            range: [34, 39],
                            loc: {
                                start: {
                                    line: 5,
                                    column: 2
                                },
                                end: {
                                    line: 5,
                                    column: 7
                                }
                            }
                        },
                        range: [10, 39],
                        loc: {
                            start: {
                                line: 1,
                                column: 10
                            },
                            end: {
                                line: 5,
                                column: 7
                            }
                        }
                    },
                    range: [6, 39],
                    loc: {
                        start: {
                            line: 1,
                            column: 6
                        },
                        end: {
                            line: 5,
                            column: 7
                        }
                    }
                }
            ],
            kind: "const",
            range: [0, 39],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 5,
                    column: 7
                }
            }
        }
    ],
    sourceType: "module",
    range: [0, 39],
    loc: {
        start: {
            line: 1,
            column: 0
        },
        end: {
            line: 5,
            column: 7
        }
    },
    tokens: [
        {
            type: "Keyword",
            value: "const",
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
            value: "x",
            range: [6, 7],
            loc: {
                start: {
                    line: 1,
                    column: 6
                },
                end: {
                    line: 1,
                    column: 7
                }
            }
        },
        {
            type: "Punctuator",
            value: "=",
            range: [8, 9],
            loc: {
                start: {
                    line: 1,
                    column: 8
                },
                end: {
                    line: 1,
                    column: 9
                }
            }
        },
        {
            type: "Identifier",
            value: "aaaa",
            range: [10, 14],
            loc: {
                start: {
                    line: 1,
                    column: 10
                },
                end: {
                    line: 1,
                    column: 14
                }
            }
        },
        {
            type: "Punctuator",
            value: "<",
            range: [14, 15],
            loc: {
                start: {
                    line: 1,
                    column: 14
                },
                end: {
                    line: 1,
                    column: 15
                }
            }
        },
        {
            type: "Identifier",
            value: "test",
            range: [18, 22],
            loc: {
                start: {
                    line: 2,
                    column: 2
                },
                end: {
                    line: 2,
                    column: 6
                }
            }
        },
        {
            type: "Punctuator",
            value: ">",
            range: [23, 24],
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
        },
        {
            type: "Template",
            value: "`foo`",
            range: [34, 39],
            loc: {
                start: {
                    line: 5,
                    column: 2
                },
                end: {
                    line: 5,
                    column: 7
                }
            }
        }
    ],
    comments: [
        {
            type: "Block",
            value: "\ntest\n",
            range: [24, 34],
            loc: {
                start: {
                    line: 3,
                    column: 1
                },
                end: {
                    line: 5,
                    column: 2
                }
            }
        }
    ]
});
