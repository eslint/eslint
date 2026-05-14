"use strict";

// The AST from babel-eslint version 5.x, for the following code:
//
//     let { name, ...otherStuff } = obj; otherStuff = {};
//

exports.parse = function() {
    return {
        type: "Program",
        start: 0,
        end: 53,
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 3,
                column: 0
            }
        },
        sourceType: "module",
        body: [
            {
                type: "VariableDeclaration",
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
                declarations: [
                    {
                        type: "VariableDeclarator",
                        start: 4,
                        end: 33,
                        loc: {
                            start: {
                                line: 1,
                                column: 4
                            },
                            end: {
                                line: 1,
                                column: 33
                            }
                        },
                        id: {
                            type: "ObjectPattern",
                            start: 4,
                            end: 27,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 4
                                },
                                end: {
                                    line: 1,
                                    column: 27
                                }
                            },
                            properties: [
                                {
                                    type: "Property",
                                    start: 6,
                                    end: 10,
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 6
                                        },
                                        end: {
                                            line: 1,
                                            column: 10
                                        }
                                    },
                                    method: false,
                                    shorthand: true,
                                    computed: false,
                                    key: {
                                        type: "Identifier",
                                        start: 6,
                                        end: 10,
                                        loc: {
                                            start: {
                                                line: 1,
                                                column: 6
                                            },
                                            end: {
                                                line: 1,
                                                column: 10
                                            }
                                        },
                                        name: "name",
                                        range: [
                                            6,
                                            10
                                        ],
                                        _babelType: "Identifier"
                                    },
                                    kind: "init",
                                    value: {
                                        type: "Identifier",
                                        start: 6,
                                        end: 10,
                                        loc: {
                                            start: {
                                                line: 1,
                                                column: 6
                                            },
                                            end: {
                                                line: 1,
                                                column: 10
                                            }
                                        },
                                        name: "name",
                                        range: [
                                            6,
                                            10
                                        ],
                                        _babelType: "Identifier"
                                    },
                                    range: [
                                        6,
                                        10
                                    ],
                                    _babelType: "Property"
                                },
                                {
                                    type: "SpreadProperty",
                                    start: 12,
                                    end: 25,
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 12
                                        },
                                        end: {
                                            line: 1,
                                            column: 25
                                        }
                                    },
                                    argument: {
                                        type: "Identifier",
                                        start: 15,
                                        end: 25,
                                        loc: {
                                            start: {
                                                line: 1,
                                                column: 15
                                            },
                                            end: {
                                                line: 1,
                                                column: 25
                                            }
                                        },
                                        name: "otherStuff",
                                        range: [
                                            15,
                                            25
                                        ],
                                        _babelType: "Identifier"
                                    },
                                    range: [
                                        12,
                                        25
                                    ],
                                    _babelType: "SpreadProperty",
                                    value: {
                                        type: "Identifier",
                                        start: 15,
                                        end: 25,
                                        loc: {
                                            start: {
                                                line: 1,
                                                column: 15
                                            },
                                            end: {
                                                line: 1,
                                                column: 25
                                            }
                                        },
                                        name: "otherStuff",
                                        range: [
                                            15,
                                            25
                                        ],
                                        _babelType: "Identifier"
                                    },
                                    key: {
                                        type: "Identifier",
                                        start: 15,
                                        end: 25,
                                        loc: {
                                            start: {
                                                line: 1,
                                                column: 15
                                            },
                                            end: {
                                                line: 1,
                                                column: 25
                                            }
                                        },
                                        name: "otherStuff",
                                        range: [
                                            15,
                                            25
                                        ],
                                        _babelType: "Identifier"
                                    }
                                }
                            ],
                            range: [
                                4,
                                27
                            ],
                            _babelType: "ObjectPattern"
                        },
                        init: {
                            type: "Identifier",
                            start: 30,
                            end: 33,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 30
                                },
                                end: {
                                    line: 1,
                                    column: 33
                                }
                            },
                            name: "obj",
                            range: [
                                30,
                                33
                            ],
                            _babelType: "Identifier"
                        },
                        range: [
                            4,
                            33
                        ],
                        _babelType: "VariableDeclarator"
                    }
                ],
                kind: "let",
                range: [
                    0,
                    34
                ],
                _babelType: "VariableDeclaration"
            },
            {
                type: "ExpressionStatement",
                start: 35,
                end: 51,
                loc: {
                    start: {
                        line: 1,
                        column: 35
                    },
                    end: {
                        line: 1,
                        column: 51
                    }
                },
                expression: {
                    type: "AssignmentExpression",
                    start: 35,
                    end: 50,
                    loc: {
                        start: {
                            line: 1,
                            column: 35
                        },
                        end: {
                            line: 1,
                            column: 50
                        }
                    },
                    operator: "=",
                    left: {
                        type: "Identifier",
                        start: 35,
                        end: 45,
                        loc: {
                            start: {
                                line: 1,
                                column: 35
                            },
                            end: {
                                line: 1,
                                column: 45
                            }
                        },
                        name: "otherStuff",
                        range: [
                            35,
                            45
                        ],
                        _babelType: "Identifier"
                    },
                    right: {
                        type: "ObjectExpression",
                        start: 48,
                        end: 50,
                        loc: {
                            start: {
                                line: 1,
                                column: 48
                            },
                            end: {
                                line: 1,
                                column: 50
                            }
                        },
                        properties: [],
                        range: [
                            48,
                            50
                        ],
                        _babelType: "ObjectExpression"
                    },
                    range: [
                        35,
                        50
                    ],
                    _babelType: "AssignmentExpression"
                },
                range: [
                    35,
                    51
                ],
                _babelType: "ExpressionStatement"
            }
        ],
        tokens: [
            {
                type: "Keyword",
                value: "let",
                start: 0,
                end: 3,
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 3
                    }
                },
                range: [
                    0,
                    3
                ]
            },
            {
                type: "Punctuator",
                value: "{",
                start: 4,
                end: 5,
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 5
                    }
                },
                range: [
                    4,
                    5
                ]
            },
            {
                type: "Identifier",
                value: "name",
                start: 6,
                end: 10,
                loc: {
                    start: {
                        line: 1,
                        column: 6
                    },
                    end: {
                        line: 1,
                        column: 10
                    }
                },
                range: [
                    6,
                    10
                ]
            },
            {
                type: "Punctuator",
                value: ",",
                start: 10,
                end: 11,
                loc: {
                    start: {
                        line: 1,
                        column: 10
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                },
                range: [
                    10,
                    11
                ]
            },
            {
                type: "Punctuator",
                value: "...",
                start: 12,
                end: 15,
                loc: {
                    start: {
                        line: 1,
                        column: 12
                    },
                    end: {
                        line: 1,
                        column: 15
                    }
                },
                range: [
                    12,
                    15
                ]
            },
            {
                type: "Identifier",
                value: "otherStuff",
                start: 15,
                end: 25,
                loc: {
                    start: {
                        line: 1,
                        column: 15
                    },
                    end: {
                        line: 1,
                        column: 25
                    }
                },
                range: [
                    15,
                    25
                ]
            },
            {
                type: "Punctuator",
                value: "}",
                start: 26,
                end: 27,
                loc: {
                    start: {
                        line: 1,
                        column: 26
                    },
                    end: {
                        line: 1,
                        column: 27
                    }
                },
                range: [
                    26,
                    27
                ]
            },
            {
                type: "Punctuator",
                value: "=",
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
                value: "obj",
                start: 30,
                end: 33,
                loc: {
                    start: {
                        line: 1,
                        column: 30
                    },
                    end: {
                        line: 1,
                        column: 33
                    }
                },
                range: [
                    30,
                    33
                ]
            },
            {
                type: "Punctuator",
                value: ";",
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
                type: "Identifier",
                value: "otherStuff",
                start: 35,
                end: 45,
                loc: {
                    start: {
                        line: 1,
                        column: 35
                    },
                    end: {
                        line: 1,
                        column: 45
                    }
                },
                range: [
                    35,
                    45
                ]
            },
            {
                type: "Punctuator",
                value: "=",
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
                type: "Punctuator",
                value: "{",
                start: 48,
                end: 49,
                loc: {
                    start: {
                        line: 1,
                        column: 48
                    },
                    end: {
                        line: 1,
                        column: 49
                    }
                },
                range: [
                    48,
                    49
                ]
            },
            {
                type: "Punctuator",
                value: "}",
                start: 49,
                end: 50,
                loc: {
                    start: {
                        line: 1,
                        column: 49
                    },
                    end: {
                        line: 1,
                        column: 50
                    }
                },
                range: [
                    49,
                    50
                ]
            },
            {
                type: "Punctuator",
                value: ";",
                start: 50,
                end: 51,
                loc: {
                    start: {
                        line: 1,
                        column: 50
                    },
                    end: {
                        line: 1,
                        column: 51
                    }
                },
                range: [
                    50,
                    51
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
                start: 53,
                end: 53,
                loc: {
                    start: {
                        line: 3,
                        column: 0
                    },
                    end: {
                        line: 3,
                        column: 0
                    }
                },
                range: [
                    53,
                    53
                ]
            }
        ],
        comments: [],
        range: [
            0,
            53
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
                        type: "VariableDeclaration",
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
                        declarations: [
                            {
                                type: "VariableDeclarator",
                                start: 4,
                                end: 33,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 4
                                    },
                                    end: {
                                        line: 1,
                                        column: 33
                                    }
                                },
                                id: {
                                    type: "ObjectPattern",
                                    start: 4,
                                    end: 27,
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 4
                                        },
                                        end: {
                                            line: 1,
                                            column: 27
                                        }
                                    },
                                    properties: [
                                        {
                                            type: "Property",
                                            start: 6,
                                            end: 10,
                                            loc: {
                                                start: {
                                                    line: 1,
                                                    column: 6
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 10
                                                }
                                            },
                                            method: false,
                                            shorthand: true,
                                            computed: false,
                                            key: {
                                                type: "Identifier",
                                                start: 6,
                                                end: 10,
                                                loc: {
                                                    start: {
                                                        line: 1,
                                                        column: 6
                                                    },
                                                    end: {
                                                        line: 1,
                                                        column: 10
                                                    }
                                                },
                                                name: "name",
                                                range: [
                                                    6,
                                                    10
                                                ],
                                                _babelType: "Identifier"
                                            },
                                            kind: "init",
                                            value: {
                                                type: "Identifier",
                                                start: 6,
                                                end: 10,
                                                loc: {
                                                    start: {
                                                        line: 1,
                                                        column: 6
                                                    },
                                                    end: {
                                                        line: 1,
                                                        column: 10
                                                    }
                                                },
                                                name: "name",
                                                range: [
                                                    6,
                                                    10
                                                ],
                                                _babelType: "Identifier"
                                            },
                                            range: [
                                                6,
                                                10
                                            ],
                                            _babelType: "Property"
                                        },
                                        {
                                            type: "SpreadProperty",
                                            start: 12,
                                            end: 25,
                                            loc: {
                                                start: {
                                                    line: 1,
                                                    column: 12
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 25
                                                }
                                            },
                                            argument: {
                                                type: "Identifier",
                                                start: 15,
                                                end: 25,
                                                loc: {
                                                    start: {
                                                        line: 1,
                                                        column: 15
                                                    },
                                                    end: {
                                                        line: 1,
                                                        column: 25
                                                    }
                                                },
                                                name: "otherStuff",
                                                range: [
                                                    15,
                                                    25
                                                ],
                                                _babelType: "Identifier"
                                            },
                                            range: [
                                                12,
                                                25
                                            ],
                                            _babelType: "SpreadProperty",
                                            value: {
                                                type: "Identifier",
                                                start: 15,
                                                end: 25,
                                                loc: {
                                                    start: {
                                                        line: 1,
                                                        column: 15
                                                    },
                                                    end: {
                                                        line: 1,
                                                        column: 25
                                                    }
                                                },
                                                name: "otherStuff",
                                                range: [
                                                    15,
                                                    25
                                                ],
                                                _babelType: "Identifier"
                                            },
                                            key: {
                                                type: "Identifier",
                                                start: 15,
                                                end: 25,
                                                loc: {
                                                    start: {
                                                        line: 1,
                                                        column: 15
                                                    },
                                                    end: {
                                                        line: 1,
                                                        column: 25
                                                    }
                                                },
                                                name: "otherStuff",
                                                range: [
                                                    15,
                                                    25
                                                ],
                                                _babelType: "Identifier"
                                            }
                                        }
                                    ],
                                    range: [
                                        4,
                                        27
                                    ],
                                    _babelType: "ObjectPattern"
                                },
                                init: {
                                    type: "Identifier",
                                    start: 30,
                                    end: 33,
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 30
                                        },
                                        end: {
                                            line: 1,
                                            column: 33
                                        }
                                    },
                                    name: "obj",
                                    range: [
                                        30,
                                        33
                                    ],
                                    _babelType: "Identifier"
                                },
                                range: [
                                    4,
                                    33
                                ],
                                _babelType: "VariableDeclarator"
                            }
                        ],
                        kind: "let",
                        range: [
                            0,
                            34
                        ],
                        _babelType: "VariableDeclaration"
                    },
                    {
                        type: "ExpressionStatement",
                        start: 35,
                        end: 51,
                        loc: {
                            start: {
                                line: 1,
                                column: 35
                            },
                            end: {
                                line: 1,
                                column: 51
                            }
                        },
                        expression: {
                            type: "AssignmentExpression",
                            start: 35,
                            end: 50,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 35
                                },
                                end: {
                                    line: 1,
                                    column: 50
                                }
                            },
                            operator: "=",
                            left: {
                                type: "Identifier",
                                start: 35,
                                end: 45,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 35
                                    },
                                    end: {
                                        line: 1,
                                        column: 45
                                    }
                                },
                                name: "otherStuff",
                                range: [
                                    35,
                                    45
                                ],
                                _babelType: "Identifier"
                            },
                            right: {
                                type: "ObjectExpression",
                                start: 48,
                                end: 50,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 48
                                    },
                                    end: {
                                        line: 1,
                                        column: 50
                                    }
                                },
                                properties: [],
                                range: [
                                    48,
                                    50
                                ],
                                _babelType: "ObjectExpression"
                            },
                            range: [
                                35,
                                50
                            ],
                            _babelType: "AssignmentExpression"
                        },
                        range: [
                            35,
                            51
                        ],
                        _babelType: "ExpressionStatement"
                    }
                ],
                listKey: "body",
                inList: true,
                parentKey: "body",
                key: 0,
                node: {
                    type: "VariableDeclaration",
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
                    declarations: [
                        {
                            type: "VariableDeclarator",
                            start: 4,
                            end: 33,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 4
                                },
                                end: {
                                    line: 1,
                                    column: 33
                                }
                            },
                            id: {
                                type: "ObjectPattern",
                                start: 4,
                                end: 27,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 4
                                    },
                                    end: {
                                        line: 1,
                                        column: 27
                                    }
                                },
                                properties: [
                                    {
                                        type: "Property",
                                        start: 6,
                                        end: 10,
                                        loc: {
                                            start: {
                                                line: 1,
                                                column: 6
                                            },
                                            end: {
                                                line: 1,
                                                column: 10
                                            }
                                        },
                                        method: false,
                                        shorthand: true,
                                        computed: false,
                                        key: {
                                            type: "Identifier",
                                            start: 6,
                                            end: 10,
                                            loc: {
                                                start: {
                                                    line: 1,
                                                    column: 6
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 10
                                                }
                                            },
                                            name: "name",
                                            range: [
                                                6,
                                                10
                                            ],
                                            _babelType: "Identifier"
                                        },
                                        kind: "init",
                                        value: {
                                            type: "Identifier",
                                            start: 6,
                                            end: 10,
                                            loc: {
                                                start: {
                                                    line: 1,
                                                    column: 6
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 10
                                                }
                                            },
                                            name: "name",
                                            range: [
                                                6,
                                                10
                                            ],
                                            _babelType: "Identifier"
                                        },
                                        range: [
                                            6,
                                            10
                                        ],
                                        _babelType: "Property"
                                    },
                                    {
                                        type: "SpreadProperty",
                                        start: 12,
                                        end: 25,
                                        loc: {
                                            start: {
                                                line: 1,
                                                column: 12
                                            },
                                            end: {
                                                line: 1,
                                                column: 25
                                            }
                                        },
                                        argument: {
                                            type: "Identifier",
                                            start: 15,
                                            end: 25,
                                            loc: {
                                                start: {
                                                    line: 1,
                                                    column: 15
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 25
                                                }
                                            },
                                            name: "otherStuff",
                                            range: [
                                                15,
                                                25
                                            ],
                                            _babelType: "Identifier"
                                        },
                                        range: [
                                            12,
                                            25
                                        ],
                                        _babelType: "SpreadProperty",
                                        value: {
                                            type: "Identifier",
                                            start: 15,
                                            end: 25,
                                            loc: {
                                                start: {
                                                    line: 1,
                                                    column: 15
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 25
                                                }
                                            },
                                            name: "otherStuff",
                                            range: [
                                                15,
                                                25
                                            ],
                                            _babelType: "Identifier"
                                        },
                                        key: {
                                            type: "Identifier",
                                            start: 15,
                                            end: 25,
                                            loc: {
                                                start: {
                                                    line: 1,
                                                    column: 15
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 25
                                                }
                                            },
                                            name: "otherStuff",
                                            range: [
                                                15,
                                                25
                                            ],
                                            _babelType: "Identifier"
                                        }
                                    }
                                ],
                                range: [
                                    4,
                                    27
                                ],
                                _babelType: "ObjectPattern"
                            },
                            init: {
                                type: "Identifier",
                                start: 30,
                                end: 33,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 30
                                    },
                                    end: {
                                        line: 1,
                                        column: 33
                                    }
                                },
                                name: "obj",
                                range: [
                                    30,
                                    33
                                ],
                                _babelType: "Identifier"
                            },
                            range: [
                                4,
                                33
                            ],
                            _babelType: "VariableDeclarator"
                        }
                    ],
                    kind: "let",
                    range: [
                        0,
                        34
                    ],
                    _babelType: "VariableDeclaration"
                },
                scope: null,
                type: "VariableDeclaration",
                typeAnnotation: null
            },
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
                        type: "VariableDeclaration",
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
                        declarations: [
                            {
                                type: "VariableDeclarator",
                                start: 4,
                                end: 33,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 4
                                    },
                                    end: {
                                        line: 1,
                                        column: 33
                                    }
                                },
                                id: {
                                    type: "ObjectPattern",
                                    start: 4,
                                    end: 27,
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 4
                                        },
                                        end: {
                                            line: 1,
                                            column: 27
                                        }
                                    },
                                    properties: [
                                        {
                                            type: "Property",
                                            start: 6,
                                            end: 10,
                                            loc: {
                                                start: {
                                                    line: 1,
                                                    column: 6
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 10
                                                }
                                            },
                                            method: false,
                                            shorthand: true,
                                            computed: false,
                                            key: {
                                                type: "Identifier",
                                                start: 6,
                                                end: 10,
                                                loc: {
                                                    start: {
                                                        line: 1,
                                                        column: 6
                                                    },
                                                    end: {
                                                        line: 1,
                                                        column: 10
                                                    }
                                                },
                                                name: "name",
                                                range: [
                                                    6,
                                                    10
                                                ],
                                                _babelType: "Identifier"
                                            },
                                            kind: "init",
                                            value: {
                                                type: "Identifier",
                                                start: 6,
                                                end: 10,
                                                loc: {
                                                    start: {
                                                        line: 1,
                                                        column: 6
                                                    },
                                                    end: {
                                                        line: 1,
                                                        column: 10
                                                    }
                                                },
                                                name: "name",
                                                range: [
                                                    6,
                                                    10
                                                ],
                                                _babelType: "Identifier"
                                            },
                                            range: [
                                                6,
                                                10
                                            ],
                                            _babelType: "Property"
                                        },
                                        {
                                            type: "SpreadProperty",
                                            start: 12,
                                            end: 25,
                                            loc: {
                                                start: {
                                                    line: 1,
                                                    column: 12
                                                },
                                                end: {
                                                    line: 1,
                                                    column: 25
                                                }
                                            },
                                            argument: {
                                                type: "Identifier",
                                                start: 15,
                                                end: 25,
                                                loc: {
                                                    start: {
                                                        line: 1,
                                                        column: 15
                                                    },
                                                    end: {
                                                        line: 1,
                                                        column: 25
                                                    }
                                                },
                                                name: "otherStuff",
                                                range: [
                                                    15,
                                                    25
                                                ],
                                                _babelType: "Identifier"
                                            },
                                            range: [
                                                12,
                                                25
                                            ],
                                            _babelType: "SpreadProperty",
                                            value: {
                                                type: "Identifier",
                                                start: 15,
                                                end: 25,
                                                loc: {
                                                    start: {
                                                        line: 1,
                                                        column: 15
                                                    },
                                                    end: {
                                                        line: 1,
                                                        column: 25
                                                    }
                                                },
                                                name: "otherStuff",
                                                range: [
                                                    15,
                                                    25
                                                ],
                                                _babelType: "Identifier"
                                            },
                                            key: {
                                                type: "Identifier",
                                                start: 15,
                                                end: 25,
                                                loc: {
                                                    start: {
                                                        line: 1,
                                                        column: 15
                                                    },
                                                    end: {
                                                        line: 1,
                                                        column: 25
                                                    }
                                                },
                                                name: "otherStuff",
                                                range: [
                                                    15,
                                                    25
                                                ],
                                                _babelType: "Identifier"
                                            }
                                        }
                                    ],
                                    range: [
                                        4,
                                        27
                                    ],
                                    _babelType: "ObjectPattern"
                                },
                                init: {
                                    type: "Identifier",
                                    start: 30,
                                    end: 33,
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 30
                                        },
                                        end: {
                                            line: 1,
                                            column: 33
                                        }
                                    },
                                    name: "obj",
                                    range: [
                                        30,
                                        33
                                    ],
                                    _babelType: "Identifier"
                                },
                                range: [
                                    4,
                                    33
                                ],
                                _babelType: "VariableDeclarator"
                            }
                        ],
                        kind: "let",
                        range: [
                            0,
                            34
                        ],
                        _babelType: "VariableDeclaration"
                    },
                    {
                        type: "ExpressionStatement",
                        start: 35,
                        end: 51,
                        loc: {
                            start: {
                                line: 1,
                                column: 35
                            },
                            end: {
                                line: 1,
                                column: 51
                            }
                        },
                        expression: {
                            type: "AssignmentExpression",
                            start: 35,
                            end: 50,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 35
                                },
                                end: {
                                    line: 1,
                                    column: 50
                                }
                            },
                            operator: "=",
                            left: {
                                type: "Identifier",
                                start: 35,
                                end: 45,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 35
                                    },
                                    end: {
                                        line: 1,
                                        column: 45
                                    }
                                },
                                name: "otherStuff",
                                range: [
                                    35,
                                    45
                                ],
                                _babelType: "Identifier"
                            },
                            right: {
                                type: "ObjectExpression",
                                start: 48,
                                end: 50,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 48
                                    },
                                    end: {
                                        line: 1,
                                        column: 50
                                    }
                                },
                                properties: [],
                                range: [
                                    48,
                                    50
                                ],
                                _babelType: "ObjectExpression"
                            },
                            range: [
                                35,
                                50
                            ],
                            _babelType: "AssignmentExpression"
                        },
                        range: [
                            35,
                            51
                        ],
                        _babelType: "ExpressionStatement"
                    }
                ],
                listKey: "body",
                inList: true,
                parentKey: "body",
                key: 1,
                node: {
                    type: "ExpressionStatement",
                    start: 35,
                    end: 51,
                    loc: {
                        start: {
                            line: 1,
                            column: 35
                        },
                        end: {
                            line: 1,
                            column: 51
                        }
                    },
                    expression: {
                        type: "AssignmentExpression",
                        start: 35,
                        end: 50,
                        loc: {
                            start: {
                                line: 1,
                                column: 35
                            },
                            end: {
                                line: 1,
                                column: 50
                            }
                        },
                        operator: "=",
                        left: {
                            type: "Identifier",
                            start: 35,
                            end: 45,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 35
                                },
                                end: {
                                    line: 1,
                                    column: 45
                                }
                            },
                            name: "otherStuff",
                            range: [
                                35,
                                45
                            ],
                            _babelType: "Identifier"
                        },
                        right: {
                            type: "ObjectExpression",
                            start: 48,
                            end: 50,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 48
                                },
                                end: {
                                    line: 1,
                                    column: 50
                                }
                            },
                            properties: [],
                            range: [
                                48,
                                50
                            ],
                            _babelType: "ObjectExpression"
                        },
                        range: [
                            35,
                            50
                        ],
                        _babelType: "AssignmentExpression"
                    },
                    range: [
                        35,
                        51
                    ],
                    _babelType: "ExpressionStatement"
                },
                scope: null,
                type: "ExpressionStatement",
                typeAnnotation: null
            }
        ]
    };
};
