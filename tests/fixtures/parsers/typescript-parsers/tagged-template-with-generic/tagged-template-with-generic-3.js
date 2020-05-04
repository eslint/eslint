"use strict";

/*
 * Parsed on astexplorer.net using @typescript-eslint/parser@1.4.2
 *
 * Source:
 * tag<
 *   generic
 * >`multiline`;
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
                                raw: "multiline",
                                cooked: "multiline"
                            },
                            tail: true,
                            range: [16, 27],
                            loc: {
                                start: {
                                    line: 3,
                                    column: 1
                                },
                                end: {
                                    line: 3,
                                    column: 12
                                }
                            }
                        }
                    ],
                    expressions: [],
                    range: [16, 27],
                    loc: {
                        start: {
                            line: 3,
                            column: 1
                        },
                        end: {
                            line: 3,
                            column: 12
                        }
                    }
                },
                range: [0, 27],
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 3,
                        column: 12
                    }
                }
            },
            range: [0, 28],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 3,
                    column: 13
                }
            }
        }
    ],
    sourceType: "script",
    range: [0, 28],
    loc: {
        start: {
            line: 1,
            column: 0
        },
        end: {
            line: 3,
            column: 13
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
            value: "`multiline`",
            range: [16, 27],
            loc: {
                start: {
                    line: 3,
                    column: 1
                },
                end: {
                    line: 3,
                    column: 12
                }
            }
        },
        {
            type: "Punctuator",
            value: ";",
            range: [27, 28],
            loc: {
                start: {
                    line: 3,
                    column: 12
                },
                end: {
                    line: 3,
                    column: 13
                }
            }
        }
    ],
    comments: []
});
