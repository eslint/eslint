/**
 * @fileoverview Tests for the prefer-regex-literals rule
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-regex-literals");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2022 } });

ruleTester.run("prefer-regex-literals", rule, {
    valid: [
        "/abc/",
        "/abc/g",


        // considered as dynamic
        "new RegExp(pattern)",
        "new RegExp('\\\\p{Emoji_Presentation}\\\\P{Script_Extensions=Latin}' + '', `ug`)",
        "new RegExp('\\\\cA' + '')",
        "RegExp(pattern, 'g')",
        "new RegExp(f('a'))",
        "RegExp(prefix + 'a')",
        "new RegExp('a' + suffix)",
        "RegExp(`a` + suffix);",
        "new RegExp(String.raw`a` + suffix);",
        "RegExp('a', flags)",
        "const flags = 'gu';RegExp('a', flags)",
        "RegExp('a', 'g' + flags)",
        "new RegExp(String.raw`a`, flags);",
        "RegExp(`${prefix}abc`)",
        "new RegExp(`a${b}c`);",
        "new RegExp(`a${''}c`);",
        "new RegExp(String.raw`a${b}c`);",
        "new RegExp(String.raw`a${''}c`);",
        "new RegExp('a' + 'b')",
        "RegExp(1)",
        "new RegExp('(\\\\p{Emoji_Presentation})\\\\1' + '', `ug`)",
        "RegExp(String.raw`\\78\\126` + '\\\\5934', '' + `g` + '')",
        "func(new RegExp(String.raw`a${''}c\\d`, 'u'),new RegExp(String.raw`a${''}c\\d`, 'u'))",
        "new RegExp('\\\\[' + \"b\\\\]\")",
        {
            code: "new RegExp(/a/, flags);",
            options: [{ disallowRedundantWrapping: true }]
        },
        {
            code: "new RegExp(/a/, `u${flags}`);",
            options: [{ disallowRedundantWrapping: true }]
        },

        // redundant wrapping is allowed
        {
            code: "new RegExp(/a/);",
            options: [{}]
        },
        {
            code: "new RegExp(/a/);",
            options: [{ disallowRedundantWrapping: false }]
        },

        // invalid number of arguments
        "new RegExp;",
        "new RegExp();",
        "RegExp();",
        "new RegExp('a', 'g', 'b');",
        "RegExp('a', 'g', 'b');",
        "new RegExp(`a`, `g`, `b`);",
        "RegExp(`a`, `g`, `b`);",
        "new RegExp(String.raw`a`, String.raw`g`, String.raw`b`);",
        "RegExp(String.raw`a`, String.raw`g`, String.raw`b`);",
        {
            code: "new RegExp(/a/, 'u', 'foo');",
            options: [{ disallowRedundantWrapping: true }]
        },

        // not String.raw``
        "new RegExp(String`a`);",
        "RegExp(raw`a`);",
        "new RegExp(f(String.raw)`a`);",
        "RegExp(string.raw`a`);",
        "new RegExp(String.Raw`a`);",
        "new RegExp(String[raw]`a`);",
        "RegExp(String.raw.foo`a`);",
        "new RegExp(String.foo.raw`a`);",
        "RegExp(foo.String.raw`a`);",
        "new RegExp(String.raw);",

        // not the global String in String.raw``
        "let String; new RegExp(String.raw`a`);",
        "function foo() { var String; new RegExp(String.raw`a`); }",
        "function foo(String) { RegExp(String.raw`a`); }",
        "if (foo) { const String = bar; RegExp(String.raw`a`); }",
        "/* globals String:off */ new RegExp(String.raw`a`);",
        {
            code: "RegExp('a', String.raw`g`);",
            globals: { String: "off" }
        },

        // not RegExp
        "new Regexp('abc');",
        "Regexp(`a`);",
        "new Regexp(String.raw`a`);",

        // not the global RegExp
        "let RegExp; new RegExp('a');",
        "function foo() { var RegExp; RegExp('a', 'g'); }",
        "function foo(RegExp) { new RegExp(String.raw`a`); }",
        "if (foo) { const RegExp = bar; RegExp('a'); }",
        "/* globals RegExp:off */ new RegExp('a');",
        {
            code: "RegExp('a');",
            globals: { RegExp: "off" }
        },
        "new globalThis.RegExp('a');",
        {
            code: "new globalThis.RegExp('a');",
            env: { es6: true }
        },
        {
            code: "new globalThis.RegExp('a');",
            env: { es2017: true }
        },
        {
            code: "class C { #RegExp; foo() { globalThis.#RegExp('a'); } }",
            env: { es2020: true }
        }
    ],

    invalid: [
        {
            code: "new RegExp('abc');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/abc/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('abc');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/abc/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('abc', 'g');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/abc/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('abc', 'g');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/abc/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(`abc`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/abc/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(`abc`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/abc/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(`abc`, `g`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/abc/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(`abc`, `g`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/abc/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String.raw`abc`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/abc/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(String.raw`abc`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/abc/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String.raw`abc`, String.raw`g`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/abc/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(String.raw`abc`, String.raw`g`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/abc/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String['raw']`a`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/a/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/(?:)/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/(?:)/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String.raw``);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/(?:)/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('a', `g`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/a/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(`a`, 'g');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/a/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(String.raw`a`, 'g');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/a/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String.raw`\\d`, `g`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\d/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String.raw`\\\\d`, `g`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\\\d/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String['raw']`\\\\d`, `g`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\\\d/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String[\"raw\"]`\\\\d`, `g`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\\\d/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('a', String.raw`g`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/a/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new globalThis.RegExp('a');",
            output: null,
            env: {
                es2020: true
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/a/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "globalThis.RegExp('a');",
            output: null,
            env: {
                es2020: true
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/a/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(/a/);",
            output: null,
            options: [
                {
                    disallowRedundantWrapping: true
                }
            ],
            errors: [
                {
                    messageId: "unexpectedRedundantRegExp",
                    type: "NewExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "new RegExp(/a/, 'u');",
            output: null,
            options: [
                {
                    disallowRedundantWrapping: true
                }
            ],
            errors: [
                {
                    messageId: "unexpectedRedundantRegExpWithFlags",
                    type: "NewExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "new RegExp(/a/, `u`);",
            output: null,
            options: [
                {
                    disallowRedundantWrapping: true
                }
            ],
            errors: [
                {
                    messageId: "unexpectedRedundantRegExpWithFlags",
                    type: "NewExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "new RegExp(/a/, String.raw`u`);",
            output: null,
            options: [
                {
                    disallowRedundantWrapping: true
                }
            ],
            errors: [
                {
                    messageId: "unexpectedRedundantRegExpWithFlags",
                    type: "NewExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "new RegExp('a');",
            output: null,
            options: [
                {
                    disallowRedundantWrapping: true
                }
            ],
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    line: 1,
                    column: 1,
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/a/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp((String?.raw)`a`);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/a/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('+');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "new RegExp('*');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "RegExp('+');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "RegExp('*');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "new RegExp('+', 'g');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "new RegExp('*', 'g');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "RegExp('+', 'g');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "RegExp('*', 'g');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "RegExp('abc', 'u');",
            output: null,
            parserOptions: {
                ecmaVersion: 3
            },
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "new RegExp('abc', 'd');",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "RegExp('abc', 'd');",
            output: null,
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/abc/d;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\\\\\\\', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\\\/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\n', '');",
            output: null,
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\n/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\n\\n', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\n\\n/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\t', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\t/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\t\\t', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\t\\t/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\r\\n', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\r\\n/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\u1234', 'g')",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "RegExp('\\u{1234}', 'g')",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "RegExp('\\u{11111}', 'g')",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "RegExp('\\v', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\v/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\v\\v', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\v\\v/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\f', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\f/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\f\\f', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\f\\f/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\\\b', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\b/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\\\b\\\\b', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\b\\b/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('\\\\B\\\\b', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\B\\b/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\\\w', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\w/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new globalThis.RegExp('\\\\W', '');",
            output: null,
            globals: {
                globalThis: "readonly"
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\W/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\\\s', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\s/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('\\\\S', '')",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\S/"
                        }
                    ]
                }
            ]
        },
        {
            code: "globalThis.RegExp('\\\\d', '');",
            output: null,
            globals: {
                globalThis: "readonly"
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\d/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "globalThis.RegExp('\\\\D', '')",
            output: null,
            globals: {
                globalThis: "readonly"
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\D/"
                        }
                    ]
                }
            ]
        },
        {
            code: "globalThis.RegExp('\\\\\\\\\\\\D', '')",
            output: null,
            globals: {
                globalThis: "readonly"
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\\\\\D/"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('\\\\D\\\\D', '')",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\D\\D/"
                        }
                    ]
                }
            ]
        },
        {
            code: "new globalThis.RegExp('\\\\0\\\\0', '');",
            output: null,
            globals: {
                globalThis: "writable"
            },
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "new RegExp('\\\\0\\\\0', '');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "new RegExp('\\0\\0', 'g');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "RegExp('\\\\0\\\\0\\\\0', '')",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "RegExp('\\\\78\\\\126\\\\5934', '')",
            output: null,
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\78\\126\\5934/"
                        }
                    ]
                }
            ]
        },
        {
            code: "new window['RegExp']('\\\\x56\\\\x78\\\\x45', '');",
            output: null,
            env: {
                browser: true
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\x56\\x78\\x45/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "a in(RegExp('abc'))",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "a in(/abc/)"
                        }
                    ]
                }
            ]
        },
        {
            code: "x = y\n            RegExp(\"foo\").test(x) ? bar() : baz()",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "func(new RegExp(String.raw`\\w{1, 2`, 'u'),new RegExp(String.raw`\\w{1, 2`, 'u'))",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                },
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "x = y;\n            RegExp(\"foo\").test(x) ? bar() : baz()",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "x = y;\n            /foo/.test(x) ? bar() : baz()"
                        }
                    ]
                }
            ]
        },
        {
            code: "typeof RegExp(\"foo\")",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "typeof /foo/"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(\"foo\") instanceof RegExp(String.raw`blahblah`, 'g') ? typeof new RegExp('(\\\\p{Emoji_Presentation})\\\\1', `ug`) : false",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                },
                {
                    messageId: "unexpectedRegExp"
                },
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "[   new RegExp(`someregular`)]",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "[   /someregular/]"
                        }
                    ]
                }
            ]
        },
        {
            code: "const totallyValidatesEmails = new RegExp(\"\\\\S+@(\\\\S+\\\\.)+\\\\S+\")\n            if (typeof totallyValidatesEmails === 'object') {\n                runSomethingThatExists(Regexp('stuff'))\n            }",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "const totallyValidatesEmails = /\\S+@(\\S+\\.)+\\S+/\n            if (typeof totallyValidatesEmails === 'object') {\n                runSomethingThatExists(Regexp('stuff'))\n            }"
                        }
                    ]
                }
            ]
        },
        {
            code: "!new RegExp('^Hey, ', 'u') && new RegExp('jk$') && ~new RegExp('^Sup, ') || new RegExp('hi') + new RegExp('person') === -new RegExp('hi again') ? 5 * new RegExp('abc') : 'notregbutstring'",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                },
                {
                    messageId: "unexpectedRegExp"
                },
                {
                    messageId: "unexpectedRegExp"
                },
                {
                    messageId: "unexpectedRegExp"
                },
                {
                    messageId: "unexpectedRegExp"
                },
                {
                    messageId: "unexpectedRegExp"
                },
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "#!/usr/bin/sh\n            RegExp(\"foo\")",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "#!/usr/bin/sh\n            /foo/"
                        }
                    ]
                }
            ]
        },
        {
            code: "async function abc(){await new RegExp(\"foo\")}",
            output: null,
            parserOptions: {
                ecmaVersion: 8,
                sourceType: "module"
            },
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "function* abc(){yield new RegExp(\"foo\")}",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "function* abc(){yield* new RegExp(\"foo\")}",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "function* abc(){yield* /foo/}"
                        }
                    ]
                }
            ]
        },
        {
            code: "console.log({ ...new RegExp('a') })",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "console.log({ .../a/ })"
                        }
                    ]
                }
            ]
        },
        {
            code: "delete RegExp('a');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "delete /a/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "void RegExp('a');",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "void /a/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(\"\\\\S+@(\\\\S+\\\\.)+\\\\S+\")**RegExp('a')",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                },
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "new RegExp(\"\\\\S+@(\\\\S+\\\\.)+\\\\S+\")%RegExp('a')",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                },
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "a in RegExp('abc')",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "a in /abc/"
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ == new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            /abc/ == /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ === new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            /abc/ === /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ != new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            /abc/ != /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ !== new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            /abc/ !== /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ > new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            /abc/ > /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ < new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            /abc/ < /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ >= new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            /abc/ >= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ <= new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            /abc/ <= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ << new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            /abc/ << /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ >> new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            /abc/ >> /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ >>> new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            /abc/ >>> /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ ^ new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            /abc/ ^ /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ & new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            /abc/ & /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ | new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            /abc/ | /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            null ?? new RegExp('blah')\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            null ?? /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc *= new RegExp('blah')\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc *= /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            console.log({a: new RegExp('sup')})\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            console.log({a: /sup/})\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            console.log(() => {new RegExp('sup')})\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            console.log(() => {/sup/})\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            function abc() {new RegExp('sup')}\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            function abc() {/sup/}\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            function abc() {return new RegExp('sup')}\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            function abc() {return /sup/}\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc <<= new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc <<= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc >>= new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc >>= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc >>>= new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc >>>= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc ^= new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc ^= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc &= new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc &= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc |= new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc |= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc ??= new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc ??= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc &&= new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc &&= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc ||= new RegExp('cba');\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc ||= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc **= new RegExp('blah')\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc **= /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc /= new RegExp('blah')\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc /= /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc += new RegExp('blah')\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc += /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc -= new RegExp('blah')\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc -= /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc %= new RegExp('blah')\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            abc %= /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            () => new RegExp('blah')\n            ",
            output: null,
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            () => /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "a/RegExp(\"foo\")in b",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "a/ /foo/ in b"
                        }
                    ]
                }
            ]
        },
        {
            code: "a/RegExp(\"foo\")instanceof b",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "a/ /foo/ instanceof b"
                        }
                    ]
                }
            ]
        },
        {
            code: "do RegExp(\"foo\")\nwhile (true);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "do /foo/\nwhile (true);"
                        }
                    ]
                }
            ]
        },
        {
            code: "for(let i;i<5;i++) { break\nnew RegExp('search')}",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "for(let i;i<5;i++) { break\n/search/}"
                        }
                    ]
                }
            ]
        },
        {
            code: "for(let i;i<5;i++) { continue\nnew RegExp('search')}",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "for(let i;i<5;i++) { continue\n/search/}"
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            switch (value) {\n                case \"possibility\":\n                    console.log('possibility matched')\n                case RegExp('myReg').toString():\n                    console.log('matches a regexp\\' toString value')\n                    break;\n            }\n            ",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "\n            switch (value) {\n                case \"possibility\":\n                    console.log('possibility matched')\n                case /myReg/.toString():\n                    console.log('matches a regexp\\' toString value')\n                    break;\n            }\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "throw new RegExp('abcdefg') // fail with a regular expression",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "throw /abcdefg/ // fail with a regular expression"
                        }
                    ]
                }
            ]
        },
        {
            code: "for (value of new RegExp('something being searched')) { console.log(value) }",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "(async function(){for await (value of new RegExp('something being searched')) { console.log(value) }})()",
            output: null,
            parserOptions: {
                ecmaVersion: 2018
            },
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "for (value in new RegExp('something being searched')) { console.log(value) }",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "for (value in /something being searched/) { console.log(value) }"
                        }
                    ]
                }
            ]
        },
        {
            code: "if (condition1 && condition2) new RegExp('avalue').test(str);",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp"
                }
            ]
        },
        {
            code: "debugger\nnew RegExp('myReg')",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "debugger\n/myReg/"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(\"\\\\\\n\")",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\n/"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(\"\\\\\\t\")",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\t/"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(\"\\\\\\f\")",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\f/"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(\"\\\\\\v\")",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\v/"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(\"\\\\\\r\")",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\r/"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(\"\t\")",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\t/"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(\"/\")",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\//"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(\"\\.\")",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/./"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(\"\\\\.\")",
            output: null,
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "unexpectedRegExp",
                            output: "/\\./"
                        }
                    ]
                }
            ]
        }
    ]
});
