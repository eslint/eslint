"use strict";

/**
 * Parser: typescript-eslint-parser-3.0.0
 * Source code:
 *  const p = {
      get name() {
        // no returns
      }
    };
 */

exports.parse = () => ({
  type: "Program",
  range: [0, 51],
  loc: {
    start: {
      line: 1,
      column: 0
    },
    end: {
      line: 5,
      column: 2
    }
  },
  body: [
    {
      type: "VariableDeclaration",
      range: [0, 51],
      loc: {
        start: {
          line: 1,
          column: 0
        },
        end: {
          line: 5,
          column: 2
        }
      },
      declarations: [
        {
          type: "VariableDeclarator",
          range: [6, 50],
          loc: {
            start: {
              line: 1,
              column: 6
            },
            end: {
              line: 5,
              column: 1
            }
          },
          id: {
            type: "Identifier",
            range: [6, 7],
            loc: {
              start: {
                line: 1,
                column: 6
              },
              end: {
                line: 1,
                column: 7
              }
            },
            name: "p"
          },
          init: {
            type: "ObjectExpression",
            range: [10, 50],
            loc: {
              start: {
                line: 1,
                column: 10
              },
              end: {
                line: 5,
                column: 1
              }
            },
            properties: [
              {
                type: "Property",
                range: [14, 48],
                loc: {
                  start: {
                    line: 2,
                    column: 2
                  },
                  end: {
                    line: 4,
                    column: 3
                  }
                },
                key: {
                  type: "Identifier",
                  range: [18, 22],
                  loc: {
                    start: {
                      line: 2,
                      column: 6
                    },
                    end: {
                      line: 2,
                      column: 10
                    }
                  },
                  name: "name"
                },
                value: {
                  type: "FunctionExpression",
                  id: null,
                  generator: false,
                  expression: false,
                  async: false,
                  body: {
                    type: "BlockStatement",
                    range: [25, 48],
                    loc: {
                      start: {
                        line: 2,
                        column: 13
                      },
                      end: {
                        line: 4,
                        column: 3
                      }
                    },
                    body: []
                  },
                  range: [22, 48],
                  loc: {
                    start: {
                      line: 2,
                      column: 10
                    },
                    end: {
                      line: 4,
                      column: 3
                    }
                  },
                  params: []
                },
                computed: false,
                method: false,
                shorthand: false,
                kind: "get"
              }
            ]
          }
        }
      ],
      kind: "const"
    }
  ],
  sourceType: "script"
});
