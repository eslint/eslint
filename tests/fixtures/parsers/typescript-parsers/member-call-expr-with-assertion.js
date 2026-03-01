"use strict";

/**
 * Parser: @typescript-eslint/parser 5.59.11 (TS 5.1.3)
 * Source code:
 * const x = (1 satisfies number).toFixed();
 */

exports.parse = () => ({
  type: "Program",
  body: [
    {
      type: "VariableDeclaration",
      declarations: [
        {
          type: "VariableDeclarator",
          definite: false,
          id: {
            type: "Identifier",
            decorators: [],
            name: "x",
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
          init: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              object: {
                type: "TSSatisfiesExpression",
                expression: {
                  type: "Literal",
                  value: 1,
                  raw: "1",
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
                typeAnnotation: {
                  type: "TSNumberKeyword",
                  range: [23, 29],
                  loc: {
                    start: {
                      line: 1,
                      column: 23,
                    },
                    end: {
                      line: 1,
                      column: 29,
                    },
                  },
                },
                range: [11, 29],
                loc: {
                  start: {
                    line: 1,
                    column: 11,
                  },
                  end: {
                    line: 1,
                    column: 29,
                  },
                },
              },
              property: {
                type: "Identifier",
                decorators: [],
                name: "toFixed",
                optional: false,
                range: [31, 38],
                loc: {
                  start: {
                    line: 1,
                    column: 31,
                  },
                  end: {
                    line: 1,
                    column: 38,
                  },
                },
              },
              computed: false,
              optional: false,
              range: [10, 38],
              loc: {
                start: {
                  line: 1,
                  column: 10,
                },
                end: {
                  line: 1,
                  column: 38,
                },
              },
            },
            arguments: [],
            optional: false,
            range: [10, 40],
            loc: {
              start: {
                line: 1,
                column: 10,
              },
              end: {
                line: 1,
                column: 40,
              },
            },
          },
          range: [6, 40],
          loc: {
            start: {
              line: 1,
              column: 6,
            },
            end: {
              line: 1,
              column: 40,
            },
          },
        },
      ],
      declare: false,
      kind: "const",
      range: [0, 41],
      loc: {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: 41,
        },
      },
    },
  ],
  comments: [],
  range: [0, 41],
  sourceType: "script",
  tokens: [
    {
      type: "Keyword",
      value: "const",
      range: [0, 5],
      loc: {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: 5,
        },
      },
    },
    {
      type: "Identifier",
      value: "x",
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
      type: "Punctuator",
      value: "=",
      range: [8, 9],
      loc: {
        start: {
          line: 1,
          column: 8,
        },
        end: {
          line: 1,
          column: 9,
        },
      },
    },
    {
      type: "Punctuator",
      value: "(",
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
      type: "Numeric",
      value: "1",
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
      type: "Identifier",
      value: "satisfies",
      range: [13, 22],
      loc: {
        start: {
          line: 1,
          column: 13,
        },
        end: {
          line: 1,
          column: 22,
        },
      },
    },
    {
      type: "Identifier",
      value: "number",
      range: [23, 29],
      loc: {
        start: {
          line: 1,
          column: 23,
        },
        end: {
          line: 1,
          column: 29,
        },
      },
    },
    {
      type: "Punctuator",
      value: ")",
      range: [29, 30],
      loc: {
        start: {
          line: 1,
          column: 29,
        },
        end: {
          line: 1,
          column: 30,
        },
      },
    },
    {
      type: "Punctuator",
      value: ".",
      range: [30, 31],
      loc: {
        start: {
          line: 1,
          column: 30,
        },
        end: {
          line: 1,
          column: 31,
        },
      },
    },
    {
      type: "Identifier",
      value: "toFixed",
      range: [31, 38],
      loc: {
        start: {
          line: 1,
          column: 31,
        },
        end: {
          line: 1,
          column: 38,
        },
      },
    },
    {
      type: "Punctuator",
      value: "(",
      range: [38, 39],
      loc: {
        start: {
          line: 1,
          column: 38,
        },
        end: {
          line: 1,
          column: 39,
        },
      },
    },
    {
      type: "Punctuator",
      value: ")",
      range: [39, 40],
      loc: {
        start: {
          line: 1,
          column: 39,
        },
        end: {
          line: 1,
          column: 40,
        },
      },
    },
    {
      type: "Punctuator",
      value: ";",
      range: [40, 41],
      loc: {
        start: {
          line: 1,
          column: 40,
        },
        end: {
          line: 1,
          column: 41,
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
      column: 41,
    },
  },
});
