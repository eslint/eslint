"use strict";

// class A extends (B as any) { constructor() { super(); } }

exports.parse = () => ({
  "type": "Program",
  "range": [
    0,
    57
  ],
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 1,
      "column": 57
    }
  },
  "sourceType": "module",
  "body": [
    {
      "type": "ClassDeclaration",
      "range": [
        0,
        57
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 1,
          "column": 57
        }
      },
      "superClass": {
        "type": "TSAsExpression",
        "range": [
          17,
          25
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 17
          },
          "end": {
            "line": 1,
            "column": 25
          }
        },
        "expression": {
          "type": "Identifier",
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
          },
          "name": "B",
          "parent": {
            "type": "Identifier",
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
            },
            "name": "B"
          }
        },
        "typeAnnotation": {
          "type": "TSAnyKeyword",
          "range": [
            22,
            25
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 22
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "parent": {
            "type": "TSAnyKeyword",
            "range": [
              22,
              25
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 22
              },
              "end": {
                "line": 1,
                "column": 25
              }
            }
          }
        },
        "parent": {
          "type": "TSAsExpression",
          "range": [
            17,
            25
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 17
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "expression": {
            "type": "Identifier",
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
            },
            "name": "B",
            "parent": {
              "type": "Identifier",
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
              },
              "name": "B"
            }
          },
          "typeAnnotation": {
            "type": "TSAnyKeyword",
            "range": [
              22,
              25
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 22
              },
              "end": {
                "line": 1,
                "column": 25
              }
            },
            "parent": {
              "type": "TSAnyKeyword",
              "range": [
                22,
                25
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 22
                },
                "end": {
                  "line": 1,
                  "column": 25
                }
              }
            }
          }
        }
      },
      "id": {
        "type": "Identifier",
        "range": [
          6,
          7
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 6
          },
          "end": {
            "line": 1,
            "column": 7
          }
        },
        "name": "A",
        "parent": {
          "type": "Identifier",
          "range": [
            6,
            7
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 6
            },
            "end": {
              "line": 1,
              "column": 7
            }
          },
          "name": "A"
        }
      },
      "body": {
        "type": "ClassBody",
        "range": [
          27,
          57
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 27
          },
          "end": {
            "line": 1,
            "column": 57
          }
        },
        "body": [
          {
            "type": "MethodDefinition",
            "range": [
              29,
              55
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 29
              },
              "end": {
                "line": 1,
                "column": 55
              }
            },
            "kind": "constructor",
            "computed": false,
            "static": false,
            "value": {
              "type": "FunctionExpression",
              "range": [
                40,
                55
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 40
                },
                "end": {
                  "line": 1,
                  "column": 55
                }
              },
              "generator": false,
              "expression": false,
              "async": false,
              "params": [],
              "body": {
                "type": "BlockStatement",
                "range": [
                  43,
                  55
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 43
                  },
                  "end": {
                    "line": 1,
                    "column": 55
                  }
                },
                "body": [
                  {
                    "type": "ExpressionStatement",
                    "range": [
                      45,
                      53
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 45
                      },
                      "end": {
                        "line": 1,
                        "column": 53
                      }
                    },
                    "expression": {
                      "type": "CallExpression",
                      "range": [
                        45,
                        52
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 45
                        },
                        "end": {
                          "line": 1,
                          "column": 52
                        }
                      },
                      "callee": {
                        "type": "Super",
                        "range": [
                          45,
                          50
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 50
                          }
                        },
                        "parent": {
                          "type": "Super",
                          "range": [
                            45,
                            50
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 50
                            }
                          }
                        }
                      },
                      "arguments": [],
                      "parent": {
                        "type": "CallExpression",
                        "range": [
                          45,
                          52
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 52
                          }
                        },
                        "callee": {
                          "type": "Super",
                          "range": [
                            45,
                            50
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 50
                            }
                          },
                          "parent": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            }
                          }
                        },
                        "arguments": []
                      }
                    },
                    "parent": {
                      "type": "ExpressionStatement",
                      "range": [
                        45,
                        53
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 45
                        },
                        "end": {
                          "line": 1,
                          "column": 53
                        }
                      },
                      "expression": {
                        "type": "CallExpression",
                        "range": [
                          45,
                          52
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 52
                          }
                        },
                        "callee": {
                          "type": "Super",
                          "range": [
                            45,
                            50
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 50
                            }
                          },
                          "parent": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            }
                          }
                        },
                        "arguments": [],
                        "parent": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": []
                        }
                      }
                    }
                  }
                ],
                "parent": {
                  "type": "BlockStatement",
                  "range": [
                    43,
                    55
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 43
                    },
                    "end": {
                      "line": 1,
                      "column": 55
                    }
                  },
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "range": [
                        45,
                        53
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 45
                        },
                        "end": {
                          "line": 1,
                          "column": 53
                        }
                      },
                      "expression": {
                        "type": "CallExpression",
                        "range": [
                          45,
                          52
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 52
                          }
                        },
                        "callee": {
                          "type": "Super",
                          "range": [
                            45,
                            50
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 50
                            }
                          },
                          "parent": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            }
                          }
                        },
                        "arguments": [],
                        "parent": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": []
                        }
                      },
                      "parent": {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        }
                      }
                    }
                  ]
                }
              },
              "parent": {
                "type": "FunctionExpression",
                "range": [
                  40,
                  55
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 40
                  },
                  "end": {
                    "line": 1,
                    "column": 55
                  }
                },
                "generator": false,
                "expression": false,
                "async": false,
                "params": [],
                "body": {
                  "type": "BlockStatement",
                  "range": [
                    43,
                    55
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 43
                    },
                    "end": {
                      "line": 1,
                      "column": 55
                    }
                  },
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "range": [
                        45,
                        53
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 45
                        },
                        "end": {
                          "line": 1,
                          "column": 53
                        }
                      },
                      "expression": {
                        "type": "CallExpression",
                        "range": [
                          45,
                          52
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 52
                          }
                        },
                        "callee": {
                          "type": "Super",
                          "range": [
                            45,
                            50
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 50
                            }
                          },
                          "parent": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            }
                          }
                        },
                        "arguments": [],
                        "parent": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": []
                        }
                      },
                      "parent": {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        }
                      }
                    }
                  ],
                  "parent": {
                    "type": "BlockStatement",
                    "range": [
                      43,
                      55
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 43
                      },
                      "end": {
                        "line": 1,
                        "column": 55
                      }
                    },
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        },
                        "parent": {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "parent": {
              "type": "MethodDefinition",
              "range": [
                29,
                55
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 29
                },
                "end": {
                  "line": 1,
                  "column": 55
                }
              },
              "kind": "constructor",
              "computed": false,
              "static": false,
              "value": {
                "type": "FunctionExpression",
                "range": [
                  40,
                  55
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 40
                  },
                  "end": {
                    "line": 1,
                    "column": 55
                  }
                },
                "generator": false,
                "expression": false,
                "async": false,
                "params": [],
                "body": {
                  "type": "BlockStatement",
                  "range": [
                    43,
                    55
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 43
                    },
                    "end": {
                      "line": 1,
                      "column": 55
                    }
                  },
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "range": [
                        45,
                        53
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 45
                        },
                        "end": {
                          "line": 1,
                          "column": 53
                        }
                      },
                      "expression": {
                        "type": "CallExpression",
                        "range": [
                          45,
                          52
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 52
                          }
                        },
                        "callee": {
                          "type": "Super",
                          "range": [
                            45,
                            50
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 50
                            }
                          },
                          "parent": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            }
                          }
                        },
                        "arguments": [],
                        "parent": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": []
                        }
                      },
                      "parent": {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        }
                      }
                    }
                  ],
                  "parent": {
                    "type": "BlockStatement",
                    "range": [
                      43,
                      55
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 43
                      },
                      "end": {
                        "line": 1,
                        "column": 55
                      }
                    },
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        },
                        "parent": {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                "parent": {
                  "type": "FunctionExpression",
                  "range": [
                    40,
                    55
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 40
                    },
                    "end": {
                      "line": 1,
                      "column": 55
                    }
                  },
                  "generator": false,
                  "expression": false,
                  "async": false,
                  "params": [],
                  "body": {
                    "type": "BlockStatement",
                    "range": [
                      43,
                      55
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 43
                      },
                      "end": {
                        "line": 1,
                        "column": 55
                      }
                    },
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        },
                        "parent": {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          }
                        }
                      }
                    ],
                    "parent": {
                      "type": "BlockStatement",
                      "range": [
                        43,
                        55
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 43
                        },
                        "end": {
                          "line": 1,
                          "column": 55
                        }
                      },
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          },
                          "parent": {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              }
            }
          }
        ],
        "parent": {
          "type": "ClassBody",
          "range": [
            27,
            57
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 27
            },
            "end": {
              "line": 1,
              "column": 57
            }
          },
          "body": [
            {
              "type": "MethodDefinition",
              "range": [
                29,
                55
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 29
                },
                "end": {
                  "line": 1,
                  "column": 55
                }
              },
              "kind": "constructor",
              "computed": false,
              "static": false,
              "value": {
                "type": "FunctionExpression",
                "range": [
                  40,
                  55
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 40
                  },
                  "end": {
                    "line": 1,
                    "column": 55
                  }
                },
                "generator": false,
                "expression": false,
                "async": false,
                "params": [],
                "body": {
                  "type": "BlockStatement",
                  "range": [
                    43,
                    55
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 43
                    },
                    "end": {
                      "line": 1,
                      "column": 55
                    }
                  },
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "range": [
                        45,
                        53
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 45
                        },
                        "end": {
                          "line": 1,
                          "column": 53
                        }
                      },
                      "expression": {
                        "type": "CallExpression",
                        "range": [
                          45,
                          52
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 52
                          }
                        },
                        "callee": {
                          "type": "Super",
                          "range": [
                            45,
                            50
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 50
                            }
                          },
                          "parent": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            }
                          }
                        },
                        "arguments": [],
                        "parent": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": []
                        }
                      },
                      "parent": {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        }
                      }
                    }
                  ],
                  "parent": {
                    "type": "BlockStatement",
                    "range": [
                      43,
                      55
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 43
                      },
                      "end": {
                        "line": 1,
                        "column": 55
                      }
                    },
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        },
                        "parent": {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                "parent": {
                  "type": "FunctionExpression",
                  "range": [
                    40,
                    55
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 40
                    },
                    "end": {
                      "line": 1,
                      "column": 55
                    }
                  },
                  "generator": false,
                  "expression": false,
                  "async": false,
                  "params": [],
                  "body": {
                    "type": "BlockStatement",
                    "range": [
                      43,
                      55
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 43
                      },
                      "end": {
                        "line": 1,
                        "column": 55
                      }
                    },
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        },
                        "parent": {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          }
                        }
                      }
                    ],
                    "parent": {
                      "type": "BlockStatement",
                      "range": [
                        43,
                        55
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 43
                        },
                        "end": {
                          "line": 1,
                          "column": 55
                        }
                      },
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          },
                          "parent": {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              },
              "parent": {
                "type": "MethodDefinition",
                "range": [
                  29,
                  55
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 29
                  },
                  "end": {
                    "line": 1,
                    "column": 55
                  }
                },
                "kind": "constructor",
                "computed": false,
                "static": false,
                "value": {
                  "type": "FunctionExpression",
                  "range": [
                    40,
                    55
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 40
                    },
                    "end": {
                      "line": 1,
                      "column": 55
                    }
                  },
                  "generator": false,
                  "expression": false,
                  "async": false,
                  "params": [],
                  "body": {
                    "type": "BlockStatement",
                    "range": [
                      43,
                      55
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 43
                      },
                      "end": {
                        "line": 1,
                        "column": 55
                      }
                    },
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        },
                        "parent": {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          }
                        }
                      }
                    ],
                    "parent": {
                      "type": "BlockStatement",
                      "range": [
                        43,
                        55
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 43
                        },
                        "end": {
                          "line": 1,
                          "column": 55
                        }
                      },
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          },
                          "parent": {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            }
                          }
                        }
                      ]
                    }
                  },
                  "parent": {
                    "type": "FunctionExpression",
                    "range": [
                      40,
                      55
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 40
                      },
                      "end": {
                        "line": 1,
                        "column": 55
                      }
                    },
                    "generator": false,
                    "expression": false,
                    "async": false,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "range": [
                        43,
                        55
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 43
                        },
                        "end": {
                          "line": 1,
                          "column": 55
                        }
                      },
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          },
                          "parent": {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            }
                          }
                        }
                      ],
                      "parent": {
                        "type": "BlockStatement",
                        "range": [
                          43,
                          55
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 43
                          },
                          "end": {
                            "line": 1,
                            "column": 55
                          }
                        },
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            },
                            "parent": {
                              "type": "ExpressionStatement",
                              "range": [
                                45,
                                53
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 53
                                }
                              },
                              "expression": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": [],
                                "parent": {
                                  "type": "CallExpression",
                                  "range": [
                                    45,
                                    52
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 52
                                    }
                                  },
                                  "callee": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    },
                                    "parent": {
                                      "type": "Super",
                                      "range": [
                                        45,
                                        50
                                      ],
                                      "loc": {
                                        "start": {
                                          "line": 1,
                                          "column": 45
                                        },
                                        "end": {
                                          "line": 1,
                                          "column": 50
                                        }
                                      }
                                    }
                                  },
                                  "arguments": []
                                }
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          ]
        }
      },
      "parent": {
        "type": "ClassDeclaration",
        "range": [
          0,
          57
        ],
        "loc": {
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 57
          }
        },
        "superClass": {
          "type": "TSAsExpression",
          "range": [
            17,
            25
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 17
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "expression": {
            "type": "Identifier",
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
            },
            "name": "B",
            "parent": {
              "type": "Identifier",
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
              },
              "name": "B"
            }
          },
          "typeAnnotation": {
            "type": "TSAnyKeyword",
            "range": [
              22,
              25
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 22
              },
              "end": {
                "line": 1,
                "column": 25
              }
            },
            "parent": {
              "type": "TSAnyKeyword",
              "range": [
                22,
                25
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 22
                },
                "end": {
                  "line": 1,
                  "column": 25
                }
              }
            }
          },
          "parent": {
            "type": "TSAsExpression",
            "range": [
              17,
              25
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 17
              },
              "end": {
                "line": 1,
                "column": 25
              }
            },
            "expression": {
              "type": "Identifier",
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
              },
              "name": "B",
              "parent": {
                "type": "Identifier",
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
                },
                "name": "B"
              }
            },
            "typeAnnotation": {
              "type": "TSAnyKeyword",
              "range": [
                22,
                25
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 22
                },
                "end": {
                  "line": 1,
                  "column": 25
                }
              },
              "parent": {
                "type": "TSAnyKeyword",
                "range": [
                  22,
                  25
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 22
                  },
                  "end": {
                    "line": 1,
                    "column": 25
                  }
                }
              }
            }
          }
        },
        "id": {
          "type": "Identifier",
          "range": [
            6,
            7
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 6
            },
            "end": {
              "line": 1,
              "column": 7
            }
          },
          "name": "A",
          "parent": {
            "type": "Identifier",
            "range": [
              6,
              7
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 6
              },
              "end": {
                "line": 1,
                "column": 7
              }
            },
            "name": "A"
          }
        },
        "body": {
          "type": "ClassBody",
          "range": [
            27,
            57
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 27
            },
            "end": {
              "line": 1,
              "column": 57
            }
          },
          "body": [
            {
              "type": "MethodDefinition",
              "range": [
                29,
                55
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 29
                },
                "end": {
                  "line": 1,
                  "column": 55
                }
              },
              "kind": "constructor",
              "computed": false,
              "static": false,
              "value": {
                "type": "FunctionExpression",
                "range": [
                  40,
                  55
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 40
                  },
                  "end": {
                    "line": 1,
                    "column": 55
                  }
                },
                "generator": false,
                "expression": false,
                "async": false,
                "params": [],
                "body": {
                  "type": "BlockStatement",
                  "range": [
                    43,
                    55
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 43
                    },
                    "end": {
                      "line": 1,
                      "column": 55
                    }
                  },
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "range": [
                        45,
                        53
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 45
                        },
                        "end": {
                          "line": 1,
                          "column": 53
                        }
                      },
                      "expression": {
                        "type": "CallExpression",
                        "range": [
                          45,
                          52
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 52
                          }
                        },
                        "callee": {
                          "type": "Super",
                          "range": [
                            45,
                            50
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 50
                            }
                          },
                          "parent": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            }
                          }
                        },
                        "arguments": [],
                        "parent": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": []
                        }
                      },
                      "parent": {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        }
                      }
                    }
                  ],
                  "parent": {
                    "type": "BlockStatement",
                    "range": [
                      43,
                      55
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 43
                      },
                      "end": {
                        "line": 1,
                        "column": 55
                      }
                    },
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        },
                        "parent": {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                "parent": {
                  "type": "FunctionExpression",
                  "range": [
                    40,
                    55
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 40
                    },
                    "end": {
                      "line": 1,
                      "column": 55
                    }
                  },
                  "generator": false,
                  "expression": false,
                  "async": false,
                  "params": [],
                  "body": {
                    "type": "BlockStatement",
                    "range": [
                      43,
                      55
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 43
                      },
                      "end": {
                        "line": 1,
                        "column": 55
                      }
                    },
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        },
                        "parent": {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          }
                        }
                      }
                    ],
                    "parent": {
                      "type": "BlockStatement",
                      "range": [
                        43,
                        55
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 43
                        },
                        "end": {
                          "line": 1,
                          "column": 55
                        }
                      },
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          },
                          "parent": {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              },
              "parent": {
                "type": "MethodDefinition",
                "range": [
                  29,
                  55
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 29
                  },
                  "end": {
                    "line": 1,
                    "column": 55
                  }
                },
                "kind": "constructor",
                "computed": false,
                "static": false,
                "value": {
                  "type": "FunctionExpression",
                  "range": [
                    40,
                    55
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 40
                    },
                    "end": {
                      "line": 1,
                      "column": 55
                    }
                  },
                  "generator": false,
                  "expression": false,
                  "async": false,
                  "params": [],
                  "body": {
                    "type": "BlockStatement",
                    "range": [
                      43,
                      55
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 43
                      },
                      "end": {
                        "line": 1,
                        "column": 55
                      }
                    },
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        },
                        "parent": {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          }
                        }
                      }
                    ],
                    "parent": {
                      "type": "BlockStatement",
                      "range": [
                        43,
                        55
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 43
                        },
                        "end": {
                          "line": 1,
                          "column": 55
                        }
                      },
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          },
                          "parent": {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            }
                          }
                        }
                      ]
                    }
                  },
                  "parent": {
                    "type": "FunctionExpression",
                    "range": [
                      40,
                      55
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 40
                      },
                      "end": {
                        "line": 1,
                        "column": 55
                      }
                    },
                    "generator": false,
                    "expression": false,
                    "async": false,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "range": [
                        43,
                        55
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 43
                        },
                        "end": {
                          "line": 1,
                          "column": 55
                        }
                      },
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          },
                          "parent": {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            }
                          }
                        }
                      ],
                      "parent": {
                        "type": "BlockStatement",
                        "range": [
                          43,
                          55
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 43
                          },
                          "end": {
                            "line": 1,
                            "column": 55
                          }
                        },
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            },
                            "parent": {
                              "type": "ExpressionStatement",
                              "range": [
                                45,
                                53
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 53
                                }
                              },
                              "expression": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": [],
                                "parent": {
                                  "type": "CallExpression",
                                  "range": [
                                    45,
                                    52
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 52
                                    }
                                  },
                                  "callee": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    },
                                    "parent": {
                                      "type": "Super",
                                      "range": [
                                        45,
                                        50
                                      ],
                                      "loc": {
                                        "start": {
                                          "line": 1,
                                          "column": 45
                                        },
                                        "end": {
                                          "line": 1,
                                          "column": 50
                                        }
                                      }
                                    }
                                  },
                                  "arguments": []
                                }
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          ],
          "parent": {
            "type": "ClassBody",
            "range": [
              27,
              57
            ],
            "loc": {
              "start": {
                "line": 1,
                "column": 27
              },
              "end": {
                "line": 1,
                "column": 57
              }
            },
            "body": [
              {
                "type": "MethodDefinition",
                "range": [
                  29,
                  55
                ],
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 29
                  },
                  "end": {
                    "line": 1,
                    "column": 55
                  }
                },
                "kind": "constructor",
                "computed": false,
                "static": false,
                "value": {
                  "type": "FunctionExpression",
                  "range": [
                    40,
                    55
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 40
                    },
                    "end": {
                      "line": 1,
                      "column": 55
                    }
                  },
                  "generator": false,
                  "expression": false,
                  "async": false,
                  "params": [],
                  "body": {
                    "type": "BlockStatement",
                    "range": [
                      43,
                      55
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 43
                      },
                      "end": {
                        "line": 1,
                        "column": 55
                      }
                    },
                    "body": [
                      {
                        "type": "ExpressionStatement",
                        "range": [
                          45,
                          53
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 45
                          },
                          "end": {
                            "line": 1,
                            "column": 53
                          }
                        },
                        "expression": {
                          "type": "CallExpression",
                          "range": [
                            45,
                            52
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 52
                            }
                          },
                          "callee": {
                            "type": "Super",
                            "range": [
                              45,
                              50
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 50
                              }
                            },
                            "parent": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              }
                            }
                          },
                          "arguments": [],
                          "parent": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": []
                          }
                        },
                        "parent": {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          }
                        }
                      }
                    ],
                    "parent": {
                      "type": "BlockStatement",
                      "range": [
                        43,
                        55
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 43
                        },
                        "end": {
                          "line": 1,
                          "column": 55
                        }
                      },
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          },
                          "parent": {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            }
                          }
                        }
                      ]
                    }
                  },
                  "parent": {
                    "type": "FunctionExpression",
                    "range": [
                      40,
                      55
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 40
                      },
                      "end": {
                        "line": 1,
                        "column": 55
                      }
                    },
                    "generator": false,
                    "expression": false,
                    "async": false,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "range": [
                        43,
                        55
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 43
                        },
                        "end": {
                          "line": 1,
                          "column": 55
                        }
                      },
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          },
                          "parent": {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            }
                          }
                        }
                      ],
                      "parent": {
                        "type": "BlockStatement",
                        "range": [
                          43,
                          55
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 43
                          },
                          "end": {
                            "line": 1,
                            "column": 55
                          }
                        },
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            },
                            "parent": {
                              "type": "ExpressionStatement",
                              "range": [
                                45,
                                53
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 53
                                }
                              },
                              "expression": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": [],
                                "parent": {
                                  "type": "CallExpression",
                                  "range": [
                                    45,
                                    52
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 52
                                    }
                                  },
                                  "callee": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    },
                                    "parent": {
                                      "type": "Super",
                                      "range": [
                                        45,
                                        50
                                      ],
                                      "loc": {
                                        "start": {
                                          "line": 1,
                                          "column": 45
                                        },
                                        "end": {
                                          "line": 1,
                                          "column": 50
                                        }
                                      }
                                    }
                                  },
                                  "arguments": []
                                }
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                },
                "parent": {
                  "type": "MethodDefinition",
                  "range": [
                    29,
                    55
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 29
                    },
                    "end": {
                      "line": 1,
                      "column": 55
                    }
                  },
                  "kind": "constructor",
                  "computed": false,
                  "static": false,
                  "value": {
                    "type": "FunctionExpression",
                    "range": [
                      40,
                      55
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 40
                      },
                      "end": {
                        "line": 1,
                        "column": 55
                      }
                    },
                    "generator": false,
                    "expression": false,
                    "async": false,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "range": [
                        43,
                        55
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 43
                        },
                        "end": {
                          "line": 1,
                          "column": 55
                        }
                      },
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "range": [
                            45,
                            53
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 45
                            },
                            "end": {
                              "line": 1,
                              "column": 53
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "range": [
                              45,
                              52
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 52
                              }
                            },
                            "callee": {
                              "type": "Super",
                              "range": [
                                45,
                                50
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 50
                                }
                              },
                              "parent": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                }
                              }
                            },
                            "arguments": [],
                            "parent": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": []
                            }
                          },
                          "parent": {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            }
                          }
                        }
                      ],
                      "parent": {
                        "type": "BlockStatement",
                        "range": [
                          43,
                          55
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 43
                          },
                          "end": {
                            "line": 1,
                            "column": 55
                          }
                        },
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            },
                            "parent": {
                              "type": "ExpressionStatement",
                              "range": [
                                45,
                                53
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 53
                                }
                              },
                              "expression": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": [],
                                "parent": {
                                  "type": "CallExpression",
                                  "range": [
                                    45,
                                    52
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 52
                                    }
                                  },
                                  "callee": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    },
                                    "parent": {
                                      "type": "Super",
                                      "range": [
                                        45,
                                        50
                                      ],
                                      "loc": {
                                        "start": {
                                          "line": 1,
                                          "column": 45
                                        },
                                        "end": {
                                          "line": 1,
                                          "column": 50
                                        }
                                      }
                                    }
                                  },
                                  "arguments": []
                                }
                              }
                            }
                          }
                        ]
                      }
                    },
                    "parent": {
                      "type": "FunctionExpression",
                      "range": [
                        40,
                        55
                      ],
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 40
                        },
                        "end": {
                          "line": 1,
                          "column": 55
                        }
                      },
                      "generator": false,
                      "expression": false,
                      "async": false,
                      "params": [],
                      "body": {
                        "type": "BlockStatement",
                        "range": [
                          43,
                          55
                        ],
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 43
                          },
                          "end": {
                            "line": 1,
                            "column": 55
                          }
                        },
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "range": [
                              45,
                              53
                            ],
                            "loc": {
                              "start": {
                                "line": 1,
                                "column": 45
                              },
                              "end": {
                                "line": 1,
                                "column": 53
                              }
                            },
                            "expression": {
                              "type": "CallExpression",
                              "range": [
                                45,
                                52
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 52
                                }
                              },
                              "callee": {
                                "type": "Super",
                                "range": [
                                  45,
                                  50
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 50
                                  }
                                },
                                "parent": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  }
                                }
                              },
                              "arguments": [],
                              "parent": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": []
                              }
                            },
                            "parent": {
                              "type": "ExpressionStatement",
                              "range": [
                                45,
                                53
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 53
                                }
                              },
                              "expression": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": [],
                                "parent": {
                                  "type": "CallExpression",
                                  "range": [
                                    45,
                                    52
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 52
                                    }
                                  },
                                  "callee": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    },
                                    "parent": {
                                      "type": "Super",
                                      "range": [
                                        45,
                                        50
                                      ],
                                      "loc": {
                                        "start": {
                                          "line": 1,
                                          "column": 45
                                        },
                                        "end": {
                                          "line": 1,
                                          "column": 50
                                        }
                                      }
                                    }
                                  },
                                  "arguments": []
                                }
                              }
                            }
                          }
                        ],
                        "parent": {
                          "type": "BlockStatement",
                          "range": [
                            43,
                            55
                          ],
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 43
                            },
                            "end": {
                              "line": 1,
                              "column": 55
                            }
                          },
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "range": [
                                45,
                                53
                              ],
                              "loc": {
                                "start": {
                                  "line": 1,
                                  "column": 45
                                },
                                "end": {
                                  "line": 1,
                                  "column": 53
                                }
                              },
                              "expression": {
                                "type": "CallExpression",
                                "range": [
                                  45,
                                  52
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 52
                                  }
                                },
                                "callee": {
                                  "type": "Super",
                                  "range": [
                                    45,
                                    50
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 50
                                    }
                                  },
                                  "parent": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    }
                                  }
                                },
                                "arguments": [],
                                "parent": {
                                  "type": "CallExpression",
                                  "range": [
                                    45,
                                    52
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 52
                                    }
                                  },
                                  "callee": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    },
                                    "parent": {
                                      "type": "Super",
                                      "range": [
                                        45,
                                        50
                                      ],
                                      "loc": {
                                        "start": {
                                          "line": 1,
                                          "column": 45
                                        },
                                        "end": {
                                          "line": 1,
                                          "column": 50
                                        }
                                      }
                                    }
                                  },
                                  "arguments": []
                                }
                              },
                              "parent": {
                                "type": "ExpressionStatement",
                                "range": [
                                  45,
                                  53
                                ],
                                "loc": {
                                  "start": {
                                    "line": 1,
                                    "column": 45
                                  },
                                  "end": {
                                    "line": 1,
                                    "column": 53
                                  }
                                },
                                "expression": {
                                  "type": "CallExpression",
                                  "range": [
                                    45,
                                    52
                                  ],
                                  "loc": {
                                    "start": {
                                      "line": 1,
                                      "column": 45
                                    },
                                    "end": {
                                      "line": 1,
                                      "column": 52
                                    }
                                  },
                                  "callee": {
                                    "type": "Super",
                                    "range": [
                                      45,
                                      50
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 50
                                      }
                                    },
                                    "parent": {
                                      "type": "Super",
                                      "range": [
                                        45,
                                        50
                                      ],
                                      "loc": {
                                        "start": {
                                          "line": 1,
                                          "column": 45
                                        },
                                        "end": {
                                          "line": 1,
                                          "column": 50
                                        }
                                      }
                                    }
                                  },
                                  "arguments": [],
                                  "parent": {
                                    "type": "CallExpression",
                                    "range": [
                                      45,
                                      52
                                    ],
                                    "loc": {
                                      "start": {
                                        "line": 1,
                                        "column": 45
                                      },
                                      "end": {
                                        "line": 1,
                                        "column": 52
                                      }
                                    },
                                    "callee": {
                                      "type": "Super",
                                      "range": [
                                        45,
                                        50
                                      ],
                                      "loc": {
                                        "start": {
                                          "line": 1,
                                          "column": 45
                                        },
                                        "end": {
                                          "line": 1,
                                          "column": 50
                                        }
                                      },
                                      "parent": {
                                        "type": "Super",
                                        "range": [
                                          45,
                                          50
                                        ],
                                        "loc": {
                                          "start": {
                                            "line": 1,
                                            "column": 45
                                          },
                                          "end": {
                                            "line": 1,
                                            "column": 50
                                          }
                                        }
                                      }
                                    },
                                    "arguments": []
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  }
                }
              }
            ]
          }
        }
      }
    }
  ],
  "tokens": [
    {
      "type": "Keyword",
      "range": [
        0,
        5
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 1,
          "column": 5
        }
      },
      "value": "class"
    },
    {
      "type": "Identifier",
      "range": [
        6,
        7
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 6
        },
        "end": {
          "line": 1,
          "column": 7
        }
      },
      "value": "A"
    },
    {
      "type": "Keyword",
      "range": [
        8,
        15
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 8
        },
        "end": {
          "line": 1,
          "column": 15
        }
      },
      "value": "extends"
    },
    {
      "type": "Punctuator",
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
      },
      "value": "("
    },
    {
      "type": "Identifier",
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
      },
      "value": "B"
    },
    {
      "type": "Identifier",
      "range": [
        19,
        21
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 19
        },
        "end": {
          "line": 1,
          "column": 21
        }
      },
      "value": "as"
    },
    {
      "type": "Identifier",
      "range": [
        22,
        25
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 22
        },
        "end": {
          "line": 1,
          "column": 25
        }
      },
      "value": "any"
    },
    {
      "type": "Punctuator",
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
      },
      "value": ")"
    },
    {
      "type": "Punctuator",
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
      },
      "value": "{"
    },
    {
      "type": "Identifier",
      "range": [
        29,
        40
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 29
        },
        "end": {
          "line": 1,
          "column": 40
        }
      },
      "value": "constructor"
    },
    {
      "type": "Punctuator",
      "range": [
        40,
        41
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 40
        },
        "end": {
          "line": 1,
          "column": 41
        }
      },
      "value": "("
    },
    {
      "type": "Punctuator",
      "range": [
        41,
        42
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 41
        },
        "end": {
          "line": 1,
          "column": 42
        }
      },
      "value": ")"
    },
    {
      "type": "Punctuator",
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
      },
      "value": "{"
    },
    {
      "type": "Keyword",
      "range": [
        45,
        50
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 45
        },
        "end": {
          "line": 1,
          "column": 50
        }
      },
      "value": "super"
    },
    {
      "type": "Punctuator",
      "range": [
        50,
        51
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 50
        },
        "end": {
          "line": 1,
          "column": 51
        }
      },
      "value": "("
    },
    {
      "type": "Punctuator",
      "range": [
        51,
        52
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 51
        },
        "end": {
          "line": 1,
          "column": 52
        }
      },
      "value": ")"
    },
    {
      "type": "Punctuator",
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
      },
      "value": ";"
    },
    {
      "type": "Punctuator",
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
      },
      "value": "}"
    },
    {
      "type": "Punctuator",
      "range": [
        56,
        57
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 56
        },
        "end": {
          "line": 1,
          "column": 57
        }
      },
      "value": "}"
    }
  ],
  "comments": []
});
