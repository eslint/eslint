"use strict";

/**
 * Parser: @typescript-eslint/parser@4.2.0
 * Source code:
 * class A { foo(bar: string): void{} }
 */

exports.parse = () => ({
    type: "Program",
    body: [
      {
        type: "ClassDeclaration",
        id: {
          type: "Identifier",
          name: "A",
          range: [6, 7],
          loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 7 } },
        },
        body: {
          type: "ClassBody",
          body: [
            {
              type: "MethodDefinition",
              key: {
                type: "Identifier",
                name: "foo",
                range: [10, 13],
                loc: {
                  start: { line: 1, column: 10 },
                  end: { line: 1, column: 13 },
                },
              },
              value: {
                type: "FunctionExpression",
                id: null,
                generator: false,
                expression: false,
                async: false,
                body: {
                  type: "BlockStatement",
                  body: [],
                  range: [32, 34],
                  loc: {
                    start: { line: 1, column: 32 },
                    end: { line: 1, column: 34 },
                  },
                },
                range: [13, 34],
                params: [
                  {
                    type: "Identifier",
                    name: "bar",
                    range: [14, 25],
                    loc: {
                      start: { line: 1, column: 14 },
                      end: { line: 1, column: 25 },
                    },
                    typeAnnotation: {
                      type: "TSTypeAnnotation",
                      loc: {
                        start: { line: 1, column: 17 },
                        end: { line: 1, column: 25 },
                      },
                      range: [17, 25],
                      typeAnnotation: {
                        type: "TSStringKeyword",
                        range: [19, 25],
                        loc: {
                          start: { line: 1, column: 19 },
                          end: { line: 1, column: 25 },
                        },
                      },
                    },
                  },
                ],
                loc: {
                  start: { line: 1, column: 13 },
                  end: { line: 1, column: 34 },
                },
                returnType: {
                  type: "TSTypeAnnotation",
                  loc: {
                    start: { line: 1, column: 26 },
                    end: { line: 1, column: 32 },
                  },
                  range: [26, 32],
                  typeAnnotation: {
                    type: "TSVoidKeyword",
                    range: [28, 32],
                    loc: {
                      start: { line: 1, column: 28 },
                      end: { line: 1, column: 32 },
                    },
                  },
                },
              },
              computed: false,
              static: false,
              kind: "method",
              range: [10, 34],
              loc: {
                start: { line: 1, column: 10 },
                end: { line: 1, column: 34 },
              },
            },
          ],
          range: [8, 36],
          loc: { start: { line: 1, column: 8 }, end: { line: 1, column: 36 } },
        },
        superClass: null,
        range: [0, 36],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 36 } },
      },
    ],
    sourceType: "script",
    range: [0, 36],
    loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 36 } },
    tokens: [
      {
        type: "Keyword",
        value: "class",
        range: [0, 5],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 5 } },
      },
      {
        type: "Identifier",
        value: "A",
        range: [6, 7],
        loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 7 } },
      },
      {
        type: "Punctuator",
        value: "{",
        range: [8, 9],
        loc: { start: { line: 1, column: 8 }, end: { line: 1, column: 9 } },
      },
      {
        type: "Identifier",
        value: "foo",
        range: [10, 13],
        loc: { start: { line: 1, column: 10 }, end: { line: 1, column: 13 } },
      },
      {
        type: "Punctuator",
        value: "(",
        range: [13, 14],
        loc: { start: { line: 1, column: 13 }, end: { line: 1, column: 14 } },
      },
      {
        type: "Identifier",
        value: "bar",
        range: [14, 17],
        loc: { start: { line: 1, column: 14 }, end: { line: 1, column: 17 } },
      },
      {
        type: "Punctuator",
        value: ":",
        range: [17, 18],
        loc: { start: { line: 1, column: 17 }, end: { line: 1, column: 18 } },
      },
      {
        type: "Identifier",
        value: "string",
        range: [19, 25],
        loc: { start: { line: 1, column: 19 }, end: { line: 1, column: 25 } },
      },
      {
        type: "Punctuator",
        value: ")",
        range: [25, 26],
        loc: { start: { line: 1, column: 25 }, end: { line: 1, column: 26 } },
      },
      {
        type: "Punctuator",
        value: ":",
        range: [26, 27],
        loc: { start: { line: 1, column: 26 }, end: { line: 1, column: 27 } },
      },
      {
        type: "Keyword",
        value: "void",
        range: [28, 32],
        loc: { start: { line: 1, column: 28 }, end: { line: 1, column: 32 } },
      },
      {
        type: "Punctuator",
        value: "{",
        range: [32, 33],
        loc: { start: { line: 1, column: 32 }, end: { line: 1, column: 33 } },
      },
      {
        type: "Punctuator",
        value: "}",
        range: [33, 34],
        loc: { start: { line: 1, column: 33 }, end: { line: 1, column: 34 } },
      },
      {
        type: "Punctuator",
        value: "}",
        range: [35, 36],
        loc: { start: { line: 1, column: 35 }, end: { line: 1, column: 36 } },
      },
    ],
    comments: [],
  });
