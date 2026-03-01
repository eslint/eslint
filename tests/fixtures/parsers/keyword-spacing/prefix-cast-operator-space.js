"use strict";

/**
 * Parser: @typescript-eslint/parser@5.0.0
 *
 * Source code:
 * <Thing> this.blah
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
                        range: [8, 12],
                        loc: {
                            start: { line: 1, column: 8 },
                            end: { line: 1, column: 12 },
                        },
                    },
                    property: {
                        type: "Identifier",
                        name: "blah",
                        range: [13, 17],
                        loc: {
                            start: { line: 1, column: 13 },
                            end: { line: 1, column: 17 },
                        },
                    },
                    computed: false,
                    optional: false,
                    range: [8, 17],
                    loc: {
                        start: { line: 1, column: 8 },
                        end: { line: 1, column: 17 },
                    },
                },
                range: [0, 17],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 17 },
                },
            },
            range: [0, 17],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 17 },
            },
        },
    ],
    sourceType: "script",
    range: [0, 17],
    loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 17 } },
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
            range: [8, 12],
            loc: {
                start: { line: 1, column: 8 },
                end: { line: 1, column: 12 },
            },
        },
        {
            type: "Punctuator",
            value: ".",
            range: [12, 13],
            loc: {
                start: { line: 1, column: 12 },
                end: { line: 1, column: 13 },
            },
        },
        {
            type: "Identifier",
            value: "blah",
            range: [13, 17],
            loc: {
                start: { line: 1, column: 13 },
                end: { line: 1, column: 17 },
            },
        },
    ],
    comments: [],
});
