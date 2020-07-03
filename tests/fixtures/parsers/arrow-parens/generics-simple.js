"use strict";

/**
 * Parser: @typescript-eslint/parser@3.5.0
 * Source code:
 * <T>(a) => b
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
          params: [
            {
              type: "Identifier",
              name: "a",
              range: [4, 5],
              loc: { start: { line: 1, column: 4 }, end: { line: 1, column: 5 } },
            },
          ],
          body: {
            type: "Identifier",
            name: "b",
            range: [10, 11],
            loc: { start: { line: 1, column: 10 }, end: { line: 1, column: 11 } },
          },
          async: false,
          expression: true,
          range: [0, 11],
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 11 } },
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
        range: [0, 11],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 11 } },
      },
    ],
    sourceType: "script",
    range: [0, 11],
    loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 11 } },
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
        type: "Identifier",
        value: "a",
        range: [4, 5],
        loc: { start: { line: 1, column: 4 }, end: { line: 1, column: 5 } },
      },
      {
        type: "Punctuator",
        value: ")",
        range: [5, 6],
        loc: { start: { line: 1, column: 5 }, end: { line: 1, column: 6 } },
      },
      {
        type: "Punctuator",
        value: "=>",
        range: [7, 9],
        loc: { start: { line: 1, column: 7 }, end: { line: 1, column: 9 } },
      },
      {
        type: "Identifier",
        value: "b",
        range: [10, 11],
        loc: { start: { line: 1, column: 10 }, end: { line: 1, column: 11 } },
      },
    ],
    comments: [],
  });
