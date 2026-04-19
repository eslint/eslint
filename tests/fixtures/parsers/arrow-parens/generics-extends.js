"use strict";

/**
 * Parser: @typescript-eslint/parser@3.5.0
 * Source code:
 * <T extends A>(a) => b
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
              range: [14, 15],
              loc: {
                start: { line: 1, column: 14 },
                end: { line: 1, column: 15 },
              },
            },
          ],
          body: {
            type: "Identifier",
            name: "b",
            range: [20, 21],
            loc: { start: { line: 1, column: 20 }, end: { line: 1, column: 21 } },
          },
          async: false,
          expression: true,
          range: [0, 21],
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 21 } },
          typeParameters: {
            type: "TSTypeParameterDeclaration",
            range: [0, 13],
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 13 } },
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
                constraint: {
                  type: "TSTypeReference",
                  typeName: {
                    type: "Identifier",
                    name: "A",
                    range: [11, 12],
                    loc: {
                      start: { line: 1, column: 11 },
                      end: { line: 1, column: 12 },
                    },
                  },
                  range: [11, 12],
                  loc: {
                    start: { line: 1, column: 11 },
                    end: { line: 1, column: 12 },
                  },
                },
                range: [1, 12],
                loc: {
                  start: { line: 1, column: 1 },
                  end: { line: 1, column: 12 },
                },
              },
            ],
          },
        },
        range: [0, 21],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 21 } },
      },
    ],
    sourceType: "script",
    range: [0, 21],
    loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 21 } },
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
        type: "Keyword",
        value: "extends",
        range: [3, 10],
        loc: { start: { line: 1, column: 3 }, end: { line: 1, column: 10 } },
      },
      {
        type: "Identifier",
        value: "A",
        range: [11, 12],
        loc: { start: { line: 1, column: 11 }, end: { line: 1, column: 12 } },
      },
      {
        type: "Punctuator",
        value: ">",
        range: [12, 13],
        loc: { start: { line: 1, column: 12 }, end: { line: 1, column: 13 } },
      },
      {
        type: "Punctuator",
        value: "(",
        range: [13, 14],
        loc: { start: { line: 1, column: 13 }, end: { line: 1, column: 14 } },
      },
      {
        type: "Identifier",
        value: "a",
        range: [14, 15],
        loc: { start: { line: 1, column: 14 }, end: { line: 1, column: 15 } },
      },
      {
        type: "Punctuator",
        value: ")",
        range: [15, 16],
        loc: { start: { line: 1, column: 15 }, end: { line: 1, column: 16 } },
      },
      {
        type: "Punctuator",
        value: "=>",
        range: [17, 19],
        loc: { start: { line: 1, column: 17 }, end: { line: 1, column: 19 } },
      },
      {
        type: "Identifier",
        value: "b",
        range: [20, 21],
        loc: { start: { line: 1, column: 20 }, end: { line: 1, column: 21 } },
      },
    ],
    comments: [],
  });
