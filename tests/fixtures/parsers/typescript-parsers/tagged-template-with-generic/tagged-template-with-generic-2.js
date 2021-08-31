"use strict";

/*
 * Parsed on astexplorer.net using @typescript-eslint/parser@1.4.2
 *
 * Source:
 * tag<
 *   generic
 * >`
 *     multiline
 * `;
 */

exports.parse = () => ({
    type: "Program",
    body: [
        {
            type: "ExpressionStatement",
            expression: {
                type: "TaggedTemplateExpression",
                typeParameters: {
                    type: "TSTypeParameterInstantiation",
                    range: [3, 16],
                    loc: {
                        start: {
                            line: 1,
                            column: 3
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
                                name: "generic",
                                range: [7, 14],
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
                            range: [7, 14],
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
                        }
                    ]
                },
                tag: {
                    type: "Identifier",
                    name: "tag",
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
                quasi: {
                    type: "TemplateLiteral",
                    quasis: [
                        {
                            type: "TemplateElement",
                            value: {
                                raw: "\n    multiline\n",
                                cooked: "\n    multiline\n"
                            },
                            tail: true,
                            range: [16, 33],
                            loc: {
                                start: {
                                    line: 3,
                                    column: 1
                                },
                                end: {
                                    line: 5,
                                    column: 1
                                }
                            }
                        }
                    ],
                    expressions: [],
                    range: [16, 33],
                    loc: {
                        start: {
                            line: 3,
                            column: 1
                        },
                        end: {
                            line: 5,
                            column: 1
                        }
                    }
                },
                range: [0, 33],
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 5,
                        column: 1
                    }
                }
            },
            range: [0, 34],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 5,
                    column: 2
                }
            }
        }
    ],
    sourceType: "script",
    range: [0, 34],
    loc: {
        start: {
            line: 1,
            column: 0
        },
        end: {
            line: 5,
            column: 2
        }
    },
    tokens: [
        {
            type: "Identifier",
            value: "tag",
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
            type: "Punctuator",
            value: "<",
            range: [3, 4],
            loc: {
                start: {
                    line: 1,
                    column: 3
                },
                end: {
                    line: 1,
                    column: 4
                }
            }
        },
        {
            type: "Identifier",
            value: "generic",
            range: [7, 14],
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
            value: ">",
            range: [15, 16],
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
            value: "`\n    multiline\n`",
            range: [16, 33],
            loc: {
                start: {
                    line: 3,
                    column: 1
                },
                end: {
                    line: 5,
                    column: 1
                }
            }
        },
        {
            type: "Punctuator",
            value: ";",
            range: [33, 34],
            loc: {
                start: {
                    line: 5,
                    column: 1
                },
                end: {
                    line: 5,
                    column: 2
                }
            }
        }
    ],
    comments: []
});
