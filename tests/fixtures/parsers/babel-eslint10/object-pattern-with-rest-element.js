/**
 * Parser: babel-eslint@10.0.3
 * Source code:
 * const { ...foo } = bar;
 */
exports.parse = () => ({
  type: "Program",
  start: 0,
  end: 24,
  loc: { start: { line: 1, column: 0 }, end: { line: 2, column: 0 } },
  range: [0, 24],
  comments: [],
  tokens: [
      {
          type: "Keyword",
          value: "const",
          start: 0,
          end: 5,
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 5 } },
          range: [0, 5]
      },
      {
          type: "Punctuator",
          value: "{",
          start: 6,
          end: 7,
          loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 7 } },
          range: [6, 7]
      },
      {
          type: "Punctuator",
          value: "...",
          start: 8,
          end: 11,
          loc: { start: { line: 1, column: 8 }, end: { line: 1, column: 11 } },
          range: [8, 11]
      },
      {
          type: "Identifier",
          value: "foo",
          start: 11,
          end: 14,
          loc: { start: { line: 1, column: 11 }, end: { line: 1, column: 14 } },
          range: [11, 14]
      },
      {
          type: "Punctuator",
          value: "}",
          start: 15,
          end: 16,
          loc: { start: { line: 1, column: 15 }, end: { line: 1, column: 16 } },
          range: [15, 16]
      },
      {
          type: "Punctuator",
          value: "=",
          start: 17,
          end: 18,
          loc: { start: { line: 1, column: 17 }, end: { line: 1, column: 18 } },
          range: [17, 18]
      },
      {
          type: "Identifier",
          value: "bar",
          start: 19,
          end: 22,
          loc: { start: { line: 1, column: 19 }, end: { line: 1, column: 22 } },
          range: [19, 22]
      },
      {
          type: "Punctuator",
          value: ";",
          start: 22,
          end: 23,
          loc: { start: { line: 1, column: 22 }, end: { line: 1, column: 23 } },
          range: [22, 23]
      }
  ],
  sourceType: "module",
  body: [
      {
          type: "VariableDeclaration",
          start: 0,
          end: 23,
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 23 } },
          range: [0, 23],
          declarations: [
              {
                  type: "VariableDeclarator",
                  start: 6,
                  end: 22,
                  loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 22 } },
                  range: [6, 22],
                  id: {
                      type: "ObjectPattern",
                      start: 6,
                      end: 16,
                      loc: {
                          start: { line: 1, column: 6 },
                          end: { line: 1, column: 16 }
                      },
                      range: [6, 16],
                      properties: [
                          {
                              type: "ExperimentalRestProperty",
                              start: 8,
                              end: 14,
                              loc: {
                                  start: { line: 1, column: 8 },
                                  end: { line: 1, column: 14 }
                              },
                              range: [8, 14],
                              argument: {
                                  type: "Identifier",
                                  start: 11,
                                  end: 14,
                                  loc: {
                                      start: { line: 1, column: 11 },
                                      end: { line: 1, column: 14 },
                                      identifierName: "foo"
                                  },
                                  range: [11, 14],
                                  name: "foo",
                                  _babelType: "Identifier"
                              },
                              _babelType: "RestElement"
                          }
                      ],
                      _babelType: "ObjectPattern"
                  },
                  init: {
                      type: "Identifier",
                      start: 19,
                      end: 22,
                      loc: {
                          start: { line: 1, column: 19 },
                          end: { line: 1, column: 22 },
                          identifierName: "bar"
                      },
                      range: [19, 22],
                      name: "bar",
                      _babelType: "Identifier"
                  },
                  _babelType: "VariableDeclarator"
              }
          ],
          kind: "const",
          _babelType: "VariableDeclaration"
      }
  ]
});
