"use strict";

/**
 * Parser: @typescript-eslint/parser@5.0.0
 *
 * Source code:
 * <Thing>this.blah
 */

exports.parse = () => ({
    type: "Program",
    body: [
        {
            type: "ExpressionStatement",
            expression: {
                type: "TSTypeAssertion",
                typeAnnotation: {
                    type: "TSTypeReference",
                    typeName: {
                        type: "Identifier",
                        name: "Thing",
                        range: [1, 6],
                        loc: {
                            start: { line: 1, column: 1 },
                            end: { line: 1, column: 6 },
                        },
                    },
                    range: [1, 6],
                    loc: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 6 },
                    },
                },
                expression: {
                    type: "MemberExpression",
                    object: {
                        type: "ThisExpression",
                        range: [7, 11],
                        loc: {
                            start: { line: 1, column: 7 },
                            end: { line: 1, column: 11 },
                        },
                    },
                    property: {
                        type: "Identifier",
                        name: "blah",
                        range: [12, 16],
                        loc: {
                            start: { line: 1, column: 12 },
                            end: { line: 1, column: 16 },
                        },
                    },
                    computed: false,
                    optional: false,
                    range: [7, 16],
                    loc: {
                        start: { line: 1, column: 7 },
                        end: { line: 1, column: 16 },
                    },
                },
                range: [0, 16],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 16 },
                },
            },
            range: [0, 16],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 16 },
            },
        },
    ],
    sourceType: "script",
    range: [0, 16],
    loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 16 } },
    tokens: [
        {
            type: "Punctuator",
            value: "<",
            range: [0, 1],
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 1 } },
        },
        {
            type: "Identifier",
            value: "Thing",
            range: [1, 6],
            loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 6 } },
        },
        {
            type: "Punctuator",
            value: ">",
            range: [6, 7],
            loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 7 } },
        },
        {
            type: "Keyword",
            value: "this",
            range: [7, 11],
            loc: {
                start: { line: 1, column: 7 },
                end: { line: 1, column: 11 },
            },
        },
        {
            type: "Punctuator",
            value: ".",
            range: [11, 12],
            loc: {
                start: { line: 1, column: 11 },
                end: { line: 1, column: 12 },
            },
        },
        {
            type: "Identifier",
            value: "blah",
            range: [12, 16],
            loc: {
                start: { line: 1, column: 12 },
                end: { line: 1, column: 16 },
            },
        },
    ],
    comments: [],
});
