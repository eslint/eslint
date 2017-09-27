"use strict";

/**
 * Parser: typescript-eslint-parser-3.0.0
 * Source code:
 * [0,1,2].map((num: number) => {
    console.log(num);
  });
 */

exports.parse = () => ({
  type: "Program",
  range: [0, 54],
  loc: {
    start: {
      line: 1,
      column: 0
    },
    end: {
      line: 3,
      column: 3
    }
  },
  body: [
    {
      type: "ExpressionStatement",
      range: [0, 54],
      loc: {
        start: {
          line: 1,
          column: 0
        },
        end: {
          line: 3,
          column: 3
        }
      },
      expression: {
        type: "CallExpression",
        range: [0, 53],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 3,
            column: 2
          }
        },
        callee: {
          type: "MemberExpression",
          range: [0, 11],
          loc: {
            start: {
              line: 1,
              column: 0
            },
            end: {
              line: 1,
              column: 11
            }
          },
          object: {
            type: "ArrayExpression",
            range: [0, 7],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 7
              }
            },
            elements: [
              {
                type: "Literal",
                range: [1, 2],
                loc: {
                  start: {
                    line: 1,
                    column: 1
                  },
                  end: {
                    line: 1,
                    column: 2
                  }
                },
                value: 0,
                raw: "0"
              },
              {
                type: "Literal",
                range: [3, 4],
                loc: {
                  start: {
                    line: 1,
                    column: 3
                  },
                  end: {
                    line: 1,
                    column: 4
                  }
                },
                value: 1,
                raw: "1"
              },
              {
                type: "Literal",
                range: [5, 6],
                loc: {
                  start: {
                    line: 1,
                    column: 5
                  },
                  end: {
                    line: 1,
                    column: 6
                  }
                },
                value: 2,
                raw: "2"
              }
            ]
          },
          property: {
            type: "Identifier",
            range: [8, 11],
            loc: {
              start: {
                line: 1,
                column: 8
              },
              end: {
                line: 1,
                column: 11
              }
            },
            name: "map"
          },
          computed: false
        },
        arguments: [
          {
            type: "ArrowFunctionExpression",
            range: [12, 52],
            loc: {
              start: {
                line: 1,
                column: 12
              },
              end: {
                line: 3,
                column: 1
              }
            },
            generator: false,
            id: null,
            params: [
              {
                type: "Identifier",
                range: [13, 16],
                loc: {
                  start: {
                    line: 1,
                    column: 13
                  },
                  end: {
                    line: 1,
                    column: 16
                  }
                },
                name: "num",
                typeAnnotation: {
                  type: "TypeAnnotation",
                  loc: {
                    start: {
                      line: 1,
                      column: 18
                    },
                    end: {
                      line: 1,
                      column: 24
                    }
                  },
                  range: [18, 24],
                  typeAnnotation: {
                    type: "TSNumberKeyword",
                    range: [18, 24],
                    loc: {
                      start: {
                        line: 1,
                        column: 18
                      },
                      end: {
                        line: 1,
                        column: 24
                      }
                    }
                  }
                }
              }
            ],
            body: {
              type: "BlockStatement",
              range: [29, 52],
              loc: {
                start: {
                  line: 1,
                  column: 29
                },
                end: {
                  line: 3,
                  column: 1
                }
              },
              body: [
                {
                  type: "ExpressionStatement",
                  range: [33, 50],
                  loc: {
                    start: {
                      line: 2,
                      column: 2
                    },
                    end: {
                      line: 2,
                      column: 19
                    }
                  },
                  expression: {
                    type: "CallExpression",
                    range: [33, 49],
                    loc: {
                      start: {
                        line: 2,
                        column: 2
                      },
                      end: {
                        line: 2,
                        column: 18
                      }
                    },
                    callee: {
                      type: "MemberExpression",
                      range: [33, 44],
                      loc: {
                        start: {
                          line: 2,
                          column: 2
                        },
                        end: {
                          line: 2,
                          column: 13
                        }
                      },
                      object: {
                        type: "Identifier",
                        range: [33, 40],
                        loc: {
                          start: {
                            line: 2,
                            column: 2
                          },
                          end: {
                            line: 2,
                            column: 9
                          }
                        },
                        name: "console"
                      },
                      property: {
                        type: "Identifier",
                        range: [41, 44],
                        loc: {
                          start: {
                            line: 2,
                            column: 10
                          },
                          end: {
                            line: 2,
                            column: 13
                          }
                        },
                        name: "log"
                      },
                      computed: false
                    },
                    arguments: [
                      {
                        type: "Identifier",
                        range: [45, 48],
                        loc: {
                          start: {
                            line: 2,
                            column: 14
                          },
                          end: {
                            line: 2,
                            column: 17
                          }
                        },
                        name: "num"
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            expression: false
          }
        ]
      }
    }
  ],
  sourceType: "script"
});
