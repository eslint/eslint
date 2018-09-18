'use strict';

/**
 * Parser: babel-eslint v9.0.0
 * Source code: var foo = bar?.a_b;
 * type TransformFunction = (el: ASTElement, code: string) => string;
 */

exports.parse = () => ({
        'type': 'Program',
        'start': 0,
        'end': 19,
        'loc': {
            'start': {
                'line': 1,
                'column': 0
            },
            'end': {
                'line': 1,
                'column': 19
            }
        },
        'range': [
            0,
            19
        ],
        'comments': [],
        'tokens': [
            {
                'type': 'Keyword',
                'value': 'var',
                'start': 0,
                'end': 3,
                'loc': {
                    'start': {
                        'line': 1,
                        'column': 0
                    },
                    'end': {
                        'line': 1,
                        'column': 3
                    }
                },
                'range': [
                    0,
                    3
                ]
            },
            {
                'type': 'Identifier',
                'value': 'foo',
                'start': 4,
                'end': 7,
                'loc': {
                    'start': {
                        'line': 1,
                        'column': 4
                    },
                    'end': {
                        'line': 1,
                        'column': 7
                    }
                },
                'range': [
                    4,
                    7
                ]
            },
            {
                'type': 'Punctuator',
                'value': '=',
                'start': 8,
                'end': 9,
                'loc': {
                    'start': {
                        'line': 1,
                        'column': 8
                    },
                    'end': {
                        'line': 1,
                        'column': 9
                    }
                },
                'range': [
                    8,
                    9
                ]
            },
            {
                'type': 'Identifier',
                'value': 'bar',
                'start': 10,
                'end': 13,
                'loc': {
                    'start': {
                        'line': 1,
                        'column': 10
                    },
                    'end': {
                        'line': 1,
                        'column': 13
                    }
                },
                'range': [
                    10,
                    13
                ]
            },
            {
                'type': 'Punctuator',
                'value': '?.',
                'start': 13,
                'end': 15,
                'loc': {
                    'start': {
                        'line': 1,
                        'column': 13
                    },
                    'end': {
                        'line': 1,
                        'column': 15
                    }
                },
                'range': [
                    13,
                    15
                ]
            },
            {
                'type': 'Identifier',
                'value': 'a_b',
                'start': 15,
                'end': 18,
                'loc': {
                    'start': {
                        'line': 1,
                        'column': 15
                    },
                    'end': {
                        'line': 1,
                        'column': 18
                    }
                },
                'range': [
                    15,
                    18
                ]
            },
            {
                'type': 'Punctuator',
                'value': ';',
                'start': 18,
                'end': 19,
                'loc': {
                    'start': {
                        'line': 1,
                        'column': 18
                    },
                    'end': {
                        'line': 1,
                        'column': 19
                    }
                },
                'range': [
                    18,
                    19
                ]
            }
        ],
        'sourceType': 'module',
        'body': [
            {
                'type': 'VariableDeclaration',
                'start': 0,
                'end': 19,
                'loc': {
                    'start': {
                        'line': 1,
                        'column': 0
                    },
                    'end': {
                        'line': 1,
                        'column': 19
                    }
                },
                'range': [
                    0,
                    19
                ],
                'declarations': [
                    {
                        'type': 'VariableDeclarator',
                        'start': 4,
                        'end': 18,
                        'loc': {
                            'start': {
                                'line': 1,
                                'column': 4
                            },
                            'end': {
                                'line': 1,
                                'column': 18
                            }
                        },
                        'range': [
                            4,
                            18
                        ],
                        'id': {
                            'type': 'Identifier',
                            'start': 4,
                            'end': 7,
                            'loc': {
                                'start': {
                                    'line': 1,
                                    'column': 4
                                },
                                'end': {
                                    'line': 1,
                                    'column': 7
                                },
                                'identifierName': 'foo'
                            },
                            'range': [
                                4,
                                7
                            ],
                            'name': 'foo',
                            '_babelType': 'Identifier'
                        },
                        'init': {
                            'type': 'OptionalMemberExpression',
                            'start': 10,
                            'end': 18,
                            'loc': {
                                'start': {
                                    'line': 1,
                                    'column': 10
                                },
                                'end': {
                                    'line': 1,
                                    'column': 18
                                }
                            },
                            'range': [
                                10,
                                18
                            ],
                            'object': {
                                'type': 'Identifier',
                                'start': 10,
                                'end': 13,
                                'loc': {
                                    'start': {
                                        'line': 1,
                                        'column': 10
                                    },
                                    'end': {
                                        'line': 1,
                                        'column': 13
                                    },
                                    'identifierName': 'bar'
                                },
                                'range': [
                                    10,
                                    13
                                ],
                                'name': 'bar',
                                '_babelType': 'Identifier'
                            },
                            'property': {
                                'type': 'Identifier',
                                'start': 15,
                                'end': 18,
                                'loc': {
                                    'start': {
                                        'line': 1,
                                        'column': 15
                                    },
                                    'end': {
                                        'line': 1,
                                        'column': 18
                                    },
                                    'identifierName': 'a_b'
                                },
                                'range': [
                                    15,
                                    18
                                ],
                                'name': 'a_b',
                                '_babelType': 'Identifier'
                            },
                            'computed': false,
                            'optional': true,
                            '_babelType': 'OptionalMemberExpression'
                        },
                        '_babelType': 'VariableDeclarator'
                    }
                ],
                'kind': 'var',
                '_babelType': 'VariableDeclaration'
            }
        ]
    }
);
