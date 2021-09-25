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
        "new RegExp(String.raw`a${b}c`);",
        "new RegExp(`a${''}c`);",
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
            output: "/abc/;",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp('abc');",
            output: "/abc/;",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp('abc', 'g');",
            output: "/abc/g;",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp('abc', 'g');",
            output: "/abc/g;",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(`abc`);",
            output: "/abc/;",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(`abc`);",
            output: "/abc/;",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(`abc`, `g`);",
            output: "/abc/g;",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(`abc`, `g`);",
            output: "/abc/g;",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(String.raw`abc`);",
            output: "/abc/;",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(String.raw`abc`);",
            output: "/abc/;",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(String.raw`abc`, String.raw`g`);",
            output: "/abc/g;",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(String.raw`abc`, String.raw`g`);",
            output: "/abc/g;",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(String['raw']`a`);",
            output: "/a/;",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "new RegExp('');",
            output: "/(?:)/;",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp('', '');",
            output: "/(?:)/;",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(String.raw``);",
            output: "/(?:)/;",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "new RegExp('a', `g`);",
            output: "/a/g;",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp(`a`, 'g');",
            output: "/a/g;",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "RegExp(String.raw`a`, 'g');",
            output: "/a/g;",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new RegExp(String.raw`\\d`, `g`);",
            output: "/\\d/g;",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "new RegExp(String.raw`\\\\d`, `g`);",
            output: "/\\\\d/g;",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "new RegExp(String['raw']`\\\\d`, `g`);",
            output: "/\\\\d/g;",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "new RegExp(String[\"raw\"]`\\\\d`, `g`);",
            output: "/\\\\d/g;",
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "RegExp('a', String.raw`g`);",
            output: "/a/g;",
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },
        {
            code: "new globalThis.RegExp('a');",
            output: "/a/;",
            env: { es2020: true },
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression" }]
        },
        {
            code: "globalThis.RegExp('a');",
            output: "/a/;",
            env: { es2020: true },
            errors: [{ messageId: "unexpectedRegExp", type: "CallExpression" }]
        },

        {
            code: "new RegExp(/a/);",
            output: "/a/;",
            options: [{ disallowRedundantWrapping: true }],
            errors: [{ messageId: "unexpectedRedundantRegExp", type: "NewExpression", line: 1, column: 1 }]
        },
        {
            code: "new RegExp(/a/, 'u');",
            output: "/a/u;",
            options: [{ disallowRedundantWrapping: true }],
            errors: [{ messageId: "unexpectedRedundantRegExpWithFlags", type: "NewExpression", line: 1, column: 1 }]
        },
        {
            code: "new RegExp(/a/, `u`);",
            output: "/a/u;",
            options: [{ disallowRedundantWrapping: true }],
            errors: [{ messageId: "unexpectedRedundantRegExpWithFlags", type: "NewExpression", line: 1, column: 1 }]
        },
        {
            code: "new RegExp(/a/, String.raw`u`);",
            output: "/a/u;",
            options: [{ disallowRedundantWrapping: true }],
            errors: [{ messageId: "unexpectedRedundantRegExpWithFlags", type: "NewExpression", line: 1, column: 1 }]
        },
        {
            code: "new RegExp('a');",
            output: "/a/;",
            options: [{ disallowRedundantWrapping: true }],
            errors: [{ messageId: "unexpectedRegExp", type: "NewExpression", line: 1, column: 1 }]
        },

        // Optional chaining
        {
            code: "new RegExp((String?.raw)`a`);",
            output: "/a/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },

        {
            code: "new RegExp('+');",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new RegExp('*');",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('+');",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('*');",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new RegExp('+', 'g');",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new RegExp('*', 'g');",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('+', 'g');",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('*', 'g');",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('abc', 'u');",
            output: null,
            parserOptions: { ecmaVersion: 3 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new RegExp('abc', 'd');",
            output: null,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('abc', 'd');",
            output: "/abc/d;",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\\\\\\\', '');",
            output: "/\\\\/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\n', '');",
            output: "/\\n/;",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\n\\n', '');",
            output: "/\\n\\n/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\t', '');",
            output: "/\\t/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\t\\t', '');",
            output: "/\\t\\t/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\r\\n', '');",
            output: "/\\r\\n/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\u1234', 'g')",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\u{1234}', 'g')",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\u{11111}', 'g')",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\v', '');",
            output: "/\\v/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\v\\v', '');",
            output: "/\\v\\v/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\f', '');",
            output: "/\\f/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\f\\f', '');",
            output: "/\\f\\f/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\\\b', '');",
            output: "/\\b/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\\\b\\\\b', '');",
            output: "/\\b\\b/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new RegExp('\\\\B\\\\b', '');",
            output: "/\\B\\b/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\\\w', '');",
            output: "/\\w/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new globalThis.RegExp('\\\\W', '');",
            output: "/\\W/;",
            globals: {
                globalThis: "readonly"
            },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\\\s', '');",
            output: "/\\s/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new RegExp('\\\\S', '')",
            output: "/\\S/",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "globalThis.RegExp('\\\\d', '');",
            output: "/\\d/;",
            globals: {
                globalThis: "readonly"
            },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "globalThis.RegExp('\\\\D', '')",
            output: "/\\D/",
            globals: {
                globalThis: "readonly"
            },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "globalThis.RegExp('\\\\\\\\\\\\D', '')",
            output: "/\\\\\\D/",
            globals: {
                globalThis: "readonly"
            },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new RegExp('\\\\D\\\\D', '')",
            output: "/\\D\\D/",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new globalThis.RegExp('\\\\0\\\\0', '');",
            output: "/\\0\\0/;",
            globals: {
                globalThis: "writable"
            },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new RegExp('\\\\0\\\\0', '');",
            output: "/\\0\\0/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new RegExp('\\0\\0', 'g');",
            output: "/\\0\\0/g;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\\\0\\\\0\\\\0', '')",
            output: "/\\0\\0\\0/",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp('\\\\78\\\\126\\\\5934', '')",
            output: "/\\78\\126\\5934/",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new window['RegExp']('\\\\x56\\\\x78\\\\x45', '');",
            output: "/\\x56\\x78\\x45/;",
            env: {
                browser: true
            },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "a in(RegExp('abc'))",
            output: "a in(/abc/)",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `x = y
            RegExp("foo").test(x) ? bar() : baz()`,
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "func(new RegExp(String.raw`\\w{1, 2`, 'u'),new RegExp(String.raw`\\w{1, 2`, 'u'))",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }, { messageId: "unexpectedRegExp" }]
        },
        {
            code: `x = y;
            RegExp("foo").test(x) ? bar() : baz()`,
            output: `x = y;
            /foo/.test(x) ? bar() : baz()`,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "typeof RegExp(\"foo\")",
            output: "typeof /foo/",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp(\"foo\") instanceof RegExp(String.raw`blahblah`, 'g') ? typeof new RegExp('(\\\\p{Emoji_Presentation})\\\\1', `ug`) : false",
            output: "/foo/ instanceof /blahblah/g ? typeof /(\\p{Emoji_Presentation})\\1/ug : false",
            errors: [{ messageId: "unexpectedRegExp" }, { messageId: "unexpectedRegExp" }, { messageId: "unexpectedRegExp" }]
        },
        {
            code: "[   new RegExp(`someregular`)]",
            output: "[   /someregular/]",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `const totallyValidatesEmails = new RegExp("\\\\S+@(\\\\S+\\\\.)+\\\\S+")
            if (typeof totallyValidatesEmails === 'object') {
                runSomethingThatExists(Regexp('stuff'))
            }`,
            output: `const totallyValidatesEmails = /\\S+@(\\S+\\.)+\\S+/
            if (typeof totallyValidatesEmails === 'object') {
                runSomethingThatExists(Regexp('stuff'))
            }`,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "!new RegExp('^Hey, ', 'u') && new RegExp('jk$') && ~new RegExp('^Sup, ') || new RegExp('hi') + new RegExp('person') === -new RegExp('hi again') ? 5 * new RegExp('abc') : 'notregbutstring'",
            output: "!/^Hey, /u && /jk$/ && ~/^Sup, / || /hi/ + /person/ === -/hi again/ ? 5 * /abc/ : 'notregbutstring'",
            errors: [{ messageId: "unexpectedRegExp" }, { messageId: "unexpectedRegExp" }, { messageId: "unexpectedRegExp" }, { messageId: "unexpectedRegExp" }, { messageId: "unexpectedRegExp" }, { messageId: "unexpectedRegExp" }, { messageId: "unexpectedRegExp" }]
        },
        {
            code: `#!/usr/bin/sh
            RegExp("foo")`,
            output: `#!/usr/bin/sh
            /foo/`,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "async function abc(){await new RegExp(\"foo\")}",
            output: null,
            parserOptions: { ecmaVersion: 8, sourceType: "module" },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "function* abc(){yield new RegExp(\"foo\")}",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "function* abc(){yield* new RegExp(\"foo\")}",
            output: "function* abc(){yield* /foo/}",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "console.log({ ...new RegExp('a') })",
            output: "console.log({ .../a/ })",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "delete RegExp('a');",
            output: "delete /a/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "void RegExp('a');",
            output: "void /a/;",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new RegExp(\"\\\\S+@(\\\\S+\\\\.)+\\\\S+\")**RegExp('a')",
            output: "/\\S+@(\\S+\\.)+\\S+/**/a/",
            errors: [{ messageId: "unexpectedRegExp" }, { messageId: "unexpectedRegExp" }]
        },
        {
            code: "new RegExp(\"\\\\S+@(\\\\S+\\\\.)+\\\\S+\")%RegExp('a')",
            output: "/\\S+@(\\S+\\.)+\\S+/%/a/",
            errors: [{ messageId: "unexpectedRegExp" }, { messageId: "unexpectedRegExp" }]
        },
        {
            code: "a in RegExp('abc')",
            output: "a in /abc/",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            /abc/ == new RegExp('cba');
            `,
            output: `
            /abc/ == /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            /abc/ === new RegExp('cba');
            `,
            output: `
            /abc/ === /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            /abc/ != new RegExp('cba');
            `,
            output: `
            /abc/ != /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            /abc/ !== new RegExp('cba');
            `,
            output: `
            /abc/ !== /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            /abc/ > new RegExp('cba');
            `,
            output: `
            /abc/ > /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            /abc/ < new RegExp('cba');
            `,
            output: `
            /abc/ < /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            /abc/ >= new RegExp('cba');
            `,
            output: `
            /abc/ >= /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            /abc/ <= new RegExp('cba');
            `,
            output: `
            /abc/ <= /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            /abc/ << new RegExp('cba');
            `,
            output: `
            /abc/ << /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            /abc/ >> new RegExp('cba');
            `,
            output: `
            /abc/ >> /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            /abc/ >>> new RegExp('cba');
            `,
            output: `
            /abc/ >>> /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            /abc/ ^ new RegExp('cba');
            `,
            output: `
            /abc/ ^ /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            /abc/ & new RegExp('cba');
            `,
            output: `
            /abc/ & /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            /abc/ | new RegExp('cba');
            `,
            output: `
            /abc/ | /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            null ?? new RegExp('blah')
            `,
            output: `
            null ?? /blah/
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc *= new RegExp('blah')
            `,
            output: `
            abc *= /blah/
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            console.log({a: new RegExp('sup')})
            `,
            output: `
            console.log({a: /sup/})
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            console.log(() => {new RegExp('sup')})
            `,
            output: `
            console.log(() => {/sup/})
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            function abc() {new RegExp('sup')}
            `,
            output: `
            function abc() {/sup/}
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            function abc() {return new RegExp('sup')}
            `,
            output: `
            function abc() {return /sup/}
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc <<= new RegExp('cba');
            `,
            output: `
            abc <<= /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc >>= new RegExp('cba');
            `,
            output: `
            abc >>= /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc >>>= new RegExp('cba');
            `,
            output: `
            abc >>>= /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc ^= new RegExp('cba');
            `,
            output: `
            abc ^= /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc &= new RegExp('cba');
            `,
            output: `
            abc &= /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc |= new RegExp('cba');
            `,
            output: `
            abc |= /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc ??= new RegExp('cba');
            `,
            output: `
            abc ??= /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc &&= new RegExp('cba');
            `,
            output: `
            abc &&= /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc ||= new RegExp('cba');
            `,
            output: `
            abc ||= /cba/;
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc **= new RegExp('blah')
            `,
            output: `
            abc **= /blah/
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc /= new RegExp('blah')
            `,
            output: `
            abc /= /blah/
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc += new RegExp('blah')
            `,
            output: `
            abc += /blah/
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc -= new RegExp('blah')
            `,
            output: `
            abc -= /blah/
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            abc %= new RegExp('blah')
            `,
            output: `
            abc %= /blah/
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            () => new RegExp('blah')
            `,
            output: `
            () => /blah/
            `,
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "a/RegExp(\"foo\")in b",
            output: "a/ /foo/ in b",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "a/RegExp(\"foo\")instanceof b",
            output: "a/ /foo/ instanceof b",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "do RegExp(\"foo\")\nwhile (true);",
            output: "do /foo/\nwhile (true);",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "for(let i;i<5;i++) { break\nnew RegExp('search')}",
            output: "for(let i;i<5;i++) { break\n/search/}",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "for(let i;i<5;i++) { continue\nnew RegExp('search')}",
            output: "for(let i;i<5;i++) { continue\n/search/}",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: `
            switch (value) {
                case "possibility":
                    console.log('possibility matched')
                case RegExp('myReg').toString():
                    console.log('matches a regexp\\' toString value')
                    break;
            }
            `,
            output: `
            switch (value) {
                case "possibility":
                    console.log('possibility matched')
                case /myReg/.toString():
                    console.log('matches a regexp\\' toString value')
                    break;
            }
            `,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "throw new RegExp('abcdefg') // fail with a regular expression",
            output: "throw /abcdefg/ // fail with a regular expression",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "for (value of new RegExp('something being searched')) { console.log(value) }",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "(async function(){for await (value of new RegExp('something being searched')) { console.log(value) }})()",
            output: null,
            parserOptions: { ecmaVersion: 2018 },
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "for (value in new RegExp('something being searched')) { console.log(value) }",
            output: "for (value in /something being searched/) { console.log(value) }",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "if (condition1 && condition2) new RegExp('avalue').test(str);",
            output: null,
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "debugger\nnew RegExp('myReg')",
            output: "debugger\n/myReg/",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp(\"\\\\\\n\")",
            output: "/\\n/",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp(\"\\\\\\t\")",
            output: "/\\t/",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp(\"\\\\\\f\")",
            output: "/\\f/",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp(\"\\\\\\v\")",
            output: "/\\v/",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "RegExp(\"\\\\\\r\")",
            output: "/\\r/",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new RegExp(\"\t\")",
            output: "/\\t/",
            errors: [{ messageId: "unexpectedRegExp" }]
        },
        {
            code: "new RegExp(\"/\")",
            output: "/\\//",
            errors: [{ messageId: "unexpectedRegExp" }]
        }
    ]
});
