"use strict";

/**
 * Parser: @typescript-eslint/parser 5.59.11 (TS 5.1.3)
 * Source code:
 * foo as any ? false : true
 */

exports.parse = () => ({
  type: "Program",
  body: [
    {
      type: "ExpressionStatement",
      expression: {
        type: "ConditionalExpression",
        test: {
          type: "TSAsExpression",
          expression: {
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
          typeAnnotation: {
            type: "TSAnyKeyword",
            range: [7, 10],
            loc: {
              start: {
                line: 1,
                column: 7,
              },
              end: {
                line: 1,
                column: 10,
              },
            },
          },
          range: [0, 10],
          loc: {
            start: {
              line: 1,
              column: 0,
            },
            end: {
              line: 1,
              column: 10,
            },
          },
        },
        consequent: {
          type: "Literal",
          value: false,
          raw: "false",
          range: [13, 18],
          loc: {
            start: {
              line: 1,
              column: 13,
            },
            end: {
              line: 1,
              column: 18,
            },
          },
        },
        alternate: {
          type: "Literal",
          value: true,
          raw: "true",
          range: [21, 25],
          loc: {
            start: {
              line: 1,
              column: 21,
            },
            end: {
              line: 1,
              column: 25,
            },
          },
        },
        range: [0, 25],
        loc: {
          start: {
            line: 1,
            column: 0,
          },
          end: {
            line: 1,
            column: 25,
          },
        },
      },
      range: [0, 25],
      loc: {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: 25,
        },
      },
    },
  ],
  comments: [],
  range: [0, 25],
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
      type: "Identifier",
      value: "as",
      range: [4, 6],
      loc: {
        start: {
          line: 1,
          column: 4,
        },
        end: {
          line: 1,
          column: 6,
        },
      },
    },
    {
      type: "Identifier",
      value: "any",
      range: [7, 10],
      loc: {
        start: {
          line: 1,
          column: 7,
        },
        end: {
          line: 1,
          column: 10,
        },
      },
    },
    {
      type: "Punctuator",
      value: "?",
      range: [11, 12],
      loc: {
        start: {
          line: 1,
          column: 11,
        },
        end: {
          line: 1,
          column: 12,
        },
      },
    },
    {
      type: "Boolean",
      value: "false",
      range: [13, 18],
      loc: {
        start: {
          line: 1,
          column: 13,
        },
        end: {
          line: 1,
          column: 18,
        },
      },
    },
    {
      type: "Punctuator",
      value: ":",
      range: [19, 20],
      loc: {
        start: {
          line: 1,
          column: 19,
        },
        end: {
          line: 1,
          column: 20,
        },
      },
    },
    {
      type: "Boolean",
      value: "true",
      range: [21, 25],
      loc: {
        start: {
          line: 1,
          column: 21,
        },
        end: {
          line: 1,
          column: 25,
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
      column: 25,
    },
  },
});
