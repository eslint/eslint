"use strict";

/**
 * Parser: @typescript-eslint/parser 5.59.11 (TS 5.1.3)
 * Source code:
 * if (!Boolean(a as any)) { }
 */

exports.parse = () => ({
  type: "Program",
  body: [
    {
      type: "IfStatement",
      test: {
        type: "UnaryExpression",
        operator: "!",
        prefix: true,
        argument: {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            decorators: [],
            name: "Boolean",
            optional: false,
            range: [5, 12],
            loc: {
              start: {
                line: 1,
                column: 5,
              },
              end: {
                line: 1,
                column: 12,
              },
            },
          },
          arguments: [
            {
              type: "TSAsExpression",
              expression: {
                type: "Identifier",
                decorators: [],
                name: "a",
                optional: false,
                range: [13, 14],
                loc: {
                  start: {
                    line: 1,
                    column: 13,
                  },
                  end: {
                    line: 1,
                    column: 14,
                  },
                },
              },
              typeAnnotation: {
                type: "TSAnyKeyword",
                range: [18, 21],
                loc: {
                  start: {
                    line: 1,
                    column: 18,
                  },
                  end: {
                    line: 1,
                    column: 21,
                  },
                },
              },
              range: [13, 21],
              loc: {
                start: {
                  line: 1,
                  column: 13,
                },
                end: {
                  line: 1,
                  column: 21,
                },
              },
            },
          ],
          optional: false,
          range: [5, 22],
          loc: {
            start: {
              line: 1,
              column: 5,
            },
            end: {
              line: 1,
              column: 22,
            },
          },
        },
        range: [4, 22],
        loc: {
          start: {
            line: 1,
            column: 4,
          },
          end: {
            line: 1,
            column: 22,
          },
        },
      },
      consequent: {
        type: "BlockStatement",
        body: [],
        range: [24, 27],
        loc: {
          start: {
            line: 1,
            column: 24,
          },
          end: {
            line: 1,
            column: 27,
          },
        },
      },
      alternate: null,
      range: [0, 27],
      loc: {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: 27,
        },
      },
    },
  ],
  comments: [],
  range: [0, 27],
  sourceType: "script",
  tokens: [
    {
      type: "Keyword",
      value: "if",
      range: [0, 2],
      loc: {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: 2,
        },
      },
    },
    {
      type: "Punctuator",
      value: "(",
      range: [3, 4],
      loc: {
        start: {
          line: 1,
          column: 3,
        },
        end: {
          line: 1,
          column: 4,
        },
      },
    },
    {
      type: "Punctuator",
      value: "!",
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
      value: "Boolean",
      range: [5, 12],
      loc: {
        start: {
          line: 1,
          column: 5,
        },
        end: {
          line: 1,
          column: 12,
        },
      },
    },
    {
      type: "Punctuator",
      value: "(",
      range: [12, 13],
      loc: {
        start: {
          line: 1,
          column: 12,
        },
        end: {
          line: 1,
          column: 13,
        },
      },
    },
    {
      type: "Identifier",
      value: "a",
      range: [13, 14],
      loc: {
        start: {
          line: 1,
          column: 13,
        },
        end: {
          line: 1,
          column: 14,
        },
      },
    },
    {
      type: "Identifier",
      value: "as",
      range: [15, 17],
      loc: {
        start: {
          line: 1,
          column: 15,
        },
        end: {
          line: 1,
          column: 17,
        },
      },
    },
    {
      type: "Identifier",
      value: "any",
      range: [18, 21],
      loc: {
        start: {
          line: 1,
          column: 18,
        },
        end: {
          line: 1,
          column: 21,
        },
      },
    },
    {
      type: "Punctuator",
      value: ")",
      range: [21, 22],
      loc: {
        start: {
          line: 1,
          column: 21,
        },
        end: {
          line: 1,
          column: 22,
        },
      },
    },
    {
      type: "Punctuator",
      value: ")",
      range: [22, 23],
      loc: {
        start: {
          line: 1,
          column: 22,
        },
        end: {
          line: 1,
          column: 23,
        },
      },
    },
    {
      type: "Punctuator",
      value: "{",
      range: [24, 25],
      loc: {
        start: {
          line: 1,
          column: 24,
        },
        end: {
          line: 1,
          column: 25,
        },
      },
    },
    {
      type: "Punctuator",
      value: "}",
      range: [26, 27],
      loc: {
        start: {
          line: 1,
          column: 26,
        },
        end: {
          line: 1,
          column: 27,
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
      column: 27,
    },
  },
});
