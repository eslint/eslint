"use strict";

exports.parse = () => ({
    type: "Program",
    range: [0, 16],
    loc: {
        start: { line: 1, column: 0 },
        end: { line: 1, column: 16 }
    },
    body: [
        {
            type: "VariableDeclaration",
            range: [0, 16],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 16 }
            },
            kind: "type",
            declarations: [
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        range: [
                            5,
                            8
                        ],
                        loc: {
                            start: { line: 1, column: 5 },
                            end: { line: 1, column: 8 }
                        },
                        name: "Foo"
                    },
                    init: {
                        type: "TSTypeReference",
                        range: [14, 15],
                        loc: {
                            start: { line: 1, column: 14 },
                            end: { line: 1, column: 15 }
                        },
                        typeName: {
                            type: "Identifier",
                            range: [14, 15],
                            loc: {
                                start: { line: 1, column: 14 },
                                end: { line: 1, column: 15 }
                            },
                            name: "T"
                        }
                    },
                    range: [5, 16],
                    loc: {
                        start: { line: 1, column: 5 },
                        end: { line: 1, column: 16 }
                    },
                    typeParameters: {
                        type: "TSTypeParameterDeclaration",
                        range: [8, 11],
                        loc: {
                            start: { line: 1, column: 8 },
                            end: { line: 1, column: 11 }
                        },
                        params: [
                            {
                                type: "TSTypeParameter",
                                range: [9, 10],
                                loc: {
                                    start: { line: 1, column: 9 },
                                    end: { line: 1, column: 10 }
                                },
                                name: "T"
                            }
                        ]
                    }
                }
            ]
        }
    ],
    sourceType: "script",
    tokens: [
        {
            type: "Identifier",
            value: "type",
            range: [0, 4],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 4 }
            }
        },
        {
            type: "Identifier",
            value: "Foo",
            range: [5, 8],
            loc: {
                start: { line: 1, column: 5 },
                end: { line: 1, column: 8 }
            }
        },
        {
            type: "Punctuator",
            value: "<",
            range: [8, 9],
            loc: {
                start: { line: 1, column: 8 },
                end: { line: 1, column: 9 }
            }
        },
        {
            type: "Identifier",
            value: "T",
            range: [9, 10],
            loc: {
                start: { line: 1, column: 9 },
                end: { line: 1, column: 10 }
            }
        },
        {
            type: "Punctuator",
            value: ">",
            range: [10, 11],
            loc: {
                start: { line: 1, column: 10 },
                end: { line: 1, column: 11 }
            }
        },
        {
            type: "Punctuator",
            value: "=",
            range: [12, 13],
            loc: {
                start: { line: 1, column: 12 },
                end: { line: 1, column: 13 }
            }
        },
        {
            type: "Identifier",
            value: "T",
            range: [14, 15],
            loc: {
                start: { line: 1, column: 14 },
                end: { line: 1, column: 15 }
            }
        },
        {
            type: "Punctuator",
            value: ";",
            range: [15, 16],
            loc: {
                start: { line: 1, column: 15 },
                end: { line: 1, column: 16 }
            }
        }
    ],
    comments: []
})
