"use strict";

/*
 * Parsed on astexplorer.net using @typescript-eslint/parser-2.6.1
 *
 * Source:
 * <T extends (A | B) & C>(a: (string | number)): T => {};
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
          "params": [
            {
              "type": "Identifier",
              "name": "a",
              "range": [
                24,
                44
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 24
                },
                "end": {
                  "line": 1,
                  "column": 44
                }
              },
              "typeAnnotation": {
                "type": "TSTypeAnnotation",
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 25
                  },
                  "end": {
                    "line": 1,
                    "column": 44
                  }
                },
                "range": [
                  25,
                  44
                ],
                "typeAnnotation": {
                  "type": "TSParenthesizedType",
                  "typeAnnotation": {
                    "type": "TSUnionType",
                    "types": [
                      {
                        "type": "TSStringKeyword",
                        "range": [
                          28,
                          34
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 28
                          },
                          "end": {
                            "line": 1,
                            "column": 34
                          }
                        }
                      },
                      {
                        "type": "TSNumberKeyword",
                        "range": [
                          37,
                          43
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 37
                          },
                          "end": {
                            "line": 1,
                            "column": 43
                          }
                        }
                      }
                    ],
                    "range": [
                      28,
                      43
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 28
                      },
                      "end": {
                        "line": 1,
                        "column": 43
                      }
                    }
                  },
                  "range": [
                    27,
                    44
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 27
                    },
                    "end": {
                      "line": 1,
                      "column": 44
                    }
                  }
                }
              }
            }
          ],
          "body": {
            "type": "BlockStatement",
            "body": [],
            "range": [
              52,
              54
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 52
              },
              "end": {
                "line": 1,
                "column": 54
              }
            }
          },
          "async": false,
          "expression": false,
          "range": [
            0,
            54
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 1,
              "column": 54
            }
          },
          "returnType": {
            "type": "TSTypeAnnotation",
            "loc": {
              "start": {
                "line": 1,
                "column": 45
              },
              "end": {
                "line": 1,
                "column": 48
              }
            },
            "range": [
              45,
              48
            ],
            "typeAnnotation": {
              "type": "TSTypeReference",
              "typeName": {
                "type": "Identifier",
                "name": "T",
                "range": [
                  47,
                  48
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 47
                  },
                  "end": {
                    "line": 1,
                    "column": 48
                  }
                }
              },
              "range": [
                47,
                48
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 47
                },
                "end": {
                  "line": 1,
                  "column": 48
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
          55
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 55
          }
        }
      }
    ],
    "sourceType": "module",
    "range": [
      0,
      55
    ],
    "loc": {
      "start": {
        "line": 1,
        "column": 0
      },
      "end": {
        "line": 1,
        "column": 55
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
        "type": "Identifier",
        "value": "a",
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
        "type": "Punctuator",
        "value": "(",
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
        "type": "Identifier",
        "value": "string",
        "range": [
          28,
          34
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 28
          },
          "end": {
            "line": 1,
            "column": 34
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "|",
        "range": [
          35,
          36
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 35
          },
          "end": {
            "line": 1,
            "column": 36
          }
        }
      },
      {
        "type": "Identifier",
        "value": "number",
        "range": [
          37,
          43
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 37
          },
          "end": {
            "line": 1,
            "column": 43
          }
        }
      },
      {
        "type": "Punctuator",
        "value": ")",
        "range": [
          43,
          44
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 43
          },
          "end": {
            "line": 1,
            "column": 44
          }
        }
      },
      {
        "type": "Punctuator",
        "value": ")",
        "range": [
          44,
          45
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 44
          },
          "end": {
            "line": 1,
            "column": 45
          }
        }
      },
      {
        "type": "Punctuator",
        "value": ":",
        "range": [
          45,
          46
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 45
          },
          "end": {
            "line": 1,
            "column": 46
          }
        }
      },
      {
        "type": "Identifier",
        "value": "T",
        "range": [
          47,
          48
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 47
          },
          "end": {
            "line": 1,
            "column": 48
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "=>",
        "range": [
          49,
          51
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 49
          },
          "end": {
            "line": 1,
            "column": 51
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "{",
        "range": [
          52,
          53
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 52
          },
          "end": {
            "line": 1,
            "column": 53
          }
        }
      },
      {
        "type": "Punctuator",
        "value": "}",
        "range": [
          53,
          54
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 53
          },
          "end": {
            "line": 1,
            "column": 54
          }
        }
      },
      {
        "type": "Punctuator",
        "value": ";",
        "range": [
          54,
          55
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 54
          },
          "end": {
            "line": 1,
            "column": 55
          }
        }
      }
    ],
    "comments": []
  }
)