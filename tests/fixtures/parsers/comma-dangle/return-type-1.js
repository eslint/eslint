"use strict";

// The AST of the following code:
//
//     function foo(a): {b: boolean,} {}
//

module.exports.parse = () => ({
    type: "Program",
    start: 0,
    end: 33,
    loc: {
        start: {
            line: 1,
            column: 0
        },
        end: {
            line: 1,
            column: 33
        }
    },
    sourceType: "module",
    body: [
        {
            type: "FunctionDeclaration",
            start: 0,
            end: 33,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 33
                }
            },
            id: {
                type: "Identifier",
                start: 9,
                end: 12,
                loc: {
                    start: {
                        line: 1,
                        column: 9
                    },
                    end: {
                        line: 1,
                        column: 12
                    }
                },
                name: "foo",
                range: [
                    9,
                    12
                ],
                _babelType: "Identifier"
            },
            generator: false,
            expression: false,
            async: false,
            params: [
                {
                    type: "Identifier",
                    start: 13,
                    end: 14,
                    loc: {
                        start: {
                            line: 1,
                            column: 13
                        },
                        end: {
                            line: 1,
                            column: 14
                        }
                    },
                    name: "a",
                    range: [
                        13,
                        14
                    ],
                    _babelType: "Identifier"
                }
            ],
            returnType: {
                type: "TypeAnnotation",
                start: 15,
                end: 30,
                loc: {
                    start: {
                        line: 1,
                        column: 15
                    },
                    end: {
                        line: 1,
                        column: 30
                    }
                },
                typeAnnotation: {
                    type: "ObjectTypeAnnotation",
                    start: 17,
                    end: 30,
                    loc: {
                        start: {
                            line: 1,
                            column: 17
                        },
                        end: {
                            line: 1,
                            column: 30
                        }
                    },
                    callProperties: [],
                    properties: [
                        {
                            type: "ObjectTypeProperty",
                            start: 18,
                            end: 29,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 18
                                },
                                end: {
                                    line: 1,
                                    column: 29
                                }
                            },
                            value: {
                                type: "BooleanTypeAnnotation",
                                start: 21,
                                end: 28,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 21
                                    },
                                    end: {
                                        line: 1,
                                        column: 28
                                    }
                                },
                                range: [
                                    21,
                                    28
                                ],
                                _babelType: "BooleanTypeAnnotation"
                            },
                            optional: false,
                            range: [
                                18,
                                29
                            ],
                            _babelType: "ObjectTypeProperty"
                        }
                    ],
                    indexers: [],
                    range: [
                        17,
                        30
                    ],
                    _babelType: "ObjectTypeAnnotation"
                },
                range: [
                    15,
                    30
                ],
                _babelType: "TypeAnnotation"
            },
            body: {
                type: "BlockStatement",
                start: 31,
                end: 33,
                loc: {
                    start: {
                        line: 1,
                        column: 31
                    },
                    end: {
                        line: 1,
                        column: 33
                    }
                },
                body: [],
                range: [
                    31,
                    33
                ],
                _babelType: "BlockStatement"
            },
            range: [
                0,
                33
            ],
            _babelType: "FunctionDeclaration"
        }
    ],
    tokens: [
        {
            type: "Keyword",
            value: "function",
            start: 0,
            end: 8,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 8
                }
            },
            range: [
                0,
                8
            ]
        },
        {
            type: "Identifier",
            value: "foo",
            start: 9,
            end: 12,
            loc: {
                start: {
                    line: 1,
                    column: 9
                },
                end: {
                    line: 1,
                    column: 12
                }
            },
            range: [
                9,
                12
            ]
        },
        {
            type: "Punctuator",
            value: "(",
            start: 12,
            end: 13,
            loc: {
                start: {
                    line: 1,
                    column: 12
                },
                end: {
                    line: 1,
                    column: 13
                }
            },
            range: [
                12,
                13
            ]
        },
        {
            type: "Identifier",
            value: "a",
            start: 13,
            end: 14,
            loc: {
                start: {
                    line: 1,
                    column: 13
                },
                end: {
                    line: 1,
                    column: 14
                }
            },
            range: [
                13,
                14
            ]
        },
        {
            type: "Punctuator",
            value: ")",
            start: 14,
            end: 15,
            loc: {
                start: {
                    line: 1,
                    column: 14
                },
                end: {
                    line: 1,
                    column: 15
                }
            },
            range: [
                14,
                15
            ]
        },
        {
            type: "Punctuator",
            value: ":",
            start: 15,
            end: 16,
            loc: {
                start: {
                    line: 1,
                    column: 15
                },
                end: {
                    line: 1,
                    column: 16
                }
            },
            range: [
                15,
                16
            ]
        },
        {
            type: "Punctuator",
            value: "{",
            start: 17,
            end: 18,
            loc: {
                start: {
                    line: 1,
                    column: 17
                },
                end: {
                    line: 1,
                    column: 18
                }
            },
            range: [
                17,
                18
            ]
        },
        {
            type: "Identifier",
            value: "b",
            start: 18,
            end: 19,
            loc: {
                start: {
                    line: 1,
                    column: 18
                },
                end: {
                    line: 1,
                    column: 19
                }
            },
            range: [
                18,
                19
            ]
        },
        {
            type: "Punctuator",
            value: ":",
            start: 19,
            end: 20,
            loc: {
                start: {
                    line: 1,
                    column: 19
                },
                end: {
                    line: 1,
                    column: 20
                }
            },
            range: [
                19,
                20
            ]
        },
        {
            type: "Identifier",
            value: "boolean",
            start: 21,
            end: 28,
            loc: {
                start: {
                    line: 1,
                    column: 21
                },
                end: {
                    line: 1,
                    column: 28
                }
            },
            range: [
                21,
                28
            ]
        },
        {
            type: "Punctuator",
            value: ",",
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
            type: "Punctuator",
            value: "}",
            start: 29,
            end: 30,
            loc: {
                start: {
                    line: 1,
                    column: 29
                },
                end: {
                    line: 1,
                    column: 30
                }
            },
            range: [
                29,
                30
            ]
        },
        {
            type: "Punctuator",
            value: "{",
            start: 31,
            end: 32,
            loc: {
                start: {
                    line: 1,
                    column: 31
                },
                end: {
                    line: 1,
                    column: 32
                }
            },
            range: [
                31,
                32
            ]
        },
        {
            type: "Punctuator",
            value: "}",
            start: 32,
            end: 33,
            loc: {
                start: {
                    line: 1,
                    column: 32
                },
                end: {
                    line: 1,
                    column: 33
                }
            },
            range: [
                32,
                33
            ]
        },
        {
            type: {
                label: "eof",
                beforeExpr: false,
                startsExpr: false,
                rightAssociative: false,
                isLoop: false,
                isAssign: false,
                prefix: false,
                postfix: false,
                binop: null,
                updateContext: null
            },
            start: 33,
            end: 33,
            loc: {
                start: {
                    line: 1,
                    column: 33
                },
                end: {
                    line: 1,
                    column: 33
                }
            },
            range: [
                33,
                33
            ]
        }
    ],
    comments: [],
    range: [
        0,
        33
    ],
    _paths: [
        {
            contexts: [],
            parent: "[Circular ~]",
            data: {},
            shouldSkip: false,
            shouldStop: false,
            removed: false,
            opts: {
                noScope: true,
                enter: [
                    null
                ],
                exit: [
                    null
                ],
                _exploded: true,
                _verified: true
            },
            skipKeys: {},
            parentPath: null,
            context: {
                queue: null,
                opts: {
                    noScope: true,
                    enter: [
                        null
                    ],
                    exit: [
                        null
                    ],
                    _exploded: true,
                    _verified: true
                }
            },
            container: [
                {
                    type: "FunctionDeclaration",
                    start: 0,
                    end: 33,
                    loc: {
                        start: {
                            line: 1,
                            column: 0
                        },
                        end: {
                            line: 1,
                            column: 33
                        }
                    },
                    id: {
                        type: "Identifier",
                        start: 9,
                        end: 12,
                        loc: {
                            start: {
                                line: 1,
                                column: 9
                            },
                            end: {
                                line: 1,
                                column: 12
                            }
                        },
                        name: "foo",
                        range: [
                            9,
                            12
                        ],
                        _babelType: "Identifier"
                    },
                    generator: false,
                    expression: false,
                    async: false,
                    params: [
                        {
                            type: "Identifier",
                            start: 13,
                            end: 14,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 13
                                },
                                end: {
                                    line: 1,
                                    column: 14
                                }
                            },
                            name: "a",
                            range: [
                                13,
                                14
                            ],
                            _babelType: "Identifier"
                        }
                    ],
                    returnType: {
                        type: "TypeAnnotation",
                        start: 15,
                        end: 30,
                        loc: {
                            start: {
                                line: 1,
                                column: 15
                            },
                            end: {
                                line: 1,
                                column: 30
                            }
                        },
                        typeAnnotation: {
                            type: "ObjectTypeAnnotation",
                            start: 17,
                            end: 30,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 17
                                },
                                end: {
                                    line: 1,
                                    column: 30
                                }
                            },
                            callProperties: [],
                            properties: [
                                {
                                    type: "ObjectTypeProperty",
                                    start: 18,
                                    end: 29,
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 18
                                        },
                                        end: {
                                            line: 1,
                                            column: 29
                                        }
                                    },
                                    value: {
                                        type: "BooleanTypeAnnotation",
                                        start: 21,
                                        end: 28,
                                        loc: {
                                            start: {
                                                line: 1,
                                                column: 21
                                            },
                                            end: {
                                                line: 1,
                                                column: 28
                                            }
                                        },
                                        range: [
                                            21,
                                            28
                                        ],
                                        _babelType: "BooleanTypeAnnotation"
                                    },
                                    optional: false,
                                    range: [
                                        18,
                                        29
                                    ],
                                    _babelType: "ObjectTypeProperty"
                                }
                            ],
                            indexers: [],
                            range: [
                                17,
                                30
                            ],
                            _babelType: "ObjectTypeAnnotation"
                        },
                        range: [
                            15,
                            30
                        ],
                        _babelType: "TypeAnnotation"
                    },
                    body: {
                        type: "BlockStatement",
                        start: 31,
                        end: 33,
                        loc: {
                            start: {
                                line: 1,
                                column: 31
                            },
                            end: {
                                line: 1,
                                column: 33
                            }
                        },
                        body: [],
                        range: [
                            31,
                            33
                        ],
                        _babelType: "BlockStatement"
                    },
                    range: [
                        0,
                        33
                    ],
                    _babelType: "FunctionDeclaration"
                }
            ],
            listKey: "body",
            inList: true,
            parentKey: "body",
            key: 0,
            node: {
                type: "FunctionDeclaration",
                start: 0,
                end: 33,
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 33
                    }
                },
                id: {
                    type: "Identifier",
                    start: 9,
                    end: 12,
                    loc: {
                        start: {
                            line: 1,
                            column: 9
                        },
                        end: {
                            line: 1,
                            column: 12
                        }
                    },
                    name: "foo",
                    range: [
                        9,
                        12
                    ],
                    _babelType: "Identifier"
                },
                generator: false,
                expression: false,
                async: false,
                params: [
                    {
                        type: "Identifier",
                        start: 13,
                        end: 14,
                        loc: {
                            start: {
                                line: 1,
                                column: 13
                            },
                            end: {
                                line: 1,
                                column: 14
                            }
                        },
                        name: "a",
                        range: [
                            13,
                            14
                        ],
                        _babelType: "Identifier"
                    }
                ],
                returnType: {
                    type: "TypeAnnotation",
                    start: 15,
                    end: 30,
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 30
                        }
                    },
                    typeAnnotation: {
                        type: "ObjectTypeAnnotation",
                        start: 17,
                        end: 30,
                        loc: {
                            start: {
                                line: 1,
                                column: 17
                            },
                            end: {
                                line: 1,
                                column: 30
                            }
                        },
                        callProperties: [],
                        properties: [
                            {
                                type: "ObjectTypeProperty",
                                start: 18,
                                end: 29,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 18
                                    },
                                    end: {
                                        line: 1,
                                        column: 29
                                    }
                                },
                                value: {
                                    type: "BooleanTypeAnnotation",
                                    start: 21,
                                    end: 28,
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 21
                                        },
                                        end: {
                                            line: 1,
                                            column: 28
                                        }
                                    },
                                    range: [
                                        21,
                                        28
                                    ],
                                    _babelType: "BooleanTypeAnnotation"
                                },
                                optional: false,
                                range: [
                                    18,
                                    29
                                ],
                                _babelType: "ObjectTypeProperty"
                            }
                        ],
                        indexers: [],
                        range: [
                            17,
                            30
                        ],
                        _babelType: "ObjectTypeAnnotation"
                    },
                    range: [
                        15,
                        30
                    ],
                    _babelType: "TypeAnnotation"
                },
                body: {
                    type: "BlockStatement",
                    start: 31,
                    end: 33,
                    loc: {
                        start: {
                            line: 1,
                            column: 31
                        },
                        end: {
                            line: 1,
                            column: 33
                        }
                    },
                    body: [],
                    range: [
                        31,
                        33
                    ],
                    _babelType: "BlockStatement"
                },
                range: [
                    0,
                    33
                ],
                _babelType: "FunctionDeclaration"
            },
            scope: null,
            type: "FunctionDeclaration",
            typeAnnotation: null
        }
    ]
});
