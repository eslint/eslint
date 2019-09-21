/**
 * Source code:
 * function foo(): Promise<void> { return Promise.resolve(); }; async function wrap() { await foo(); }
 */

exports.parse = () => ({
  type: 'Program',
  start: 0,
  end: 99,
  loc: {
      start: {
          line: 1,
          column: 0
      },
      end: {
          line: 1,
          column: 99
      }
  },
  range: [0, 99],
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
          value: 'Promise',
          start: 16,
          end: 23,
          loc: {
              start: {
                  line: 1,
                  column: 16
              },
              end: {
                  line: 1,
                  column: 23
              }
          },
          range: [16, 23]
      },
      {
          type: 'Punctuator',
          value: '<',
          start: 23,
          end: 24,
          loc: {
              start: {
                  line: 1,
                  column: 23
              },
              end: {
                  line: 1,
                  column: 24
              }
          },
          range: [23, 24]
      },
      {
          type: 'Keyword',
          value: 'void',
          start: 24,
          end: 28,
          loc: {
              start: {
                  line: 1,
                  column: 24
              },
              end: {
                  line: 1,
                  column: 28
              }
          },
          range: [24, 28]
      },
      {
          type: 'Punctuator',
          value: '>',
          start: 28,
          end: 29,
          loc: {
              start: {
                  line: 1,
                  column: 28
              },
              end: {
                  line: 1,
                  column: 29
              }
          },
          range: [28, 29]
      },
      {
          type: 'Punctuator',
          value: '{',
          start: 30,
          end: 31,
          loc: {
              start: {
                  line: 1,
                  column: 30
              },
              end: {
                  line: 1,
                  column: 31
              }
          },
          range: [30, 31]
      },
      {
          type: 'Keyword',
          value: 'return',
          start: 32,
          end: 38,
          loc: {
              start: {
                  line: 1,
                  column: 32
              },
              end: {
                  line: 1,
                  column: 38
              }
          },
          range: [32, 38]
      },
      {
          type: 'Identifier',
          value: 'Promise',
          start: 39,
          end: 46,
          loc: {
              start: {
                  line: 1,
                  column: 39
              },
              end: {
                  line: 1,
                  column: 46
              }
          },
          range: [39, 46]
      },
      {
          type: 'Punctuator',
          value: '.',
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
          type: 'Identifier',
          value: 'resolve',
          start: 47,
          end: 54,
          loc: {
              start: {
                  line: 1,
                  column: 47
              },
              end: {
                  line: 1,
                  column: 54
              }
          },
          range: [47, 54]
      },
      {
          type: 'Punctuator',
          value: '(',
          start: 54,
          end: 55,
          loc: {
              start: {
                  line: 1,
                  column: 54
              },
              end: {
                  line: 1,
                  column: 55
              }
          },
          range: [54, 55]
      },
      {
          type: 'Punctuator',
          value: ')',
          start: 55,
          end: 56,
          loc: {
              start: {
                  line: 1,
                  column: 55
              },
              end: {
                  line: 1,
                  column: 56
              }
          },
          range: [55, 56]
      },
      {
          type: 'Punctuator',
          value: ';',
          start: 56,
          end: 57,
          loc: {
              start: {
                  line: 1,
                  column: 56
              },
              end: {
                  line: 1,
                  column: 57
              }
          },
          range: [56, 57]
      },
      {
          type: 'Punctuator',
          value: '}',
          start: 58,
          end: 59,
          loc: {
              start: {
                  line: 1,
                  column: 58
              },
              end: {
                  line: 1,
                  column: 59
              }
          },
          range: [58, 59]
      },
      {
          type: 'Punctuator',
          value: ';',
          start: 59,
          end: 60,
          loc: {
              start: {
                  line: 1,
                  column: 59
              },
              end: {
                  line: 1,
                  column: 60
              }
          },
          range: [59, 60]
      },
      {
          type: 'Identifier',
          value: 'async',
          start: 61,
          end: 66,
          loc: {
              start: {
                  line: 1,
                  column: 61
              },
              end: {
                  line: 1,
                  column: 66
              }
          },
          range: [61, 66]
      },
      {
          type: 'Keyword',
          value: 'function',
          start: 67,
          end: 75,
          loc: {
              start: {
                  line: 1,
                  column: 67
              },
              end: {
                  line: 1,
                  column: 75
              }
          },
          range: [67, 75]
      },
      {
          type: 'Identifier',
          value: 'wrap',
          start: 76,
          end: 80,
          loc: {
              start: {
                  line: 1,
                  column: 76
              },
              end: {
                  line: 1,
                  column: 80
              }
          },
          range: [76, 80]
      },
      {
          type: 'Punctuator',
          value: '(',
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
          value: ')',
          start: 81,
          end: 82,
          loc: {
              start: {
                  line: 1,
                  column: 81
              },
              end: {
                  line: 1,
                  column: 82
              }
          },
          range: [81, 82]
      },
      {
          type: 'Punctuator',
          value: '{',
          start: 83,
          end: 84,
          loc: {
              start: {
                  line: 1,
                  column: 83
              },
              end: {
                  line: 1,
                  column: 84
              }
          },
          range: [83, 84]
      },
      {
          type: 'Identifier',
          value: 'await',
          start: 85,
          end: 90,
          loc: {
              start: {
                  line: 1,
                  column: 85
              },
              end: {
                  line: 1,
                  column: 90
              }
          },
          range: [85, 90]
      },
      {
          type: 'Identifier',
          value: 'foo',
          start: 91,
          end: 94,
          loc: {
              start: {
                  line: 1,
                  column: 91
              },
              end: {
                  line: 1,
                  column: 94
              }
          },
          range: [91, 94]
      },
      {
          type: 'Punctuator',
          value: '(',
          start: 94,
          end: 95,
          loc: {
              start: {
                  line: 1,
                  column: 94
              },
              end: {
                  line: 1,
                  column: 95
              }
          },
          range: [94, 95]
      },
      {
          type: 'Punctuator',
          value: ')',
          start: 95,
          end: 96,
          loc: {
              start: {
                  line: 1,
                  column: 95
              },
              end: {
                  line: 1,
                  column: 96
              }
          },
          range: [95, 96]
      },
      {
          type: 'Punctuator',
          value: ';',
          start: 96,
          end: 97,
          loc: {
              start: {
                  line: 1,
                  column: 96
              },
              end: {
                  line: 1,
                  column: 97
              }
          },
          range: [96, 97]
      },
      {
          type: 'Punctuator',
          value: '}',
          start: 98,
          end: 99,
          loc: {
              start: {
                  line: 1,
                  column: 98
              },
              end: {
                  line: 1,
                  column: 99
              }
          },
          range: [98, 99]
      }
  ],
  sourceType: 'module',
  directives: undefined,
  body: [{
          type: 'FunctionDeclaration',
          start: 0,
          end: 59,
          loc: {
              start: {
                  line: 1,
                  column: 0
              },
              end: {
                  line: 1,
                  column: 59
              }
          },
          range: [0, 59],
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
              end: 29,
              loc: {
                  start: {
                      line: 1,
                      column: 14
                  },
                  end: {
                      line: 1,
                      column: 29
                  }
              },
              range: [14, 29],
              typeAnnotation: {
                  type: 'GenericTypeAnnotation',
                  start: 16,
                  end: 29,
                  loc: {
                      start: {
                          line: 1,
                          column: 16
                      },
                      end: {
                          line: 1,
                          column: 29
                      }
                  },
                  range: [16, 29],
                  typeParameters: {
                      type: 'TypeParameterInstantiation',
                      start: 23,
                      end: 29,
                      loc: {
                          start: {
                              line: 1,
                              column: 23
                          },
                          end: {
                              line: 1,
                              column: 29
                          }
                      },
                      range: [23, 29],
                      params: [{
                          type: 'VoidTypeAnnotation',
                          start: 24,
                          end: 28,
                          loc: {
                              start: {
                                  line: 1,
                                  column: 24
                              },
                              end: {
                                  line: 1,
                                  column: 28
                              }
                          },
                          range: [24, 28],
                          _babelType: 'VoidTypeAnnotation',
                      }],
                      _babelType: 'TypeParameterInstantiation',
                  },
                  id: {
                      type: 'Identifier',
                      start: 16,
                      end: 23,
                      loc: {
                          start: {
                              line: 1,
                              column: 16
                          },
                          end: {
                              line: 1,
                              column: 23
                          },
                          identifierName: 'Promise'
                      },
                      range: [16, 23],
                      name: 'Promise',
                      _babelType: 'Identifier',
                  },
                  _babelType: 'GenericTypeAnnotation',
              },
              _babelType: 'TypeAnnotation',
          },
          body: {
              type: 'BlockStatement',
              start: 30,
              end: 59,
              loc: {
                  start: {
                      line: 1,
                      column: 30
                  },
                  end: {
                      line: 1,
                      column: 59
                  }
              },
              range: [30, 59],
              body: [{
                  type: 'ReturnStatement',
                  start: 32,
                  end: 57,
                  loc: {
                      start: {
                          line: 1,
                          column: 32
                      },
                      end: {
                          line: 1,
                          column: 57
                      }
                  },
                  range: [32, 57],
                  argument: {
                      type: 'CallExpression',
                      start: 39,
                      end: 56,
                      loc: {
                          start: {
                              line: 1,
                              column: 39
                          },
                          end: {
                              line: 1,
                              column: 56
                          }
                      },
                      range: [39, 56],
                      callee: {
                          type: 'MemberExpression',
                          start: 39,
                          end: 54,
                          loc: {
                              start: {
                                  line: 1,
                                  column: 39
                              },
                              end: {
                                  line: 1,
                                  column: 54
                              }
                          },
                          range: [39, 54],
                          object: {
                              type: 'Identifier',
                              start: 39,
                              end: 46,
                              loc: {
                                  start: {
                                      line: 1,
                                      column: 39
                                  },
                                  end: {
                                      line: 1,
                                      column: 46
                                  },
                                  identifierName: 'Promise'
                              },
                              range: [39, 46],
                              name: 'Promise',
                              _babelType: 'Identifier',
                          },
                          property: {
                              type: 'Identifier',
                              start: 47,
                              end: 54,
                              loc: {
                                  start: {
                                      line: 1,
                                      column: 47
                                  },
                                  end: {
                                      line: 1,
                                      column: 54
                                  },
                                  identifierName: 'resolve'
                              },
                              range: [47, 54],
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
          start: 59,
          end: 60,
          loc: {
              start: {
                  line: 1,
                  column: 59
              },
              end: {
                  line: 1,
                  column: 60
              }
          },
          range: [59, 60],
          _babelType: 'EmptyStatement',
      },
      {
          type: 'FunctionDeclaration',
          start: 61,
          end: 99,
          loc: {
              start: {
                  line: 1,
                  column: 61
              },
              end: {
                  line: 1,
                  column: 99
              }
          },
          range: [61, 99],
          id: {
              type: 'Identifier',
              start: 76,
              end: 80,
              loc: {
                  start: {
                      line: 1,
                      column: 76
                  },
                  end: {
                      line: 1,
                      column: 80
                  },
                  identifierName: 'wrap'
              },
              range: [76, 80],
              name: 'wrap',
              _babelType: 'Identifier',
          },
          generator: false,
          async: true,
          expression: false,
          params: [],
          body: {
              type: 'BlockStatement',
              start: 83,
              end: 99,
              loc: {
                  start: {
                      line: 1,
                      column: 83
                  },
                  end: {
                      line: 1,
                      column: 99
                  }
              },
              range: [83, 99],
              body: [{
                  type: 'ExpressionStatement',
                  start: 85,
                  end: 97,
                  loc: {
                      start: {
                          line: 1,
                          column: 85
                      },
                      end: {
                          line: 1,
                          column: 97
                      }
                  },
                  range: [85, 97],
                  expression: {
                      type: 'AwaitExpression',
                      start: 85,
                      end: 96,
                      loc: {
                          start: {
                              line: 1,
                              column: 85
                          },
                          end: {
                              line: 1,
                              column: 96
                          }
                      },
                      range: [85, 96],
                      argument: {
                          type: 'CallExpression',
                          start: 91,
                          end: 96,
                          loc: {
                              start: {
                                  line: 1,
                                  column: 91
                              },
                              end: {
                                  line: 1,
                                  column: 96
                              }
                          },
                          range: [91, 96],
                          callee: {
                              type: 'Identifier',
                              start: 91,
                              end: 94,
                              loc: {
                                  start: {
                                      line: 1,
                                      column: 91
                                  },
                                  end: {
                                      line: 1,
                                      column: 94
                                  },
                                  identifierName: 'foo'
                              },
                              range: [91, 94],
                              name: 'foo',
                              _babelType: 'Identifier',
                          },
                          arguments: [],
                          _babelType: 'CallExpression',
                      },
                      _babelType: 'AwaitExpression',
                  },
                  _babelType: 'ExpressionStatement',
              }],
              _babelType: 'BlockStatement',
          },
          _babelType: 'FunctionDeclaration',
      }
  ],
});
