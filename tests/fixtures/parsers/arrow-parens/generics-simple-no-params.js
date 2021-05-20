"use strict";

/**
 * Parser: @typescript-eslint/parser@3.5.0
 * Source code:
 * <T>() => b
 */

exports.parse = () => ({
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "ArrowFunctionExpression",
          generator: false,
          id: null,
          params: [],
          body: {
            type: "Identifier",
            name: "b",
            range: [9, 10],
            loc: { start: { line: 1, column: 9 }, end: { line: 1, column: 10 } },
          },
          async: false,
          expression: true,
          range: [0, 10],
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
          typeParameters: {
            type: "TSTypeParameterDeclaration",
            range: [0, 3],
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 3 } },
            params: [
              {
                type: "TSTypeParameter",
                name: {
                  type: "Identifier",
                  name: "T",
                  range: [1, 2],
                  loc: {
                    start: { line: 1, column: 1 },
                    end: { line: 1, column: 2 },
                  },
                },
                range: [1, 2],
                loc: {
                  start: { line: 1, column: 1 },
                  end: { line: 1, column: 2 },
                },
              },
            ],
          },
        },
        range: [0, 10],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
      },
    ],
    sourceType: "script",
    range: [0, 10],
    loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
    tokens: [
      {
        type: "Punctuator",
        value: "<",
        range: [0, 1],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 1 } },
      },
      {
        type: "Identifier",
        value: "T",
        range: [1, 2],
        loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 2 } },
      },
      {
        type: "Punctuator",
        value: ">",
        range: [2, 3],
        loc: { start: { line: 1, column: 2 }, end: { line: 1, column: 3 } },
      },
      {
        type: "Punctuator",
        value: "(",
        range: [3, 4],
        loc: { start: { line: 1, column: 3 }, end: { line: 1, column: 4 } },
      },
      {
        type: "Punctuator",
        value: ")",
        range: [4, 5],
        loc: { start: { line: 1, column: 4 }, end: { line: 1, column: 5 } },
      },
      {
        type: "Punctuator",
        value: "=>",
        range: [6, 8],
        loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 8 } },
      },
      {
        type: "Identifier",
        value: "b",
        range: [9, 10],
        loc: { start: { line: 1, column: 9 }, end: { line: 1, column: 10 } },
      },
    ],
    comments: [],
  });
