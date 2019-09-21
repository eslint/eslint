/**
 * Source code:
 * function foo(): any { return Promise.resolve(); }; async function wrap() { foo(); }
 */

exports.parse = () => ({
  type: 'Program',
  start: 0,
  end: 83,
  loc: {
      start: {
          line: 1,
          column: 0
      },
      end: {
          line: 1,
          column: 83
      }
  },
  range: [0, 83],
  comments: [],
  tokens: [{
          type: 'Keyword',
          value: 'function',
          start: 0,
          end: 8,
          loc: {
              start: {
                  line: 1,
                  column: 0
              },
              end: {
                  line: 1,
                  column: 8
              }
          },
          range: [0, 8]
      },
      {
          type: 'Identifier',
          value: 'foo',
          start: 9,
          end: 12,
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
          range: [9, 12]
      },
      {
          type: 'Punctuator',
          value: '(',
          start: 12,
          end: 13,
          loc: {
              start: {
                  line: 1,
                  column: 12
              },
              end: {
                  line: 1,
                  column: 13
              }
          },
          range: [12, 13]
      },
      {
          type: 'Punctuator',
          value: ')',
          start: 13,
          end: 14,
          loc: {
              start: {
                  line: 1,
                  column: 13
              },
              end: {
                  line: 1,
                  column: 14
              }
          },
          range: [13, 14]
      },
      {
          type: 'Punctuator',
          value: ':',
          start: 14,
          end: 15,
          loc: {
              start: {
                  line: 1,
                  column: 14
              },
              end: {
                  line: 1,
                  column: 15
              }
          },
          range: [14, 15]
      },
      {
          type: 'Identifier',
          value: 'any',
          start: 16,
          end: 19,
          loc: {
              start: {
                  line: 1,
                  column: 16
              },
              end: {
                  line: 1,
                  column: 19
              }
          },
          range: [16, 19]
      },
      {
          type: 'Punctuator',
          value: '{',
          start: 20,
          end: 21,
          loc: {
              start: {
                  line: 1,
                  column: 20
              },
              end: {
                  line: 1,
                  column: 21
              }
          },
          range: [20, 21]
      },
      {
          type: 'Keyword',
          value: 'return',
          start: 22,
          end: 28,
          loc: {
              start: {
                  line: 1,
                  column: 22
              },
              end: {
                  line: 1,
                  column: 28
              }
          },
          range: [22, 28]
      },
      {
          type: 'Identifier',
          value: 'Promise',
          start: 29,
          end: 36,
          loc: {
              start: {
                  line: 1,
                  column: 29
              },
              end: {
                  line: 1,
                  column: 36
              }
          },
          range: [29, 36]
      },
      {
          type: 'Punctuator',
          value: '.',
          start: 36,
          end: 37,
          loc: {
              start: {
                  line: 1,
                  column: 36
              },
              end: {
                  line: 1,
                  column: 37
              }
          },
          range: [36, 37]
      },
      {
          type: 'Identifier',
          value: 'resolve',
          start: 37,
          end: 44,
          loc: {
              start: {
                  line: 1,
                  column: 37
              },
              end: {
                  line: 1,
                  column: 44
              }
          },
          range: [37, 44]
      },
      {
          type: 'Punctuator',
          value: '(',
          start: 44,
          end: 45,
          loc: {
              start: {
                  line: 1,
                  column: 44
              },
              end: {
                  line: 1,
                  column: 45
              }
          },
          range: [44, 45]
      },
      {
          type: 'Punctuator',
          value: ')',
          start: 45,
          end: 46,
          loc: {
              start: {
                  line: 1,
                  column: 45
              },
              end: {
                  line: 1,
                  column: 46
              }
          },
          range: [45, 46]
      },
      {
          type: 'Punctuator',
          value: ';',
          start: 46,
          end: 47,
          loc: {
              start: {
                  line: 1,
                  column: 46
              },
              end: {
                  line: 1,
                  column: 47
              }
          },
          range: [46, 47]
      },
      {
          type: 'Punctuator',
          value: '}',
          start: 48,
          end: 49,
          loc: {
              start: {
                  line: 1,
                  column: 48
              },
              end: {
                  line: 1,
                  column: 49
              }
          },
          range: [48, 49]
      },
      {
          type: 'Punctuator',
          value: ';',
          start: 49,
          end: 50,
          loc: {
              start: {
                  line: 1,
                  column: 49
              },
              end: {
                  line: 1,
                  column: 50
              }
          },
          range: [49, 50]
      },
      {
          type: 'Identifier',
          value: 'async',
          start: 51,
          end: 56,
          loc: {
              start: {
                  line: 1,
                  column: 51
              },
              end: {
                  line: 1,
                  column: 56
              }
          },
          range: [51, 56]
      },
      {
          type: 'Keyword',
          value: 'function',
          start: 57,
          end: 65,
          loc: {
              start: {
                  line: 1,
                  column: 57
              },
              end: {
                  line: 1,
                  column: 65
              }
          },
          range: [57, 65]
      },
      {
          type: 'Identifier',
          value: 'wrap',
          start: 66,
          end: 70,
          loc: {
              start: {
                  line: 1,
                  column: 66
              },
              end: {
                  line: 1,
                  column: 70
              }
          },
          range: [66, 70]
      },
      {
          type: 'Punctuator',
          value: '(',
          start: 70,
          end: 71,
          loc: {
              start: {
                  line: 1,
                  column: 70
              },
              end: {
                  line: 1,
                  column: 71
              }
          },
          range: [70, 71]
      },
      {
          type: 'Punctuator',
          value: ')',
          start: 71,
          end: 72,
          loc: {
              start: {
                  line: 1,
                  column: 71
              },
              end: {
                  line: 1,
                  column: 72
              }
          },
          range: [71, 72]
      },
      {
          type: 'Punctuator',
          value: '{',
          start: 73,
          end: 74,
          loc: {
              start: {
                  line: 1,
                  column: 73
              },
              end: {
                  line: 1,
                  column: 74
              }
          },
          range: [73, 74]
      },
      {
          type: 'Identifier',
          value: 'foo',
          start: 75,
          end: 78,
          loc: {
              start: {
                  line: 1,
                  column: 75
              },
              end: {
                  line: 1,
                  column: 78
              }
          },
          range: [75, 78]
      },
      {
          type: 'Punctuator',
          value: '(',
          start: 78,
          end: 79,
          loc: {
              start: {
                  line: 1,
                  column: 78
              },
              end: {
                  line: 1,
                  column: 79
              }
          },
          range: [78, 79]
      },
      {
          type: 'Punctuator',
          value: ')',
          start: 79,
          end: 80,
          loc: {
              start: {
                  line: 1,
                  column: 79
              },
              end: {
                  line: 1,
                  column: 80
              }
          },
          range: [79, 80]
      },
      {
          type: 'Punctuator',
          value: ';',
          start: 80,
          end: 81,
          loc: {
              start: {
                  line: 1,
                  column: 80
              },
              end: {
                  line: 1,
                  column: 81
              }
          },
          range: [80, 81]
      },
      {
          type: 'Punctuator',
          value: '}',
          start: 82,
          end: 83,
          loc: {
              start: {
                  line: 1,
                  column: 82
              },
              end: {
                  line: 1,
                  column: 83
              }
          },
          range: [82, 83]
      }
  ],
  sourceType: 'module',
  directives: undefined,
  body: [{
          type: 'FunctionDeclaration',
          start: 0,
          end: 49,
          loc: {
              start: {
                  line: 1,
                  column: 0
              },
              end: {
                  line: 1,
                  column: 49
              }
          },
          range: [0, 49],
          id: {
              type: 'Identifier',
              start: 9,
              end: 12,
              loc: {
                  start: {
                      line: 1,
                      column: 9
                  },
                  end: {
                      line: 1,
                      column: 12
                  },
                  identifierName: 'foo'
              },
              range: [9, 12],
              name: 'foo',
              _babelType: 'Identifier',
          },
          generator: false,
          async: false,
          expression: false,
          params: [],
          predicate: null,
          returnType: {
              type: 'TypeAnnotation',
              start: 14,
              end: 19,
              loc: {
                  start: {
                      line: 1,
                      column: 14
                  },
                  end: {
                      line: 1,
                      column: 19
                  }
              },
              range: [14, 19],
              typeAnnotation: {
                  type: 'AnyTypeAnnotation',
                  start: 16,
                  end: 19,
                  loc: {
                      start: {
                          line: 1,
                          column: 16
                      },
                      end: {
                          line: 1,
                          column: 19
                      }
                  },
                  range: [16, 19],
                  _babelType: 'AnyTypeAnnotation',
              },
              _babelType: 'TypeAnnotation',
          },
          body: {
              type: 'BlockStatement',
              start: 20,
              end: 49,
              loc: {
                  start: {
                      line: 1,
                      column: 20
                  },
                  end: {
                      line: 1,
                      column: 49
                  }
              },
              range: [20, 49],
              body: [{
                  type: 'ReturnStatement',
                  start: 22,
                  end: 47,
                  loc: {
                      start: {
                          line: 1,
                          column: 22
                      },
                      end: {
                          line: 1,
                          column: 47
                      }
                  },
                  range: [22, 47],
                  argument: {
                      type: 'CallExpression',
                      start: 29,
                      end: 46,
                      loc: {
                          start: {
                              line: 1,
                              column: 29
                          },
                          end: {
                              line: 1,
                              column: 46
                          }
                      },
                      range: [29, 46],
                      callee: {
                          type: 'MemberExpression',
                          start: 29,
                          end: 44,
                          loc: {
                              start: {
                                  line: 1,
                                  column: 29
                              },
                              end: {
                                  line: 1,
                                  column: 44
                              }
                          },
                          range: [29, 44],
                          object: {
                              type: 'Identifier',
                              start: 29,
                              end: 36,
                              loc: {
                                  start: {
                                      line: 1,
                                      column: 29
                                  },
                                  end: {
                                      line: 1,
                                      column: 36
                                  },
                                  identifierName: 'Promise'
                              },
                              range: [29, 36],
                              name: 'Promise',
                              _babelType: 'Identifier',
                          },
                          property: {
                              type: 'Identifier',
                              start: 37,
                              end: 44,
                              loc: {
                                  start: {
                                      line: 1,
                                      column: 37
                                  },
                                  end: {
                                      line: 1,
                                      column: 44
                                  },
                                  identifierName: 'resolve'
                              },
                              range: [37, 44],
                              name: 'resolve',
                              _babelType: 'Identifier',
                          },
                          computed: false,
                          _babelType: 'MemberExpression',
                      },
                      arguments: [],
                      _babelType: 'CallExpression',
                  },
                  _babelType: 'ReturnStatement',
              }],
              _babelType: 'BlockStatement',
          },
          _babelType: 'FunctionDeclaration',
      },
      {
          type: 'EmptyStatement',
          start: 49,
          end: 50,
          loc: {
              start: {
                  line: 1,
                  column: 49
              },
              end: {
                  line: 1,
                  column: 50
              }
          },
          range: [49, 50],
          _babelType: 'EmptyStatement',
      },
      {
          type: 'FunctionDeclaration',
          start: 51,
          end: 83,
          loc: {
              start: {
                  line: 1,
                  column: 51
              },
              end: {
                  line: 1,
                  column: 83
              }
          },
          range: [51, 83],
          id: {
              type: 'Identifier',
              start: 66,
              end: 70,
              loc: {
                  start: {
                      line: 1,
                      column: 66
                  },
                  end: {
                      line: 1,
                      column: 70
                  },
                  identifierName: 'wrap'
              },
              range: [66, 70],
              name: 'wrap',
              _babelType: 'Identifier',
          },
          generator: false,
          async: true,
          expression: false,
          params: [],
          body: {
              type: 'BlockStatement',
              start: 73,
              end: 83,
              loc: {
                  start: {
                      line: 1,
                      column: 73
                  },
                  end: {
                      line: 1,
                      column: 83
                  }
              },
              range: [73, 83],
              body: [{
                  type: 'ExpressionStatement',
                  start: 75,
                  end: 81,
                  loc: {
                      start: {
                          line: 1,
                          column: 75
                      },
                      end: {
                          line: 1,
                          column: 81
                      }
                  },
                  range: [75, 81],
                  expression: {
                      type: 'CallExpression',
                      start: 75,
                      end: 80,
                      loc: {
                          start: {
                              line: 1,
                              column: 75
                          },
                          end: {
                              line: 1,
                              column: 80
                          }
                      },
                      range: [75, 80],
                      callee: {
                          type: 'Identifier',
                          start: 75,
                          end: 78,
                          loc: {
                              start: {
                                  line: 1,
                                  column: 75
                              },
                              end: {
                                  line: 1,
                                  column: 78
                              },
                              identifierName: 'foo'
                          },
                          range: [75, 78],
                          name: 'foo',
                          _babelType: 'Identifier',
                      },
                      arguments: [],
                      _babelType: 'CallExpression',
                  },
                  _babelType: 'ExpressionStatement',
              }],
              _babelType: 'BlockStatement',
          },
          _babelType: 'FunctionDeclaration',
      }
  ],
});
