"use strict";

/**
 * Parser: babel-eslint v7.2.1
 * Source code:
 * type TransformFunction = (el: ASTElement, code: string) => string;
 */

exports.parse = () => ({
    type: "Program",
    start: 0,
    end: 66,
    loc: {
        start: {
            line: 1,
            column: 0
        },
        end: {
            line: 1,
            column: 66
        }
    },
    comments: [],
    tokens: [
        {
            type: "Identifier",
            value: "type",
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
            range: [
                0,
                4
            ]
        },
        {
            type: "Identifier",
            value: "TransformFunction",
            start: 5,
            end: 22,
            loc: {
                start: {
                    line: 1,
                    column: 5
                },
                end: {
                    line: 1,
                    column: 22
                }
            },
            range: [
                5,
                22
            ]
        },
        {
            type: "Punctuator",
            value: "=",
            start: 23,
            end: 24,
            loc: {
                start: {
                    line: 1,
                    column: 23
                },
                end: {
                    line: 1,
                    column: 24
                }
            },
            range: [
                23,
                24
            ]
        },
        {
            type: "Punctuator",
            value: "(",
            start: 25,
            end: 26,
            loc: {
                start: {
                    line: 1,
                    column: 25
                },
                end: {
                    line: 1,
                    column: 26
                }
            },
            range: [
                25,
                26
            ]
        },
        {
            type: "Identifier",
            value: "el",
            start: 26,
            end: 28,
            loc: {
                start: {
                    line: 1,
                    column: 26
                },
                end: {
                    line: 1,
                    column: 28
                }
            },
            range: [
                26,
                28
            ]
        },
        {
            type: "Punctuator",
            value: ":",
            start: 28,
            end: 29,
            loc: {
                start: {
                    line: 1,
                    column: 28
                },
                end: {
                    line: 1,
                    column: 29
                }
            },
            range: [
                28,
                29
            ]
        },
        {
            type: "Identifier",
            value: "ASTElement",
            start: 30,
            end: 40,
            loc: {
                start: {
                    line: 1,
                    column: 30
                },
                end: {
                    line: 1,
                    column: 40
                }
            },
            range: [
                30,
                40
            ]
        },
        {
            type: "Punctuator",
            value: ",",
            start: 40,
            end: 41,
            loc: {
                start: {
                    line: 1,
                    column: 40
                },
                end: {
                    line: 1,
                    column: 41
                }
            },
            range: [
                40,
                41
            ]
        },
        {
            type: "Identifier",
            value: "code",
            start: 42,
            end: 46,
            loc: {
                start: {
                    line: 1,
                    column: 42
                },
                end: {
                    line: 1,
                    column: 46
                }
            },
            range: [
                42,
                46
            ]
        },
        {
            type: "Punctuator",
            value: ":",
            start: 46,
            end: 47,
            loc: {
                start: {
                    line: 1,
                    column: 46
                },
                end: {
                    line: 1,
                    column: 47
                }
            },
            range: [
                46,
                47
            ]
        },
        {
            type: "Identifier",
            value: "string",
            start: 48,
            end: 54,
            loc: {
                start: {
                    line: 1,
                    column: 48
                },
                end: {
                    line: 1,
                    column: 54
                }
            },
            range: [
                48,
                54
            ]
        },
        {
            type: "Punctuator",
            value: ")",
            start: 54,
            end: 55,
            loc: {
                start: {
                    line: 1,
                    column: 54
                },
                end: {
                    line: 1,
                    column: 55
                }
            },
            range: [
                54,
                55
            ]
        },
        {
            type: "Punctuator",
            value: "=>",
            start: 56,
            end: 58,
            loc: {
                start: {
                    line: 1,
                    column: 56
                },
                end: {
                    line: 1,
                    column: 58
                }
            },
            range: [
                56,
                58
            ]
        },
        {
            type: "Identifier",
            value: "string",
            start: 59,
            end: 65,
            loc: {
                start: {
                    line: 1,
                    column: 59
                },
                end: {
                    line: 1,
                    column: 65
                }
            },
            range: [
                59,
                65
            ]
        },
        {
            type: "Punctuator",
            value: ";",
            start: 65,
            end: 66,
            loc: {
                start: {
                    line: 1,
                    column: 65
                },
                end: {
                    line: 1,
                    column: 66
                }
            },
            range: [
                65,
                66
            ]
        }
    ],
    range: [
        0,
        66
    ],
    sourceType: "module",
    body: [
        {
            type: "TypeAlias",
            start: 0,
            end: 66,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 66
                }
            },
            id: {
                type: "Identifier",
                start: 5,
                end: 22,
                loc: {
                    start: {
                        line: 1,
                        column: 5
                    },
                    end: {
                        line: 1,
                        column: 22
                    },
                    identifierName: "TransformFunction"
                },
                name: "TransformFunction",
                range: [
                    5,
                    22
                ],
                _babelType: "Identifier"
            },
            typeParameters: null,
            right: {
                type: "FunctionTypeAnnotation",
                start: 25,
                end: 65,
                loc: {
                    start: {
                        line: 1,
                        column: 25
                    },
                    end: {
                        line: 1,
                        column: 65
                    }
                },
                params: [
                    {
                        type: "FunctionTypeParam",
                        start: 26,
                        end: 40,
                        loc: {
                            start: {
                                line: 1,
                                column: 26
                            },
                            end: {
                                line: 1,
                                column: 40
                            }
                        },
                        optional: false,
                        typeAnnotation: {
                            type: "GenericTypeAnnotation",
                            start: 30,
                            end: 40,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 30
                                },
                                end: {
                                    line: 1,
                                    column: 40
                                }
                            },
                            typeParameters: null,
                            id: {
                                type: "Identifier",
                                start: 30,
                                end: 40,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 30
                                    },
                                    end: {
                                        line: 1,
                                        column: 40
                                    },
                                    identifierName: "ASTElement"
                                },
                                name: "ASTElement",
                                range: [
                                    30,
                                    40
                                ],
                                _babelType: "Identifier"
                            },
                            range: [
                                30,
                                40
                            ],
                            _babelType: "GenericTypeAnnotation"
                        },
                        range: [
                            26,
                            40
                        ],
                        _babelType: "FunctionTypeParam"
                    },
                    {
                        type: "FunctionTypeParam",
                        start: 42,
                        end: 54,
                        loc: {
                            start: {
                                line: 1,
                                column: 42
                            },
                            end: {
                                line: 1,
                                column: 54
                            }
                        },
                        optional: false,
                        typeAnnotation: {
                            type: "StringTypeAnnotation",
                            start: 48,
                            end: 54,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 48
                                },
                                end: {
                                    line: 1,
                                    column: 54
                                }
                            },
                            range: [
                                48,
                                54
                            ],
                            _babelType: "StringTypeAnnotation"
                        },
                        range: [
                            42,
                            54
                        ],
                        _babelType: "FunctionTypeParam"
                    }
                ],
                rest: null,
                returnType: {
                    type: "StringTypeAnnotation",
                    start: 59,
                    end: 65,
                    loc: {
                        start: {
                            line: 1,
                            column: 59
                        },
                        end: {
                            line: 1,
                            column: 65
                        }
                    },
                    range: [
                        59,
                        65
                    ],
                    _babelType: "StringTypeAnnotation"
                },
                typeParameters: null,
                range: [
                    25,
                    65
                ],
                _babelType: "FunctionTypeAnnotation"
            },
            range: [
                0,
                66
            ],
            _babelType: "TypeAlias"
        }
    ]
});
