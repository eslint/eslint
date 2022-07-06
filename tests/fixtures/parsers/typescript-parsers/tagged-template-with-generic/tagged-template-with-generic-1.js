"use strict";

/*
 * Parsed on astexplorer.net using @typescript-eslint/parser@1.4.2
 *
 * Source:
 * tag<generic>`
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
                    range: [3, 12],
                    loc: {
                        start: {
                            line: 1,
                            column: 3
                        },
                        end: {
                            line: 1,
                            column: 12
                        }
                    },
                    params: [
                        {
                            type: "TSTypeReference",
                            typeName: {
                                type: "Identifier",
                                name: "generic",
                                range: [4, 11],
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 4
                                    },
                                    end: {
                                        line: 1,
                                        column: 11
                                    }
                                }
                            },
                            range: [4, 11],
                            loc: {
                                start: {
                                    line: 1,
                                    column: 4
                                },
                                end: {
                                    line: 1,
                                    column: 11
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
                            range: [12, 29],
                            loc: {
                                start: {
                                    line: 1,
                                    column: 12
                                },
                                end: {
                                    line: 3,
                                    column: 1
                                }
                            }
                        }
                    ],
                    expressions: [],
                    range: [12, 29],
                    loc: {
                        start: {
                            line: 1,
                            column: 12
                        },
                        end: {
                            line: 3,
                            column: 1
                        }
                    }
                },
                range: [0, 29],
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
            },
            range: [0, 30],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 3,
                    column: 2
                }
            }
        }
    ],
    sourceType: "script",
    range: [0, 30],
    loc: {
        start: {
            line: 1,
            column: 0
        },
        end: {
            line: 3,
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
            range: [4, 11],
            loc: {
                start: {
                    line: 1,
                    column: 4
                },
                end: {
                    line: 1,
                    column: 11
                }
            }
        },
        {
            type: "Punctuator",
            value: ">",
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
        },
        {
            type: "Template",
            value: "`\n    multiline\n`",
            range: [12, 29],
            loc: {
                start: {
                    line: 1,
                    column: 12
                },
                end: {
                    line: 3,
                    column: 1
                }
            }
        },
        {
            type: "Punctuator",
            value: ";",
            range: [29, 30],
            loc: {
                start: {
                    line: 3,
                    column: 1
                },
                end: {
                    line: 3,
                    column: 2
                }
            }
        }
    ],
    comments: []
});
