"use strict";

/**
 * Parser: @typescript-eslint/parser@3.5.0
 * Source code:
 * async <T>(a) => b
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
              range: [10, 11],
              loc: {
                start: { line: 1, column: 10 },
                end: { line: 1, column: 11 },
              },
            },
          ],
          body: {
            type: "Identifier",
            name: "b",
            range: [16, 17],
            loc: { start: { line: 1, column: 16 }, end: { line: 1, column: 17 } },
          },
          async: true,
          expression: true,
          range: [0, 17],
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 17 } },
          typeParameters: {
            type: "TSTypeParameterDeclaration",
            range: [6, 9],
            loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 9 } },
            params: [
              {
                type: "TSTypeParameter",
                name: {
                  type: "Identifier",
                  name: "T",
                  range: [7, 8],
                  loc: {
                    start: { line: 1, column: 7 },
                    end: { line: 1, column: 8 },
                  },
                },
                range: [7, 8],
                loc: {
                  start: { line: 1, column: 7 },
                  end: { line: 1, column: 8 },
                },
              },
            ],
          },
        },
        range: [0, 17],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 17 } },
      },
    ],
    sourceType: "script",
    range: [0, 17],
    loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 17 } },
    tokens: [
      {
        type: "Identifier",
        value: "async",
        range: [0, 5],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 5 } },
      },
      {
        type: "Punctuator",
        value: "<",
        range: [6, 7],
        loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 7 } },
      },
      {
        type: "Identifier",
        value: "T",
        range: [7, 8],
        loc: { start: { line: 1, column: 7 }, end: { line: 1, column: 8 } },
      },
      {
        type: "Punctuator",
        value: ">",
        range: [8, 9],
        loc: { start: { line: 1, column: 8 }, end: { line: 1, column: 9 } },
      },
      {
        type: "Punctuator",
        value: "(",
        range: [9, 10],
        loc: { start: { line: 1, column: 9 }, end: { line: 1, column: 10 } },
      },
      {
        type: "Identifier",
        value: "a",
        range: [10, 11],
        loc: { start: { line: 1, column: 10 }, end: { line: 1, column: 11 } },
      },
      {
        type: "Punctuator",
        value: ")",
        range: [11, 12],
        loc: { start: { line: 1, column: 11 }, end: { line: 1, column: 12 } },
      },
      {
        type: "Punctuator",
        value: "=>",
        range: [13, 15],
        loc: { start: { line: 1, column: 13 }, end: { line: 1, column: 15 } },
      },
      {
        type: "Identifier",
        value: "b",
        range: [16, 17],
        loc: { start: { line: 1, column: 16 }, end: { line: 1, column: 17 } },
      },
    ],
    comments: [],
  });
