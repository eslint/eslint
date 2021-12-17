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
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/abc/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('abc');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/abc/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('abc', 'g');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/abc/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('abc', 'g');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/abc/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(`abc`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/abc/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(`abc`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/abc/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(`abc`, `g`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/abc/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(`abc`, `g`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/abc/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String.raw`abc`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/abc/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String.raw`abc\nabc`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/abc\\nabc/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String.raw`\tabc\nabc`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\tabc\\nabc/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(String.raw`abc`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/abc/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String.raw`abc`, String.raw`g`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/abc/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(String.raw`abc`, String.raw`g`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/abc/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String['raw']`a`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/a/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/(?:)/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/(?:)/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String.raw``);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/(?:)/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('a', `g`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/a/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(`a`, 'g');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/a/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(String.raw`a`, 'g');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/a/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String.raw`\\d`, `g`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\d/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String.raw`\\\\d`, `g`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\\\d/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String['raw']`\\\\d`, `g`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\\\d/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(String[\"raw\"]`\\\\d`, `g`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\\\d/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('a', String.raw`g`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/a/g;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new globalThis.RegExp('a');",
            env: {
                es2020: true
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "NewExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/a/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "globalThis.RegExp('a');",
            env: {
                es2020: true
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    type: "CallExpression",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/a/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(/a/);",
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
                            messageId: "replaceWithLiteral",
                            output: "/a/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp((String?.raw)`a`);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/a/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('+');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "new RegExp('*');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "RegExp('+');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "RegExp('*');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "new RegExp('+', 'g');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "new RegExp('*', 'g');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "RegExp('+', 'g');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "RegExp('*', 'g');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "RegExp('abc', 'u');",
            parserOptions: {
                ecmaVersion: 3
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "new RegExp('abc', 'd');",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "RegExp('abc', 'd');",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/abc/d;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\\\\\\\', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\\\/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\n', '');",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\n/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\n\\n', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\n\\n/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\t', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\t/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\t\\t', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\t\\t/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\r\\n', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\r\\n/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\u1234', 'g')",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "RegExp('\\u{1234}', 'g')",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "RegExp('\\u{11111}', 'g')",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "RegExp('\\v', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\v/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\v\\v', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\v\\v/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\f', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\f/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\f\\f', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\f\\f/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\\\b', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\b/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\\\b\\\\b', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\b\\b/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('\\\\B\\\\b', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\B\\b/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\\\w', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\w/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new globalThis.RegExp('\\\\W', '');",
            globals: {
                globalThis: "readonly"
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\W/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\\\s', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\s/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('\\\\S', '')",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\S/"
                        }
                    ]
                }
            ]
        },
        {
            code: "globalThis.RegExp('\\\\d', '');",
            globals: {
                globalThis: "readonly"
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\d/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "globalThis.RegExp('\\\\D', '')",
            globals: {
                globalThis: "readonly"
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\D/"
                        }
                    ]
                }
            ]
        },
        {
            code: "globalThis.RegExp('\\\\\\\\\\\\D', '')",
            globals: {
                globalThis: "readonly"
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\\\\\D/"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('\\\\D\\\\D', '')",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\D\\D/"
                        }
                    ]
                }
            ]
        },
        {
            code: "new globalThis.RegExp('\\\\0\\\\0', '');",
            globals: {
                globalThis: "writable"
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\0\\0/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('\\\\0\\\\0', '');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\0\\0/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('\\0\\0', 'g');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "RegExp('\\\\0\\\\0\\\\0', '')",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\0\\0\\0/"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp('\\\\78\\\\126\\\\5934', '')",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\78\\126\\5934/"
                        }
                    ]
                }
            ]
        },
        {
            code: "new window['RegExp']('\\\\x56\\\\x78\\\\x45', '');",
            env: {
                browser: true
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\x56\\x78\\x45/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "a in(RegExp('abc'))",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "a in(/abc/)"
                        }
                    ]
                }
            ]
        },
        {
            code: "x = y\n            RegExp(\"foo\").test(x) ? bar() : baz()",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "func(new RegExp(String.raw`\\w{1, 2`, 'u'),new RegExp(String.raw`\\w{1, 2`, 'u'))",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                },
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "x = y;\n            RegExp(\"foo\").test(x) ? bar() : baz()",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "x = y;\n            /foo/.test(x) ? bar() : baz()"
                        }
                    ]
                }
            ]
        },
        {
            code: "typeof RegExp(\"foo\")",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "typeof /foo/"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(\"foo\") instanceof RegExp(String.raw`blahblah`, 'g') ? typeof new RegExp('(\\\\p{Emoji_Presentation})\\\\1', `ug`) : false",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/foo/ instanceof RegExp(String.raw`blahblah`, 'g') ? typeof new RegExp('(\\\\p{Emoji_Presentation})\\\\1', `ug`) : false"
                        }
                    ]
                },
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "RegExp(\"foo\") instanceof /blahblah/g ? typeof new RegExp('(\\\\p{Emoji_Presentation})\\\\1', `ug`) : false"
                        }
                    ]
                },
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "RegExp(\"foo\") instanceof RegExp(String.raw`blahblah`, 'g') ? typeof /(\\p{Emoji_Presentation})\\1/ug : false"
                        }
                    ]
                }
            ]
        },
        {
            code: "[   new RegExp(`someregular`)]",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "[   /someregular/]"
                        }
                    ]
                }
            ]
        },
        {
            code: "const totallyValidatesEmails = new RegExp(\"\\\\S+@(\\\\S+\\\\.)+\\\\S+\")\n            if (typeof totallyValidatesEmails === 'object') {\n                runSomethingThatExists(Regexp('stuff'))\n            }",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "const totallyValidatesEmails = /\\S+@(\\S+\\.)+\\S+/\n            if (typeof totallyValidatesEmails === 'object') {\n                runSomethingThatExists(Regexp('stuff'))\n            }"
                        }
                    ]
                }
            ]
        },
        {
            code: "!new RegExp('^Hey, ', 'u') && new RegExp('jk$') && ~new RegExp('^Sup, ') || new RegExp('hi') + new RegExp('person') === -new RegExp('hi again') ? 5 * new RegExp('abc') : 'notregbutstring'",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "!/^Hey, /u && new RegExp('jk$') && ~new RegExp('^Sup, ') || new RegExp('hi') + new RegExp('person') === -new RegExp('hi again') ? 5 * new RegExp('abc') : 'notregbutstring'"
                        }
                    ]
                },
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "!new RegExp('^Hey, ', 'u') && /jk$/ && ~new RegExp('^Sup, ') || new RegExp('hi') + new RegExp('person') === -new RegExp('hi again') ? 5 * new RegExp('abc') : 'notregbutstring'"
                        }
                    ]
                },
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "!new RegExp('^Hey, ', 'u') && new RegExp('jk$') && ~/^Sup, / || new RegExp('hi') + new RegExp('person') === -new RegExp('hi again') ? 5 * new RegExp('abc') : 'notregbutstring'"
                        }
                    ]
                },
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "!new RegExp('^Hey, ', 'u') && new RegExp('jk$') && ~new RegExp('^Sup, ') || /hi/ + new RegExp('person') === -new RegExp('hi again') ? 5 * new RegExp('abc') : 'notregbutstring'"
                        }
                    ]
                },
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "!new RegExp('^Hey, ', 'u') && new RegExp('jk$') && ~new RegExp('^Sup, ') || new RegExp('hi') + /person/ === -new RegExp('hi again') ? 5 * new RegExp('abc') : 'notregbutstring'"
                        }
                    ]
                },
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "!new RegExp('^Hey, ', 'u') && new RegExp('jk$') && ~new RegExp('^Sup, ') || new RegExp('hi') + new RegExp('person') === -/hi again/ ? 5 * new RegExp('abc') : 'notregbutstring'"
                        }
                    ]
                },
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "!new RegExp('^Hey, ', 'u') && new RegExp('jk$') && ~new RegExp('^Sup, ') || new RegExp('hi') + new RegExp('person') === -new RegExp('hi again') ? 5 * /abc/ : 'notregbutstring'"
                        }
                    ]
                }
            ]
        },
        {
            code: "#!/usr/bin/sh\n            RegExp(\"foo\")",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "#!/usr/bin/sh\n            /foo/"
                        }
                    ]
                }
            ]
        },
        {
            code: "async function abc(){await new RegExp(\"foo\")}",
            parserOptions: {
                ecmaVersion: 8,
                sourceType: "module"
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "function* abc(){yield new RegExp(\"foo\")}",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "function* abc(){yield* new RegExp(\"foo\")}",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "function* abc(){yield* /foo/}"
                        }
                    ]
                }
            ]
        },
        {
            code: "console.log({ ...new RegExp('a') })",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "console.log({ .../a/ })"
                        }
                    ]
                }
            ]
        },
        {
            code: "delete RegExp('a');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "delete /a/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "void RegExp('a');",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "void /a/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(\"\\\\S+@(\\\\S+\\\\.)+\\\\S+\")**RegExp('a')",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\S+@(\\S+\\.)+\\S+/**RegExp('a')"
                        }
                    ]
                },
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "new RegExp(\"\\\\S+@(\\\\S+\\\\.)+\\\\S+\")**/a/"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(\"\\\\S+@(\\\\S+\\\\.)+\\\\S+\")%RegExp('a')",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\S+@(\\S+\\.)+\\S+/%RegExp('a')"
                        }
                    ]
                },
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "new RegExp(\"\\\\S+@(\\\\S+\\\\.)+\\\\S+\")%/a/"
                        }
                    ]
                }
            ]
        },
        {
            code: "a in RegExp('abc')",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "a in /abc/"
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ == new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            /abc/ == /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ === new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            /abc/ === /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ != new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            /abc/ != /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ !== new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            /abc/ !== /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ > new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            /abc/ > /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ < new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            /abc/ < /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ >= new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            /abc/ >= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ <= new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            /abc/ <= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ << new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            /abc/ << /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ >> new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            /abc/ >> /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ >>> new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            /abc/ >>> /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ ^ new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            /abc/ ^ /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ & new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            /abc/ & /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            /abc/ | new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            /abc/ | /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            null ?? new RegExp('blah')\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            null ?? /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc *= new RegExp('blah')\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc *= /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            console.log({a: new RegExp('sup')})\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            console.log({a: /sup/})\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            console.log(() => {new RegExp('sup')})\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            console.log(() => {/sup/})\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            function abc() {new RegExp('sup')}\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            function abc() {/sup/}\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            function abc() {return new RegExp('sup')}\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            function abc() {return /sup/}\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc <<= new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc <<= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc >>= new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc >>= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc >>>= new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc >>>= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc ^= new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc ^= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc &= new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc &= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc |= new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc |= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc ??= new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc ??= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc &&= new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc &&= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc ||= new RegExp('cba');\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc ||= /cba/;\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc **= new RegExp('blah')\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc **= /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc /= new RegExp('blah')\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc /= /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc += new RegExp('blah')\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc += /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc -= new RegExp('blah')\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc -= /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            abc %= new RegExp('blah')\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            abc %= /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            () => new RegExp('blah')\n            ",
            parserOptions: {
                ecmaVersion: 2021
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            () => /blah/\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "a/RegExp(\"foo\")in b",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "a/ /foo/ in b"
                        }
                    ]
                }
            ]
        },
        {
            code: "a/RegExp(\"foo\")instanceof b",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "a/ /foo/ instanceof b"
                        }
                    ]
                }
            ]
        },
        {
            code: "do RegExp(\"foo\")\nwhile (true);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "do /foo/\nwhile (true);"
                        }
                    ]
                }
            ]
        },
        {
            code: "for(let i;i<5;i++) { break\nnew RegExp('search')}",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "for(let i;i<5;i++) { break\n/search/}"
                        }
                    ]
                }
            ]
        },
        {
            code: "for(let i;i<5;i++) { continue\nnew RegExp('search')}",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "for(let i;i<5;i++) { continue\n/search/}"
                        }
                    ]
                }
            ]
        },
        {
            code: "\n            switch (value) {\n                case \"possibility\":\n                    console.log('possibility matched')\n                case RegExp('myReg').toString():\n                    console.log('matches a regexp\\' toString value')\n                    break;\n            }\n            ",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "\n            switch (value) {\n                case \"possibility\":\n                    console.log('possibility matched')\n                case /myReg/.toString():\n                    console.log('matches a regexp\\' toString value')\n                    break;\n            }\n            "
                        }
                    ]
                }
            ]
        },
        {
            code: "throw new RegExp('abcdefg') // fail with a regular expression",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "throw /abcdefg/ // fail with a regular expression"
                        }
                    ]
                }
            ]
        },
        {
            code: "for (value of new RegExp('something being searched')) { console.log(value) }",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "(async function(){for await (value of new RegExp('something being searched')) { console.log(value) }})()",
            parserOptions: {
                ecmaVersion: 2018
            },
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "for (value in new RegExp('something being searched')) { console.log(value) }",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "for (value in /something being searched/) { console.log(value) }"
                        }
                    ]
                }
            ]
        },
        {
            code: "if (condition1 && condition2) new RegExp('avalue').test(str);",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        },
        {
            code: "debugger\nnew RegExp('myReg')",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "debugger\n/myReg/"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(\"\\\\\\n\")",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\n/"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(\"\\\\\\t\")",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\t/"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(\"\\\\\\f\")",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\f/"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(\"\\\\\\v\")",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\v/"
                        }
                    ]
                }
            ]
        },
        {
            code: "RegExp(\"\\\\\\r\")",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\r/"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(\"\t\")",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\t/"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(\"/\")",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\//"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(\"\\.\")",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/./"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(\"\\\\.\")",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\./"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(\"\\\\\\n\\\\\\n\")",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\n\\n/"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(\"\\\\\\n\\\\\\f\\\\\\n\")",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\n\\f\\n/"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp(\"\\u000A\\u000A\");",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: [
                        {
                            messageId: "replaceWithLiteral",
                            output: "/\\n\\n/;"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('mysafereg' /* comment explaining its safety */)",
            errors: [
                {
                    messageId: "unexpectedRegExp",
                    suggestions: null
                }
            ]
        }
    ]
});
