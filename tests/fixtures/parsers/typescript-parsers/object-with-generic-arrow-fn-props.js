"use strict";

/*
 * Parsed on https://typescript-eslint.io/play using @typescript-eslint/parser@5.4.5
 *
 * Source:
const test = {
    key: <T>(): void => { },
    key: async <T>(): Promise<void> => { },

    key: <T>(arg: T): T => { return arg },
    key: async <T>(arg: T): Promise<T> => { return arg },
}
 */

exports.parse = () => ({
    type: "Program",
    body: [
        {
            type: "VariableDeclaration",
            declarations: [
                {
                    type: "VariableDeclarator",
                    definite: false,
                    id: {
                        type: "Identifier",
                        decorators: [],
                        name: "test",
                        optional: false,
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
                        type: "ObjectExpression",
                        properties: [
                            {
                                type: "Property",
                                key: {
                                    type: "Identifier",
                                    decorators: [],
                                    name: "key",
                                    optional: false,
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
                                    type: "ArrowFunctionExpression",
                                    generator: false,
                                    id: null,
                                    params: [],
                                    body: {
                                        type: "BlockStatement",
                                        body: [],
                                        range: [39, 42],
                                        loc: {
                                            start: {
                                                line: 2,
                                                column: 24,
                                            },
                                            end: {
                                                line: 2,
                                                column: 27,
                                            },
                                        },
                                    },
                                    async: false,
                                    expression: false,
                                    returnType: {
                                        type: "TSTypeAnnotation",
                                        loc: {
                                            start: {
                                                line: 2,
                                                column: 14,
                                            },
                                            end: {
                                                line: 2,
                                                column: 20,
                                            },
                                        },
                                        range: [29, 35],
                                        typeAnnotation: {
                                            type: "TSVoidKeyword",
                                            range: [31, 35],
                                            loc: {
                                                start: {
                                                    line: 2,
                                                    column: 16,
                                                },
                                                end: {
                                                    line: 2,
                                                    column: 20,
                                                },
                                            },
                                        },
                                    },
                                    typeParameters: {
                                        type: "TSTypeParameterDeclaration",
                                        range: [24, 27],
                                        loc: {
                                            start: {
                                                line: 2,
                                                column: 9,
                                            },
                                            end: {
                                                line: 2,
                                                column: 12,
                                            },
                                        },
                                        params: [
                                            {
                                                type: "TSTypeParameter",
                                                name: {
                                                    type: "Identifier",
                                                    decorators: [],
                                                    name: "T",
                                                    optional: false,
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
                                                in: false,
                                                out: false,
                                                const: false,
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
                                        ],
                                    },
                                    range: [24, 42],
                                    loc: {
                                        start: {
                                            line: 2,
                                            column: 9,
                                        },
                                        end: {
                                            line: 2,
                                            column: 27,
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                optional: false,
                                shorthand: false,
                                kind: "init",
                                range: [19, 42],
                                loc: {
                                    start: {
                                        line: 2,
                                        column: 4,
                                    },
                                    end: {
                                        line: 2,
                                        column: 27,
                                    },
                                },
                            },
                            {
                                type: "Property",
                                key: {
                                    type: "Identifier",
                                    decorators: [],
                                    name: "key",
                                    optional: false,
                                    range: [48, 51],
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
                                    type: "ArrowFunctionExpression",
                                    generator: false,
                                    id: null,
                                    params: [],
                                    body: {
                                        type: "BlockStatement",
                                        body: [],
                                        range: [83, 86],
                                        loc: {
                                            start: {
                                                line: 3,
                                                column: 39,
                                            },
                                            end: {
                                                line: 3,
                                                column: 42,
                                            },
                                        },
                                    },
                                    async: true,
                                    expression: false,
                                    returnType: {
                                        type: "TSTypeAnnotation",
                                        loc: {
                                            start: {
                                                line: 3,
                                                column: 20,
                                            },
                                            end: {
                                                line: 3,
                                                column: 35,
                                            },
                                        },
                                        range: [64, 79],
                                        typeAnnotation: {
                                            type: "TSTypeReference",
                                            typeName: {
                                                type: "Identifier",
                                                decorators: [],
                                                name: "Promise",
                                                optional: false,
                                                range: [66, 73],
                                                loc: {
                                                    start: {
                                                        line: 3,
                                                        column: 22,
                                                    },
                                                    end: {
                                                        line: 3,
                                                        column: 29,
                                                    },
                                                },
                                            },
                                            typeArguments: {
                                                type: "TSTypeParameterInstantiation",
                                                range: [73, 79],
                                                params: [
                                                    {
                                                        type: "TSVoidKeyword",
                                                        range: [74, 78],
                                                        loc: {
                                                            start: {
                                                                line: 3,
                                                                column: 30,
                                                            },
                                                            end: {
                                                                line: 3,
                                                                column: 34,
                                                            },
                                                        },
                                                    },
                                                ],
                                                loc: {
                                                    start: {
                                                        line: 3,
                                                        column: 29,
                                                    },
                                                    end: {
                                                        line: 3,
                                                        column: 35,
                                                    },
                                                },
                                            },
                                            range: [66, 79],
                                            loc: {
                                                start: {
                                                    line: 3,
                                                    column: 22,
                                                },
                                                end: {
                                                    line: 3,
                                                    column: 35,
                                                },
                                            },
                                        },
                                    },
                                    typeParameters: {
                                        type: "TSTypeParameterDeclaration",
                                        range: [59, 62],
                                        loc: {
                                            start: {
                                                line: 3,
                                                column: 15,
                                            },
                                            end: {
                                                line: 3,
                                                column: 18,
                                            },
                                        },
                                        params: [
                                            {
                                                type: "TSTypeParameter",
                                                name: {
                                                    type: "Identifier",
                                                    decorators: [],
                                                    name: "T",
                                                    optional: false,
                                                    range: [60, 61],
                                                    loc: {
                                                        start: {
                                                            line: 3,
                                                            column: 16,
                                                        },
                                                        end: {
                                                            line: 3,
                                                            column: 17,
                                                        },
                                                    },
                                                },
                                                in: false,
                                                out: false,
                                                const: false,
                                                range: [60, 61],
                                                loc: {
                                                    start: {
                                                        line: 3,
                                                        column: 16,
                                                    },
                                                    end: {
                                                        line: 3,
                                                        column: 17,
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                    range: [53, 86],
                                    loc: {
                                        start: {
                                            line: 3,
                                            column: 9,
                                        },
                                        end: {
                                            line: 3,
                                            column: 42,
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                optional: false,
                                shorthand: false,
                                kind: "init",
                                range: [48, 86],
                                loc: {
                                    start: {
                                        line: 3,
                                        column: 4,
                                    },
                                    end: {
                                        line: 3,
                                        column: 42,
                                    },
                                },
                            },
                            {
                                type: "Property",
                                key: {
                                    type: "Identifier",
                                    decorators: [],
                                    name: "key",
                                    optional: false,
                                    range: [93, 96],
                                    loc: {
                                        start: {
                                            line: 5,
                                            column: 4,
                                        },
                                        end: {
                                            line: 5,
                                            column: 7,
                                        },
                                    },
                                },
                                value: {
                                    type: "ArrowFunctionExpression",
                                    generator: false,
                                    id: null,
                                    params: [
                                        {
                                            type: "Identifier",
                                            decorators: [],
                                            name: "arg",
                                            optional: false,
                                            typeAnnotation: {
                                                type: "TSTypeAnnotation",
                                                loc: {
                                                    start: {
                                                        line: 5,
                                                        column: 16,
                                                    },
                                                    end: {
                                                        line: 5,
                                                        column: 19,
                                                    },
                                                },
                                                range: [105, 108],
                                                typeAnnotation: {
                                                    type: "TSTypeReference",
                                                    typeName: {
                                                        type: "Identifier",
                                                        decorators: [],
                                                        name: "T",
                                                        optional: false,
                                                        range: [107, 108],
                                                        loc: {
                                                            start: {
                                                                line: 5,
                                                                column: 18,
                                                            },
                                                            end: {
                                                                line: 5,
                                                                column: 19,
                                                            },
                                                        },
                                                    },
                                                    range: [107, 108],
                                                    loc: {
                                                        start: {
                                                            line: 5,
                                                            column: 18,
                                                        },
                                                        end: {
                                                            line: 5,
                                                            column: 19,
                                                        },
                                                    },
                                                },
                                            },
                                            range: [102, 108],
                                            loc: {
                                                start: {
                                                    line: 5,
                                                    column: 13,
                                                },
                                                end: {
                                                    line: 5,
                                                    column: 19,
                                                },
                                            },
                                        },
                                    ],
                                    body: {
                                        type: "BlockStatement",
                                        body: [
                                            {
                                                type: "ReturnStatement",
                                                argument: {
                                                    type: "Identifier",
                                                    decorators: [],
                                                    name: "arg",
                                                    optional: false,
                                                    range: [125, 128],
                                                    loc: {
                                                        start: {
                                                            line: 5,
                                                            column: 36,
                                                        },
                                                        end: {
                                                            line: 5,
                                                            column: 39,
                                                        },
                                                    },
                                                },
                                                range: [118, 128],
                                                loc: {
                                                    start: {
                                                        line: 5,
                                                        column: 29,
                                                    },
                                                    end: {
                                                        line: 5,
                                                        column: 39,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [116, 130],
                                        loc: {
                                            start: {
                                                line: 5,
                                                column: 27,
                                            },
                                            end: {
                                                line: 5,
                                                column: 41,
                                            },
                                        },
                                    },
                                    async: false,
                                    expression: false,
                                    returnType: {
                                        type: "TSTypeAnnotation",
                                        loc: {
                                            start: {
                                                line: 5,
                                                column: 20,
                                            },
                                            end: {
                                                line: 5,
                                                column: 23,
                                            },
                                        },
                                        range: [109, 112],
                                        typeAnnotation: {
                                            type: "TSTypeReference",
                                            typeName: {
                                                type: "Identifier",
                                                decorators: [],
                                                name: "T",
                                                optional: false,
                                                range: [111, 112],
                                                loc: {
                                                    start: {
                                                        line: 5,
                                                        column: 22,
                                                    },
                                                    end: {
                                                        line: 5,
                                                        column: 23,
                                                    },
                                                },
                                            },
                                            range: [111, 112],
                                            loc: {
                                                start: {
                                                    line: 5,
                                                    column: 22,
                                                },
                                                end: {
                                                    line: 5,
                                                    column: 23,
                                                },
                                            },
                                        },
                                    },
                                    typeParameters: {
                                        type: "TSTypeParameterDeclaration",
                                        range: [98, 101],
                                        loc: {
                                            start: {
                                                line: 5,
                                                column: 9,
                                            },
                                            end: {
                                                line: 5,
                                                column: 12,
                                            },
                                        },
                                        params: [
                                            {
                                                type: "TSTypeParameter",
                                                name: {
                                                    type: "Identifier",
                                                    decorators: [],
                                                    name: "T",
                                                    optional: false,
                                                    range: [99, 100],
                                                    loc: {
                                                        start: {
                                                            line: 5,
                                                            column: 10,
                                                        },
                                                        end: {
                                                            line: 5,
                                                            column: 11,
                                                        },
                                                    },
                                                },
                                                in: false,
                                                out: false,
                                                const: false,
                                                range: [99, 100],
                                                loc: {
                                                    start: {
                                                        line: 5,
                                                        column: 10,
                                                    },
                                                    end: {
                                                        line: 5,
                                                        column: 11,
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                    range: [98, 130],
                                    loc: {
                                        start: {
                                            line: 5,
                                            column: 9,
                                        },
                                        end: {
                                            line: 5,
                                            column: 41,
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                optional: false,
                                shorthand: false,
                                kind: "init",
                                range: [93, 130],
                                loc: {
                                    start: {
                                        line: 5,
                                        column: 4,
                                    },
                                    end: {
                                        line: 5,
                                        column: 41,
                                    },
                                },
                            },
                            {
                                type: "Property",
                                key: {
                                    type: "Identifier",
                                    decorators: [],
                                    name: "key",
                                    optional: false,
                                    range: [136, 139],
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
                                    type: "ArrowFunctionExpression",
                                    generator: false,
                                    id: null,
                                    params: [
                                        {
                                            type: "Identifier",
                                            decorators: [],
                                            name: "arg",
                                            optional: false,
                                            typeAnnotation: {
                                                type: "TSTypeAnnotation",
                                                loc: {
                                                    start: {
                                                        line: 6,
                                                        column: 22,
                                                    },
                                                    end: {
                                                        line: 6,
                                                        column: 25,
                                                    },
                                                },
                                                range: [154, 157],
                                                typeAnnotation: {
                                                    type: "TSTypeReference",
                                                    typeName: {
                                                        type: "Identifier",
                                                        decorators: [],
                                                        name: "T",
                                                        optional: false,
                                                        range: [156, 157],
                                                        loc: {
                                                            start: {
                                                                line: 6,
                                                                column: 24,
                                                            },
                                                            end: {
                                                                line: 6,
                                                                column: 25,
                                                            },
                                                        },
                                                    },
                                                    range: [156, 157],
                                                    loc: {
                                                        start: {
                                                            line: 6,
                                                            column: 24,
                                                        },
                                                        end: {
                                                            line: 6,
                                                            column: 25,
                                                        },
                                                    },
                                                },
                                            },
                                            range: [151, 157],
                                            loc: {
                                                start: {
                                                    line: 6,
                                                    column: 19,
                                                },
                                                end: {
                                                    line: 6,
                                                    column: 25,
                                                },
                                            },
                                        },
                                    ],
                                    body: {
                                        type: "BlockStatement",
                                        body: [
                                            {
                                                type: "ReturnStatement",
                                                argument: {
                                                    type: "Identifier",
                                                    decorators: [],
                                                    name: "arg",
                                                    optional: false,
                                                    range: [183, 186],
                                                    loc: {
                                                        start: {
                                                            line: 6,
                                                            column: 51,
                                                        },
                                                        end: {
                                                            line: 6,
                                                            column: 54,
                                                        },
                                                    },
                                                },
                                                range: [176, 186],
                                                loc: {
                                                    start: {
                                                        line: 6,
                                                        column: 44,
                                                    },
                                                    end: {
                                                        line: 6,
                                                        column: 54,
                                                    },
                                                },
                                            },
                                        ],
                                        range: [174, 188],
                                        loc: {
                                            start: {
                                                line: 6,
                                                column: 42,
                                            },
                                            end: {
                                                line: 6,
                                                column: 56,
                                            },
                                        },
                                    },
                                    async: true,
                                    expression: false,
                                    returnType: {
                                        type: "TSTypeAnnotation",
                                        loc: {
                                            start: {
                                                line: 6,
                                                column: 26,
                                            },
                                            end: {
                                                line: 6,
                                                column: 38,
                                            },
                                        },
                                        range: [158, 170],
                                        typeAnnotation: {
                                            type: "TSTypeReference",
                                            typeName: {
                                                type: "Identifier",
                                                decorators: [],
                                                name: "Promise",
                                                optional: false,
                                                range: [160, 167],
                                                loc: {
                                                    start: {
                                                        line: 6,
                                                        column: 28,
                                                    },
                                                    end: {
                                                        line: 6,
                                                        column: 35,
                                                    },
                                                },
                                            },
                                            typeArguments: {
                                                type: "TSTypeParameterInstantiation",
                                                range: [167, 170],
                                                params: [
                                                    {
                                                        type: "TSTypeReference",
                                                        typeName: {
                                                            type: "Identifier",
                                                            decorators: [],
                                                            name: "T",
                                                            optional: false,
                                                            range: [168, 169],
                                                            loc: {
                                                                start: {
                                                                    line: 6,
                                                                    column: 36,
                                                                },
                                                                end: {
                                                                    line: 6,
                                                                    column: 37,
                                                                },
                                                            },
                                                        },
                                                        range: [168, 169],
                                                        loc: {
                                                            start: {
                                                                line: 6,
                                                                column: 36,
                                                            },
                                                            end: {
                                                                line: 6,
                                                                column: 37,
                                                            },
                                                        },
                                                    },
                                                ],
                                                loc: {
                                                    start: {
                                                        line: 6,
                                                        column: 35,
                                                    },
                                                    end: {
                                                        line: 6,
                                                        column: 38,
                                                    },
                                                },
                                            },
                                            range: [160, 170],
                                            loc: {
                                                start: {
                                                    line: 6,
                                                    column: 28,
                                                },
                                                end: {
                                                    line: 6,
                                                    column: 38,
                                                },
                                            },
                                        },
                                    },
                                    typeParameters: {
                                        type: "TSTypeParameterDeclaration",
                                        range: [147, 150],
                                        loc: {
                                            start: {
                                                line: 6,
                                                column: 15,
                                            },
                                            end: {
                                                line: 6,
                                                column: 18,
                                            },
                                        },
                                        params: [
                                            {
                                                type: "TSTypeParameter",
                                                name: {
                                                    type: "Identifier",
                                                    decorators: [],
                                                    name: "T",
                                                    optional: false,
                                                    range: [148, 149],
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
                                                in: false,
                                                out: false,
                                                const: false,
                                                range: [148, 149],
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
                                        ],
                                    },
                                    range: [141, 188],
                                    loc: {
                                        start: {
                                            line: 6,
                                            column: 9,
                                        },
                                        end: {
                                            line: 6,
                                            column: 56,
                                        },
                                    },
                                },
                                computed: false,
                                method: false,
                                optional: false,
                                shorthand: false,
                                kind: "init",
                                range: [136, 188],
                                loc: {
                                    start: {
                                        line: 6,
                                        column: 4,
                                    },
                                    end: {
                                        line: 6,
                                        column: 56,
                                    },
                                },
                            },
                        ],
                        range: [13, 191],
                        loc: {
                            start: {
                                line: 1,
                                column: 13,
                            },
                            end: {
                                line: 7,
                                column: 1,
                            },
                        },
                    },
                    range: [6, 191],
                    loc: {
                        start: {
                            line: 1,
                            column: 6,
                        },
                        end: {
                            line: 7,
                            column: 1,
                        },
                    },
                },
            ],
            declare: false,
            kind: "const",
            range: [0, 191],
            loc: {
                start: {
                    line: 1,
                    column: 0,
                },
                end: {
                    line: 7,
                    column: 1,
                },
            },
        },
    ],
    comments: [],
    range: [0, 191],
    sourceType: "script",
    tokens: [
        {
            type: "Keyword",
            value: "const",
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
            type: "Identifier",
            value: "test",
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
            type: "Punctuator",
            value: "=",
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
            type: "Punctuator",
            value: "{",
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
            type: "Identifier",
            value: "key",
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
            type: "Punctuator",
            value: ":",
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
            type: "Punctuator",
            value: "<",
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
            type: "Identifier",
            value: "T",
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
            type: "Punctuator",
            value: ">",
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
            type: "Punctuator",
            value: "(",
            range: [27, 28],
            loc: {
                start: {
                    line: 2,
                    column: 12,
                },
                end: {
                    line: 2,
                    column: 13,
                },
            },
        },
        {
            type: "Punctuator",
            value: ")",
            range: [28, 29],
            loc: {
                start: {
                    line: 2,
                    column: 13,
                },
                end: {
                    line: 2,
                    column: 14,
                },
            },
        },
        {
            type: "Punctuator",
            value: ":",
            range: [29, 30],
            loc: {
                start: {
                    line: 2,
                    column: 14,
                },
                end: {
                    line: 2,
                    column: 15,
                },
            },
        },
        {
            type: "Keyword",
            value: "void",
            range: [31, 35],
            loc: {
                start: {
                    line: 2,
                    column: 16,
                },
                end: {
                    line: 2,
                    column: 20,
                },
            },
        },
        {
            type: "Punctuator",
            value: "=>",
            range: [36, 38],
            loc: {
                start: {
                    line: 2,
                    column: 21,
                },
                end: {
                    line: 2,
                    column: 23,
                },
            },
        },
        {
            type: "Punctuator",
            value: "{",
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
            type: "Punctuator",
            value: "}",
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
            type: "Punctuator",
            value: ",",
            range: [42, 43],
            loc: {
                start: {
                    line: 2,
                    column: 27,
                },
                end: {
                    line: 2,
                    column: 28,
                },
            },
        },
        {
            type: "Identifier",
            value: "key",
            range: [48, 51],
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
            type: "Punctuator",
            value: ":",
            range: [51, 52],
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
            type: "Identifier",
            value: "async",
            range: [53, 58],
            loc: {
                start: {
                    line: 3,
                    column: 9,
                },
                end: {
                    line: 3,
                    column: 14,
                },
            },
        },
        {
            type: "Punctuator",
            value: "<",
            range: [59, 60],
            loc: {
                start: {
                    line: 3,
                    column: 15,
                },
                end: {
                    line: 3,
                    column: 16,
                },
            },
        },
        {
            type: "Identifier",
            value: "T",
            range: [60, 61],
            loc: {
                start: {
                    line: 3,
                    column: 16,
                },
                end: {
                    line: 3,
                    column: 17,
                },
            },
        },
        {
            type: "Punctuator",
            value: ">",
            range: [61, 62],
            loc: {
                start: {
                    line: 3,
                    column: 17,
                },
                end: {
                    line: 3,
                    column: 18,
                },
            },
        },
        {
            type: "Punctuator",
            value: "(",
            range: [62, 63],
            loc: {
                start: {
                    line: 3,
                    column: 18,
                },
                end: {
                    line: 3,
                    column: 19,
                },
            },
        },
        {
            type: "Punctuator",
            value: ")",
            range: [63, 64],
            loc: {
                start: {
                    line: 3,
                    column: 19,
                },
                end: {
                    line: 3,
                    column: 20,
                },
            },
        },
        {
            type: "Punctuator",
            value: ":",
            range: [64, 65],
            loc: {
                start: {
                    line: 3,
                    column: 20,
                },
                end: {
                    line: 3,
                    column: 21,
                },
            },
        },
        {
            type: "Identifier",
            value: "Promise",
            range: [66, 73],
            loc: {
                start: {
                    line: 3,
                    column: 22,
                },
                end: {
                    line: 3,
                    column: 29,
                },
            },
        },
        {
            type: "Punctuator",
            value: "<",
            range: [73, 74],
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
            type: "Keyword",
            value: "void",
            range: [74, 78],
            loc: {
                start: {
                    line: 3,
                    column: 30,
                },
                end: {
                    line: 3,
                    column: 34,
                },
            },
        },
        {
            type: "Punctuator",
            value: ">",
            range: [78, 79],
            loc: {
                start: {
                    line: 3,
                    column: 34,
                },
                end: {
                    line: 3,
                    column: 35,
                },
            },
        },
        {
            type: "Punctuator",
            value: "=>",
            range: [80, 82],
            loc: {
                start: {
                    line: 3,
                    column: 36,
                },
                end: {
                    line: 3,
                    column: 38,
                },
            },
        },
        {
            type: "Punctuator",
            value: "{",
            range: [83, 84],
            loc: {
                start: {
                    line: 3,
                    column: 39,
                },
                end: {
                    line: 3,
                    column: 40,
                },
            },
        },
        {
            type: "Punctuator",
            value: "}",
            range: [85, 86],
            loc: {
                start: {
                    line: 3,
                    column: 41,
                },
                end: {
                    line: 3,
                    column: 42,
                },
            },
        },
        {
            type: "Punctuator",
            value: ",",
            range: [86, 87],
            loc: {
                start: {
                    line: 3,
                    column: 42,
                },
                end: {
                    line: 3,
                    column: 43,
                },
            },
        },
        {
            type: "Identifier",
            value: "key",
            range: [93, 96],
            loc: {
                start: {
                    line: 5,
                    column: 4,
                },
                end: {
                    line: 5,
                    column: 7,
                },
            },
        },
        {
            type: "Punctuator",
            value: ":",
            range: [96, 97],
            loc: {
                start: {
                    line: 5,
                    column: 7,
                },
                end: {
                    line: 5,
                    column: 8,
                },
            },
        },
        {
            type: "Punctuator",
            value: "<",
            range: [98, 99],
            loc: {
                start: {
                    line: 5,
                    column: 9,
                },
                end: {
                    line: 5,
                    column: 10,
                },
            },
        },
        {
            type: "Identifier",
            value: "T",
            range: [99, 100],
            loc: {
                start: {
                    line: 5,
                    column: 10,
                },
                end: {
                    line: 5,
                    column: 11,
                },
            },
        },
        {
            type: "Punctuator",
            value: ">",
            range: [100, 101],
            loc: {
                start: {
                    line: 5,
                    column: 11,
                },
                end: {
                    line: 5,
                    column: 12,
                },
            },
        },
        {
            type: "Punctuator",
            value: "(",
            range: [101, 102],
            loc: {
                start: {
                    line: 5,
                    column: 12,
                },
                end: {
                    line: 5,
                    column: 13,
                },
            },
        },
        {
            type: "Identifier",
            value: "arg",
            range: [102, 105],
            loc: {
                start: {
                    line: 5,
                    column: 13,
                },
                end: {
                    line: 5,
                    column: 16,
                },
            },
        },
        {
            type: "Punctuator",
            value: ":",
            range: [105, 106],
            loc: {
                start: {
                    line: 5,
                    column: 16,
                },
                end: {
                    line: 5,
                    column: 17,
                },
            },
        },
        {
            type: "Identifier",
            value: "T",
            range: [107, 108],
            loc: {
                start: {
                    line: 5,
                    column: 18,
                },
                end: {
                    line: 5,
                    column: 19,
                },
            },
        },
        {
            type: "Punctuator",
            value: ")",
            range: [108, 109],
            loc: {
                start: {
                    line: 5,
                    column: 19,
                },
                end: {
                    line: 5,
                    column: 20,
                },
            },
        },
        {
            type: "Punctuator",
            value: ":",
            range: [109, 110],
            loc: {
                start: {
                    line: 5,
                    column: 20,
                },
                end: {
                    line: 5,
                    column: 21,
                },
            },
        },
        {
            type: "Identifier",
            value: "T",
            range: [111, 112],
            loc: {
                start: {
                    line: 5,
                    column: 22,
                },
                end: {
                    line: 5,
                    column: 23,
                },
            },
        },
        {
            type: "Punctuator",
            value: "=>",
            range: [113, 115],
            loc: {
                start: {
                    line: 5,
                    column: 24,
                },
                end: {
                    line: 5,
                    column: 26,
                },
            },
        },
        {
            type: "Punctuator",
            value: "{",
            range: [116, 117],
            loc: {
                start: {
                    line: 5,
                    column: 27,
                },
                end: {
                    line: 5,
                    column: 28,
                },
            },
        },
        {
            type: "Keyword",
            value: "return",
            range: [118, 124],
            loc: {
                start: {
                    line: 5,
                    column: 29,
                },
                end: {
                    line: 5,
                    column: 35,
                },
            },
        },
        {
            type: "Identifier",
            value: "arg",
            range: [125, 128],
            loc: {
                start: {
                    line: 5,
                    column: 36,
                },
                end: {
                    line: 5,
                    column: 39,
                },
            },
        },
        {
            type: "Punctuator",
            value: "}",
            range: [129, 130],
            loc: {
                start: {
                    line: 5,
                    column: 40,
                },
                end: {
                    line: 5,
                    column: 41,
                },
            },
        },
        {
            type: "Punctuator",
            value: ",",
            range: [130, 131],
            loc: {
                start: {
                    line: 5,
                    column: 41,
                },
                end: {
                    line: 5,
                    column: 42,
                },
            },
        },
        {
            type: "Identifier",
            value: "key",
            range: [136, 139],
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
            type: "Punctuator",
            value: ":",
            range: [139, 140],
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
            type: "Identifier",
            value: "async",
            range: [141, 146],
            loc: {
                start: {
                    line: 6,
                    column: 9,
                },
                end: {
                    line: 6,
                    column: 14,
                },
            },
        },
        {
            type: "Punctuator",
            value: "<",
            range: [147, 148],
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
            type: "Identifier",
            value: "T",
            range: [148, 149],
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
            type: "Punctuator",
            value: ">",
            range: [149, 150],
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
            type: "Punctuator",
            value: "(",
            range: [150, 151],
            loc: {
                start: {
                    line: 6,
                    column: 18,
                },
                end: {
                    line: 6,
                    column: 19,
                },
            },
        },
        {
            type: "Identifier",
            value: "arg",
            range: [151, 154],
            loc: {
                start: {
                    line: 6,
                    column: 19,
                },
                end: {
                    line: 6,
                    column: 22,
                },
            },
        },
        {
            type: "Punctuator",
            value: ":",
            range: [154, 155],
            loc: {
                start: {
                    line: 6,
                    column: 22,
                },
                end: {
                    line: 6,
                    column: 23,
                },
            },
        },
        {
            type: "Identifier",
            value: "T",
            range: [156, 157],
            loc: {
                start: {
                    line: 6,
                    column: 24,
                },
                end: {
                    line: 6,
                    column: 25,
                },
            },
        },
        {
            type: "Punctuator",
            value: ")",
            range: [157, 158],
            loc: {
                start: {
                    line: 6,
                    column: 25,
                },
                end: {
                    line: 6,
                    column: 26,
                },
            },
        },
        {
            type: "Punctuator",
            value: ":",
            range: [158, 159],
            loc: {
                start: {
                    line: 6,
                    column: 26,
                },
                end: {
                    line: 6,
                    column: 27,
                },
            },
        },
        {
            type: "Identifier",
            value: "Promise",
            range: [160, 167],
            loc: {
                start: {
                    line: 6,
                    column: 28,
                },
                end: {
                    line: 6,
                    column: 35,
                },
            },
        },
        {
            type: "Punctuator",
            value: "<",
            range: [167, 168],
            loc: {
                start: {
                    line: 6,
                    column: 35,
                },
                end: {
                    line: 6,
                    column: 36,
                },
            },
        },
        {
            type: "Identifier",
            value: "T",
            range: [168, 169],
            loc: {
                start: {
                    line: 6,
                    column: 36,
                },
                end: {
                    line: 6,
                    column: 37,
                },
            },
        },
        {
            type: "Punctuator",
            value: ">",
            range: [169, 170],
            loc: {
                start: {
                    line: 6,
                    column: 37,
                },
                end: {
                    line: 6,
                    column: 38,
                },
            },
        },
        {
            type: "Punctuator",
            value: "=>",
            range: [171, 173],
            loc: {
                start: {
                    line: 6,
                    column: 39,
                },
                end: {
                    line: 6,
                    column: 41,
                },
            },
        },
        {
            type: "Punctuator",
            value: "{",
            range: [174, 175],
            loc: {
                start: {
                    line: 6,
                    column: 42,
                },
                end: {
                    line: 6,
                    column: 43,
                },
            },
        },
        {
            type: "Keyword",
            value: "return",
            range: [176, 182],
            loc: {
                start: {
                    line: 6,
                    column: 44,
                },
                end: {
                    line: 6,
                    column: 50,
                },
            },
        },
        {
            type: "Identifier",
            value: "arg",
            range: [183, 186],
            loc: {
                start: {
                    line: 6,
                    column: 51,
                },
                end: {
                    line: 6,
                    column: 54,
                },
            },
        },
        {
            type: "Punctuator",
            value: "}",
            range: [187, 188],
            loc: {
                start: {
                    line: 6,
                    column: 55,
                },
                end: {
                    line: 6,
                    column: 56,
                },
            },
        },
        {
            type: "Punctuator",
            value: ",",
            range: [188, 189],
            loc: {
                start: {
                    line: 6,
                    column: 56,
                },
                end: {
                    line: 6,
                    column: 57,
                },
            },
        },
        {
            type: "Punctuator",
            value: "}",
            range: [190, 191],
            loc: {
                start: {
                    line: 7,
                    column: 0,
                },
                end: {
                    line: 7,
                    column: 1,
                },
            },
        },
    ],
    loc: {
        start: {
            line: 1,
            column: 0,
        },
        end: {
            line: 7,
            column: 1,
        },
    },
    parent: null,
});
