"use strict";

/**
 * Parser: @typescript-eslint/parser 5.59.11 (TS 5.1.3)
 * Source code:
 * foo ? foo : bar as any
 */

exports.parse = () => ({
  type: "Program",
  body: [
    {
      type: "ExpressionStatement",
      expression: {
        type: "ConditionalExpression",
        test: {
          type: "Identifier",
          decorators: [],
          name: "foo",
          optional: false,
          range: [0, 3],
          loc: {
            start: {
              line: 1,
              column: 0,
            },
            end: {
              line: 1,
              column: 3,
            },
          },
        },
        consequent: {
          type: "Identifier",
          decorators: [],
          name: "foo",
          optional: false,
          range: [6, 9],
          loc: {
            start: {
              line: 1,
              column: 6,
            },
            end: {
              line: 1,
              column: 9,
            },
          },
        },
        alternate: {
          type: "TSAsExpression",
          expression: {
            type: "Identifier",
            decorators: [],
            name: "bar",
            optional: false,
            range: [12, 15],
            loc: {
              start: {
                line: 1,
                column: 12,
              },
              end: {
                line: 1,
                column: 15,
              },
            },
          },
          typeAnnotation: {
            type: "TSAnyKeyword",
            range: [19, 22],
            loc: {
              start: {
                line: 1,
                column: 19,
              },
              end: {
                line: 1,
                column: 22,
              },
            },
          },
          range: [12, 22],
          loc: {
            start: {
              line: 1,
              column: 12,
            },
            end: {
              line: 1,
              column: 22,
            },
          },
        },
        range: [0, 22],
        loc: {
          start: {
            line: 1,
            column: 0,
          },
          end: {
            line: 1,
            column: 22,
          },
        },
      },
      range: [0, 22],
      loc: {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: 22,
        },
      },
    },
  ],
  comments: [],
  range: [0, 22],
  sourceType: "script",
  tokens: [
    {
      type: "Identifier",
      value: "foo",
      range: [0, 3],
      loc: {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: 3,
        },
      },
    },
    {
      type: "Punctuator",
      value: "?",
      range: [4, 5],
      loc: {
        start: {
          line: 1,
          column: 4,
        },
        end: {
          line: 1,
          column: 5,
        },
      },
    },
    {
      type: "Identifier",
      value: "foo",
      range: [6, 9],
      loc: {
        start: {
          line: 1,
          column: 6,
        },
        end: {
          line: 1,
          column: 9,
        },
      },
    },
    {
      type: "Punctuator",
      value: ":",
      range: [10, 11],
      loc: {
        start: {
          line: 1,
          column: 10,
        },
        end: {
          line: 1,
          column: 11,
        },
      },
    },
    {
      type: "Identifier",
      value: "bar",
      range: [12, 15],
      loc: {
        start: {
          line: 1,
          column: 12,
        },
        end: {
          line: 1,
          column: 15,
        },
      },
    },
    {
      type: "Identifier",
      value: "as",
      range: [16, 18],
      loc: {
        start: {
          line: 1,
          column: 16,
        },
        end: {
          line: 1,
          column: 18,
        },
      },
    },
    {
      type: "Identifier",
      value: "any",
      range: [19, 22],
      loc: {
        start: {
          line: 1,
          column: 19,
        },
        end: {
          line: 1,
          column: 22,
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
      column: 22,
    },
  },
});
