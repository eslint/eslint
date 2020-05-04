"use strict";

/*
 * Parsed on astexplorer.net using @typescript-eslint/parser-2.6.1
 *
 * Source:
 * <T extends (A | B) & C>(): T => {};
 */

exports.parse = () => (
  {
    "type": "Program",
    "body": [
      {
        "type": "ExpressionStatement",
        "expression": {
          "type": "ArrowFunctionExpression",
          "generator": false,
          "id": null,
          "params": [],
          "body": {
            "type": "BlockStatement",
            "body": [],
            "range": [
              32,
              34
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 32
              },
              "end": {
                "line": 1,
                "column": 34
              }
            }
          },
          "async": false,
          "expression": false,
          "range": [
            0,
            34
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 1,
              "column": 34
            }
          },
          "returnType": {
            "type": "TSTypeAnnotation",
            "loc": {
              "start": {
                "line": 1,
                "column": 25
              },
              "end": {
                "line": 1,
                "column": 28
              }
            },
            "range": [
              25,
              28
            ],
            "typeAnnotation": {
              "type": "TSTypeReference",
              "typeName": {
                "type": "Identifier",
                "name": "T",
                "range": [
                  27,
                  28
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 27
                  },
                  "end": {
                    "line": 1,
                    "column": 28
                  }
                }
              },
              "range": [
                27,
                28
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 27
                },
                "end": {
                  "line": 1,
                  "column": 28
                }
              }
            }
          },
          "typeParameters": {
            "type": "TSTypeParameterDeclaration",
            "range": [
              0,
              23
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 0
              },
              "end": {
                "line": 1,
                "column": 23
              }
            },
            "params": [
              {
                "type": "TSTypeParameter",
                "name": {
                  "type": "Identifier",
                  "name": "T",
                  "range": [
                    1,
                    2
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 1
                    },
                    "end": {
                      "line": 1,
                      "column": 2
                    }
                  }
                },
                "constraint": {
                  "type": "TSIntersectionType",
                  "types": [
                    {
                      "type": "TSParenthesizedType",
                      "typeAnnotation": {
                        "type": "TSUnionType",
                        "types": [
                          {
                            "type": "TSTypeReference",
                            "typeName": {
                              "type": "Identifier",
                              "name": "A",
                              "range": [
                                12,
                                13
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 12
                                },
                                "end": {
                                  "line": 1,
                                  "column": 13
                                }
                              }
                            },
                            "range": [
                              12,
                              13
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 12
                              },
                              "end": {
                                "line": 1,
                                "column": 13
                              }
                            }
                          },
                          {
                            "type": "TSTypeReference",
                            "typeName": {
                              "type": "Identifier",
                              "name": "B",
                              "range": [
                                16,
                                17
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 16
                                },
                                "end": {
                                  "line": 1,
                                  "column": 17
                                }
                              }
                            },
                            "range": [
                              16,
                              17
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 16
                              },
                              "end": {
                                "line": 1,
                                "column": 17
                              }
                            }
                          }
                        ],
                        "range": [
                          12,
                          17
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 12
                          },
                          "end": {
                            "line": 1,
                            "column": 17
                          }
                        }
                      },
                      "range": [
                        11,
                        18
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 11
                        },
                        "end": {
                          "line": 1,
                          "column": 18
                        }
                      }
                    },
                    {
                      "type": "TSTypeReference",
                      "typeName": {
                        "type": "Identifier",
                        "name": "C",
                        "range": [
                          21,
                          22
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 21
                          },
                          "end": {
                            "line": 1,
                            "column": 22
                          }
                        }
                      },
                      "range": [
                        21,
                        22
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 21
                        },
                        "end": {
                          "line": 1,
                          "column": 22
                        }
                      }
                    }
                  ],
                  "range": [
                    11,
                    22
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 11
                    },
                    "end": {
                      "line": 1,
                      "column": 22
                    }
                  }
                },
                "range": [
                  1,
                  22
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 1
                  },
                  "end": {
                    "line": 1,
                    "column": 22
                  }
                }
              }
            ]
          }
        },
        "range": [
          0,
          35
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 35
          }
        }
      }
    ],
    "sourceType": "module",
    "range": [
      0,
      35
    ],
    "loc": {
      "start": {
        "line": 1,
        "column": 0
      },
      "end": {
        "line": 1,
        "column": 35
      }
    },
    "tokens": [
      {
        "type": "Punctuator",
        "value": "<",
        "range": [
          0,
          1
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 1
          }
        }
      },
      {
        "type": "Identifier",
        "value": "T",
        "range": [
          1,
          2
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 1
          },
          "end": {
            "line": 1,
            "column": 2
          }
        }
      },
      {
        "type": "Keyword",
        "value": "extends",
        "range": [
          3,
          10
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 3
          },
          "end": {
            "line": 1,
            "column": 10
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "(",
        "range": [
          11,
          12
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 11
          },
          "end": {
            "line": 1,
            "column": 12
          }
        }
      },
      {
        "type": "Identifier",
        "value": "A",
        "range": [
          12,
          13
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 12
          },
          "end": {
            "line": 1,
            "column": 13
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "|",
        "range": [
          14,
          15
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 14
          },
          "end": {
            "line": 1,
            "column": 15
          }
        }
      },
      {
        "type": "Identifier",
        "value": "B",
        "range": [
          16,
          17
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 16
          },
          "end": {
            "line": 1,
            "column": 17
          }
        }
      },
      {
        "type": "Punctuator",
        "value": ")",
        "range": [
          17,
          18
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 17
          },
          "end": {
            "line": 1,
            "column": 18
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "&",
        "range": [
          19,
          20
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 19
          },
          "end": {
            "line": 1,
            "column": 20
          }
        }
      },
      {
        "type": "Identifier",
        "value": "C",
        "range": [
          21,
          22
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 21
          },
          "end": {
            "line": 1,
            "column": 22
          }
        }
      },
      {
        "type": "Punctuator",
        "value": ">",
        "range": [
          22,
          23
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 22
          },
          "end": {
            "line": 1,
            "column": 23
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "(",
        "range": [
          23,
          24
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 23
          },
          "end": {
            "line": 1,
            "column": 24
          }
        }
      },
      {
        "type": "Punctuator",
        "value": ")",
        "range": [
          24,
          25
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 24
          },
          "end": {
            "line": 1,
            "column": 25
          }
        }
      },
      {
        "type": "Punctuator",
        "value": ":",
        "range": [
          25,
          26
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 25
          },
          "end": {
            "line": 1,
            "column": 26
          }
        }
      },
      {
        "type": "Identifier",
        "value": "T",
        "range": [
          27,
          28
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 27
          },
          "end": {
            "line": 1,
            "column": 28
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "=>",
        "range": [
          29,
          31
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 29
          },
          "end": {
            "line": 1,
            "column": 31
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "{",
        "range": [
          32,
          33
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 32
          },
          "end": {
            "line": 1,
            "column": 33
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "}",
        "range": [
          33,
          34
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 33
          },
          "end": {
            "line": 1,
            "column": 34
          }
        }
      },
      {
        "type": "Punctuator",
        "value": ";",
        "range": [
          34,
          35
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 34
          },
          "end": {
            "line": 1,
            "column": 35
          }
        }
      }
    ],
    "comments": []
  }
)