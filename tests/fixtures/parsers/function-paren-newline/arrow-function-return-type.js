"use strict";

/**
 * Parser: @typescript-eslint/parser@5.10.1
 * Source code:
 * const method6 = (
 *   abc: number,
 *   def: () => void,
 * ): [
 *  string,
 *  () => void
 * ] => [`a${abc}`, def];
 * method6(3, () => {});
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
                      name: "method6",
                      range: [6, 13],
                      loc: {
                          start: { line: 1, column: 6 },
                          end: { line: 1, column: 13 },
                      },
                  },
                  init: {
                      type: "ArrowFunctionExpression",
                      generator: false,
                      id: null,
                      params: [
                          {
                              type: "Identifier",
                              name: "abc",
                              range: [20, 31],
                              loc: {
                                  start: { line: 2, column: 2 },
                                  end: { line: 2, column: 13 },
                              },
                              typeAnnotation: {
                                  type: "TSTypeAnnotation",
                                  loc: {
                                      start: { line: 2, column: 5 },
                                      end: { line: 2, column: 13 },
                                  },
                                  range: [23, 31],
                                  typeAnnotation: {
                                      type: "TSNumberKeyword",
                                      range: [25, 31],
                                      loc: {
                                          start: { line: 2, column: 7 },
                                          end: { line: 2, column: 13 },
                                      },
                                  },
                              },
                          },
                          {
                              type: "Identifier",
                              name: "def",
                              range: [35, 50],
                              loc: {
                                  start: { line: 3, column: 2 },
                                  end: { line: 3, column: 17 },
                              },
                              typeAnnotation: {
                                  type: "TSTypeAnnotation",
                                  loc: {
                                      start: { line: 3, column: 5 },
                                      end: { line: 3, column: 17 },
                                  },
                                  range: [38, 50],
                                  typeAnnotation: {
                                      type: "TSFunctionType",
                                      params: [],
                                      range: [40, 50],
                                      loc: {
                                          start: { line: 3, column: 7 },
                                          end: { line: 3, column: 17 },
                                      },
                                      returnType: {
                                          type: "TSTypeAnnotation",
                                          loc: {
                                              start: { line: 3, column: 10 },
                                              end: { line: 3, column: 17 },
                                          },
                                          range: [43, 50],
                                          typeAnnotation: {
                                              type: "TSVoidKeyword",
                                              range: [46, 50],
                                              loc: {
                                                  start: {
                                                      line: 3,
                                                      column: 13,
                                                  },
                                                  end: {
                                                      line: 3,
                                                      column: 17,
                                                  },
                                              },
                                          },
                                      },
                                  },
                              },
                          },
                      ],
                      body: {
                          type: "ArrayExpression",
                          elements: [
                              {
                                  type: "TemplateLiteral",
                                  quasis: [
                                      {
                                          type: "TemplateElement",
                                          value: { raw: "a", cooked: "a" },
                                          tail: false,
                                          range: [86, 90],
                                          loc: {
                                              start: { line: 7, column: 6 },
                                              end: { line: 7, column: 10 },
                                          },
                                      },
                                      {
                                          type: "TemplateElement",
                                          value: { raw: "", cooked: "" },
                                          tail: true,
                                          range: [93, 95],
                                          loc: {
                                              start: { line: 7, column: 13 },
                                              end: { line: 7, column: 15 },
                                          },
                                      },
                                  ],
                                  expressions: [
                                      {
                                          type: "Identifier",
                                          name: "abc",
                                          range: [90, 93],
                                          loc: {
                                              start: { line: 7, column: 10 },
                                              end: { line: 7, column: 13 },
                                          },
                                      },
                                  ],
                                  range: [86, 95],
                                  loc: {
                                      start: { line: 7, column: 6 },
                                      end: { line: 7, column: 15 },
                                  },
                              },
                              {
                                  type: "Identifier",
                                  name: "def",
                                  range: [97, 100],
                                  loc: {
                                      start: { line: 7, column: 17 },
                                      end: { line: 7, column: 20 },
                                  },
                              },
                          ],
                          range: [85, 101],
                          loc: {
                              start: { line: 7, column: 5 },
                              end: { line: 7, column: 21 },
                          },
                      },
                      async: false,
                      expression: true,
                      range: [16, 101],
                      loc: {
                          start: { line: 1, column: 16 },
                          end: { line: 7, column: 21 },
                      },
                      returnType: {
                          type: "TSTypeAnnotation",
                          loc: {
                              start: { line: 4, column: 1 },
                              end: { line: 7, column: 1 },
                          },
                          range: [53, 81],
                          typeAnnotation: {
                              type: "TSTupleType",
                              elementTypes: [
                                  {
                                      type: "TSStringKeyword",
                                      range: [59, 65],
                                      loc: {
                                          start: { line: 5, column: 2 },
                                          end: { line: 5, column: 8 },
                                      },
                                  },
                                  {
                                      type: "TSFunctionType",
                                      params: [],
                                      range: [69, 79],
                                      loc: {
                                          start: { line: 6, column: 2 },
                                          end: { line: 6, column: 12 },
                                      },
                                      returnType: {
                                          type: "TSTypeAnnotation",
                                          loc: {
                                              start: { line: 6, column: 5 },
                                              end: { line: 6, column: 12 },
                                          },
                                          range: [72, 79],
                                          typeAnnotation: {
                                              type: "TSVoidKeyword",
                                              range: [75, 79],
                                              loc: {
                                                  start: {
                                                      line: 6,
                                                      column: 8,
                                                  },
                                                  end: {
                                                      line: 6,
                                                      column: 12,
                                                  },
                                              },
                                          },
                                      },
                                  },
                              ],
                              range: [55, 81],
                              loc: {
                                  start: { line: 4, column: 3 },
                                  end: { line: 7, column: 1 },
                              },
                          },
                      },
                  },
                  range: [6, 101],
                  loc: {
                      start: { line: 1, column: 6 },
                      end: { line: 7, column: 21 },
                  },
              },
          ],
          kind: "const",
          range: [0, 102],
          loc: {
              start: { line: 1, column: 0 },
              end: { line: 7, column: 22 },
          },
      },
      {
          type: "ExpressionStatement",
          expression: {
              type: "CallExpression",
              callee: {
                  type: "Identifier",
                  name: "method6",
                  range: [103, 110],
                  loc: {
                      start: { line: 8, column: 0 },
                      end: { line: 8, column: 7 },
                  },
              },
              arguments: [
                  {
                      type: "Literal",
                      value: 3,
                      raw: "3",
                      range: [111, 112],
                      loc: {
                          start: { line: 8, column: 8 },
                          end: { line: 8, column: 9 },
                      },
                  },
                  {
                      type: "ArrowFunctionExpression",
                      generator: false,
                      id: null,
                      params: [],
                      body: {
                          type: "BlockStatement",
                          body: [],
                          range: [120, 122],
                          loc: {
                              start: { line: 8, column: 17 },
                              end: { line: 8, column: 19 },
                          },
                      },
                      async: false,
                      expression: false,
                      range: [114, 122],
                      loc: {
                          start: { line: 8, column: 11 },
                          end: { line: 8, column: 19 },
                      },
                  },
              ],
              optional: false,
              range: [103, 123],
              loc: {
                  start: { line: 8, column: 0 },
                  end: { line: 8, column: 20 },
              },
          },
          range: [103, 124],
          loc: {
              start: { line: 8, column: 0 },
              end: { line: 8, column: 21 },
          },
      },
  ],
  sourceType: "script",
  range: [0, 125],
  loc: { start: { line: 1, column: 0 }, end: { line: 9, column: 0 } },
  tokens: [
      {
          type: "Keyword",
          value: "const",
          range: [0, 5],
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 5 } },
      },
      {
          type: "Identifier",
          value: "method6",
          range: [6, 13],
          loc: {
              start: { line: 1, column: 6 },
              end: { line: 1, column: 13 },
          },
      },
      {
          type: "Punctuator",
          value: "=",
          range: [14, 15],
          loc: {
              start: { line: 1, column: 14 },
              end: { line: 1, column: 15 },
          },
      },
      {
          type: "Punctuator",
          value: "(",
          range: [16, 17],
          loc: {
              start: { line: 1, column: 16 },
              end: { line: 1, column: 17 },
          },
      },
      {
          type: "Identifier",
          value: "abc",
          range: [20, 23],
          loc: { start: { line: 2, column: 2 }, end: { line: 2, column: 5 } },
      },
      {
          type: "Punctuator",
          value: ":",
          range: [23, 24],
          loc: { start: { line: 2, column: 5 }, end: { line: 2, column: 6 } },
      },
      {
          type: "Identifier",
          value: "number",
          range: [25, 31],
          loc: {
              start: { line: 2, column: 7 },
              end: { line: 2, column: 13 },
          },
      },
      {
          type: "Punctuator",
          value: ",",
          range: [31, 32],
          loc: {
              start: { line: 2, column: 13 },
              end: { line: 2, column: 14 },
          },
      },
      {
          type: "Identifier",
          value: "def",
          range: [35, 38],
          loc: { start: { line: 3, column: 2 }, end: { line: 3, column: 5 } },
      },
      {
          type: "Punctuator",
          value: ":",
          range: [38, 39],
          loc: { start: { line: 3, column: 5 }, end: { line: 3, column: 6 } },
      },
      {
          type: "Punctuator",
          value: "(",
          range: [40, 41],
          loc: { start: { line: 3, column: 7 }, end: { line: 3, column: 8 } },
      },
      {
          type: "Punctuator",
          value: ")",
          range: [41, 42],
          loc: { start: { line: 3, column: 8 }, end: { line: 3, column: 9 } },
      },
      {
          type: "Punctuator",
          value: "=>",
          range: [43, 45],
          loc: {
              start: { line: 3, column: 10 },
              end: { line: 3, column: 12 },
          },
      },
      {
          type: "Keyword",
          value: "void",
          range: [46, 50],
          loc: {
              start: { line: 3, column: 13 },
              end: { line: 3, column: 17 },
          },
      },
      {
          type: "Punctuator",
          value: ",",
          range: [50, 51],
          loc: {
              start: { line: 3, column: 17 },
              end: { line: 3, column: 18 },
          },
      },
      {
          type: "Punctuator",
          value: ")",
          range: [52, 53],
          loc: { start: { line: 4, column: 0 }, end: { line: 4, column: 1 } },
      },
      {
          type: "Punctuator",
          value: ":",
          range: [53, 54],
          loc: { start: { line: 4, column: 1 }, end: { line: 4, column: 2 } },
      },
      {
          type: "Punctuator",
          value: "[",
          range: [55, 56],
          loc: { start: { line: 4, column: 3 }, end: { line: 4, column: 4 } },
      },
      {
          type: "Identifier",
          value: "string",
          range: [59, 65],
          loc: { start: { line: 5, column: 2 }, end: { line: 5, column: 8 } },
      },
      {
          type: "Punctuator",
          value: ",",
          range: [65, 66],
          loc: { start: { line: 5, column: 8 }, end: { line: 5, column: 9 } },
      },
      {
          type: "Punctuator",
          value: "(",
          range: [69, 70],
          loc: { start: { line: 6, column: 2 }, end: { line: 6, column: 3 } },
      },
      {
          type: "Punctuator",
          value: ")",
          range: [70, 71],
          loc: { start: { line: 6, column: 3 }, end: { line: 6, column: 4 } },
      },
      {
          type: "Punctuator",
          value: "=>",
          range: [72, 74],
          loc: { start: { line: 6, column: 5 }, end: { line: 6, column: 7 } },
      },
      {
          type: "Keyword",
          value: "void",
          range: [75, 79],
          loc: {
              start: { line: 6, column: 8 },
              end: { line: 6, column: 12 },
          },
      },
      {
          type: "Punctuator",
          value: "]",
          range: [80, 81],
          loc: { start: { line: 7, column: 0 }, end: { line: 7, column: 1 } },
      },
      {
          type: "Punctuator",
          value: "=>",
          range: [82, 84],
          loc: { start: { line: 7, column: 2 }, end: { line: 7, column: 4 } },
      },
      {
          type: "Punctuator",
          value: "[",
          range: [85, 86],
          loc: { start: { line: 7, column: 5 }, end: { line: 7, column: 6 } },
      },
      {
          type: "Template",
          value: "`a${",
          range: [86, 90],
          loc: {
              start: { line: 7, column: 6 },
              end: { line: 7, column: 10 },
          },
      },
      {
          type: "Identifier",
          value: "abc",
          range: [90, 93],
          loc: {
              start: { line: 7, column: 10 },
              end: { line: 7, column: 13 },
          },
      },
      {
          type: "Template",
          value: "}`",
          range: [93, 95],
          loc: {
              start: { line: 7, column: 13 },
              end: { line: 7, column: 15 },
          },
      },
      {
          type: "Punctuator",
          value: ",",
          range: [95, 96],
          loc: {
              start: { line: 7, column: 15 },
              end: { line: 7, column: 16 },
          },
      },
      {
          type: "Identifier",
          value: "def",
          range: [97, 100],
          loc: {
              start: { line: 7, column: 17 },
              end: { line: 7, column: 20 },
          },
      },
      {
          type: "Punctuator",
          value: "]",
          range: [100, 101],
          loc: {
              start: { line: 7, column: 20 },
              end: { line: 7, column: 21 },
          },
      },
      {
          type: "Punctuator",
          value: ";",
          range: [101, 102],
          loc: {
              start: { line: 7, column: 21 },
              end: { line: 7, column: 22 },
          },
      },
      {
          type: "Identifier",
          value: "method6",
          range: [103, 110],
          loc: { start: { line: 8, column: 0 }, end: { line: 8, column: 7 } },
      },
      {
          type: "Punctuator",
          value: "(",
          range: [110, 111],
          loc: { start: { line: 8, column: 7 }, end: { line: 8, column: 8 } },
      },
      {
          type: "Numeric",
          value: "3",
          range: [111, 112],
          loc: { start: { line: 8, column: 8 }, end: { line: 8, column: 9 } },
      },
      {
          type: "Punctuator",
          value: ",",
          range: [112, 113],
          loc: {
              start: { line: 8, column: 9 },
              end: { line: 8, column: 10 },
          },
      },
      {
          type: "Punctuator",
          value: "(",
          range: [114, 115],
          loc: {
              start: { line: 8, column: 11 },
              end: { line: 8, column: 12 },
          },
      },
      {
          type: "Punctuator",
          value: ")",
          range: [115, 116],
          loc: {
              start: { line: 8, column: 12 },
              end: { line: 8, column: 13 },
          },
      },
      {
          type: "Punctuator",
          value: "=>",
          range: [117, 119],
          loc: {
              start: { line: 8, column: 14 },
              end: { line: 8, column: 16 },
          },
      },
      {
          type: "Punctuator",
          value: "{",
          range: [120, 121],
          loc: {
              start: { line: 8, column: 17 },
              end: { line: 8, column: 18 },
          },
      },
      {
          type: "Punctuator",
          value: "}",
          range: [121, 122],
          loc: {
              start: { line: 8, column: 18 },
              end: { line: 8, column: 19 },
          },
      },
      {
          type: "Punctuator",
          value: ")",
          range: [122, 123],
          loc: {
              start: { line: 8, column: 19 },
              end: { line: 8, column: 20 },
          },
      },
      {
          type: "Punctuator",
          value: ";",
          range: [123, 124],
          loc: {
              start: { line: 8, column: 20 },
              end: { line: 8, column: 21 },
          },
      },
  ],
  comments: [],
});
