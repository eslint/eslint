'use strict';

/*
 * Parsed on astexplorer.net using @typescript-eslint/parser@1.13.0
 *
 * Source:
const test = {
    key: (): void => {x()},
    key: ( (): void => {x()} ),
    key: ( (): (void) => {x()} ),

    key: (arg: t): void => {x()},
    key: ( (arg: t): void => {x()} ),
    key: ( (arg: t): (void) => {x()} ),

    key: (arg: t, arg2: t): void => {x()},
    key: ( (arg: t, arg2: t): void => {x()} ),
    key: ( (arg: t, arg2: t): (void) => {x()} ),

    key: async (): void => {x()},
    key: ( async (): void => {x()} ),
    key: ( async (): (void) => {x()} ),

    key: async (arg: t): void => {x()},
    key: ( async (arg: t): void => {x()} ),
    key: ( async (arg: t): (void) => {x()} ),

    key: async (arg: t, arg2: t): void => {x()},
    key: ( async (arg: t, arg2: t): void => {x()} ),
    key: ( async (arg: t, arg2: t): (void) => {x()} ),
}
 */

exports.parse = () => ({
    type: 'Program',
    body: [
        {
            type: 'VariableDeclaration',
            declarations: [
                {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'test',
                        range: [6, 10],
                        loc: {
                            start: {
                                line: 1,
                                column: 6,
                            },
                            end: {
                                line: 1,
                                column: 10,
                            },
                        },
                    },
                    init: {
                        type: 'ObjectExpression',
                        properties: [
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [19, 22],
                                    loc: {
                                        start: {
                                            line: 2,
                                            column: 4,
                                        },
                                        end: {
                                            line: 2,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [37, 38],
                                                        loc: {
                                                            start: {
                                                                line: 2,
                                                                column: 22,
                                                            },
                                                            end: {
                                                                line: 2,
                                                                column: 23,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [37, 40],
                                                    loc: {
                                                        start: {
                                                            line: 2,
                                                            column: 22,
                                                        },
                                                        end: {
                                                            line: 2,
                                                            column: 25,
                                                        },
                                                    },
                                                },
                                                range: [37, 40],
                                                loc: {
                                                    start: {
                                                        line: 2,
                                                        column: 22,
                                                    },
                                                    end: {
                                                        line: 2,
                                                        column: 25,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [36, 41],
                                        loc: {
                                            start: {
                                                line: 2,
                                                column: 21,
                                            },
                                            end: {
                                                line: 2,
                                                column: 26,
                                            },
                                        },
                                    },
                                    async: false,
                                    expression: false,
                                    range: [24, 41],
                                    loc: {
                                        start: {
                                            line: 2,
                                            column: 9,
                                        },
                                        end: {
                                            line: 2,
                                            column: 26,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 2,
                                                column: 11,
                                            },
                                            end: {
                                                line: 2,
                                                column: 17,
                                            },
                                        },
                                        range: [26, 32],
                                        typeAnnotation: {
                                            type: 'TSVoidKeyword',
                                            range: [28, 32],
                                            loc: {
                                                start: {
                                                    line: 2,
                                                    column: 13,
                                                },
                                                end: {
                                                    line: 2,
                                                    column: 17,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [19, 41],
                                loc: {
                                    start: {
                                        line: 2,
                                        column: 4,
                                    },
                                    end: {
                                        line: 2,
                                        column: 26,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [47, 50],
                                    loc: {
                                        start: {
                                            line: 3,
                                            column: 4,
                                        },
                                        end: {
                                            line: 3,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [67, 68],
                                                        loc: {
                                                            start: {
                                                                line: 3,
                                                                column: 24,
                                                            },
                                                            end: {
                                                                line: 3,
                                                                column: 25,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [67, 70],
                                                    loc: {
                                                        start: {
                                                            line: 3,
                                                            column: 24,
                                                        },
                                                        end: {
                                                            line: 3,
                                                            column: 27,
                                                        },
                                                    },
                                                },
                                                range: [67, 70],
                                                loc: {
                                                    start: {
                                                        line: 3,
                                                        column: 24,
                                                    },
                                                    end: {
                                                        line: 3,
                                                        column: 27,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [66, 71],
                                        loc: {
                                            start: {
                                                line: 3,
                                                column: 23,
                                            },
                                            end: {
                                                line: 3,
                                                column: 28,
                                            },
                                        },
                                    },
                                    async: false,
                                    expression: false,
                                    range: [54, 71],
                                    loc: {
                                        start: {
                                            line: 3,
                                            column: 11,
                                        },
                                        end: {
                                            line: 3,
                                            column: 28,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 3,
                                                column: 13,
                                            },
                                            end: {
                                                line: 3,
                                                column: 19,
                                            },
                                        },
                                        range: [56, 62],
                                        typeAnnotation: {
                                            type: 'TSVoidKeyword',
                                            range: [58, 62],
                                            loc: {
                                                start: {
                                                    line: 3,
                                                    column: 15,
                                                },
                                                end: {
                                                    line: 3,
                                                    column: 19,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [47, 73],
                                loc: {
                                    start: {
                                        line: 3,
                                        column: 4,
                                    },
                                    end: {
                                        line: 3,
                                        column: 30,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [79, 82],
                                    loc: {
                                        start: {
                                            line: 4,
                                            column: 4,
                                        },
                                        end: {
                                            line: 4,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [101, 102],
                                                        loc: {
                                                            start: {
                                                                line: 4,
                                                                column: 26,
                                                            },
                                                            end: {
                                                                line: 4,
                                                                column: 27,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [101, 104],
                                                    loc: {
                                                        start: {
                                                            line: 4,
                                                            column: 26,
                                                        },
                                                        end: {
                                                            line: 4,
                                                            column: 29,
                                                        },
                                                    },
                                                },
                                                range: [101, 104],
                                                loc: {
                                                    start: {
                                                        line: 4,
                                                        column: 26,
                                                    },
                                                    end: {
                                                        line: 4,
                                                        column: 29,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [100, 105],
                                        loc: {
                                            start: {
                                                line: 4,
                                                column: 25,
                                            },
                                            end: {
                                                line: 4,
                                                column: 30,
                                            },
                                        },
                                    },
                                    async: false,
                                    expression: false,
                                    range: [86, 105],
                                    loc: {
                                        start: {
                                            line: 4,
                                            column: 11,
                                        },
                                        end: {
                                            line: 4,
                                            column: 30,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 4,
                                                column: 13,
                                            },
                                            end: {
                                                line: 4,
                                                column: 21,
                                            },
                                        },
                                        range: [88, 96],
                                        typeAnnotation: {
                                            type: 'TSParenthesizedType',
                                            typeAnnotation: {
                                                type: 'TSVoidKeyword',
                                                range: [91, 95],
                                                loc: {
                                                    start: {
                                                        line: 4,
                                                        column: 16,
                                                    },
                                                    end: {
                                                        line: 4,
                                                        column: 20,
                                                    },
                                                },
                                            },
                                            range: [90, 96],
                                            loc: {
                                                start: {
                                                    line: 4,
                                                    column: 15,
                                                },
                                                end: {
                                                    line: 4,
                                                    column: 21,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [79, 107],
                                loc: {
                                    start: {
                                        line: 4,
                                        column: 4,
                                    },
                                    end: {
                                        line: 4,
                                        column: 32,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [114, 117],
                                    loc: {
                                        start: {
                                            line: 6,
                                            column: 4,
                                        },
                                        end: {
                                            line: 6,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [
                                        {
                                            type: 'Identifier',
                                            name: 'arg',
                                            range: [120, 126],
                                            loc: {
                                                start: {
                                                    line: 6,
                                                    column: 10,
                                                },
                                                end: {
                                                    line: 6,
                                                    column: 16,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 6,
                                                        column: 13,
                                                    },
                                                    end: {
                                                        line: 6,
                                                        column: 16,
                                                    },
                                                },
                                                range: [123, 126],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [125, 126],
                                                        loc: {
                                                            start: {
                                                                line: 6,
                                                                column: 15,
                                                            },
                                                            end: {
                                                                line: 6,
                                                                column: 16,
                                                            },
                                                        },
                                                    },
                                                    range: [125, 126],
                                                    loc: {
                                                        start: {
                                                            line: 6,
                                                            column: 15,
                                                        },
                                                        end: {
                                                            line: 6,
                                                            column: 16,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [138, 139],
                                                        loc: {
                                                            start: {
                                                                line: 6,
                                                                column: 28,
                                                            },
                                                            end: {
                                                                line: 6,
                                                                column: 29,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [138, 141],
                                                    loc: {
                                                        start: {
                                                            line: 6,
                                                            column: 28,
                                                        },
                                                        end: {
                                                            line: 6,
                                                            column: 31,
                                                        },
                                                    },
                                                },
                                                range: [138, 141],
                                                loc: {
                                                    start: {
                                                        line: 6,
                                                        column: 28,
                                                    },
                                                    end: {
                                                        line: 6,
                                                        column: 31,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [137, 142],
                                        loc: {
                                            start: {
                                                line: 6,
                                                column: 27,
                                            },
                                            end: {
                                                line: 6,
                                                column: 32,
                                            },
                                        },
                                    },
                                    async: false,
                                    expression: false,
                                    range: [119, 142],
                                    loc: {
                                        start: {
                                            line: 6,
                                            column: 9,
                                        },
                                        end: {
                                            line: 6,
                                            column: 32,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 6,
                                                column: 17,
                                            },
                                            end: {
                                                line: 6,
                                                column: 23,
                                            },
                                        },
                                        range: [127, 133],
                                        typeAnnotation: {
                                            type: 'TSVoidKeyword',
                                            range: [129, 133],
                                            loc: {
                                                start: {
                                                    line: 6,
                                                    column: 19,
                                                },
                                                end: {
                                                    line: 6,
                                                    column: 23,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [114, 142],
                                loc: {
                                    start: {
                                        line: 6,
                                        column: 4,
                                    },
                                    end: {
                                        line: 6,
                                        column: 32,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [148, 151],
                                    loc: {
                                        start: {
                                            line: 7,
                                            column: 4,
                                        },
                                        end: {
                                            line: 7,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [
                                        {
                                            type: 'Identifier',
                                            name: 'arg',
                                            range: [156, 162],
                                            loc: {
                                                start: {
                                                    line: 7,
                                                    column: 12,
                                                },
                                                end: {
                                                    line: 7,
                                                    column: 18,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 7,
                                                        column: 15,
                                                    },
                                                    end: {
                                                        line: 7,
                                                        column: 18,
                                                    },
                                                },
                                                range: [159, 162],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [161, 162],
                                                        loc: {
                                                            start: {
                                                                line: 7,
                                                                column: 17,
                                                            },
                                                            end: {
                                                                line: 7,
                                                                column: 18,
                                                            },
                                                        },
                                                    },
                                                    range: [161, 162],
                                                    loc: {
                                                        start: {
                                                            line: 7,
                                                            column: 17,
                                                        },
                                                        end: {
                                                            line: 7,
                                                            column: 18,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [174, 175],
                                                        loc: {
                                                            start: {
                                                                line: 7,
                                                                column: 30,
                                                            },
                                                            end: {
                                                                line: 7,
                                                                column: 31,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [174, 177],
                                                    loc: {
                                                        start: {
                                                            line: 7,
                                                            column: 30,
                                                        },
                                                        end: {
                                                            line: 7,
                                                            column: 33,
                                                        },
                                                    },
                                                },
                                                range: [174, 177],
                                                loc: {
                                                    start: {
                                                        line: 7,
                                                        column: 30,
                                                    },
                                                    end: {
                                                        line: 7,
                                                        column: 33,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [173, 178],
                                        loc: {
                                            start: {
                                                line: 7,
                                                column: 29,
                                            },
                                            end: {
                                                line: 7,
                                                column: 34,
                                            },
                                        },
                                    },
                                    async: false,
                                    expression: false,
                                    range: [155, 178],
                                    loc: {
                                        start: {
                                            line: 7,
                                            column: 11,
                                        },
                                        end: {
                                            line: 7,
                                            column: 34,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 7,
                                                column: 19,
                                            },
                                            end: {
                                                line: 7,
                                                column: 25,
                                            },
                                        },
                                        range: [163, 169],
                                        typeAnnotation: {
                                            type: 'TSVoidKeyword',
                                            range: [165, 169],
                                            loc: {
                                                start: {
                                                    line: 7,
                                                    column: 21,
                                                },
                                                end: {
                                                    line: 7,
                                                    column: 25,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [148, 180],
                                loc: {
                                    start: {
                                        line: 7,
                                        column: 4,
                                    },
                                    end: {
                                        line: 7,
                                        column: 36,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [186, 189],
                                    loc: {
                                        start: {
                                            line: 8,
                                            column: 4,
                                        },
                                        end: {
                                            line: 8,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [
                                        {
                                            type: 'Identifier',
                                            name: 'arg',
                                            range: [194, 200],
                                            loc: {
                                                start: {
                                                    line: 8,
                                                    column: 12,
                                                },
                                                end: {
                                                    line: 8,
                                                    column: 18,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 8,
                                                        column: 15,
                                                    },
                                                    end: {
                                                        line: 8,
                                                        column: 18,
                                                    },
                                                },
                                                range: [197, 200],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [199, 200],
                                                        loc: {
                                                            start: {
                                                                line: 8,
                                                                column: 17,
                                                            },
                                                            end: {
                                                                line: 8,
                                                                column: 18,
                                                            },
                                                        },
                                                    },
                                                    range: [199, 200],
                                                    loc: {
                                                        start: {
                                                            line: 8,
                                                            column: 17,
                                                        },
                                                        end: {
                                                            line: 8,
                                                            column: 18,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [214, 215],
                                                        loc: {
                                                            start: {
                                                                line: 8,
                                                                column: 32,
                                                            },
                                                            end: {
                                                                line: 8,
                                                                column: 33,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [214, 217],
                                                    loc: {
                                                        start: {
                                                            line: 8,
                                                            column: 32,
                                                        },
                                                        end: {
                                                            line: 8,
                                                            column: 35,
                                                        },
                                                    },
                                                },
                                                range: [214, 217],
                                                loc: {
                                                    start: {
                                                        line: 8,
                                                        column: 32,
                                                    },
                                                    end: {
                                                        line: 8,
                                                        column: 35,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [213, 218],
                                        loc: {
                                            start: {
                                                line: 8,
                                                column: 31,
                                            },
                                            end: {
                                                line: 8,
                                                column: 36,
                                            },
                                        },
                                    },
                                    async: false,
                                    expression: false,
                                    range: [193, 218],
                                    loc: {
                                        start: {
                                            line: 8,
                                            column: 11,
                                        },
                                        end: {
                                            line: 8,
                                            column: 36,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 8,
                                                column: 19,
                                            },
                                            end: {
                                                line: 8,
                                                column: 27,
                                            },
                                        },
                                        range: [201, 209],
                                        typeAnnotation: {
                                            type: 'TSParenthesizedType',
                                            typeAnnotation: {
                                                type: 'TSVoidKeyword',
                                                range: [204, 208],
                                                loc: {
                                                    start: {
                                                        line: 8,
                                                        column: 22,
                                                    },
                                                    end: {
                                                        line: 8,
                                                        column: 26,
                                                    },
                                                },
                                            },
                                            range: [203, 209],
                                            loc: {
                                                start: {
                                                    line: 8,
                                                    column: 21,
                                                },
                                                end: {
                                                    line: 8,
                                                    column: 27,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [186, 220],
                                loc: {
                                    start: {
                                        line: 8,
                                        column: 4,
                                    },
                                    end: {
                                        line: 8,
                                        column: 38,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [227, 230],
                                    loc: {
                                        start: {
                                            line: 10,
                                            column: 4,
                                        },
                                        end: {
                                            line: 10,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [
                                        {
                                            type: 'Identifier',
                                            name: 'arg',
                                            range: [233, 239],
                                            loc: {
                                                start: {
                                                    line: 10,
                                                    column: 10,
                                                },
                                                end: {
                                                    line: 10,
                                                    column: 16,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 10,
                                                        column: 13,
                                                    },
                                                    end: {
                                                        line: 10,
                                                        column: 16,
                                                    },
                                                },
                                                range: [236, 239],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [238, 239],
                                                        loc: {
                                                            start: {
                                                                line: 10,
                                                                column: 15,
                                                            },
                                                            end: {
                                                                line: 10,
                                                                column: 16,
                                                            },
                                                        },
                                                    },
                                                    range: [238, 239],
                                                    loc: {
                                                        start: {
                                                            line: 10,
                                                            column: 15,
                                                        },
                                                        end: {
                                                            line: 10,
                                                            column: 16,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            type: 'Identifier',
                                            name: 'arg2',
                                            range: [241, 248],
                                            loc: {
                                                start: {
                                                    line: 10,
                                                    column: 18,
                                                },
                                                end: {
                                                    line: 10,
                                                    column: 25,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 10,
                                                        column: 22,
                                                    },
                                                    end: {
                                                        line: 10,
                                                        column: 25,
                                                    },
                                                },
                                                range: [245, 248],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [247, 248],
                                                        loc: {
                                                            start: {
                                                                line: 10,
                                                                column: 24,
                                                            },
                                                            end: {
                                                                line: 10,
                                                                column: 25,
                                                            },
                                                        },
                                                    },
                                                    range: [247, 248],
                                                    loc: {
                                                        start: {
                                                            line: 10,
                                                            column: 24,
                                                        },
                                                        end: {
                                                            line: 10,
                                                            column: 25,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [260, 261],
                                                        loc: {
                                                            start: {
                                                                line: 10,
                                                                column: 37,
                                                            },
                                                            end: {
                                                                line: 10,
                                                                column: 38,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [260, 263],
                                                    loc: {
                                                        start: {
                                                            line: 10,
                                                            column: 37,
                                                        },
                                                        end: {
                                                            line: 10,
                                                            column: 40,
                                                        },
                                                    },
                                                },
                                                range: [260, 263],
                                                loc: {
                                                    start: {
                                                        line: 10,
                                                        column: 37,
                                                    },
                                                    end: {
                                                        line: 10,
                                                        column: 40,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [259, 264],
                                        loc: {
                                            start: {
                                                line: 10,
                                                column: 36,
                                            },
                                            end: {
                                                line: 10,
                                                column: 41,
                                            },
                                        },
                                    },
                                    async: false,
                                    expression: false,
                                    range: [232, 264],
                                    loc: {
                                        start: {
                                            line: 10,
                                            column: 9,
                                        },
                                        end: {
                                            line: 10,
                                            column: 41,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 10,
                                                column: 26,
                                            },
                                            end: {
                                                line: 10,
                                                column: 32,
                                            },
                                        },
                                        range: [249, 255],
                                        typeAnnotation: {
                                            type: 'TSVoidKeyword',
                                            range: [251, 255],
                                            loc: {
                                                start: {
                                                    line: 10,
                                                    column: 28,
                                                },
                                                end: {
                                                    line: 10,
                                                    column: 32,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [227, 264],
                                loc: {
                                    start: {
                                        line: 10,
                                        column: 4,
                                    },
                                    end: {
                                        line: 10,
                                        column: 41,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [270, 273],
                                    loc: {
                                        start: {
                                            line: 11,
                                            column: 4,
                                        },
                                        end: {
                                            line: 11,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [
                                        {
                                            type: 'Identifier',
                                            name: 'arg',
                                            range: [278, 284],
                                            loc: {
                                                start: {
                                                    line: 11,
                                                    column: 12,
                                                },
                                                end: {
                                                    line: 11,
                                                    column: 18,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 11,
                                                        column: 15,
                                                    },
                                                    end: {
                                                        line: 11,
                                                        column: 18,
                                                    },
                                                },
                                                range: [281, 284],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [283, 284],
                                                        loc: {
                                                            start: {
                                                                line: 11,
                                                                column: 17,
                                                            },
                                                            end: {
                                                                line: 11,
                                                                column: 18,
                                                            },
                                                        },
                                                    },
                                                    range: [283, 284],
                                                    loc: {
                                                        start: {
                                                            line: 11,
                                                            column: 17,
                                                        },
                                                        end: {
                                                            line: 11,
                                                            column: 18,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            type: 'Identifier',
                                            name: 'arg2',
                                            range: [286, 293],
                                            loc: {
                                                start: {
                                                    line: 11,
                                                    column: 20,
                                                },
                                                end: {
                                                    line: 11,
                                                    column: 27,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 11,
                                                        column: 24,
                                                    },
                                                    end: {
                                                        line: 11,
                                                        column: 27,
                                                    },
                                                },
                                                range: [290, 293],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [292, 293],
                                                        loc: {
                                                            start: {
                                                                line: 11,
                                                                column: 26,
                                                            },
                                                            end: {
                                                                line: 11,
                                                                column: 27,
                                                            },
                                                        },
                                                    },
                                                    range: [292, 293],
                                                    loc: {
                                                        start: {
                                                            line: 11,
                                                            column: 26,
                                                        },
                                                        end: {
                                                            line: 11,
                                                            column: 27,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [305, 306],
                                                        loc: {
                                                            start: {
                                                                line: 11,
                                                                column: 39,
                                                            },
                                                            end: {
                                                                line: 11,
                                                                column: 40,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [305, 308],
                                                    loc: {
                                                        start: {
                                                            line: 11,
                                                            column: 39,
                                                        },
                                                        end: {
                                                            line: 11,
                                                            column: 42,
                                                        },
                                                    },
                                                },
                                                range: [305, 308],
                                                loc: {
                                                    start: {
                                                        line: 11,
                                                        column: 39,
                                                    },
                                                    end: {
                                                        line: 11,
                                                        column: 42,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [304, 309],
                                        loc: {
                                            start: {
                                                line: 11,
                                                column: 38,
                                            },
                                            end: {
                                                line: 11,
                                                column: 43,
                                            },
                                        },
                                    },
                                    async: false,
                                    expression: false,
                                    range: [277, 309],
                                    loc: {
                                        start: {
                                            line: 11,
                                            column: 11,
                                        },
                                        end: {
                                            line: 11,
                                            column: 43,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 11,
                                                column: 28,
                                            },
                                            end: {
                                                line: 11,
                                                column: 34,
                                            },
                                        },
                                        range: [294, 300],
                                        typeAnnotation: {
                                            type: 'TSVoidKeyword',
                                            range: [296, 300],
                                            loc: {
                                                start: {
                                                    line: 11,
                                                    column: 30,
                                                },
                                                end: {
                                                    line: 11,
                                                    column: 34,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [270, 311],
                                loc: {
                                    start: {
                                        line: 11,
                                        column: 4,
                                    },
                                    end: {
                                        line: 11,
                                        column: 45,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [317, 320],
                                    loc: {
                                        start: {
                                            line: 12,
                                            column: 4,
                                        },
                                        end: {
                                            line: 12,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [
                                        {
                                            type: 'Identifier',
                                            name: 'arg',
                                            range: [325, 331],
                                            loc: {
                                                start: {
                                                    line: 12,
                                                    column: 12,
                                                },
                                                end: {
                                                    line: 12,
                                                    column: 18,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 12,
                                                        column: 15,
                                                    },
                                                    end: {
                                                        line: 12,
                                                        column: 18,
                                                    },
                                                },
                                                range: [328, 331],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [330, 331],
                                                        loc: {
                                                            start: {
                                                                line: 12,
                                                                column: 17,
                                                            },
                                                            end: {
                                                                line: 12,
                                                                column: 18,
                                                            },
                                                        },
                                                    },
                                                    range: [330, 331],
                                                    loc: {
                                                        start: {
                                                            line: 12,
                                                            column: 17,
                                                        },
                                                        end: {
                                                            line: 12,
                                                            column: 18,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            type: 'Identifier',
                                            name: 'arg2',
                                            range: [333, 340],
                                            loc: {
                                                start: {
                                                    line: 12,
                                                    column: 20,
                                                },
                                                end: {
                                                    line: 12,
                                                    column: 27,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 12,
                                                        column: 24,
                                                    },
                                                    end: {
                                                        line: 12,
                                                        column: 27,
                                                    },
                                                },
                                                range: [337, 340],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [339, 340],
                                                        loc: {
                                                            start: {
                                                                line: 12,
                                                                column: 26,
                                                            },
                                                            end: {
                                                                line: 12,
                                                                column: 27,
                                                            },
                                                        },
                                                    },
                                                    range: [339, 340],
                                                    loc: {
                                                        start: {
                                                            line: 12,
                                                            column: 26,
                                                        },
                                                        end: {
                                                            line: 12,
                                                            column: 27,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [354, 355],
                                                        loc: {
                                                            start: {
                                                                line: 12,
                                                                column: 41,
                                                            },
                                                            end: {
                                                                line: 12,
                                                                column: 42,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [354, 357],
                                                    loc: {
                                                        start: {
                                                            line: 12,
                                                            column: 41,
                                                        },
                                                        end: {
                                                            line: 12,
                                                            column: 44,
                                                        },
                                                    },
                                                },
                                                range: [354, 357],
                                                loc: {
                                                    start: {
                                                        line: 12,
                                                        column: 41,
                                                    },
                                                    end: {
                                                        line: 12,
                                                        column: 44,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [353, 358],
                                        loc: {
                                            start: {
                                                line: 12,
                                                column: 40,
                                            },
                                            end: {
                                                line: 12,
                                                column: 45,
                                            },
                                        },
                                    },
                                    async: false,
                                    expression: false,
                                    range: [324, 358],
                                    loc: {
                                        start: {
                                            line: 12,
                                            column: 11,
                                        },
                                        end: {
                                            line: 12,
                                            column: 45,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 12,
                                                column: 28,
                                            },
                                            end: {
                                                line: 12,
                                                column: 36,
                                            },
                                        },
                                        range: [341, 349],
                                        typeAnnotation: {
                                            type: 'TSParenthesizedType',
                                            typeAnnotation: {
                                                type: 'TSVoidKeyword',
                                                range: [344, 348],
                                                loc: {
                                                    start: {
                                                        line: 12,
                                                        column: 31,
                                                    },
                                                    end: {
                                                        line: 12,
                                                        column: 35,
                                                    },
                                                },
                                            },
                                            range: [343, 349],
                                            loc: {
                                                start: {
                                                    line: 12,
                                                    column: 30,
                                                },
                                                end: {
                                                    line: 12,
                                                    column: 36,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [317, 360],
                                loc: {
                                    start: {
                                        line: 12,
                                        column: 4,
                                    },
                                    end: {
                                        line: 12,
                                        column: 47,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [367, 370],
                                    loc: {
                                        start: {
                                            line: 14,
                                            column: 4,
                                        },
                                        end: {
                                            line: 14,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [391, 392],
                                                        loc: {
                                                            start: {
                                                                line: 14,
                                                                column: 28,
                                                            },
                                                            end: {
                                                                line: 14,
                                                                column: 29,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [391, 394],
                                                    loc: {
                                                        start: {
                                                            line: 14,
                                                            column: 28,
                                                        },
                                                        end: {
                                                            line: 14,
                                                            column: 31,
                                                        },
                                                    },
                                                },
                                                range: [391, 394],
                                                loc: {
                                                    start: {
                                                        line: 14,
                                                        column: 28,
                                                    },
                                                    end: {
                                                        line: 14,
                                                        column: 31,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [390, 395],
                                        loc: {
                                            start: {
                                                line: 14,
                                                column: 27,
                                            },
                                            end: {
                                                line: 14,
                                                column: 32,
                                            },
                                        },
                                    },
                                    async: true,
                                    expression: false,
                                    range: [372, 395],
                                    loc: {
                                        start: {
                                            line: 14,
                                            column: 9,
                                        },
                                        end: {
                                            line: 14,
                                            column: 32,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 14,
                                                column: 17,
                                            },
                                            end: {
                                                line: 14,
                                                column: 23,
                                            },
                                        },
                                        range: [380, 386],
                                        typeAnnotation: {
                                            type: 'TSVoidKeyword',
                                            range: [382, 386],
                                            loc: {
                                                start: {
                                                    line: 14,
                                                    column: 19,
                                                },
                                                end: {
                                                    line: 14,
                                                    column: 23,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [367, 395],
                                loc: {
                                    start: {
                                        line: 14,
                                        column: 4,
                                    },
                                    end: {
                                        line: 14,
                                        column: 32,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [401, 404],
                                    loc: {
                                        start: {
                                            line: 15,
                                            column: 4,
                                        },
                                        end: {
                                            line: 15,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [427, 428],
                                                        loc: {
                                                            start: {
                                                                line: 15,
                                                                column: 30,
                                                            },
                                                            end: {
                                                                line: 15,
                                                                column: 31,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [427, 430],
                                                    loc: {
                                                        start: {
                                                            line: 15,
                                                            column: 30,
                                                        },
                                                        end: {
                                                            line: 15,
                                                            column: 33,
                                                        },
                                                    },
                                                },
                                                range: [427, 430],
                                                loc: {
                                                    start: {
                                                        line: 15,
                                                        column: 30,
                                                    },
                                                    end: {
                                                        line: 15,
                                                        column: 33,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [426, 431],
                                        loc: {
                                            start: {
                                                line: 15,
                                                column: 29,
                                            },
                                            end: {
                                                line: 15,
                                                column: 34,
                                            },
                                        },
                                    },
                                    async: true,
                                    expression: false,
                                    range: [408, 431],
                                    loc: {
                                        start: {
                                            line: 15,
                                            column: 11,
                                        },
                                        end: {
                                            line: 15,
                                            column: 34,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 15,
                                                column: 19,
                                            },
                                            end: {
                                                line: 15,
                                                column: 25,
                                            },
                                        },
                                        range: [416, 422],
                                        typeAnnotation: {
                                            type: 'TSVoidKeyword',
                                            range: [418, 422],
                                            loc: {
                                                start: {
                                                    line: 15,
                                                    column: 21,
                                                },
                                                end: {
                                                    line: 15,
                                                    column: 25,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [401, 433],
                                loc: {
                                    start: {
                                        line: 15,
                                        column: 4,
                                    },
                                    end: {
                                        line: 15,
                                        column: 36,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [439, 442],
                                    loc: {
                                        start: {
                                            line: 16,
                                            column: 4,
                                        },
                                        end: {
                                            line: 16,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [467, 468],
                                                        loc: {
                                                            start: {
                                                                line: 16,
                                                                column: 32,
                                                            },
                                                            end: {
                                                                line: 16,
                                                                column: 33,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [467, 470],
                                                    loc: {
                                                        start: {
                                                            line: 16,
                                                            column: 32,
                                                        },
                                                        end: {
                                                            line: 16,
                                                            column: 35,
                                                        },
                                                    },
                                                },
                                                range: [467, 470],
                                                loc: {
                                                    start: {
                                                        line: 16,
                                                        column: 32,
                                                    },
                                                    end: {
                                                        line: 16,
                                                        column: 35,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [466, 471],
                                        loc: {
                                            start: {
                                                line: 16,
                                                column: 31,
                                            },
                                            end: {
                                                line: 16,
                                                column: 36,
                                            },
                                        },
                                    },
                                    async: true,
                                    expression: false,
                                    range: [446, 471],
                                    loc: {
                                        start: {
                                            line: 16,
                                            column: 11,
                                        },
                                        end: {
                                            line: 16,
                                            column: 36,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 16,
                                                column: 19,
                                            },
                                            end: {
                                                line: 16,
                                                column: 27,
                                            },
                                        },
                                        range: [454, 462],
                                        typeAnnotation: {
                                            type: 'TSParenthesizedType',
                                            typeAnnotation: {
                                                type: 'TSVoidKeyword',
                                                range: [457, 461],
                                                loc: {
                                                    start: {
                                                        line: 16,
                                                        column: 22,
                                                    },
                                                    end: {
                                                        line: 16,
                                                        column: 26,
                                                    },
                                                },
                                            },
                                            range: [456, 462],
                                            loc: {
                                                start: {
                                                    line: 16,
                                                    column: 21,
                                                },
                                                end: {
                                                    line: 16,
                                                    column: 27,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [439, 473],
                                loc: {
                                    start: {
                                        line: 16,
                                        column: 4,
                                    },
                                    end: {
                                        line: 16,
                                        column: 38,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [480, 483],
                                    loc: {
                                        start: {
                                            line: 18,
                                            column: 4,
                                        },
                                        end: {
                                            line: 18,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [
                                        {
                                            type: 'Identifier',
                                            name: 'arg',
                                            range: [492, 498],
                                            loc: {
                                                start: {
                                                    line: 18,
                                                    column: 16,
                                                },
                                                end: {
                                                    line: 18,
                                                    column: 22,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 18,
                                                        column: 19,
                                                    },
                                                    end: {
                                                        line: 18,
                                                        column: 22,
                                                    },
                                                },
                                                range: [495, 498],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [497, 498],
                                                        loc: {
                                                            start: {
                                                                line: 18,
                                                                column: 21,
                                                            },
                                                            end: {
                                                                line: 18,
                                                                column: 22,
                                                            },
                                                        },
                                                    },
                                                    range: [497, 498],
                                                    loc: {
                                                        start: {
                                                            line: 18,
                                                            column: 21,
                                                        },
                                                        end: {
                                                            line: 18,
                                                            column: 22,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [510, 511],
                                                        loc: {
                                                            start: {
                                                                line: 18,
                                                                column: 34,
                                                            },
                                                            end: {
                                                                line: 18,
                                                                column: 35,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [510, 513],
                                                    loc: {
                                                        start: {
                                                            line: 18,
                                                            column: 34,
                                                        },
                                                        end: {
                                                            line: 18,
                                                            column: 37,
                                                        },
                                                    },
                                                },
                                                range: [510, 513],
                                                loc: {
                                                    start: {
                                                        line: 18,
                                                        column: 34,
                                                    },
                                                    end: {
                                                        line: 18,
                                                        column: 37,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [509, 514],
                                        loc: {
                                            start: {
                                                line: 18,
                                                column: 33,
                                            },
                                            end: {
                                                line: 18,
                                                column: 38,
                                            },
                                        },
                                    },
                                    async: true,
                                    expression: false,
                                    range: [485, 514],
                                    loc: {
                                        start: {
                                            line: 18,
                                            column: 9,
                                        },
                                        end: {
                                            line: 18,
                                            column: 38,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 18,
                                                column: 23,
                                            },
                                            end: {
                                                line: 18,
                                                column: 29,
                                            },
                                        },
                                        range: [499, 505],
                                        typeAnnotation: {
                                            type: 'TSVoidKeyword',
                                            range: [501, 505],
                                            loc: {
                                                start: {
                                                    line: 18,
                                                    column: 25,
                                                },
                                                end: {
                                                    line: 18,
                                                    column: 29,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [480, 514],
                                loc: {
                                    start: {
                                        line: 18,
                                        column: 4,
                                    },
                                    end: {
                                        line: 18,
                                        column: 38,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [520, 523],
                                    loc: {
                                        start: {
                                            line: 19,
                                            column: 4,
                                        },
                                        end: {
                                            line: 19,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [
                                        {
                                            type: 'Identifier',
                                            name: 'arg',
                                            range: [534, 540],
                                            loc: {
                                                start: {
                                                    line: 19,
                                                    column: 18,
                                                },
                                                end: {
                                                    line: 19,
                                                    column: 24,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 19,
                                                        column: 21,
                                                    },
                                                    end: {
                                                        line: 19,
                                                        column: 24,
                                                    },
                                                },
                                                range: [537, 540],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [539, 540],
                                                        loc: {
                                                            start: {
                                                                line: 19,
                                                                column: 23,
                                                            },
                                                            end: {
                                                                line: 19,
                                                                column: 24,
                                                            },
                                                        },
                                                    },
                                                    range: [539, 540],
                                                    loc: {
                                                        start: {
                                                            line: 19,
                                                            column: 23,
                                                        },
                                                        end: {
                                                            line: 19,
                                                            column: 24,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [552, 553],
                                                        loc: {
                                                            start: {
                                                                line: 19,
                                                                column: 36,
                                                            },
                                                            end: {
                                                                line: 19,
                                                                column: 37,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [552, 555],
                                                    loc: {
                                                        start: {
                                                            line: 19,
                                                            column: 36,
                                                        },
                                                        end: {
                                                            line: 19,
                                                            column: 39,
                                                        },
                                                    },
                                                },
                                                range: [552, 555],
                                                loc: {
                                                    start: {
                                                        line: 19,
                                                        column: 36,
                                                    },
                                                    end: {
                                                        line: 19,
                                                        column: 39,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [551, 556],
                                        loc: {
                                            start: {
                                                line: 19,
                                                column: 35,
                                            },
                                            end: {
                                                line: 19,
                                                column: 40,
                                            },
                                        },
                                    },
                                    async: true,
                                    expression: false,
                                    range: [527, 556],
                                    loc: {
                                        start: {
                                            line: 19,
                                            column: 11,
                                        },
                                        end: {
                                            line: 19,
                                            column: 40,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 19,
                                                column: 25,
                                            },
                                            end: {
                                                line: 19,
                                                column: 31,
                                            },
                                        },
                                        range: [541, 547],
                                        typeAnnotation: {
                                            type: 'TSVoidKeyword',
                                            range: [543, 547],
                                            loc: {
                                                start: {
                                                    line: 19,
                                                    column: 27,
                                                },
                                                end: {
                                                    line: 19,
                                                    column: 31,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [520, 558],
                                loc: {
                                    start: {
                                        line: 19,
                                        column: 4,
                                    },
                                    end: {
                                        line: 19,
                                        column: 42,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [564, 567],
                                    loc: {
                                        start: {
                                            line: 20,
                                            column: 4,
                                        },
                                        end: {
                                            line: 20,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [
                                        {
                                            type: 'Identifier',
                                            name: 'arg',
                                            range: [578, 584],
                                            loc: {
                                                start: {
                                                    line: 20,
                                                    column: 18,
                                                },
                                                end: {
                                                    line: 20,
                                                    column: 24,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 20,
                                                        column: 21,
                                                    },
                                                    end: {
                                                        line: 20,
                                                        column: 24,
                                                    },
                                                },
                                                range: [581, 584],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [583, 584],
                                                        loc: {
                                                            start: {
                                                                line: 20,
                                                                column: 23,
                                                            },
                                                            end: {
                                                                line: 20,
                                                                column: 24,
                                                            },
                                                        },
                                                    },
                                                    range: [583, 584],
                                                    loc: {
                                                        start: {
                                                            line: 20,
                                                            column: 23,
                                                        },
                                                        end: {
                                                            line: 20,
                                                            column: 24,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [598, 599],
                                                        loc: {
                                                            start: {
                                                                line: 20,
                                                                column: 38,
                                                            },
                                                            end: {
                                                                line: 20,
                                                                column: 39,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [598, 601],
                                                    loc: {
                                                        start: {
                                                            line: 20,
                                                            column: 38,
                                                        },
                                                        end: {
                                                            line: 20,
                                                            column: 41,
                                                        },
                                                    },
                                                },
                                                range: [598, 601],
                                                loc: {
                                                    start: {
                                                        line: 20,
                                                        column: 38,
                                                    },
                                                    end: {
                                                        line: 20,
                                                        column: 41,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [597, 602],
                                        loc: {
                                            start: {
                                                line: 20,
                                                column: 37,
                                            },
                                            end: {
                                                line: 20,
                                                column: 42,
                                            },
                                        },
                                    },
                                    async: true,
                                    expression: false,
                                    range: [571, 602],
                                    loc: {
                                        start: {
                                            line: 20,
                                            column: 11,
                                        },
                                        end: {
                                            line: 20,
                                            column: 42,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 20,
                                                column: 25,
                                            },
                                            end: {
                                                line: 20,
                                                column: 33,
                                            },
                                        },
                                        range: [585, 593],
                                        typeAnnotation: {
                                            type: 'TSParenthesizedType',
                                            typeAnnotation: {
                                                type: 'TSVoidKeyword',
                                                range: [588, 592],
                                                loc: {
                                                    start: {
                                                        line: 20,
                                                        column: 28,
                                                    },
                                                    end: {
                                                        line: 20,
                                                        column: 32,
                                                    },
                                                },
                                            },
                                            range: [587, 593],
                                            loc: {
                                                start: {
                                                    line: 20,
                                                    column: 27,
                                                },
                                                end: {
                                                    line: 20,
                                                    column: 33,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [564, 604],
                                loc: {
                                    start: {
                                        line: 20,
                                        column: 4,
                                    },
                                    end: {
                                        line: 20,
                                        column: 44,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [611, 614],
                                    loc: {
                                        start: {
                                            line: 22,
                                            column: 4,
                                        },
                                        end: {
                                            line: 22,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [
                                        {
                                            type: 'Identifier',
                                            name: 'arg',
                                            range: [623, 629],
                                            loc: {
                                                start: {
                                                    line: 22,
                                                    column: 16,
                                                },
                                                end: {
                                                    line: 22,
                                                    column: 22,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 22,
                                                        column: 19,
                                                    },
                                                    end: {
                                                        line: 22,
                                                        column: 22,
                                                    },
                                                },
                                                range: [626, 629],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [628, 629],
                                                        loc: {
                                                            start: {
                                                                line: 22,
                                                                column: 21,
                                                            },
                                                            end: {
                                                                line: 22,
                                                                column: 22,
                                                            },
                                                        },
                                                    },
                                                    range: [628, 629],
                                                    loc: {
                                                        start: {
                                                            line: 22,
                                                            column: 21,
                                                        },
                                                        end: {
                                                            line: 22,
                                                            column: 22,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            type: 'Identifier',
                                            name: 'arg2',
                                            range: [631, 638],
                                            loc: {
                                                start: {
                                                    line: 22,
                                                    column: 24,
                                                },
                                                end: {
                                                    line: 22,
                                                    column: 31,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 22,
                                                        column: 28,
                                                    },
                                                    end: {
                                                        line: 22,
                                                        column: 31,
                                                    },
                                                },
                                                range: [635, 638],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [637, 638],
                                                        loc: {
                                                            start: {
                                                                line: 22,
                                                                column: 30,
                                                            },
                                                            end: {
                                                                line: 22,
                                                                column: 31,
                                                            },
                                                        },
                                                    },
                                                    range: [637, 638],
                                                    loc: {
                                                        start: {
                                                            line: 22,
                                                            column: 30,
                                                        },
                                                        end: {
                                                            line: 22,
                                                            column: 31,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [650, 651],
                                                        loc: {
                                                            start: {
                                                                line: 22,
                                                                column: 43,
                                                            },
                                                            end: {
                                                                line: 22,
                                                                column: 44,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [650, 653],
                                                    loc: {
                                                        start: {
                                                            line: 22,
                                                            column: 43,
                                                        },
                                                        end: {
                                                            line: 22,
                                                            column: 46,
                                                        },
                                                    },
                                                },
                                                range: [650, 653],
                                                loc: {
                                                    start: {
                                                        line: 22,
                                                        column: 43,
                                                    },
                                                    end: {
                                                        line: 22,
                                                        column: 46,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [649, 654],
                                        loc: {
                                            start: {
                                                line: 22,
                                                column: 42,
                                            },
                                            end: {
                                                line: 22,
                                                column: 47,
                                            },
                                        },
                                    },
                                    async: true,
                                    expression: false,
                                    range: [616, 654],
                                    loc: {
                                        start: {
                                            line: 22,
                                            column: 9,
                                        },
                                        end: {
                                            line: 22,
                                            column: 47,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 22,
                                                column: 32,
                                            },
                                            end: {
                                                line: 22,
                                                column: 38,
                                            },
                                        },
                                        range: [639, 645],
                                        typeAnnotation: {
                                            type: 'TSVoidKeyword',
                                            range: [641, 645],
                                            loc: {
                                                start: {
                                                    line: 22,
                                                    column: 34,
                                                },
                                                end: {
                                                    line: 22,
                                                    column: 38,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [611, 654],
                                loc: {
                                    start: {
                                        line: 22,
                                        column: 4,
                                    },
                                    end: {
                                        line: 22,
                                        column: 47,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [660, 663],
                                    loc: {
                                        start: {
                                            line: 23,
                                            column: 4,
                                        },
                                        end: {
                                            line: 23,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [
                                        {
                                            type: 'Identifier',
                                            name: 'arg',
                                            range: [674, 680],
                                            loc: {
                                                start: {
                                                    line: 23,
                                                    column: 18,
                                                },
                                                end: {
                                                    line: 23,
                                                    column: 24,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 23,
                                                        column: 21,
                                                    },
                                                    end: {
                                                        line: 23,
                                                        column: 24,
                                                    },
                                                },
                                                range: [677, 680],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [679, 680],
                                                        loc: {
                                                            start: {
                                                                line: 23,
                                                                column: 23,
                                                            },
                                                            end: {
                                                                line: 23,
                                                                column: 24,
                                                            },
                                                        },
                                                    },
                                                    range: [679, 680],
                                                    loc: {
                                                        start: {
                                                            line: 23,
                                                            column: 23,
                                                        },
                                                        end: {
                                                            line: 23,
                                                            column: 24,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            type: 'Identifier',
                                            name: 'arg2',
                                            range: [682, 689],
                                            loc: {
                                                start: {
                                                    line: 23,
                                                    column: 26,
                                                },
                                                end: {
                                                    line: 23,
                                                    column: 33,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 23,
                                                        column: 30,
                                                    },
                                                    end: {
                                                        line: 23,
                                                        column: 33,
                                                    },
                                                },
                                                range: [686, 689],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [688, 689],
                                                        loc: {
                                                            start: {
                                                                line: 23,
                                                                column: 32,
                                                            },
                                                            end: {
                                                                line: 23,
                                                                column: 33,
                                                            },
                                                        },
                                                    },
                                                    range: [688, 689],
                                                    loc: {
                                                        start: {
                                                            line: 23,
                                                            column: 32,
                                                        },
                                                        end: {
                                                            line: 23,
                                                            column: 33,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [701, 702],
                                                        loc: {
                                                            start: {
                                                                line: 23,
                                                                column: 45,
                                                            },
                                                            end: {
                                                                line: 23,
                                                                column: 46,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [701, 704],
                                                    loc: {
                                                        start: {
                                                            line: 23,
                                                            column: 45,
                                                        },
                                                        end: {
                                                            line: 23,
                                                            column: 48,
                                                        },
                                                    },
                                                },
                                                range: [701, 704],
                                                loc: {
                                                    start: {
                                                        line: 23,
                                                        column: 45,
                                                    },
                                                    end: {
                                                        line: 23,
                                                        column: 48,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [700, 705],
                                        loc: {
                                            start: {
                                                line: 23,
                                                column: 44,
                                            },
                                            end: {
                                                line: 23,
                                                column: 49,
                                            },
                                        },
                                    },
                                    async: true,
                                    expression: false,
                                    range: [667, 705],
                                    loc: {
                                        start: {
                                            line: 23,
                                            column: 11,
                                        },
                                        end: {
                                            line: 23,
                                            column: 49,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 23,
                                                column: 34,
                                            },
                                            end: {
                                                line: 23,
                                                column: 40,
                                            },
                                        },
                                        range: [690, 696],
                                        typeAnnotation: {
                                            type: 'TSVoidKeyword',
                                            range: [692, 696],
                                            loc: {
                                                start: {
                                                    line: 23,
                                                    column: 36,
                                                },
                                                end: {
                                                    line: 23,
                                                    column: 40,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [660, 707],
                                loc: {
                                    start: {
                                        line: 23,
                                        column: 4,
                                    },
                                    end: {
                                        line: 23,
                                        column: 51,
                                    },
                                },
                            },
                            {
                                type: 'Property',
                                key: {
                                    type: 'Identifier',
                                    name: 'key',
                                    range: [713, 716],
                                    loc: {
                                        start: {
                                            line: 24,
                                            column: 4,
                                        },
                                        end: {
                                            line: 24,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: 'ArrowFunctionExpression',
                                    generator: false,
                                    id: null,
                                    params: [
                                        {
                                            type: 'Identifier',
                                            name: 'arg',
                                            range: [727, 733],
                                            loc: {
                                                start: {
                                                    line: 24,
                                                    column: 18,
                                                },
                                                end: {
                                                    line: 24,
                                                    column: 24,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 24,
                                                        column: 21,
                                                    },
                                                    end: {
                                                        line: 24,
                                                        column: 24,
                                                    },
                                                },
                                                range: [730, 733],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [732, 733],
                                                        loc: {
                                                            start: {
                                                                line: 24,
                                                                column: 23,
                                                            },
                                                            end: {
                                                                line: 24,
                                                                column: 24,
                                                            },
                                                        },
                                                    },
                                                    range: [732, 733],
                                                    loc: {
                                                        start: {
                                                            line: 24,
                                                            column: 23,
                                                        },
                                                        end: {
                                                            line: 24,
                                                            column: 24,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            type: 'Identifier',
                                            name: 'arg2',
                                            range: [735, 742],
                                            loc: {
                                                start: {
                                                    line: 24,
                                                    column: 26,
                                                },
                                                end: {
                                                    line: 24,
                                                    column: 33,
                                                },
                                            },
                                            typeAnnotation: {
                                                type: 'TSTypeAnnotation',
                                                loc: {
                                                    start: {
                                                        line: 24,
                                                        column: 30,
                                                    },
                                                    end: {
                                                        line: 24,
                                                        column: 33,
                                                    },
                                                },
                                                range: [739, 742],
                                                typeAnnotation: {
                                                    type: 'TSTypeReference',
                                                    typeName: {
                                                        type: 'Identifier',
                                                        name: 't',
                                                        range: [741, 742],
                                                        loc: {
                                                            start: {
                                                                line: 24,
                                                                column: 32,
                                                            },
                                                            end: {
                                                                line: 24,
                                                                column: 33,
                                                            },
                                                        },
                                                    },
                                                    range: [741, 742],
                                                    loc: {
                                                        start: {
                                                            line: 24,
                                                            column: 32,
                                                        },
                                                        end: {
                                                            line: 24,
                                                            column: 33,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                    body: {
                                        type: 'BlockStatement',
                                        body: [
                                            {
                                                type: 'ExpressionStatement',
                                                expression: {
                                                    type: 'CallExpression',
                                                    callee: {
                                                        type: 'Identifier',
                                                        name: 'x',
                                                        range: [756, 757],
                                                        loc: {
                                                            start: {
                                                                line: 24,
                                                                column: 47,
                                                            },
                                                            end: {
                                                                line: 24,
                                                                column: 48,
                                                            },
                                                        },
                                                    },
                                                    arguments: [],
                                                    range: [756, 759],
                                                    loc: {
                                                        start: {
                                                            line: 24,
                                                            column: 47,
                                                        },
                                                        end: {
                                                            line: 24,
                                                            column: 50,
                                                        },
                                                    },
                                                },
                                                range: [756, 759],
                                                loc: {
                                                    start: {
                                                        line: 24,
                                                        column: 47,
                                                    },
                                                    end: {
                                                        line: 24,
                                                        column: 50,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [755, 760],
                                        loc: {
                                            start: {
                                                line: 24,
                                                column: 46,
                                            },
                                            end: {
                                                line: 24,
                                                column: 51,
                                            },
                                        },
                                    },
                                    async: true,
                                    expression: false,
                                    range: [720, 760],
                                    loc: {
                                        start: {
                                            line: 24,
                                            column: 11,
                                        },
                                        end: {
                                            line: 24,
                                            column: 51,
                                        },
                                    },
                                    returnType: {
                                        type: 'TSTypeAnnotation',
                                        loc: {
                                            start: {
                                                line: 24,
                                                column: 34,
                                            },
                                            end: {
                                                line: 24,
                                                column: 42,
                                            },
                                        },
                                        range: [743, 751],
                                        typeAnnotation: {
                                            type: 'TSParenthesizedType',
                                            typeAnnotation: {
                                                type: 'TSVoidKeyword',
                                                range: [746, 750],
                                                loc: {
                                                    start: {
                                                        line: 24,
                                                        column: 37,
                                                    },
                                                    end: {
                                                        line: 24,
                                                        column: 41,
                                                    },
                                                },
                                            },
                                            range: [745, 751],
                                            loc: {
                                                start: {
                                                    line: 24,
                                                    column: 36,
                                                },
                                                end: {
                                                    line: 24,
                                                    column: 42,
                                                },
                                            },
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                shorthand: false,
                                kind: 'init',
                                range: [713, 762],
                                loc: {
                                    start: {
                                        line: 24,
                                        column: 4,
                                    },
                                    end: {
                                        line: 24,
                                        column: 53,
                                    },
                                },
                            },
                        ],
                        range: [13, 765],
                        loc: {
                            start: {
                                line: 1,
                                column: 13,
                            },
                            end: {
                                line: 25,
                                column: 1,
                            },
                        },
                    },
                    range: [6, 765],
                    loc: {
                        start: {
                            line: 1,
                            column: 6,
                        },
                        end: {
                            line: 25,
                            column: 1,
                        },
                    },
                },
            ],
            kind: 'const',
            range: [0, 765],
            loc: {
                start: {
                    line: 1,
                    column: 0,
                },
                end: {
                    line: 25,
                    column: 1,
                },
            },
        },
    ],
    sourceType: 'module',
    range: [0, 765],
    loc: {
        start: {
            line: 1,
            column: 0,
        },
        end: {
            line: 25,
            column: 1,
        },
    },
    tokens: [
        {
            type: 'Keyword',
            value: 'const',
            range: [0, 5],
            loc: {
                start: {
                    line: 1,
                    column: 0,
                },
                end: {
                    line: 1,
                    column: 5,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'test',
            range: [6, 10],
            loc: {
                start: {
                    line: 1,
                    column: 6,
                },
                end: {
                    line: 1,
                    column: 10,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=',
            range: [11, 12],
            loc: {
                start: {
                    line: 1,
                    column: 11,
                },
                end: {
                    line: 1,
                    column: 12,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [13, 14],
            loc: {
                start: {
                    line: 1,
                    column: 13,
                },
                end: {
                    line: 1,
                    column: 14,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [19, 22],
            loc: {
                start: {
                    line: 2,
                    column: 4,
                },
                end: {
                    line: 2,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [22, 23],
            loc: {
                start: {
                    line: 2,
                    column: 7,
                },
                end: {
                    line: 2,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [24, 25],
            loc: {
                start: {
                    line: 2,
                    column: 9,
                },
                end: {
                    line: 2,
                    column: 10,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [25, 26],
            loc: {
                start: {
                    line: 2,
                    column: 10,
                },
                end: {
                    line: 2,
                    column: 11,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [26, 27],
            loc: {
                start: {
                    line: 2,
                    column: 11,
                },
                end: {
                    line: 2,
                    column: 12,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [28, 32],
            loc: {
                start: {
                    line: 2,
                    column: 13,
                },
                end: {
                    line: 2,
                    column: 17,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [33, 35],
            loc: {
                start: {
                    line: 2,
                    column: 18,
                },
                end: {
                    line: 2,
                    column: 20,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [36, 37],
            loc: {
                start: {
                    line: 2,
                    column: 21,
                },
                end: {
                    line: 2,
                    column: 22,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [37, 38],
            loc: {
                start: {
                    line: 2,
                    column: 22,
                },
                end: {
                    line: 2,
                    column: 23,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [38, 39],
            loc: {
                start: {
                    line: 2,
                    column: 23,
                },
                end: {
                    line: 2,
                    column: 24,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [39, 40],
            loc: {
                start: {
                    line: 2,
                    column: 24,
                },
                end: {
                    line: 2,
                    column: 25,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [40, 41],
            loc: {
                start: {
                    line: 2,
                    column: 25,
                },
                end: {
                    line: 2,
                    column: 26,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [41, 42],
            loc: {
                start: {
                    line: 2,
                    column: 26,
                },
                end: {
                    line: 2,
                    column: 27,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [47, 50],
            loc: {
                start: {
                    line: 3,
                    column: 4,
                },
                end: {
                    line: 3,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [50, 51],
            loc: {
                start: {
                    line: 3,
                    column: 7,
                },
                end: {
                    line: 3,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [52, 53],
            loc: {
                start: {
                    line: 3,
                    column: 9,
                },
                end: {
                    line: 3,
                    column: 10,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [54, 55],
            loc: {
                start: {
                    line: 3,
                    column: 11,
                },
                end: {
                    line: 3,
                    column: 12,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [55, 56],
            loc: {
                start: {
                    line: 3,
                    column: 12,
                },
                end: {
                    line: 3,
                    column: 13,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [56, 57],
            loc: {
                start: {
                    line: 3,
                    column: 13,
                },
                end: {
                    line: 3,
                    column: 14,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [58, 62],
            loc: {
                start: {
                    line: 3,
                    column: 15,
                },
                end: {
                    line: 3,
                    column: 19,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [63, 65],
            loc: {
                start: {
                    line: 3,
                    column: 20,
                },
                end: {
                    line: 3,
                    column: 22,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [66, 67],
            loc: {
                start: {
                    line: 3,
                    column: 23,
                },
                end: {
                    line: 3,
                    column: 24,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [67, 68],
            loc: {
                start: {
                    line: 3,
                    column: 24,
                },
                end: {
                    line: 3,
                    column: 25,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [68, 69],
            loc: {
                start: {
                    line: 3,
                    column: 25,
                },
                end: {
                    line: 3,
                    column: 26,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [69, 70],
            loc: {
                start: {
                    line: 3,
                    column: 26,
                },
                end: {
                    line: 3,
                    column: 27,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [70, 71],
            loc: {
                start: {
                    line: 3,
                    column: 27,
                },
                end: {
                    line: 3,
                    column: 28,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [72, 73],
            loc: {
                start: {
                    line: 3,
                    column: 29,
                },
                end: {
                    line: 3,
                    column: 30,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [73, 74],
            loc: {
                start: {
                    line: 3,
                    column: 30,
                },
                end: {
                    line: 3,
                    column: 31,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [79, 82],
            loc: {
                start: {
                    line: 4,
                    column: 4,
                },
                end: {
                    line: 4,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [82, 83],
            loc: {
                start: {
                    line: 4,
                    column: 7,
                },
                end: {
                    line: 4,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [84, 85],
            loc: {
                start: {
                    line: 4,
                    column: 9,
                },
                end: {
                    line: 4,
                    column: 10,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [86, 87],
            loc: {
                start: {
                    line: 4,
                    column: 11,
                },
                end: {
                    line: 4,
                    column: 12,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [87, 88],
            loc: {
                start: {
                    line: 4,
                    column: 12,
                },
                end: {
                    line: 4,
                    column: 13,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [88, 89],
            loc: {
                start: {
                    line: 4,
                    column: 13,
                },
                end: {
                    line: 4,
                    column: 14,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [90, 91],
            loc: {
                start: {
                    line: 4,
                    column: 15,
                },
                end: {
                    line: 4,
                    column: 16,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [91, 95],
            loc: {
                start: {
                    line: 4,
                    column: 16,
                },
                end: {
                    line: 4,
                    column: 20,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [95, 96],
            loc: {
                start: {
                    line: 4,
                    column: 20,
                },
                end: {
                    line: 4,
                    column: 21,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [97, 99],
            loc: {
                start: {
                    line: 4,
                    column: 22,
                },
                end: {
                    line: 4,
                    column: 24,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [100, 101],
            loc: {
                start: {
                    line: 4,
                    column: 25,
                },
                end: {
                    line: 4,
                    column: 26,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [101, 102],
            loc: {
                start: {
                    line: 4,
                    column: 26,
                },
                end: {
                    line: 4,
                    column: 27,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [102, 103],
            loc: {
                start: {
                    line: 4,
                    column: 27,
                },
                end: {
                    line: 4,
                    column: 28,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [103, 104],
            loc: {
                start: {
                    line: 4,
                    column: 28,
                },
                end: {
                    line: 4,
                    column: 29,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [104, 105],
            loc: {
                start: {
                    line: 4,
                    column: 29,
                },
                end: {
                    line: 4,
                    column: 30,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [106, 107],
            loc: {
                start: {
                    line: 4,
                    column: 31,
                },
                end: {
                    line: 4,
                    column: 32,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [107, 108],
            loc: {
                start: {
                    line: 4,
                    column: 32,
                },
                end: {
                    line: 4,
                    column: 33,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [114, 117],
            loc: {
                start: {
                    line: 6,
                    column: 4,
                },
                end: {
                    line: 6,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [117, 118],
            loc: {
                start: {
                    line: 6,
                    column: 7,
                },
                end: {
                    line: 6,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [119, 120],
            loc: {
                start: {
                    line: 6,
                    column: 9,
                },
                end: {
                    line: 6,
                    column: 10,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg',
            range: [120, 123],
            loc: {
                start: {
                    line: 6,
                    column: 10,
                },
                end: {
                    line: 6,
                    column: 13,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [123, 124],
            loc: {
                start: {
                    line: 6,
                    column: 13,
                },
                end: {
                    line: 6,
                    column: 14,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [125, 126],
            loc: {
                start: {
                    line: 6,
                    column: 15,
                },
                end: {
                    line: 6,
                    column: 16,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [126, 127],
            loc: {
                start: {
                    line: 6,
                    column: 16,
                },
                end: {
                    line: 6,
                    column: 17,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [127, 128],
            loc: {
                start: {
                    line: 6,
                    column: 17,
                },
                end: {
                    line: 6,
                    column: 18,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [129, 133],
            loc: {
                start: {
                    line: 6,
                    column: 19,
                },
                end: {
                    line: 6,
                    column: 23,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [134, 136],
            loc: {
                start: {
                    line: 6,
                    column: 24,
                },
                end: {
                    line: 6,
                    column: 26,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [137, 138],
            loc: {
                start: {
                    line: 6,
                    column: 27,
                },
                end: {
                    line: 6,
                    column: 28,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [138, 139],
            loc: {
                start: {
                    line: 6,
                    column: 28,
                },
                end: {
                    line: 6,
                    column: 29,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [139, 140],
            loc: {
                start: {
                    line: 6,
                    column: 29,
                },
                end: {
                    line: 6,
                    column: 30,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [140, 141],
            loc: {
                start: {
                    line: 6,
                    column: 30,
                },
                end: {
                    line: 6,
                    column: 31,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [141, 142],
            loc: {
                start: {
                    line: 6,
                    column: 31,
                },
                end: {
                    line: 6,
                    column: 32,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [142, 143],
            loc: {
                start: {
                    line: 6,
                    column: 32,
                },
                end: {
                    line: 6,
                    column: 33,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [148, 151],
            loc: {
                start: {
                    line: 7,
                    column: 4,
                },
                end: {
                    line: 7,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [151, 152],
            loc: {
                start: {
                    line: 7,
                    column: 7,
                },
                end: {
                    line: 7,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [153, 154],
            loc: {
                start: {
                    line: 7,
                    column: 9,
                },
                end: {
                    line: 7,
                    column: 10,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [155, 156],
            loc: {
                start: {
                    line: 7,
                    column: 11,
                },
                end: {
                    line: 7,
                    column: 12,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg',
            range: [156, 159],
            loc: {
                start: {
                    line: 7,
                    column: 12,
                },
                end: {
                    line: 7,
                    column: 15,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [159, 160],
            loc: {
                start: {
                    line: 7,
                    column: 15,
                },
                end: {
                    line: 7,
                    column: 16,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [161, 162],
            loc: {
                start: {
                    line: 7,
                    column: 17,
                },
                end: {
                    line: 7,
                    column: 18,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [162, 163],
            loc: {
                start: {
                    line: 7,
                    column: 18,
                },
                end: {
                    line: 7,
                    column: 19,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [163, 164],
            loc: {
                start: {
                    line: 7,
                    column: 19,
                },
                end: {
                    line: 7,
                    column: 20,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [165, 169],
            loc: {
                start: {
                    line: 7,
                    column: 21,
                },
                end: {
                    line: 7,
                    column: 25,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [170, 172],
            loc: {
                start: {
                    line: 7,
                    column: 26,
                },
                end: {
                    line: 7,
                    column: 28,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [173, 174],
            loc: {
                start: {
                    line: 7,
                    column: 29,
                },
                end: {
                    line: 7,
                    column: 30,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [174, 175],
            loc: {
                start: {
                    line: 7,
                    column: 30,
                },
                end: {
                    line: 7,
                    column: 31,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [175, 176],
            loc: {
                start: {
                    line: 7,
                    column: 31,
                },
                end: {
                    line: 7,
                    column: 32,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [176, 177],
            loc: {
                start: {
                    line: 7,
                    column: 32,
                },
                end: {
                    line: 7,
                    column: 33,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [177, 178],
            loc: {
                start: {
                    line: 7,
                    column: 33,
                },
                end: {
                    line: 7,
                    column: 34,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [179, 180],
            loc: {
                start: {
                    line: 7,
                    column: 35,
                },
                end: {
                    line: 7,
                    column: 36,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [180, 181],
            loc: {
                start: {
                    line: 7,
                    column: 36,
                },
                end: {
                    line: 7,
                    column: 37,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [186, 189],
            loc: {
                start: {
                    line: 8,
                    column: 4,
                },
                end: {
                    line: 8,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [189, 190],
            loc: {
                start: {
                    line: 8,
                    column: 7,
                },
                end: {
                    line: 8,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [191, 192],
            loc: {
                start: {
                    line: 8,
                    column: 9,
                },
                end: {
                    line: 8,
                    column: 10,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [193, 194],
            loc: {
                start: {
                    line: 8,
                    column: 11,
                },
                end: {
                    line: 8,
                    column: 12,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg',
            range: [194, 197],
            loc: {
                start: {
                    line: 8,
                    column: 12,
                },
                end: {
                    line: 8,
                    column: 15,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [197, 198],
            loc: {
                start: {
                    line: 8,
                    column: 15,
                },
                end: {
                    line: 8,
                    column: 16,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [199, 200],
            loc: {
                start: {
                    line: 8,
                    column: 17,
                },
                end: {
                    line: 8,
                    column: 18,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [200, 201],
            loc: {
                start: {
                    line: 8,
                    column: 18,
                },
                end: {
                    line: 8,
                    column: 19,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [201, 202],
            loc: {
                start: {
                    line: 8,
                    column: 19,
                },
                end: {
                    line: 8,
                    column: 20,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [203, 204],
            loc: {
                start: {
                    line: 8,
                    column: 21,
                },
                end: {
                    line: 8,
                    column: 22,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [204, 208],
            loc: {
                start: {
                    line: 8,
                    column: 22,
                },
                end: {
                    line: 8,
                    column: 26,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [208, 209],
            loc: {
                start: {
                    line: 8,
                    column: 26,
                },
                end: {
                    line: 8,
                    column: 27,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [210, 212],
            loc: {
                start: {
                    line: 8,
                    column: 28,
                },
                end: {
                    line: 8,
                    column: 30,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [213, 214],
            loc: {
                start: {
                    line: 8,
                    column: 31,
                },
                end: {
                    line: 8,
                    column: 32,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [214, 215],
            loc: {
                start: {
                    line: 8,
                    column: 32,
                },
                end: {
                    line: 8,
                    column: 33,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [215, 216],
            loc: {
                start: {
                    line: 8,
                    column: 33,
                },
                end: {
                    line: 8,
                    column: 34,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [216, 217],
            loc: {
                start: {
                    line: 8,
                    column: 34,
                },
                end: {
                    line: 8,
                    column: 35,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [217, 218],
            loc: {
                start: {
                    line: 8,
                    column: 35,
                },
                end: {
                    line: 8,
                    column: 36,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [219, 220],
            loc: {
                start: {
                    line: 8,
                    column: 37,
                },
                end: {
                    line: 8,
                    column: 38,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [220, 221],
            loc: {
                start: {
                    line: 8,
                    column: 38,
                },
                end: {
                    line: 8,
                    column: 39,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [227, 230],
            loc: {
                start: {
                    line: 10,
                    column: 4,
                },
                end: {
                    line: 10,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [230, 231],
            loc: {
                start: {
                    line: 10,
                    column: 7,
                },
                end: {
                    line: 10,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [232, 233],
            loc: {
                start: {
                    line: 10,
                    column: 9,
                },
                end: {
                    line: 10,
                    column: 10,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg',
            range: [233, 236],
            loc: {
                start: {
                    line: 10,
                    column: 10,
                },
                end: {
                    line: 10,
                    column: 13,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [236, 237],
            loc: {
                start: {
                    line: 10,
                    column: 13,
                },
                end: {
                    line: 10,
                    column: 14,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [238, 239],
            loc: {
                start: {
                    line: 10,
                    column: 15,
                },
                end: {
                    line: 10,
                    column: 16,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [239, 240],
            loc: {
                start: {
                    line: 10,
                    column: 16,
                },
                end: {
                    line: 10,
                    column: 17,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg2',
            range: [241, 245],
            loc: {
                start: {
                    line: 10,
                    column: 18,
                },
                end: {
                    line: 10,
                    column: 22,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [245, 246],
            loc: {
                start: {
                    line: 10,
                    column: 22,
                },
                end: {
                    line: 10,
                    column: 23,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [247, 248],
            loc: {
                start: {
                    line: 10,
                    column: 24,
                },
                end: {
                    line: 10,
                    column: 25,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [248, 249],
            loc: {
                start: {
                    line: 10,
                    column: 25,
                },
                end: {
                    line: 10,
                    column: 26,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [249, 250],
            loc: {
                start: {
                    line: 10,
                    column: 26,
                },
                end: {
                    line: 10,
                    column: 27,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [251, 255],
            loc: {
                start: {
                    line: 10,
                    column: 28,
                },
                end: {
                    line: 10,
                    column: 32,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [256, 258],
            loc: {
                start: {
                    line: 10,
                    column: 33,
                },
                end: {
                    line: 10,
                    column: 35,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [259, 260],
            loc: {
                start: {
                    line: 10,
                    column: 36,
                },
                end: {
                    line: 10,
                    column: 37,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [260, 261],
            loc: {
                start: {
                    line: 10,
                    column: 37,
                },
                end: {
                    line: 10,
                    column: 38,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [261, 262],
            loc: {
                start: {
                    line: 10,
                    column: 38,
                },
                end: {
                    line: 10,
                    column: 39,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [262, 263],
            loc: {
                start: {
                    line: 10,
                    column: 39,
                },
                end: {
                    line: 10,
                    column: 40,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [263, 264],
            loc: {
                start: {
                    line: 10,
                    column: 40,
                },
                end: {
                    line: 10,
                    column: 41,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [264, 265],
            loc: {
                start: {
                    line: 10,
                    column: 41,
                },
                end: {
                    line: 10,
                    column: 42,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [270, 273],
            loc: {
                start: {
                    line: 11,
                    column: 4,
                },
                end: {
                    line: 11,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [273, 274],
            loc: {
                start: {
                    line: 11,
                    column: 7,
                },
                end: {
                    line: 11,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [275, 276],
            loc: {
                start: {
                    line: 11,
                    column: 9,
                },
                end: {
                    line: 11,
                    column: 10,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [277, 278],
            loc: {
                start: {
                    line: 11,
                    column: 11,
                },
                end: {
                    line: 11,
                    column: 12,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg',
            range: [278, 281],
            loc: {
                start: {
                    line: 11,
                    column: 12,
                },
                end: {
                    line: 11,
                    column: 15,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [281, 282],
            loc: {
                start: {
                    line: 11,
                    column: 15,
                },
                end: {
                    line: 11,
                    column: 16,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [283, 284],
            loc: {
                start: {
                    line: 11,
                    column: 17,
                },
                end: {
                    line: 11,
                    column: 18,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [284, 285],
            loc: {
                start: {
                    line: 11,
                    column: 18,
                },
                end: {
                    line: 11,
                    column: 19,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg2',
            range: [286, 290],
            loc: {
                start: {
                    line: 11,
                    column: 20,
                },
                end: {
                    line: 11,
                    column: 24,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [290, 291],
            loc: {
                start: {
                    line: 11,
                    column: 24,
                },
                end: {
                    line: 11,
                    column: 25,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [292, 293],
            loc: {
                start: {
                    line: 11,
                    column: 26,
                },
                end: {
                    line: 11,
                    column: 27,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [293, 294],
            loc: {
                start: {
                    line: 11,
                    column: 27,
                },
                end: {
                    line: 11,
                    column: 28,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [294, 295],
            loc: {
                start: {
                    line: 11,
                    column: 28,
                },
                end: {
                    line: 11,
                    column: 29,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [296, 300],
            loc: {
                start: {
                    line: 11,
                    column: 30,
                },
                end: {
                    line: 11,
                    column: 34,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [301, 303],
            loc: {
                start: {
                    line: 11,
                    column: 35,
                },
                end: {
                    line: 11,
                    column: 37,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [304, 305],
            loc: {
                start: {
                    line: 11,
                    column: 38,
                },
                end: {
                    line: 11,
                    column: 39,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [305, 306],
            loc: {
                start: {
                    line: 11,
                    column: 39,
                },
                end: {
                    line: 11,
                    column: 40,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [306, 307],
            loc: {
                start: {
                    line: 11,
                    column: 40,
                },
                end: {
                    line: 11,
                    column: 41,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [307, 308],
            loc: {
                start: {
                    line: 11,
                    column: 41,
                },
                end: {
                    line: 11,
                    column: 42,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [308, 309],
            loc: {
                start: {
                    line: 11,
                    column: 42,
                },
                end: {
                    line: 11,
                    column: 43,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [310, 311],
            loc: {
                start: {
                    line: 11,
                    column: 44,
                },
                end: {
                    line: 11,
                    column: 45,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [311, 312],
            loc: {
                start: {
                    line: 11,
                    column: 45,
                },
                end: {
                    line: 11,
                    column: 46,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [317, 320],
            loc: {
                start: {
                    line: 12,
                    column: 4,
                },
                end: {
                    line: 12,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [320, 321],
            loc: {
                start: {
                    line: 12,
                    column: 7,
                },
                end: {
                    line: 12,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [322, 323],
            loc: {
                start: {
                    line: 12,
                    column: 9,
                },
                end: {
                    line: 12,
                    column: 10,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [324, 325],
            loc: {
                start: {
                    line: 12,
                    column: 11,
                },
                end: {
                    line: 12,
                    column: 12,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg',
            range: [325, 328],
            loc: {
                start: {
                    line: 12,
                    column: 12,
                },
                end: {
                    line: 12,
                    column: 15,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [328, 329],
            loc: {
                start: {
                    line: 12,
                    column: 15,
                },
                end: {
                    line: 12,
                    column: 16,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [330, 331],
            loc: {
                start: {
                    line: 12,
                    column: 17,
                },
                end: {
                    line: 12,
                    column: 18,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [331, 332],
            loc: {
                start: {
                    line: 12,
                    column: 18,
                },
                end: {
                    line: 12,
                    column: 19,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg2',
            range: [333, 337],
            loc: {
                start: {
                    line: 12,
                    column: 20,
                },
                end: {
                    line: 12,
                    column: 24,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [337, 338],
            loc: {
                start: {
                    line: 12,
                    column: 24,
                },
                end: {
                    line: 12,
                    column: 25,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [339, 340],
            loc: {
                start: {
                    line: 12,
                    column: 26,
                },
                end: {
                    line: 12,
                    column: 27,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [340, 341],
            loc: {
                start: {
                    line: 12,
                    column: 27,
                },
                end: {
                    line: 12,
                    column: 28,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [341, 342],
            loc: {
                start: {
                    line: 12,
                    column: 28,
                },
                end: {
                    line: 12,
                    column: 29,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [343, 344],
            loc: {
                start: {
                    line: 12,
                    column: 30,
                },
                end: {
                    line: 12,
                    column: 31,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [344, 348],
            loc: {
                start: {
                    line: 12,
                    column: 31,
                },
                end: {
                    line: 12,
                    column: 35,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [348, 349],
            loc: {
                start: {
                    line: 12,
                    column: 35,
                },
                end: {
                    line: 12,
                    column: 36,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [350, 352],
            loc: {
                start: {
                    line: 12,
                    column: 37,
                },
                end: {
                    line: 12,
                    column: 39,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [353, 354],
            loc: {
                start: {
                    line: 12,
                    column: 40,
                },
                end: {
                    line: 12,
                    column: 41,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [354, 355],
            loc: {
                start: {
                    line: 12,
                    column: 41,
                },
                end: {
                    line: 12,
                    column: 42,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [355, 356],
            loc: {
                start: {
                    line: 12,
                    column: 42,
                },
                end: {
                    line: 12,
                    column: 43,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [356, 357],
            loc: {
                start: {
                    line: 12,
                    column: 43,
                },
                end: {
                    line: 12,
                    column: 44,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [357, 358],
            loc: {
                start: {
                    line: 12,
                    column: 44,
                },
                end: {
                    line: 12,
                    column: 45,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [359, 360],
            loc: {
                start: {
                    line: 12,
                    column: 46,
                },
                end: {
                    line: 12,
                    column: 47,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [360, 361],
            loc: {
                start: {
                    line: 12,
                    column: 47,
                },
                end: {
                    line: 12,
                    column: 48,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [367, 370],
            loc: {
                start: {
                    line: 14,
                    column: 4,
                },
                end: {
                    line: 14,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [370, 371],
            loc: {
                start: {
                    line: 14,
                    column: 7,
                },
                end: {
                    line: 14,
                    column: 8,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'async',
            range: [372, 377],
            loc: {
                start: {
                    line: 14,
                    column: 9,
                },
                end: {
                    line: 14,
                    column: 14,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [378, 379],
            loc: {
                start: {
                    line: 14,
                    column: 15,
                },
                end: {
                    line: 14,
                    column: 16,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [379, 380],
            loc: {
                start: {
                    line: 14,
                    column: 16,
                },
                end: {
                    line: 14,
                    column: 17,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [380, 381],
            loc: {
                start: {
                    line: 14,
                    column: 17,
                },
                end: {
                    line: 14,
                    column: 18,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [382, 386],
            loc: {
                start: {
                    line: 14,
                    column: 19,
                },
                end: {
                    line: 14,
                    column: 23,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [387, 389],
            loc: {
                start: {
                    line: 14,
                    column: 24,
                },
                end: {
                    line: 14,
                    column: 26,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [390, 391],
            loc: {
                start: {
                    line: 14,
                    column: 27,
                },
                end: {
                    line: 14,
                    column: 28,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [391, 392],
            loc: {
                start: {
                    line: 14,
                    column: 28,
                },
                end: {
                    line: 14,
                    column: 29,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [392, 393],
            loc: {
                start: {
                    line: 14,
                    column: 29,
                },
                end: {
                    line: 14,
                    column: 30,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [393, 394],
            loc: {
                start: {
                    line: 14,
                    column: 30,
                },
                end: {
                    line: 14,
                    column: 31,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [394, 395],
            loc: {
                start: {
                    line: 14,
                    column: 31,
                },
                end: {
                    line: 14,
                    column: 32,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [395, 396],
            loc: {
                start: {
                    line: 14,
                    column: 32,
                },
                end: {
                    line: 14,
                    column: 33,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [401, 404],
            loc: {
                start: {
                    line: 15,
                    column: 4,
                },
                end: {
                    line: 15,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [404, 405],
            loc: {
                start: {
                    line: 15,
                    column: 7,
                },
                end: {
                    line: 15,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [406, 407],
            loc: {
                start: {
                    line: 15,
                    column: 9,
                },
                end: {
                    line: 15,
                    column: 10,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'async',
            range: [408, 413],
            loc: {
                start: {
                    line: 15,
                    column: 11,
                },
                end: {
                    line: 15,
                    column: 16,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [414, 415],
            loc: {
                start: {
                    line: 15,
                    column: 17,
                },
                end: {
                    line: 15,
                    column: 18,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [415, 416],
            loc: {
                start: {
                    line: 15,
                    column: 18,
                },
                end: {
                    line: 15,
                    column: 19,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [416, 417],
            loc: {
                start: {
                    line: 15,
                    column: 19,
                },
                end: {
                    line: 15,
                    column: 20,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [418, 422],
            loc: {
                start: {
                    line: 15,
                    column: 21,
                },
                end: {
                    line: 15,
                    column: 25,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [423, 425],
            loc: {
                start: {
                    line: 15,
                    column: 26,
                },
                end: {
                    line: 15,
                    column: 28,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [426, 427],
            loc: {
                start: {
                    line: 15,
                    column: 29,
                },
                end: {
                    line: 15,
                    column: 30,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [427, 428],
            loc: {
                start: {
                    line: 15,
                    column: 30,
                },
                end: {
                    line: 15,
                    column: 31,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [428, 429],
            loc: {
                start: {
                    line: 15,
                    column: 31,
                },
                end: {
                    line: 15,
                    column: 32,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [429, 430],
            loc: {
                start: {
                    line: 15,
                    column: 32,
                },
                end: {
                    line: 15,
                    column: 33,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [430, 431],
            loc: {
                start: {
                    line: 15,
                    column: 33,
                },
                end: {
                    line: 15,
                    column: 34,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [432, 433],
            loc: {
                start: {
                    line: 15,
                    column: 35,
                },
                end: {
                    line: 15,
                    column: 36,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [433, 434],
            loc: {
                start: {
                    line: 15,
                    column: 36,
                },
                end: {
                    line: 15,
                    column: 37,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [439, 442],
            loc: {
                start: {
                    line: 16,
                    column: 4,
                },
                end: {
                    line: 16,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [442, 443],
            loc: {
                start: {
                    line: 16,
                    column: 7,
                },
                end: {
                    line: 16,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [444, 445],
            loc: {
                start: {
                    line: 16,
                    column: 9,
                },
                end: {
                    line: 16,
                    column: 10,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'async',
            range: [446, 451],
            loc: {
                start: {
                    line: 16,
                    column: 11,
                },
                end: {
                    line: 16,
                    column: 16,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [452, 453],
            loc: {
                start: {
                    line: 16,
                    column: 17,
                },
                end: {
                    line: 16,
                    column: 18,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [453, 454],
            loc: {
                start: {
                    line: 16,
                    column: 18,
                },
                end: {
                    line: 16,
                    column: 19,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [454, 455],
            loc: {
                start: {
                    line: 16,
                    column: 19,
                },
                end: {
                    line: 16,
                    column: 20,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [456, 457],
            loc: {
                start: {
                    line: 16,
                    column: 21,
                },
                end: {
                    line: 16,
                    column: 22,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [457, 461],
            loc: {
                start: {
                    line: 16,
                    column: 22,
                },
                end: {
                    line: 16,
                    column: 26,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [461, 462],
            loc: {
                start: {
                    line: 16,
                    column: 26,
                },
                end: {
                    line: 16,
                    column: 27,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [463, 465],
            loc: {
                start: {
                    line: 16,
                    column: 28,
                },
                end: {
                    line: 16,
                    column: 30,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [466, 467],
            loc: {
                start: {
                    line: 16,
                    column: 31,
                },
                end: {
                    line: 16,
                    column: 32,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [467, 468],
            loc: {
                start: {
                    line: 16,
                    column: 32,
                },
                end: {
                    line: 16,
                    column: 33,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [468, 469],
            loc: {
                start: {
                    line: 16,
                    column: 33,
                },
                end: {
                    line: 16,
                    column: 34,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [469, 470],
            loc: {
                start: {
                    line: 16,
                    column: 34,
                },
                end: {
                    line: 16,
                    column: 35,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [470, 471],
            loc: {
                start: {
                    line: 16,
                    column: 35,
                },
                end: {
                    line: 16,
                    column: 36,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [472, 473],
            loc: {
                start: {
                    line: 16,
                    column: 37,
                },
                end: {
                    line: 16,
                    column: 38,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [473, 474],
            loc: {
                start: {
                    line: 16,
                    column: 38,
                },
                end: {
                    line: 16,
                    column: 39,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [480, 483],
            loc: {
                start: {
                    line: 18,
                    column: 4,
                },
                end: {
                    line: 18,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [483, 484],
            loc: {
                start: {
                    line: 18,
                    column: 7,
                },
                end: {
                    line: 18,
                    column: 8,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'async',
            range: [485, 490],
            loc: {
                start: {
                    line: 18,
                    column: 9,
                },
                end: {
                    line: 18,
                    column: 14,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [491, 492],
            loc: {
                start: {
                    line: 18,
                    column: 15,
                },
                end: {
                    line: 18,
                    column: 16,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg',
            range: [492, 495],
            loc: {
                start: {
                    line: 18,
                    column: 16,
                },
                end: {
                    line: 18,
                    column: 19,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [495, 496],
            loc: {
                start: {
                    line: 18,
                    column: 19,
                },
                end: {
                    line: 18,
                    column: 20,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [497, 498],
            loc: {
                start: {
                    line: 18,
                    column: 21,
                },
                end: {
                    line: 18,
                    column: 22,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [498, 499],
            loc: {
                start: {
                    line: 18,
                    column: 22,
                },
                end: {
                    line: 18,
                    column: 23,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [499, 500],
            loc: {
                start: {
                    line: 18,
                    column: 23,
                },
                end: {
                    line: 18,
                    column: 24,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [501, 505],
            loc: {
                start: {
                    line: 18,
                    column: 25,
                },
                end: {
                    line: 18,
                    column: 29,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [506, 508],
            loc: {
                start: {
                    line: 18,
                    column: 30,
                },
                end: {
                    line: 18,
                    column: 32,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [509, 510],
            loc: {
                start: {
                    line: 18,
                    column: 33,
                },
                end: {
                    line: 18,
                    column: 34,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [510, 511],
            loc: {
                start: {
                    line: 18,
                    column: 34,
                },
                end: {
                    line: 18,
                    column: 35,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [511, 512],
            loc: {
                start: {
                    line: 18,
                    column: 35,
                },
                end: {
                    line: 18,
                    column: 36,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [512, 513],
            loc: {
                start: {
                    line: 18,
                    column: 36,
                },
                end: {
                    line: 18,
                    column: 37,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [513, 514],
            loc: {
                start: {
                    line: 18,
                    column: 37,
                },
                end: {
                    line: 18,
                    column: 38,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [514, 515],
            loc: {
                start: {
                    line: 18,
                    column: 38,
                },
                end: {
                    line: 18,
                    column: 39,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [520, 523],
            loc: {
                start: {
                    line: 19,
                    column: 4,
                },
                end: {
                    line: 19,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [523, 524],
            loc: {
                start: {
                    line: 19,
                    column: 7,
                },
                end: {
                    line: 19,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [525, 526],
            loc: {
                start: {
                    line: 19,
                    column: 9,
                },
                end: {
                    line: 19,
                    column: 10,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'async',
            range: [527, 532],
            loc: {
                start: {
                    line: 19,
                    column: 11,
                },
                end: {
                    line: 19,
                    column: 16,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [533, 534],
            loc: {
                start: {
                    line: 19,
                    column: 17,
                },
                end: {
                    line: 19,
                    column: 18,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg',
            range: [534, 537],
            loc: {
                start: {
                    line: 19,
                    column: 18,
                },
                end: {
                    line: 19,
                    column: 21,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [537, 538],
            loc: {
                start: {
                    line: 19,
                    column: 21,
                },
                end: {
                    line: 19,
                    column: 22,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [539, 540],
            loc: {
                start: {
                    line: 19,
                    column: 23,
                },
                end: {
                    line: 19,
                    column: 24,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [540, 541],
            loc: {
                start: {
                    line: 19,
                    column: 24,
                },
                end: {
                    line: 19,
                    column: 25,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [541, 542],
            loc: {
                start: {
                    line: 19,
                    column: 25,
                },
                end: {
                    line: 19,
                    column: 26,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [543, 547],
            loc: {
                start: {
                    line: 19,
                    column: 27,
                },
                end: {
                    line: 19,
                    column: 31,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [548, 550],
            loc: {
                start: {
                    line: 19,
                    column: 32,
                },
                end: {
                    line: 19,
                    column: 34,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [551, 552],
            loc: {
                start: {
                    line: 19,
                    column: 35,
                },
                end: {
                    line: 19,
                    column: 36,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [552, 553],
            loc: {
                start: {
                    line: 19,
                    column: 36,
                },
                end: {
                    line: 19,
                    column: 37,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [553, 554],
            loc: {
                start: {
                    line: 19,
                    column: 37,
                },
                end: {
                    line: 19,
                    column: 38,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [554, 555],
            loc: {
                start: {
                    line: 19,
                    column: 38,
                },
                end: {
                    line: 19,
                    column: 39,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [555, 556],
            loc: {
                start: {
                    line: 19,
                    column: 39,
                },
                end: {
                    line: 19,
                    column: 40,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [557, 558],
            loc: {
                start: {
                    line: 19,
                    column: 41,
                },
                end: {
                    line: 19,
                    column: 42,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [558, 559],
            loc: {
                start: {
                    line: 19,
                    column: 42,
                },
                end: {
                    line: 19,
                    column: 43,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [564, 567],
            loc: {
                start: {
                    line: 20,
                    column: 4,
                },
                end: {
                    line: 20,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [567, 568],
            loc: {
                start: {
                    line: 20,
                    column: 7,
                },
                end: {
                    line: 20,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [569, 570],
            loc: {
                start: {
                    line: 20,
                    column: 9,
                },
                end: {
                    line: 20,
                    column: 10,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'async',
            range: [571, 576],
            loc: {
                start: {
                    line: 20,
                    column: 11,
                },
                end: {
                    line: 20,
                    column: 16,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [577, 578],
            loc: {
                start: {
                    line: 20,
                    column: 17,
                },
                end: {
                    line: 20,
                    column: 18,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg',
            range: [578, 581],
            loc: {
                start: {
                    line: 20,
                    column: 18,
                },
                end: {
                    line: 20,
                    column: 21,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [581, 582],
            loc: {
                start: {
                    line: 20,
                    column: 21,
                },
                end: {
                    line: 20,
                    column: 22,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [583, 584],
            loc: {
                start: {
                    line: 20,
                    column: 23,
                },
                end: {
                    line: 20,
                    column: 24,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [584, 585],
            loc: {
                start: {
                    line: 20,
                    column: 24,
                },
                end: {
                    line: 20,
                    column: 25,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [585, 586],
            loc: {
                start: {
                    line: 20,
                    column: 25,
                },
                end: {
                    line: 20,
                    column: 26,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [587, 588],
            loc: {
                start: {
                    line: 20,
                    column: 27,
                },
                end: {
                    line: 20,
                    column: 28,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [588, 592],
            loc: {
                start: {
                    line: 20,
                    column: 28,
                },
                end: {
                    line: 20,
                    column: 32,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [592, 593],
            loc: {
                start: {
                    line: 20,
                    column: 32,
                },
                end: {
                    line: 20,
                    column: 33,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [594, 596],
            loc: {
                start: {
                    line: 20,
                    column: 34,
                },
                end: {
                    line: 20,
                    column: 36,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [597, 598],
            loc: {
                start: {
                    line: 20,
                    column: 37,
                },
                end: {
                    line: 20,
                    column: 38,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [598, 599],
            loc: {
                start: {
                    line: 20,
                    column: 38,
                },
                end: {
                    line: 20,
                    column: 39,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [599, 600],
            loc: {
                start: {
                    line: 20,
                    column: 39,
                },
                end: {
                    line: 20,
                    column: 40,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [600, 601],
            loc: {
                start: {
                    line: 20,
                    column: 40,
                },
                end: {
                    line: 20,
                    column: 41,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [601, 602],
            loc: {
                start: {
                    line: 20,
                    column: 41,
                },
                end: {
                    line: 20,
                    column: 42,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [603, 604],
            loc: {
                start: {
                    line: 20,
                    column: 43,
                },
                end: {
                    line: 20,
                    column: 44,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [604, 605],
            loc: {
                start: {
                    line: 20,
                    column: 44,
                },
                end: {
                    line: 20,
                    column: 45,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [611, 614],
            loc: {
                start: {
                    line: 22,
                    column: 4,
                },
                end: {
                    line: 22,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [614, 615],
            loc: {
                start: {
                    line: 22,
                    column: 7,
                },
                end: {
                    line: 22,
                    column: 8,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'async',
            range: [616, 621],
            loc: {
                start: {
                    line: 22,
                    column: 9,
                },
                end: {
                    line: 22,
                    column: 14,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [622, 623],
            loc: {
                start: {
                    line: 22,
                    column: 15,
                },
                end: {
                    line: 22,
                    column: 16,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg',
            range: [623, 626],
            loc: {
                start: {
                    line: 22,
                    column: 16,
                },
                end: {
                    line: 22,
                    column: 19,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [626, 627],
            loc: {
                start: {
                    line: 22,
                    column: 19,
                },
                end: {
                    line: 22,
                    column: 20,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [628, 629],
            loc: {
                start: {
                    line: 22,
                    column: 21,
                },
                end: {
                    line: 22,
                    column: 22,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [629, 630],
            loc: {
                start: {
                    line: 22,
                    column: 22,
                },
                end: {
                    line: 22,
                    column: 23,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg2',
            range: [631, 635],
            loc: {
                start: {
                    line: 22,
                    column: 24,
                },
                end: {
                    line: 22,
                    column: 28,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [635, 636],
            loc: {
                start: {
                    line: 22,
                    column: 28,
                },
                end: {
                    line: 22,
                    column: 29,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [637, 638],
            loc: {
                start: {
                    line: 22,
                    column: 30,
                },
                end: {
                    line: 22,
                    column: 31,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [638, 639],
            loc: {
                start: {
                    line: 22,
                    column: 31,
                },
                end: {
                    line: 22,
                    column: 32,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [639, 640],
            loc: {
                start: {
                    line: 22,
                    column: 32,
                },
                end: {
                    line: 22,
                    column: 33,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [641, 645],
            loc: {
                start: {
                    line: 22,
                    column: 34,
                },
                end: {
                    line: 22,
                    column: 38,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [646, 648],
            loc: {
                start: {
                    line: 22,
                    column: 39,
                },
                end: {
                    line: 22,
                    column: 41,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [649, 650],
            loc: {
                start: {
                    line: 22,
                    column: 42,
                },
                end: {
                    line: 22,
                    column: 43,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [650, 651],
            loc: {
                start: {
                    line: 22,
                    column: 43,
                },
                end: {
                    line: 22,
                    column: 44,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [651, 652],
            loc: {
                start: {
                    line: 22,
                    column: 44,
                },
                end: {
                    line: 22,
                    column: 45,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [652, 653],
            loc: {
                start: {
                    line: 22,
                    column: 45,
                },
                end: {
                    line: 22,
                    column: 46,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [653, 654],
            loc: {
                start: {
                    line: 22,
                    column: 46,
                },
                end: {
                    line: 22,
                    column: 47,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [654, 655],
            loc: {
                start: {
                    line: 22,
                    column: 47,
                },
                end: {
                    line: 22,
                    column: 48,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [660, 663],
            loc: {
                start: {
                    line: 23,
                    column: 4,
                },
                end: {
                    line: 23,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [663, 664],
            loc: {
                start: {
                    line: 23,
                    column: 7,
                },
                end: {
                    line: 23,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [665, 666],
            loc: {
                start: {
                    line: 23,
                    column: 9,
                },
                end: {
                    line: 23,
                    column: 10,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'async',
            range: [667, 672],
            loc: {
                start: {
                    line: 23,
                    column: 11,
                },
                end: {
                    line: 23,
                    column: 16,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [673, 674],
            loc: {
                start: {
                    line: 23,
                    column: 17,
                },
                end: {
                    line: 23,
                    column: 18,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg',
            range: [674, 677],
            loc: {
                start: {
                    line: 23,
                    column: 18,
                },
                end: {
                    line: 23,
                    column: 21,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [677, 678],
            loc: {
                start: {
                    line: 23,
                    column: 21,
                },
                end: {
                    line: 23,
                    column: 22,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [679, 680],
            loc: {
                start: {
                    line: 23,
                    column: 23,
                },
                end: {
                    line: 23,
                    column: 24,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [680, 681],
            loc: {
                start: {
                    line: 23,
                    column: 24,
                },
                end: {
                    line: 23,
                    column: 25,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg2',
            range: [682, 686],
            loc: {
                start: {
                    line: 23,
                    column: 26,
                },
                end: {
                    line: 23,
                    column: 30,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [686, 687],
            loc: {
                start: {
                    line: 23,
                    column: 30,
                },
                end: {
                    line: 23,
                    column: 31,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [688, 689],
            loc: {
                start: {
                    line: 23,
                    column: 32,
                },
                end: {
                    line: 23,
                    column: 33,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [689, 690],
            loc: {
                start: {
                    line: 23,
                    column: 33,
                },
                end: {
                    line: 23,
                    column: 34,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [690, 691],
            loc: {
                start: {
                    line: 23,
                    column: 34,
                },
                end: {
                    line: 23,
                    column: 35,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [692, 696],
            loc: {
                start: {
                    line: 23,
                    column: 36,
                },
                end: {
                    line: 23,
                    column: 40,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [697, 699],
            loc: {
                start: {
                    line: 23,
                    column: 41,
                },
                end: {
                    line: 23,
                    column: 43,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [700, 701],
            loc: {
                start: {
                    line: 23,
                    column: 44,
                },
                end: {
                    line: 23,
                    column: 45,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [701, 702],
            loc: {
                start: {
                    line: 23,
                    column: 45,
                },
                end: {
                    line: 23,
                    column: 46,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [702, 703],
            loc: {
                start: {
                    line: 23,
                    column: 46,
                },
                end: {
                    line: 23,
                    column: 47,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [703, 704],
            loc: {
                start: {
                    line: 23,
                    column: 47,
                },
                end: {
                    line: 23,
                    column: 48,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [704, 705],
            loc: {
                start: {
                    line: 23,
                    column: 48,
                },
                end: {
                    line: 23,
                    column: 49,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [706, 707],
            loc: {
                start: {
                    line: 23,
                    column: 50,
                },
                end: {
                    line: 23,
                    column: 51,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [707, 708],
            loc: {
                start: {
                    line: 23,
                    column: 51,
                },
                end: {
                    line: 23,
                    column: 52,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'key',
            range: [713, 716],
            loc: {
                start: {
                    line: 24,
                    column: 4,
                },
                end: {
                    line: 24,
                    column: 7,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [716, 717],
            loc: {
                start: {
                    line: 24,
                    column: 7,
                },
                end: {
                    line: 24,
                    column: 8,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [718, 719],
            loc: {
                start: {
                    line: 24,
                    column: 9,
                },
                end: {
                    line: 24,
                    column: 10,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'async',
            range: [720, 725],
            loc: {
                start: {
                    line: 24,
                    column: 11,
                },
                end: {
                    line: 24,
                    column: 16,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [726, 727],
            loc: {
                start: {
                    line: 24,
                    column: 17,
                },
                end: {
                    line: 24,
                    column: 18,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg',
            range: [727, 730],
            loc: {
                start: {
                    line: 24,
                    column: 18,
                },
                end: {
                    line: 24,
                    column: 21,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [730, 731],
            loc: {
                start: {
                    line: 24,
                    column: 21,
                },
                end: {
                    line: 24,
                    column: 22,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [732, 733],
            loc: {
                start: {
                    line: 24,
                    column: 23,
                },
                end: {
                    line: 24,
                    column: 24,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [733, 734],
            loc: {
                start: {
                    line: 24,
                    column: 24,
                },
                end: {
                    line: 24,
                    column: 25,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'arg2',
            range: [735, 739],
            loc: {
                start: {
                    line: 24,
                    column: 26,
                },
                end: {
                    line: 24,
                    column: 30,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [739, 740],
            loc: {
                start: {
                    line: 24,
                    column: 30,
                },
                end: {
                    line: 24,
                    column: 31,
                },
            },
        },
        {
            type: 'Identifier',
            value: 't',
            range: [741, 742],
            loc: {
                start: {
                    line: 24,
                    column: 32,
                },
                end: {
                    line: 24,
                    column: 33,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [742, 743],
            loc: {
                start: {
                    line: 24,
                    column: 33,
                },
                end: {
                    line: 24,
                    column: 34,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ':',
            range: [743, 744],
            loc: {
                start: {
                    line: 24,
                    column: 34,
                },
                end: {
                    line: 24,
                    column: 35,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [745, 746],
            loc: {
                start: {
                    line: 24,
                    column: 36,
                },
                end: {
                    line: 24,
                    column: 37,
                },
            },
        },
        {
            type: 'Keyword',
            value: 'void',
            range: [746, 750],
            loc: {
                start: {
                    line: 24,
                    column: 37,
                },
                end: {
                    line: 24,
                    column: 41,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [750, 751],
            loc: {
                start: {
                    line: 24,
                    column: 41,
                },
                end: {
                    line: 24,
                    column: 42,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '=>',
            range: [752, 754],
            loc: {
                start: {
                    line: 24,
                    column: 43,
                },
                end: {
                    line: 24,
                    column: 45,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '{',
            range: [755, 756],
            loc: {
                start: {
                    line: 24,
                    column: 46,
                },
                end: {
                    line: 24,
                    column: 47,
                },
            },
        },
        {
            type: 'Identifier',
            value: 'x',
            range: [756, 757],
            loc: {
                start: {
                    line: 24,
                    column: 47,
                },
                end: {
                    line: 24,
                    column: 48,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '(',
            range: [757, 758],
            loc: {
                start: {
                    line: 24,
                    column: 48,
                },
                end: {
                    line: 24,
                    column: 49,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [758, 759],
            loc: {
                start: {
                    line: 24,
                    column: 49,
                },
                end: {
                    line: 24,
                    column: 50,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [759, 760],
            loc: {
                start: {
                    line: 24,
                    column: 50,
                },
                end: {
                    line: 24,
                    column: 51,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ')',
            range: [761, 762],
            loc: {
                start: {
                    line: 24,
                    column: 52,
                },
                end: {
                    line: 24,
                    column: 53,
                },
            },
        },
        {
            type: 'Punctuator',
            value: ',',
            range: [762, 763],
            loc: {
                start: {
                    line: 24,
                    column: 53,
                },
                end: {
                    line: 24,
                    column: 54,
                },
            },
        },
        {
            type: 'Punctuator',
            value: '}',
            range: [764, 765],
            loc: {
                start: {
                    line: 25,
                    column: 0,
                },
                end: {
                    line: 25,
                    column: 1,
                },
            },
        },
    ],
    comments: [],
});
