"use strict";

// The AST of the following code:
//
//     function foo({a,}: {a: string}) {}
//

module.exports.parse = () => ({
    type: "Program",
    start: 0,
    end: 34,
    loc: {
        start: {
            line: 1,
            column: 0
        },
        end: {
            line: 1,
            column: 34
        }
    },
    sourceType: "module",
    body: [
        {
            type: "FunctionDeclaration",
            start: 0,
            end: 34,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 34
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
                    type: "ObjectPattern",
                    start: 13,
                    end: 30,
                    loc: {
                        start: {
                            line: 1,
                            column: 13
                        },
                        end: {
                            line: 1,
                            column: 30
                        }
                    },
                    properties: [
                        {
                            type: "Property",
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
                            method: false,
                            shorthand: true,
                            computed: false,
                            key: {
                                type: "Identifier",
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
                                name: "a",
                                range: [
                                    14,
                                    15
                                ],
                                _babelType: "Identifier"
                            },
                            kind: "init",
                            value: {
                                type: "Identifier",
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
                                name: "a",
                                range: [
                                    14,
                                    15
                                ],
                                _babelType: "Identifier"
                            },
                            range: [
                                14,
                                15
                            ],
                            _babelType: "Property"
                        }
                    ],
                    typeAnnotation: {
                        type: "TypeAnnotation",
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
                        typeAnnotation: {
                            type: "ObjectTypeAnnotation",
                            start: 19,
                            end: 30,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 19
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
                                    start: 20,
                                    end: 29,
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 20
                                        },
                                        end: {
                                            line: 1,
                                            column: 29
                                        }
                                    },
                                    value: {
                                        type: "StringTypeAnnotation",
                                        start: 23,
                                        end: 29,
                                        loc: {
                                            start: {
                                                line: 1,
                                                column: 23
                                            },
                                            end: {
                                                line: 1,
                                                column: 29
                                            }
                                        },
                                        range: [
                                            23,
                                            29
                                        ],
                                        _babelType: "StringTypeAnnotation"
                                    },
                                    optional: false,
                                    range: [
                                        20,
                                        29
                                    ],
                                    _babelType: "ObjectTypeProperty"
                                }
                            ],
                            indexers: [],
                            range: [
                                19,
                                30
                            ],
                            _babelType: "ObjectTypeAnnotation"
                        },
                        range: [
                            17,
                            30
                        ],
                        _babelType: "TypeAnnotation"
                    },
                    range: [
                        13,
                        30
                    ],
                    _babelType: "ObjectPattern"
                }
            ],
            body: {
                type: "BlockStatement",
                start: 32,
                end: 34,
                loc: {
                    start: {
                        line: 1,
                        column: 32
                    },
                    end: {
                        line: 1,
                        column: 34
                    }
                },
                body: [],
                range: [
                    32,
                    34
                ],
                _babelType: "BlockStatement"
            },
            range: [
                0,
                34
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
            type: "Punctuator",
            value: "{",
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
            type: "Identifier",
            value: "a",
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
            value: ",",
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
            value: "}",
            start: 16,
            end: 17,
            loc: {
                start: {
                    line: 1,
                    column: 16
                },
                end: {
                    line: 1,
                    column: 17
                }
            },
            range: [
                16,
                17
            ]
        },
        {
            type: "Punctuator",
            value: ":",
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
            type: "Punctuator",
            value: "{",
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
            value: "a",
            start: 20,
            end: 21,
            loc: {
                start: {
                    line: 1,
                    column: 20
                },
                end: {
                    line: 1,
                    column: 21
                }
            },
            range: [
                20,
                21
            ]
        },
        {
            type: "Punctuator",
            value: ":",
            start: 21,
            end: 22,
            loc: {
                start: {
                    line: 1,
                    column: 21
                },
                end: {
                    line: 1,
                    column: 22
                }
            },
            range: [
                21,
                22
            ]
        },
        {
            type: "Identifier",
            value: "string",
            start: 23,
            end: 29,
            loc: {
                start: {
                    line: 1,
                    column: 23
                },
                end: {
                    line: 1,
                    column: 29
                }
            },
            range: [
                23,
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
            value: ")",
            start: 30,
            end: 31,
            loc: {
                start: {
                    line: 1,
                    column: 30
                },
                end: {
                    line: 1,
                    column: 31
                }
            },
            range: [
                30,
                31
            ]
        },
        {
            type: "Punctuator",
            value: "{",
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
            type: "Punctuator",
            value: "}",
            start: 33,
            end: 34,
            loc: {
                start: {
                    line: 1,
                    column: 33
                },
                end: {
                    line: 1,
                    column: 34
                }
            },
            range: [
                33,
                34
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
            start: 34,
            end: 34,
            loc: {
                start: {
                    line: 1,
                    column: 34
                },
                end: {
                    line: 1,
                    column: 34
                }
            },
            range: [
                34,
                34
            ]
        }
    ],
    comments: [],
    range: [
        0,
        34
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
                    end: 34,
                    loc: {
                        start: {
                            line: 1,
                            column: 0
                        },
                        end: {
                            line: 1,
                            column: 34
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
                            type: "ObjectPattern",
                            start: 13,
                            end: 30,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 13
                                },
                                end: {
                                    line: 1,
                                    column: 30
                                }
                            },
                            properties: [
                                {
                                    type: "Property",
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
                                    method: false,
                                    shorthand: true,
                                    computed: false,
                                    key: {
                                        type: "Identifier",
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
                                        name: "a",
                                        range: [
                                            14,
                                            15
                                        ],
                                        _babelType: "Identifier"
                                    },
                                    kind: "init",
                                    value: {
                                        type: "Identifier",
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
                                        name: "a",
                                        range: [
                                            14,
                                            15
                                        ],
                                        _babelType: "Identifier"
                                    },
                                    range: [
                                        14,
                                        15
                                    ],
                                    _babelType: "Property"
                                }
                            ],
                            typeAnnotation: {
                                type: "TypeAnnotation",
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
                                typeAnnotation: {
                                    type: "ObjectTypeAnnotation",
                                    start: 19,
                                    end: 30,
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 19
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
                                            start: 20,
                                            end: 29,
                                            loc: {
                                                start: {
                                                    line: 1,
                                                    column: 20
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 29
                                                }
                                            },
                                            value: {
                                                type: "StringTypeAnnotation",
                                                start: 23,
                                                end: 29,
                                                loc: {
                                                    start: {
                                                        line: 1,
                                                        column: 23
                                                    },
                                                    end: {
                                                        line: 1,
                                                        column: 29
                                                    }
                                                },
                                                range: [
                                                    23,
                                                    29
                                                ],
                                                _babelType: "StringTypeAnnotation"
                                            },
                                            optional: false,
                                            range: [
                                                20,
                                                29
                                            ],
                                            _babelType: "ObjectTypeProperty"
                                        }
                                    ],
                                    indexers: [],
                                    range: [
                                        19,
                                        30
                                    ],
                                    _babelType: "ObjectTypeAnnotation"
                                },
                                range: [
                                    17,
                                    30
                                ],
                                _babelType: "TypeAnnotation"
                            },
                            range: [
                                13,
                                30
                            ],
                            _babelType: "ObjectPattern"
                        }
                    ],
                    body: {
                        type: "BlockStatement",
                        start: 32,
                        end: 34,
                        loc: {
                            start: {
                                line: 1,
                                column: 32
                            },
                            end: {
                                line: 1,
                                column: 34
                            }
                        },
                        body: [],
                        range: [
                            32,
                            34
                        ],
                        _babelType: "BlockStatement"
                    },
                    range: [
                        0,
                        34
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
                end: 34,
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 34
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
                        type: "ObjectPattern",
                        start: 13,
                        end: 30,
                        loc: {
                            start: {
                                line: 1,
                                column: 13
                            },
                            end: {
                                line: 1,
                                column: 30
                            }
                        },
                        properties: [
                            {
                                type: "Property",
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
                                method: false,
                                shorthand: true,
                                computed: false,
                                key: {
                                    type: "Identifier",
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
                                    name: "a",
                                    range: [
                                        14,
                                        15
                                    ],
                                    _babelType: "Identifier"
                                },
                                kind: "init",
                                value: {
                                    type: "Identifier",
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
                                    name: "a",
                                    range: [
                                        14,
                                        15
                                    ],
                                    _babelType: "Identifier"
                                },
                                range: [
                                    14,
                                    15
                                ],
                                _babelType: "Property"
                            }
                        ],
                        typeAnnotation: {
                            type: "TypeAnnotation",
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
                            typeAnnotation: {
                                type: "ObjectTypeAnnotation",
                                start: 19,
                                end: 30,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 19
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
                                        start: 20,
                                        end: 29,
                                        loc: {
                                            start: {
                                                line: 1,
                                                column: 20
                                            },
                                            end: {
                                                line: 1,
                                                column: 29
                                            }
                                        },
                                        value: {
                                            type: "StringTypeAnnotation",
                                            start: 23,
                                            end: 29,
                                            loc: {
                                                start: {
                                                    line: 1,
                                                    column: 23
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 29
                                                }
                                            },
                                            range: [
                                                23,
                                                29
                                            ],
                                            _babelType: "StringTypeAnnotation"
                                        },
                                        optional: false,
                                        range: [
                                            20,
                                            29
                                        ],
                                        _babelType: "ObjectTypeProperty"
                                    }
                                ],
                                indexers: [],
                                range: [
                                    19,
                                    30
                                ],
                                _babelType: "ObjectTypeAnnotation"
                            },
                            range: [
                                17,
                                30
                            ],
                            _babelType: "TypeAnnotation"
                        },
                        range: [
                            13,
                            30
                        ],
                        _babelType: "ObjectPattern"
                    }
                ],
                body: {
                    type: "BlockStatement",
                    start: 32,
                    end: 34,
                    loc: {
                        start: {
                            line: 1,
                            column: 32
                        },
                        end: {
                            line: 1,
                            column: 34
                        }
                    },
                    body: [],
                    range: [
                        32,
                        34
                    ],
                    _babelType: "BlockStatement"
                },
                range: [
                    0,
                    34
                ],
                _babelType: "FunctionDeclaration"
            },
            scope: null,
            type: "FunctionDeclaration",
            typeAnnotation: null
        }
    ]
});
