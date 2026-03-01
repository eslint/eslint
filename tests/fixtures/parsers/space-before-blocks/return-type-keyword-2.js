"use strict";

/**
 * Parser: @typescript-eslint/parser@4.2.0
 * Source code:
 * function foo(): null {}
 */

exports.parse = () => ({
    type: "Program",
    body: [
      {
        type: "FunctionDeclaration",
        id: {
          type: "Identifier",
          name: "foo",
          range: [9, 12],
          loc: { start: { line: 1, column: 9 }, end: { line: 1, column: 12 } },
        },
        generator: false,
        expression: false,
        async: false,
        params: [],
        body: {
          type: "BlockStatement",
          body: [],
          range: [21, 23],
          loc: { start: { line: 1, column: 21 }, end: { line: 1, column: 23 } },
        },
        range: [0, 23],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 23 } },
        returnType: {
          type: "TSTypeAnnotation",
          loc: { start: { line: 1, column: 14 }, end: { line: 1, column: 20 } },
          range: [14, 20],
          typeAnnotation: {
            type: "TSNullKeyword",
            range: [16, 20],
            loc: { start: { line: 1, column: 16 }, end: { line: 1, column: 20 } },
          },
        },
      },
    ],
    sourceType: "script",
    range: [0, 23],
    loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 23 } },
    tokens: [
      {
        type: "Keyword",
        value: "function",
        range: [0, 8],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 8 } },
      },
      {
        type: "Identifier",
        value: "foo",
        range: [9, 12],
        loc: { start: { line: 1, column: 9 }, end: { line: 1, column: 12 } },
      },
      {
        type: "Punctuator",
        value: "(",
        range: [12, 13],
        loc: { start: { line: 1, column: 12 }, end: { line: 1, column: 13 } },
      },
      {
        type: "Punctuator",
        value: ")",
        range: [13, 14],
        loc: { start: { line: 1, column: 13 }, end: { line: 1, column: 14 } },
      },
      {
        type: "Punctuator",
        value: ":",
        range: [14, 15],
        loc: { start: { line: 1, column: 14 }, end: { line: 1, column: 15 } },
      },
      {
        type: "Keyword",
        value: "null",
        range: [16, 20],
        loc: { start: { line: 1, column: 16 }, end: { line: 1, column: 20 } },
      },
      {
        type: "Punctuator",
        value: "{",
        range: [21, 22],
        loc: { start: { line: 1, column: 21 }, end: { line: 1, column: 22 } },
      },
      {
        type: "Punctuator",
        value: "}",
        range: [22, 23],
        loc: { start: { line: 1, column: 22 }, end: { line: 1, column: 23 } },
      },
    ],
    comments: [],
  });
