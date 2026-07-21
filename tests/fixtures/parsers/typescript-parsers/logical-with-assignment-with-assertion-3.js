"use strict";

/**
 * Parser: @typescript-eslint/parser 5.59.11 (TS 5.1.3)
 * Source code:
 * (a.b.c || (a.b.c = d)) as number
 */

exports.parse = () => ({
  type: "Program",
  body: [
    {
      type: "ExpressionStatement",
      expression: {
        type: "TSAsExpression",
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
              property: {
                type: "Identifier",
                decorators: [],
                name: "b",
                optional: false,
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
              computed: false,
              optional: false,
              range: [1, 4],
              loc: {
                start: {
                  line: 1,
                  column: 1,
                },
                end: {
                  line: 1,
                  column: 4,
                },
              },
            },
            property: {
              type: "Identifier",
              decorators: [],
              name: "c",
              optional: false,
              range: [5, 6],
              loc: {
                start: {
                  line: 1,
                  column: 5,
                },
                end: {
                  line: 1,
                  column: 6,
                },
              },
            },
            computed: false,
            optional: false,
            range: [1, 6],
            loc: {
              start: {
                line: 1,
                column: 1,
              },
              end: {
                line: 1,
                column: 6,
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
                property: {
                  type: "Identifier",
                  decorators: [],
                  name: "b",
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
                computed: false,
                optional: false,
                range: [11, 14],
                loc: {
                  start: {
                    line: 1,
                    column: 11,
                  },
                  end: {
                    line: 1,
                    column: 14,
                  },
                },
              },
              property: {
                type: "Identifier",
                decorators: [],
                name: "c",
                optional: false,
                range: [15, 16],
                loc: {
                  start: {
                    line: 1,
                    column: 15,
                  },
                  end: {
                    line: 1,
                    column: 16,
                  },
                },
              },
              computed: false,
              optional: false,
              range: [11, 16],
              loc: {
                start: {
                  line: 1,
                  column: 11,
                },
                end: {
                  line: 1,
                  column: 16,
                },
              },
            },
            right: {
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
            range: [11, 20],
            loc: {
              start: {
                line: 1,
                column: 11,
              },
              end: {
                line: 1,
                column: 20,
              },
            },
          },
          range: [1, 21],
          loc: {
            start: {
              line: 1,
              column: 1,
            },
            end: {
              line: 1,
              column: 21,
            },
          },
        },
        typeAnnotation: {
          type: "TSNumberKeyword",
          range: [26, 32],
          loc: {
            start: {
              line: 1,
              column: 26,
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
      type: "Punctuator",
      value: "(",
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
      type: "Identifier",
      value: "a",
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
      type: "Punctuator",
      value: ".",
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
      type: "Identifier",
      value: "b",
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
      value: ".",
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
      value: "c",
      range: [5, 6],
      loc: {
        start: {
          line: 1,
          column: 5,
        },
        end: {
          line: 1,
          column: 6,
        },
      },
    },
    {
      type: "Punctuator",
      value: "||",
      range: [7, 9],
      loc: {
        start: {
          line: 1,
          column: 7,
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
      type: "Identifier",
      value: "a",
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
      type: "Punctuator",
      value: ".",
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
      value: "b",
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
      type: "Punctuator",
      value: ".",
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
      type: "Identifier",
      value: "c",
      range: [15, 16],
      loc: {
        start: {
          line: 1,
          column: 15,
        },
        end: {
          line: 1,
          column: 16,
        },
      },
    },
    {
      type: "Punctuator",
      value: "=",
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
      type: "Punctuator",
      value: ")",
      range: [20, 21],
      loc: {
        start: {
          line: 1,
          column: 20,
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
      type: "Identifier",
      value: "as",
      range: [23, 25],
      loc: {
        start: {
          line: 1,
          column: 23,
        },
        end: {
          line: 1,
          column: 25,
        },
      },
    },
    {
      type: "Identifier",
      value: "number",
      range: [26, 32],
      loc: {
        start: {
          line: 1,
          column: 26,
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
