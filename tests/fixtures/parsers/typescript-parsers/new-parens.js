"use strict";

// new Storage<RootState>('state');

exports.parse = () => ({
    type: "Program",
    range: [0, 32],
    loc: {
        start: { line: 1, column: 0 },
        end: { line: 1, column: 32 }
    },
    body: [
        {
            type: "ExpressionStatement",
            range: [0, 32],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 32 }
            },
            expression: {
                type: "NewExpression",
                range: [0, 31],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 31 }
                },
                callee: {
                    type: "Identifier",
                    range: [4, 11],
                    loc: {
                        start: { line: 1, column: 4 },
                        end: { line: 1, column: 11 }
                    },
                    name: "Storage"
                },
                arguments: [
                    {
                        type: "Literal",
                        range: [23, 30],
                        loc: {
                            start: { line: 1, column: 23 },
                            end: { line: 1, column: 30 }
                        },
                        value: "state",
                        raw: "'state'"
                    }
                ]
            }
        }
    ],
    sourceType: "script",
    tokens: [
        {
            type: "Keyword",
            value: "new",
            range: [0, 3],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 3 }
            }
        },
        {
            type: "Identifier",
            value: "Storage",
            range: [4, 11],
            loc: {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 11 }
            }
        },
        {
            type: "Punctuator",
            value: "<",
            range: [11, 12],
            loc: {
                start: { line: 1, column: 11 },
                end: { line: 1, column: 12 }
            }
        },
        {
            type: "Identifier",
            value: "RootState",
            range: [12, 21],
            loc: {
                start: { line: 1, column: 12 },
                end: { line: 1, column: 21 }
            }
        },
        {
            type: "Punctuator",
            value: ">",
            range: [21, 22],
            loc: {
                start: { line: 1, column: 21 },
                end: { line: 1, column: 22 }
            }
        },
        {
            type: "Punctuator",
            value: "(",
            range: [22, 23],
            loc: {
                start: { line: 1, column: 22 },
                end: { line: 1, column: 23 }
            }
        },
        {
            type: "String",
            value: "'state'",
            range: [23, 30],
            loc: {
                start: { line: 1, column: 23 },
                end: { line: 1, column: 30 }
            }
        },
        {
            type: "Punctuator",
            value: ")",
            range: [30, 31],
            loc: {
                start: { line: 1, column: 30 },
                end: { line: 1, column: 31 }
            }
        },
        {
            type: "Punctuator",
            value: ";",
            range: [31, 32],
            loc: {
                start: { line: 1, column: 31 },
                end: { line: 1, column: 32 }
            }
        }
    ],
    comments: []
});
