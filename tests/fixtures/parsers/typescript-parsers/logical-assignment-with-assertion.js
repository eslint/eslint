"use strict";

/**
 * Parser: @typescript-eslint/parser 5.59.11 (TS 5.1.3)
 * Source code:
 * a ||= b as number;
 */

exports.parse = () => ({
  type: "Program",
  body: [
    {
      type: "ExpressionStatement",
      expression: {
        type: "AssignmentExpression",
        operator: "||=",
        left: {
          type: "Identifier",
          decorators: [],
          name: "a",
          optional: false,
          range: [0, 1],
          loc: {
            start: {
              line: 1,
              column: 0,
            },
            end: {
              line: 1,
              column: 1,
            },
          },
        },
        right: {
          type: "TSAsExpression",
          expression: {
            type: "Identifier",
            decorators: [],
            name: "b",
            optional: false,
            range: [6, 7],
            loc: {
              start: {
                line: 1,
                column: 6,
              },
              end: {
                line: 1,
                column: 7,
              },
            },
          },
          typeAnnotation: {
            type: "TSNumberKeyword",
            range: [11, 17],
            loc: {
              start: {
                line: 1,
                column: 11,
              },
              end: {
                line: 1,
                column: 17,
              },
            },
          },
          range: [6, 17],
          loc: {
            start: {
              line: 1,
              column: 6,
            },
            end: {
              line: 1,
              column: 17,
            },
          },
        },
        range: [0, 17],
        loc: {
          start: {
            line: 1,
            column: 0,
          },
          end: {
            line: 1,
            column: 17,
          },
        },
      },
      range: [0, 18],
      loc: {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: 18,
        },
      },
    },
  ],
  comments: [],
  range: [0, 18],
  sourceType: "script",
  tokens: [
    {
      type: "Identifier",
      value: "a",
      range: [0, 1],
      loc: {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: 1,
        },
      },
    },
    {
      type: "Punctuator",
      value: "||=",
      range: [2, 5],
      loc: {
        start: {
          line: 1,
          column: 2,
        },
        end: {
          line: 1,
          column: 5,
        },
      },
    },
    {
      type: "Identifier",
      value: "b",
      range: [6, 7],
      loc: {
        start: {
          line: 1,
          column: 6,
        },
        end: {
          line: 1,
          column: 7,
        },
      },
    },
    {
      type: "Identifier",
      value: "as",
      range: [8, 10],
      loc: {
        start: {
          line: 1,
          column: 8,
        },
        end: {
          line: 1,
          column: 10,
        },
      },
    },
    {
      type: "Identifier",
      value: "number",
      range: [11, 17],
      loc: {
        start: {
          line: 1,
          column: 11,
        },
        end: {
          line: 1,
          column: 17,
        },
      },
    },
    {
      type: "Punctuator",
      value: ";",
      range: [17, 18],
      loc: {
        start: {
          line: 1,
          column: 17,
        },
        end: {
          line: 1,
          column: 18,
        },
      },
    },
  ],
  loc: {
    start: {
      line: 1,
      column: 0,
    },
    end: {
      line: 1,
      column: 18,
    },
  },
});
