"use strict";

/**
 * Parser: @typescript-eslint/parser 5.59.11 (TS 5.1.3)
 * Source code:
 * a.b.c || (a.b.c = (d as number))
 */

exports.parse = () => ({
  type: "Program",
  body: [
    {
      type: "ExpressionStatement",
      expression: {
        type: "LogicalExpression",
        operator: "||",
        left: {
          type: "MemberExpression",
          object: {
            type: "MemberExpression",
            object: {
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
            property: {
              type: "Identifier",
              decorators: [],
              name: "b",
              optional: false,
              range: [2, 3],
              loc: {
                start: {
                  line: 1,
                  column: 2,
                },
                end: {
                  line: 1,
                  column: 3,
                },
              },
            },
            computed: false,
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
          property: {
            type: "Identifier",
            decorators: [],
            name: "c",
            optional: false,
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
          computed: false,
          optional: false,
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
        right: {
          type: "AssignmentExpression",
          operator: "=",
          left: {
            type: "MemberExpression",
            object: {
              type: "MemberExpression",
              object: {
                type: "Identifier",
                decorators: [],
                name: "a",
                optional: false,
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
              property: {
                type: "Identifier",
                decorators: [],
                name: "b",
                optional: false,
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
              computed: false,
              optional: false,
              range: [10, 13],
              loc: {
                start: {
                  line: 1,
                  column: 10,
                },
                end: {
                  line: 1,
                  column: 13,
                },
              },
            },
            property: {
              type: "Identifier",
              decorators: [],
              name: "c",
              optional: false,
              range: [14, 15],
              loc: {
                start: {
                  line: 1,
                  column: 14,
                },
                end: {
                  line: 1,
                  column: 15,
                },
              },
            },
            computed: false,
            optional: false,
            range: [10, 15],
            loc: {
              start: {
                line: 1,
                column: 10,
              },
              end: {
                line: 1,
                column: 15,
              },
            },
          },
          right: {
            type: "TSAsExpression",
            expression: {
              type: "Identifier",
              decorators: [],
              name: "d",
              optional: false,
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
            typeAnnotation: {
              type: "TSNumberKeyword",
              range: [24, 30],
              loc: {
                start: {
                  line: 1,
                  column: 24,
                },
                end: {
                  line: 1,
                  column: 30,
                },
              },
            },
            range: [19, 30],
            loc: {
              start: {
                line: 1,
                column: 19,
              },
              end: {
                line: 1,
                column: 30,
              },
            },
          },
          range: [10, 31],
          loc: {
            start: {
              line: 1,
              column: 10,
            },
            end: {
              line: 1,
              column: 31,
            },
          },
        },
        range: [0, 32],
        loc: {
          start: {
            line: 1,
            column: 0,
          },
          end: {
            line: 1,
            column: 32,
          },
        },
      },
      range: [0, 32],
      loc: {
        start: {
          line: 1,
          column: 0,
        },
        end: {
          line: 1,
          column: 32,
        },
      },
    },
  ],
  comments: [],
  range: [0, 32],
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
      value: ".",
      range: [1, 2],
      loc: {
        start: {
          line: 1,
          column: 1,
        },
        end: {
          line: 1,
          column: 2,
        },
      },
    },
    {
      type: "Identifier",
      value: "b",
      range: [2, 3],
      loc: {
        start: {
          line: 1,
          column: 2,
        },
        end: {
          line: 1,
          column: 3,
        },
      },
    },
    {
      type: "Punctuator",
      value: ".",
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
      type: "Identifier",
      value: "c",
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
      type: "Punctuator",
      value: "||",
      range: [6, 8],
      loc: {
        start: {
          line: 1,
          column: 6,
        },
        end: {
          line: 1,
          column: 8,
        },
      },
    },
    {
      type: "Punctuator",
      value: "(",
      range: [9, 10],
      loc: {
        start: {
          line: 1,
          column: 9,
        },
        end: {
          line: 1,
          column: 10,
        },
      },
    },
    {
      type: "Identifier",
      value: "a",
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
      type: "Punctuator",
      value: ".",
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
      value: "b",
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
      type: "Punctuator",
      value: ".",
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
      value: "c",
      range: [14, 15],
      loc: {
        start: {
          line: 1,
          column: 14,
        },
        end: {
          line: 1,
          column: 15,
        },
      },
    },
    {
      type: "Punctuator",
      value: "=",
      range: [16, 17],
      loc: {
        start: {
          line: 1,
          column: 16,
        },
        end: {
          line: 1,
          column: 17,
        },
      },
    },
    {
      type: "Punctuator",
      value: "(",
      range: [18, 19],
      loc: {
        start: {
          line: 1,
          column: 18,
        },
        end: {
          line: 1,
          column: 19,
        },
      },
    },
    {
      type: "Identifier",
      value: "d",
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
      type: "Identifier",
      value: "as",
      range: [21, 23],
      loc: {
        start: {
          line: 1,
          column: 21,
        },
        end: {
          line: 1,
          column: 23,
        },
      },
    },
    {
      type: "Identifier",
      value: "number",
      range: [24, 30],
      loc: {
        start: {
          line: 1,
          column: 24,
        },
        end: {
          line: 1,
          column: 30,
        },
      },
    },
    {
      type: "Punctuator",
      value: ")",
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
      type: "Punctuator",
      value: ")",
      range: [31, 32],
      loc: {
        start: {
          line: 1,
          column: 31,
        },
        end: {
          line: 1,
          column: 32,
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
      column: 32,
    },
  },
});
