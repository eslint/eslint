"use strict";

/**
 * Parser: @typescript-eslint/parser@2.24.0
 * Source code:
 * const obj = Object.assign<{}, Record<string, string[]>>({}, getObject());
 */

exports.parse = () => ({
  type: "Program",
  body: [
    {
      type: "VariableDeclaration",
      declarations: [
        {
          type: "VariableDeclarator",
          id: {
            type: "Identifier",
            name: "obj",
            range: [6, 9],
            loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 9 } }
          },
          init: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              object: {
                type: "Identifier",
                name: "Object",
                range: [12, 18],
                loc: {
                  start: { line: 1, column: 12 },
                  end: { line: 1, column: 18 }
                }
              },
              property: {
                type: "Identifier",
                name: "assign",
                range: [19, 25],
                loc: {
                  start: { line: 1, column: 19 },
                  end: { line: 1, column: 25 }
                }
              },
              computed: false,
              optional: false,
              range: [12, 25],
              loc: {
                start: { line: 1, column: 12 },
                end: { line: 1, column: 25 }
              }
            },
            arguments: [
              {
                type: "ObjectExpression",
                properties: [],
                range: [56, 58],
                loc: {
                  start: { line: 1, column: 56 },
                  end: { line: 1, column: 58 }
                }
              },
              {
                type: "CallExpression",
                callee: {
                  type: "Identifier",
                  name: "getObject",
                  range: [60, 69],
                  loc: {
                    start: { line: 1, column: 60 },
                    end: { line: 1, column: 69 }
                  }
                },
                arguments: [],
                optional: false,
                range: [60, 71],
                loc: {
                  start: { line: 1, column: 60 },
                  end: { line: 1, column: 71 }
                }
              }
            ],
            optional: false,
            range: [12, 72],
            loc: {
              start: { line: 1, column: 12 },
              end: { line: 1, column: 72 }
            },
            typeParameters: {
              type: "TSTypeParameterInstantiation",
              range: [25, 55],
              params: [
                {
                  type: "TSTypeLiteral",
                  members: [],
                  range: [26, 28],
                  loc: {
                    start: { line: 1, column: 26 },
                    end: { line: 1, column: 28 }
                  }
                },
                {
                  type: "TSTypeReference",
                  typeName: {
                    type: "Identifier",
                    name: "Record",
                    range: [30, 36],
                    loc: {
                      start: { line: 1, column: 30 },
                      end: { line: 1, column: 36 }
                    }
                  },
                  typeParameters: {
                    type: "TSTypeParameterInstantiation",
                    range: [36, 54],
                    params: [
                      {
                        type: "TSStringKeyword",
                        range: [37, 43],
                        loc: {
                          start: { line: 1, column: 37 },
                          end: { line: 1, column: 43 }
                        }
                      },
                      {
                        type: "TSArrayType",
                        elementType: {
                          type: "TSStringKeyword",
                          range: [45, 51],
                          loc: {
                            start: { line: 1, column: 45 },
                            end: { line: 1, column: 51 }
                          }
                        },
                        range: [45, 53],
                        loc: {
                          start: { line: 1, column: 45 },
                          end: { line: 1, column: 53 }
                        }
                      }
                    ],
                    loc: {
                      start: { line: 1, column: 36 },
                      end: { line: 1, column: 54 }
                    }
                  },
                  range: [30, 54],
                  loc: {
                    start: { line: 1, column: 30 },
                    end: { line: 1, column: 54 }
                  }
                }
              ],
              loc: {
                start: { line: 1, column: 25 },
                end: { line: 1, column: 55 }
              }
            }
          },
          range: [6, 72],
          loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 72 } }
        }
      ],
      kind: "const",
      range: [0, 73],
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 73 } }
    }
  ],
  sourceType: "script",
  range: [0, 73],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 73 } },
  tokens: [
    {
      type: "Keyword",
      value: "const",
      range: [0, 5],
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 5 } }
    },
    {
      type: "Identifier",
      value: "obj",
      range: [6, 9],
      loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 9 } }
    },
    {
      type: "Punctuator",
      value: "=",
      range: [10, 11],
      loc: { start: { line: 1, column: 10 }, end: { line: 1, column: 11 } }
    },
    {
      type: "Identifier",
      value: "Object",
      range: [12, 18],
      loc: { start: { line: 1, column: 12 }, end: { line: 1, column: 18 } }
    },
    {
      type: "Punctuator",
      value: ".",
      range: [18, 19],
      loc: { start: { line: 1, column: 18 }, end: { line: 1, column: 19 } }
    },
    {
      type: "Identifier",
      value: "assign",
      range: [19, 25],
      loc: { start: { line: 1, column: 19 }, end: { line: 1, column: 25 } }
    },
    {
      type: "Punctuator",
      value: "<",
      range: [25, 26],
      loc: { start: { line: 1, column: 25 }, end: { line: 1, column: 26 } }
    },
    {
      type: "Punctuator",
      value: "{",
      range: [26, 27],
      loc: { start: { line: 1, column: 26 }, end: { line: 1, column: 27 } }
    },
    {
      type: "Punctuator",
      value: "}",
      range: [27, 28],
      loc: { start: { line: 1, column: 27 }, end: { line: 1, column: 28 } }
    },
    {
      type: "Punctuator",
      value: ",",
      range: [28, 29],
      loc: { start: { line: 1, column: 28 }, end: { line: 1, column: 29 } }
    },
    {
      type: "Identifier",
      value: "Record",
      range: [30, 36],
      loc: { start: { line: 1, column: 30 }, end: { line: 1, column: 36 } }
    },
    {
      type: "Punctuator",
      value: "<",
      range: [36, 37],
      loc: { start: { line: 1, column: 36 }, end: { line: 1, column: 37 } }
    },
    {
      type: "Identifier",
      value: "string",
      range: [37, 43],
      loc: { start: { line: 1, column: 37 }, end: { line: 1, column: 43 } }
    },
    {
      type: "Punctuator",
      value: ",",
      range: [43, 44],
      loc: { start: { line: 1, column: 43 }, end: { line: 1, column: 44 } }
    },
    {
      type: "Identifier",
      value: "string",
      range: [45, 51],
      loc: { start: { line: 1, column: 45 }, end: { line: 1, column: 51 } }
    },
    {
      type: "Punctuator",
      value: "[",
      range: [51, 52],
      loc: { start: { line: 1, column: 51 }, end: { line: 1, column: 52 } }
    },
    {
      type: "Punctuator",
      value: "]",
      range: [52, 53],
      loc: { start: { line: 1, column: 52 }, end: { line: 1, column: 53 } }
    },
    {
      type: "Punctuator",
      value: ">",
      range: [53, 54],
      loc: { start: { line: 1, column: 53 }, end: { line: 1, column: 54 } }
    },
    {
      type: "Punctuator",
      value: ">",
      range: [54, 55],
      loc: { start: { line: 1, column: 54 }, end: { line: 1, column: 55 } }
    },
    {
      type: "Punctuator",
      value: "(",
      range: [55, 56],
      loc: { start: { line: 1, column: 55 }, end: { line: 1, column: 56 } }
    },
    {
      type: "Punctuator",
      value: "{",
      range: [56, 57],
      loc: { start: { line: 1, column: 56 }, end: { line: 1, column: 57 } }
    },
    {
      type: "Punctuator",
      value: "}",
      range: [57, 58],
      loc: { start: { line: 1, column: 57 }, end: { line: 1, column: 58 } }
    },
    {
      type: "Punctuator",
      value: ",",
      range: [58, 59],
      loc: { start: { line: 1, column: 58 }, end: { line: 1, column: 59 } }
    },
    {
      type: "Identifier",
      value: "getObject",
      range: [60, 69],
      loc: { start: { line: 1, column: 60 }, end: { line: 1, column: 69 } }
    },
    {
      type: "Punctuator",
      value: "(",
      range: [69, 70],
      loc: { start: { line: 1, column: 69 }, end: { line: 1, column: 70 } }
    },
    {
      type: "Punctuator",
      value: ")",
      range: [70, 71],
      loc: { start: { line: 1, column: 70 }, end: { line: 1, column: 71 } }
    },
    {
      type: "Punctuator",
      value: ")",
      range: [71, 72],
      loc: { start: { line: 1, column: 71 }, end: { line: 1, column: 72 } }
    },
    {
      type: "Punctuator",
      value: ";",
      range: [72, 73],
      loc: { start: { line: 1, column: 72 }, end: { line: 1, column: 73 } }
    }
  ],
  comments: []
});
