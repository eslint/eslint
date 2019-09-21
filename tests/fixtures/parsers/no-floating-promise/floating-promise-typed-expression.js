/**
 * Source code:
 * async function wrap() { (function (): Promise<void> { return Promise.resolve(); })(); };
 */

exports.parse = () => ({
  type: 'Program',
  start: 0,
  end: 87,
  loc: {
      start: {
          line: 1,
          column: 0
      },
      end: {
          line: 1,
          column: 87
      }
  },
  range: [0, 87],
  comments: [],
  tokens: [{
          type: 'Identifier',
          value: 'async',
          start: 0,
          end: 5,
          loc: {
              start: {
                  line: 1,
                  column: 0
              },
              end: {
                  line: 1,
                  column: 5
              }
          },
          range: [0, 5]
      },
      {
          type: 'Keyword',
          value: 'function',
          start: 6,
          end: 14,
          loc: {
              start: {
                  line: 1,
                  column: 6
              },
              end: {
                  line: 1,
                  column: 14
              }
          },
          range: [6, 14]
      },
      {
          type: 'Identifier',
          value: 'wrap',
          start: 15,
          end: 19,
          loc: {
              start: {
                  line: 1,
                  column: 15
              },
              end: {
                  line: 1,
                  column: 19
              }
          },
          range: [15, 19]
      },
      {
          type: 'Punctuator',
          value: '(',
          start: 19,
          end: 20,
          loc: {
              start: {
                  line: 1,
                  column: 19
              },
              end: {
                  line: 1,
                  column: 20
              }
          },
          range: [19, 20]
      },
      {
          type: 'Punctuator',
          value: ')',
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
          type: 'Punctuator',
          value: '{',
          start: 22,
          end: 23,
          loc: {
              start: {
                  line: 1,
                  column: 22
              },
              end: {
                  line: 1,
                  column: 23
              }
          },
          range: [22, 23]
      },
      {
          type: 'Punctuator',
          value: '(',
          start: 24,
          end: 25,
          loc: {
              start: {
                  line: 1,
                  column: 24
              },
              end: {
                  line: 1,
                  column: 25
              }
          },
          range: [24, 25]
      },
      {
          type: 'Keyword',
          value: 'function',
          start: 25,
          end: 33,
          loc: {
              start: {
                  line: 1,
                  column: 25
              },
              end: {
                  line: 1,
                  column: 33
              }
          },
          range: [25, 33]
      },
      {
          type: 'Punctuator',
          value: '(',
          start: 34,
          end: 35,
          loc: {
              start: {
                  line: 1,
                  column: 34
              },
              end: {
                  line: 1,
                  column: 35
              }
          },
          range: [34, 35]
      },
      {
          type: 'Punctuator',
          value: ')',
          start: 35,
          end: 36,
          loc: {
              start: {
                  line: 1,
                  column: 35
              },
              end: {
                  line: 1,
                  column: 36
              }
          },
          range: [35, 36]
      },
      {
          type: 'Punctuator',
          value: ':',
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
          value: 'Promise',
          start: 38,
          end: 45,
          loc: {
              start: {
                  line: 1,
                  column: 38
              },
              end: {
                  line: 1,
                  column: 45
              }
          },
          range: [38, 45]
      },
      {
          type: 'Punctuator',
          value: '<',
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
          type: 'Keyword',
          value: 'void',
          start: 46,
          end: 50,
          loc: {
              start: {
                  line: 1,
                  column: 46
              },
              end: {
                  line: 1,
                  column: 50
              }
          },
          range: [46, 50]
      },
      {
          type: 'Punctuator',
          value: '>',
          start: 50,
          end: 51,
          loc: {
              start: {
                  line: 1,
                  column: 50
              },
              end: {
                  line: 1,
                  column: 51
              }
          },
          range: [50, 51]
      },
      {
          type: 'Punctuator',
          value: '{',
          start: 52,
          end: 53,
          loc: {
              start: {
                  line: 1,
                  column: 52
              },
              end: {
                  line: 1,
                  column: 53
              }
          },
          range: [52, 53]
      },
      {
          type: 'Keyword',
          value: 'return',
          start: 54,
          end: 60,
          loc: {
              start: {
                  line: 1,
                  column: 54
              },
              end: {
                  line: 1,
                  column: 60
              }
          },
          range: [54, 60]
      },
      {
          type: 'Identifier',
          value: 'Promise',
          start: 61,
          end: 68,
          loc: {
              start: {
                  line: 1,
                  column: 61
              },
              end: {
                  line: 1,
                  column: 68
              }
          },
          range: [61, 68]
      },
      {
          type: 'Punctuator',
          value: '.',
          start: 68,
          end: 69,
          loc: {
              start: {
                  line: 1,
                  column: 68
              },
              end: {
                  line: 1,
                  column: 69
              }
          },
          range: [68, 69]
      },
      {
          type: 'Identifier',
          value: 'resolve',
          start: 69,
          end: 76,
          loc: {
              start: {
                  line: 1,
                  column: 69
              },
              end: {
                  line: 1,
                  column: 76
              }
          },
          range: [69, 76]
      },
      {
          type: 'Punctuator',
          value: '(',
          start: 76,
          end: 77,
          loc: {
              start: {
                  line: 1,
                  column: 76
              },
              end: {
                  line: 1,
                  column: 77
              }
          },
          range: [76, 77]
      },
      {
          type: 'Punctuator',
          value: ')',
          start: 77,
          end: 78,
          loc: {
              start: {
                  line: 1,
                  column: 77
              },
              end: {
                  line: 1,
                  column: 78
              }
          },
          range: [77, 78]
      },
      {
          type: 'Punctuator',
          value: ';',
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
          value: '}',
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
          value: '(',
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
      },
      {
          type: 'Punctuator',
          value: ')',
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
          type: 'Punctuator',
          value: ';',
          start: 84,
          end: 85,
          loc: {
              start: {
                  line: 1,
                  column: 84
              },
              end: {
                  line: 1,
                  column: 85
              }
          },
          range: [84, 85]
      },
      {
          type: 'Punctuator',
          value: '}',
          start: 86,
          end: 87,
          loc: {
              start: {
                  line: 1,
                  column: 86
              },
              end: {
                  line: 1,
                  column: 87
              }
          },
          range: [86, 87]
      }
  ],
  sourceType: 'module',
  directives: undefined,
  body: [{
      type: 'FunctionDeclaration',
      start: 0,
      end: 87,
      loc: {
          start: {
              line: 1,
              column: 0
          },
          end: {
              line: 1,
              column: 87
          }
      },
      range: [0, 87],
      id: {
          type: 'Identifier',
          start: 15,
          end: 19,
          loc: {
              start: {
                  line: 1,
                  column: 15
              },
              end: {
                  line: 1,
                  column: 19
              },
              identifierName: 'wrap'
          },
          range: [15, 19],
          name: 'wrap',
          _babelType: 'Identifier',
      },
      generator: false,
      async: true,
      expression: false,
      params: [],
      body: {
          type: 'BlockStatement',
          start: 22,
          end: 87,
          loc: {
              start: {
                  line: 1,
                  column: 22
              },
              end: {
                  line: 1,
                  column: 87
              }
          },
          range: [22, 87],
          body: [{
              type: 'ExpressionStatement',
              start: 24,
              end: 85,
              loc: {
                  start: {
                      line: 1,
                      column: 24
                  },
                  end: {
                      line: 1,
                      column: 85
                  }
              },
              range: [24, 85],
              expression: {
                  type: 'CallExpression',
                  start: 24,
                  end: 84,
                  loc: {
                      start: {
                          line: 1,
                          column: 24
                      },
                      end: {
                          line: 1,
                          column: 84
                      }
                  },
                  range: [24, 84],
                  callee: {
                      type: 'FunctionExpression',
                      start: 25,
                      end: 81,
                      loc: {
                          start: {
                              line: 1,
                              column: 25
                          },
                          end: {
                              line: 1,
                              column: 81
                          }
                      },
                      range: [25, 81],
                      id: null,
                      generator: false,
                      async: false,
                      expression: false,
                      params: [],
                      predicate: null,
                      returnType: {
                          type: 'TypeAnnotation',
                          start: 36,
                          end: 51,
                          loc: {
                              start: {
                                  line: 1,
                                  column: 36
                              },
                              end: {
                                  line: 1,
                                  column: 51
                              }
                          },
                          range: [36, 51],
                          typeAnnotation: {
                              type: 'GenericTypeAnnotation',
                              start: 38,
                              end: 51,
                              loc: {
                                  start: {
                                      line: 1,
                                      column: 38
                                  },
                                  end: {
                                      line: 1,
                                      column: 51
                                  }
                              },
                              range: [38, 51],
                              typeParameters: {
                                  type: 'TypeParameterInstantiation',
                                  start: 45,
                                  end: 51,
                                  loc: {
                                      start: {
                                          line: 1,
                                          column: 45
                                      },
                                      end: {
                                          line: 1,
                                          column: 51
                                      }
                                  },
                                  range: [45, 51],
                                  params: [{
                                      type: 'VoidTypeAnnotation',
                                      start: 46,
                                      end: 50,
                                      loc: {
                                          start: {
                                              line: 1,
                                              column: 46
                                          },
                                          end: {
                                              line: 1,
                                              column: 50
                                          }
                                      },
                                      range: [46, 50],
                                      _babelType: 'VoidTypeAnnotation',
                                  }],
                                  _babelType: 'TypeParameterInstantiation',
                              },
                              id: {
                                  type: 'Identifier',
                                  start: 38,
                                  end: 45,
                                  loc: {
                                      start: {
                                          line: 1,
                                          column: 38
                                      },
                                      end: {
                                          line: 1,
                                          column: 45
                                      },
                                      identifierName: 'Promise'
                                  },
                                  range: [38, 45],
                                  name: 'Promise',
                                  _babelType: 'Identifier',
                              },
                              _babelType: 'GenericTypeAnnotation',
                          },
                          _babelType: 'TypeAnnotation',
                      },
                      body: {
                          type: 'BlockStatement',
                          start: 52,
                          end: 81,
                          loc: {
                              start: {
                                  line: 1,
                                  column: 52
                              },
                              end: {
                                  line: 1,
                                  column: 81
                              }
                          },
                          range: [52, 81],
                          body: [{
                              type: 'ReturnStatement',
                              start: 54,
                              end: 79,
                              loc: {
                                  start: {
                                      line: 1,
                                      column: 54
                                  },
                                  end: {
                                      line: 1,
                                      column: 79
                                  }
                              },
                              range: [54, 79],
                              argument: {
                                  type: 'CallExpression',
                                  start: 61,
                                  end: 78,
                                  loc: {
                                      start: {
                                          line: 1,
                                          column: 61
                                      },
                                      end: {
                                          line: 1,
                                          column: 78
                                      }
                                  },
                                  range: [61, 78],
                                  callee: {
                                      type: 'MemberExpression',
                                      start: 61,
                                      end: 76,
                                      loc: {
                                          start: {
                                              line: 1,
                                              column: 61
                                          },
                                          end: {
                                              line: 1,
                                              column: 76
                                          }
                                      },
                                      range: [61, 76],
                                      object: {
                                          type: 'Identifier',
                                          start: 61,
                                          end: 68,
                                          loc: {
                                              start: {
                                                  line: 1,
                                                  column: 61
                                              },
                                              end: {
                                                  line: 1,
                                                  column: 68
                                              },
                                              identifierName: 'Promise'
                                          },
                                          range: [61, 68],
                                          name: 'Promise',
                                          _babelType: 'Identifier',
                                      },
                                      property: {
                                          type: 'Identifier',
                                          start: 69,
                                          end: 76,
                                          loc: {
                                              start: {
                                                  line: 1,
                                                  column: 69
                                              },
                                              end: {
                                                  line: 1,
                                                  column: 76
                                              },
                                              identifierName: 'resolve'
                                          },
                                          range: [69, 76],
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
                      extra: {
                          parenthesized: true,
                          parenStart: 24
                      },
                      _babelType: 'FunctionExpression',
                  },
                  arguments: [],
                  _babelType: 'CallExpression',
              },
              _babelType: 'ExpressionStatement',
          }],
          _babelType: 'BlockStatement',
      },
      _babelType: 'FunctionDeclaration',
  }],
});
