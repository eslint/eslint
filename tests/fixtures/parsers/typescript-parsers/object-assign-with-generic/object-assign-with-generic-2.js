"use strict";

/**
 * Parser: @typescript-eslint/parser@2.24.0
 * Source code:
 * Object.assign<{}, A>({}, foo);
 */

exports.parse = () => ({
  type: "Program",
  body: [
    {
      type: "ExpressionStatement",
      expression: {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: {
            type: "Identifier",
            name: "Object",
            range: [0, 6],
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 6 } }
          },
          property: {
            type: "Identifier",
            name: "assign",
            range: [7, 13],
            loc: { start: { line: 1, column: 7 }, end: { line: 1, column: 13 } }
          },
          computed: false,
          optional: false,
          range: [0, 13],
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 13 } }
        },
        arguments: [
          {
            type: "ObjectExpression",
            properties: [],
            range: [21, 23],
            loc: {
              start: { line: 1, column: 21 },
              end: { line: 1, column: 23 }
            }
          },
          {
            type: "Identifier",
            name: "foo",
            range: [25, 28],
            loc: {
              start: { line: 1, column: 25 },
              end: { line: 1, column: 28 }
            }
          }
        ],
        optional: false,
        range: [0, 29],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 29 } },
        typeParameters: {
          type: "TSTypeParameterInstantiation",
          range: [13, 20],
          params: [
            {
              type: "TSTypeLiteral",
              members: [],
              range: [14, 16],
              loc: {
                start: { line: 1, column: 14 },
                end: { line: 1, column: 16 }
              }
            },
            {
              type: "TSTypeReference",
              typeName: {
                type: "Identifier",
                name: "A",
                range: [18, 19],
                loc: {
                  start: { line: 1, column: 18 },
                  end: { line: 1, column: 19 }
                }
              },
              range: [18, 19],
              loc: {
                start: { line: 1, column: 18 },
                end: { line: 1, column: 19 }
              }
            }
          ],
          loc: { start: { line: 1, column: 13 }, end: { line: 1, column: 20 } }
        }
      },
      range: [0, 30],
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 30 } }
    }
  ],
  sourceType: "script",
  range: [0, 30],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 30 } },
  tokens: [
    {
      type: "Identifier",
      value: "Object",
      range: [0, 6],
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 6 } }
    },
    {
      type: "Punctuator",
      value: ".",
      range: [6, 7],
      loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 7 } }
    },
    {
      type: "Identifier",
      value: "assign",
      range: [7, 13],
      loc: { start: { line: 1, column: 7 }, end: { line: 1, column: 13 } }
    },
    {
      type: "Punctuator",
      value: "<",
      range: [13, 14],
      loc: { start: { line: 1, column: 13 }, end: { line: 1, column: 14 } }
    },
    {
      type: "Punctuator",
      value: "{",
      range: [14, 15],
      loc: { start: { line: 1, column: 14 }, end: { line: 1, column: 15 } }
    },
    {
      type: "Punctuator",
      value: "}",
      range: [15, 16],
      loc: { start: { line: 1, column: 15 }, end: { line: 1, column: 16 } }
    },
    {
      type: "Punctuator",
      value: ",",
      range: [16, 17],
      loc: { start: { line: 1, column: 16 }, end: { line: 1, column: 17 } }
    },
    {
      type: "Identifier",
      value: "A",
      range: [18, 19],
      loc: { start: { line: 1, column: 18 }, end: { line: 1, column: 19 } }
    },
    {
      type: "Punctuator",
      value: ">",
      range: [19, 20],
      loc: { start: { line: 1, column: 19 }, end: { line: 1, column: 20 } }
    },
    {
      type: "Punctuator",
      value: "(",
      range: [20, 21],
      loc: { start: { line: 1, column: 20 }, end: { line: 1, column: 21 } }
    },
    {
      type: "Punctuator",
      value: "{",
      range: [21, 22],
      loc: { start: { line: 1, column: 21 }, end: { line: 1, column: 22 } }
    },
    {
      type: "Punctuator",
      value: "}",
      range: [22, 23],
      loc: { start: { line: 1, column: 22 }, end: { line: 1, column: 23 } }
    },
    {
      type: "Punctuator",
      value: ",",
      range: [23, 24],
      loc: { start: { line: 1, column: 23 }, end: { line: 1, column: 24 } }
    },
    {
      type: "Identifier",
      value: "foo",
      range: [25, 28],
      loc: { start: { line: 1, column: 25 }, end: { line: 1, column: 28 } }
    },
    {
      type: "Punctuator",
      value: ")",
      range: [28, 29],
      loc: { start: { line: 1, column: 28 }, end: { line: 1, column: 29 } }
    },
    {
      type: "Punctuator",
      value: ";",
      range: [29, 30],
      loc: { start: { line: 1, column: 29 }, end: { line: 1, column: 30 } }
    }
  ],
  comments: []
});
