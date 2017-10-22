"use strict";

/**
 * Parser: typescript-eslint-parser-3.0.0
 * Source code:
 *  function foo() {
      "use strict";

      console.log('foo');
    }
 */

exports.parse = () => ({
  type: "Program",
  range: [0, 57],
  loc: {
    start: {
      line: 1,
      column: 0
    },
    end: {
      line: 5,
      column: 1
    }
  },
  body: [
    {
      type: "FunctionDeclaration",
      range: [0, 57],
      loc: {
        start: {
          line: 1,
          column: 0
        },
        end: {
          line: 5,
          column: 1
        }
      },
      id: {
        type: "Identifier",
        range: [9, 12],
        loc: {
          start: {
            line: 1,
            column: 9
          },
          end: {
            line: 1,
            column: 12
          }
        },
        name: "foo"
      },
      generator: false,
      expression: false,
      async: false,
      params: [],
      body: {
        type: "BlockStatement",
        range: [15, 57],
        loc: {
          start: {
            line: 1,
            column: 15
          },
          end: {
            line: 5,
            column: 1
          }
        },
        body: [
          {
            type: "ExpressionStatement",
            range: [19, 32],
            loc: {
              start: {
                line: 2,
                column: 2
              },
              end: {
                line: 2,
                column: 15
              }
            },
            expression: {
              type: "Literal",
              range: [19, 31],
              loc: {
                start: {
                  line: 2,
                  column: 2
                },
                end: {
                  line: 2,
                  column: 14
                }
              },
              value: "use strict",
              raw: '"use strict"'
            }
          },
          {
            type: "ExpressionStatement",
            range: [36, 55],
            loc: {
              start: {
                line: 4,
                column: 2
              },
              end: {
                line: 4,
                column: 21
              }
            },
            expression: {
              type: "CallExpression",
              range: [36, 54],
              loc: {
                start: {
                  line: 4,
                  column: 2
                },
                end: {
                  line: 4,
                  column: 20
                }
              },
              callee: {
                type: "MemberExpression",
                range: [36, 47],
                loc: {
                  start: {
                    line: 4,
                    column: 2
                  },
                  end: {
                    line: 4,
                    column: 13
                  }
                },
                object: {
                  type: "Identifier",
                  range: [36, 43],
                  loc: {
                    start: {
                      line: 4,
                      column: 2
                    },
                    end: {
                      line: 4,
                      column: 9
                    }
                  },
                  name: "console"
                },
                property: {
                  type: "Identifier",
                  range: [44, 47],
                  loc: {
                    start: {
                      line: 4,
                      column: 10
                    },
                    end: {
                      line: 4,
                      column: 13
                    }
                  },
                  name: "log"
                },
                computed: false
              },
              arguments: [
                {
                  type: "Literal",
                  range: [48, 53],
                  loc: {
                    start: {
                      line: 4,
                      column: 14
                    },
                    end: {
                      line: 4,
                      column: 19
                    }
                  },
                  value: "foo",
                  raw: "'foo'"
                }
              ]
            }
          }
        ]
      }
    }
  ],
  sourceType: "script"
});
