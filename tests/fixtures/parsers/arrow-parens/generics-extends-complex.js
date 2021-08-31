"use strict";

/**
 * Parser: @typescript-eslint/parser@3.5.0
 * Source code:
 * <T extends (A | B) & C>(a) => b
 */

exports.parse = () => ({
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "ArrowFunctionExpression",
          generator: false,
          id: null,
          params: [
            {
              type: "Identifier",
              name: "a",
              range: [24, 25],
              loc: {
                start: { line: 1, column: 24 },
                end: { line: 1, column: 25 },
              },
            },
          ],
          body: {
            type: "Identifier",
            name: "b",
            range: [30, 31],
            loc: { start: { line: 1, column: 30 }, end: { line: 1, column: 31 } },
          },
          async: false,
          expression: true,
          range: [0, 31],
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 31 } },
          typeParameters: {
            type: "TSTypeParameterDeclaration",
            range: [0, 23],
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 23 } },
            params: [
              {
                type: "TSTypeParameter",
                name: {
                  type: "Identifier",
                  name: "T",
                  range: [1, 2],
                  loc: {
                    start: { line: 1, column: 1 },
                    end: { line: 1, column: 2 },
                  },
                },
                constraint: {
                  type: "TSIntersectionType",
                  types: [
                    {
                      type: "TSParenthesizedType",
                      typeAnnotation: {
                        type: "TSUnionType",
                        types: [
                          {
                            type: "TSTypeReference",
                            typeName: {
                              type: "Identifier",
                              name: "A",
                              range: [12, 13],
                              loc: {
                                start: { line: 1, column: 12 },
                                end: { line: 1, column: 13 },
                              },
                            },
                            range: [12, 13],
                            loc: {
                              start: { line: 1, column: 12 },
                              end: { line: 1, column: 13 },
                            },
                          },
                          {
                            type: "TSTypeReference",
                            typeName: {
                              type: "Identifier",
                              name: "B",
                              range: [16, 17],
                              loc: {
                                start: { line: 1, column: 16 },
                                end: { line: 1, column: 17 },
                              },
                            },
                            range: [16, 17],
                            loc: {
                              start: { line: 1, column: 16 },
                              end: { line: 1, column: 17 },
                            },
                          },
                        ],
                        range: [12, 17],
                        loc: {
                          start: { line: 1, column: 12 },
                          end: { line: 1, column: 17 },
                        },
                      },
                      range: [11, 18],
                      loc: {
                        start: { line: 1, column: 11 },
                        end: { line: 1, column: 18 },
                      },
                    },
                    {
                      type: "TSTypeReference",
                      typeName: {
                        type: "Identifier",
                        name: "C",
                        range: [21, 22],
                        loc: {
                          start: { line: 1, column: 21 },
                          end: { line: 1, column: 22 },
                        },
                      },
                      range: [21, 22],
                      loc: {
                        start: { line: 1, column: 21 },
                        end: { line: 1, column: 22 },
                      },
                    },
                  ],
                  range: [11, 22],
                  loc: {
                    start: { line: 1, column: 11 },
                    end: { line: 1, column: 22 },
                  },
                },
                range: [1, 22],
                loc: {
                  start: { line: 1, column: 1 },
                  end: { line: 1, column: 22 },
                },
              },
            ],
          },
        },
        range: [0, 31],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 31 } },
      },
    ],
    sourceType: "script",
    range: [0, 31],
    loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 31 } },
    tokens: [
      {
        type: "Punctuator",
        value: "<",
        range: [0, 1],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 1 } },
      },
      {
        type: "Identifier",
        value: "T",
        range: [1, 2],
        loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 2 } },
      },
      {
        type: "Keyword",
        value: "extends",
        range: [3, 10],
        loc: { start: { line: 1, column: 3 }, end: { line: 1, column: 10 } },
      },
      {
        type: "Punctuator",
        value: "(",
        range: [11, 12],
        loc: { start: { line: 1, column: 11 }, end: { line: 1, column: 12 } },
      },
      {
        type: "Identifier",
        value: "A",
        range: [12, 13],
        loc: { start: { line: 1, column: 12 }, end: { line: 1, column: 13 } },
      },
      {
        type: "Punctuator",
        value: "|",
        range: [14, 15],
        loc: { start: { line: 1, column: 14 }, end: { line: 1, column: 15 } },
      },
      {
        type: "Identifier",
        value: "B",
        range: [16, 17],
        loc: { start: { line: 1, column: 16 }, end: { line: 1, column: 17 } },
      },
      {
        type: "Punctuator",
        value: ")",
        range: [17, 18],
        loc: { start: { line: 1, column: 17 }, end: { line: 1, column: 18 } },
      },
      {
        type: "Punctuator",
        value: "&",
        range: [19, 20],
        loc: { start: { line: 1, column: 19 }, end: { line: 1, column: 20 } },
      },
      {
        type: "Identifier",
        value: "C",
        range: [21, 22],
        loc: { start: { line: 1, column: 21 }, end: { line: 1, column: 22 } },
      },
      {
        type: "Punctuator",
        value: ">",
        range: [22, 23],
        loc: { start: { line: 1, column: 22 }, end: { line: 1, column: 23 } },
      },
      {
        type: "Punctuator",
        value: "(",
        range: [23, 24],
        loc: { start: { line: 1, column: 23 }, end: { line: 1, column: 24 } },
      },
      {
        type: "Identifier",
        value: "a",
        range: [24, 25],
        loc: { start: { line: 1, column: 24 }, end: { line: 1, column: 25 } },
      },
      {
        type: "Punctuator",
        value: ")",
        range: [25, 26],
        loc: { start: { line: 1, column: 25 }, end: { line: 1, column: 26 } },
      },
      {
        type: "Punctuator",
        value: "=>",
        range: [27, 29],
        loc: { start: { line: 1, column: 27 }, end: { line: 1, column: 29 } },
      },
      {
        type: "Identifier",
        value: "b",
        range: [30, 31],
        loc: { start: { line: 1, column: 30 }, end: { line: 1, column: 31 } },
      },
    ],
    comments: [],
  });
