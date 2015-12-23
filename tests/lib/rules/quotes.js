/**
 * @fileoverview Tests for quotes rule.
 * @author Matt DuVall <http://www.mattduvall.com/>, Michael Paulukonis
 * @copyright 2013 Matt DuVall. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/quotes"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();
ruleTester.run("quotes", rule, {
    valid: [
        "var foo = \"bar\";",
        { code: "var foo = \"bar\";"},
        { code: "var foo = 'bar';", options: ["single"] },
        { code: "var foo = \"bar\";", options: ["double"] },
        { code: "var foo = 1;", options: ["single"] },
        { code: "var foo = 1;", options: ["double"] },
        { code: "var foo = \"'\";", options: ["single", "avoid-escape"] },
        { code: "var foo = '\"';", options: ["double", "avoid-escape"] },
        { code: "var foo = <div>Hello world</div>;", options: ["single"], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var foo = <div id=\"foo\"></div>;", options: ["single"], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var foo = <div>Hello world</div>;", options: ["double"], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var foo = <div>Hello world</div>;", options: ["double", "avoid-escape"], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var foo = `bar`;", options: ["backtick"], parserOptions: { ecmaVersion: 6 }},
        { code: "var foo = `bar 'baz'`;", options: ["backtick"], parserOptions: { ecmaVersion: 6 }},
        { code: "var foo = `bar \"baz\"`;", options: ["backtick"], parserOptions: { ecmaVersion: 6 }},
        { code: "var foo = 1;", options: ["backtick"]},
        { code: "var foo = \"a string containing `backtick` quotes\";", options: ["backtick", "avoid-escape"] },
        { code: "var foo = <div id=\"foo\"></div>;", options: ["backtick"], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var foo = <div>Hello world</div>;", options: ["backtick"], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }},

        // Backticks are only okay if they have substitutions, contain a line break, or are tagged
        { code: "var foo = `back\ntick`;", options: ["single"], parserOptions: { ecmaVersion: 6 }},
        { code: "var foo = `back${x}tick`;", options: ["double"], parserOptions: { ecmaVersion: 6 }},
        { code: "var foo = tag`backtick`;", options: ["double"], parserOptions: { ecmaVersion: 6 }},

        // `backtick` should not warn the directive prologues.
        { code: "\"use strict\"; var foo = `backtick`;", options: ["backtick"], parserOptions: { ecmaVersion: 6 }},
        { code: "\"use strict\"; 'use strong'; \"use asm\"; var foo = `backtick`;", options: ["backtick"], parserOptions: { ecmaVersion: 6 }},
        { code: "function foo() { \"use strict\"; \"use strong\"; \"use asm\"; var foo = `backtick`; }", options: ["backtick"], parserOptions: { ecmaVersion: 6 }},
        { code: "(function() { 'use strict'; 'use strong'; 'use asm'; var foo = `backtick`; })();", options: ["backtick"], parserOptions: { ecmaVersion: 6 }},
        { code: "(() => { \"use strict\"; \"use strong\"; \"use asm\"; var foo = `backtick`; })();", options: ["backtick"], parserOptions: { ecmaVersion: 6 }},

        // `backtick` should not warn import/export sources.
        { code: "import \"a\"; import 'b';", options: ["backtick"], parserOptions: { sourceType: "module" }},
        { code: "import a from \"a\"; import b from 'b';", options: ["backtick"], parserOptions: { sourceType: "module" }},
        { code: "export * from \"a\"; export * from 'b';", options: ["backtick"], parserOptions: { sourceType: "module" }},

        // `backtick` should not warn property names (not computed).
        { code: "var obj = {\"key0\": 0, 'key1': 1};", options: ["backtick"], parserOptions: { ecmaVersion: 6 }}
    ],
    invalid: [
        {
            code: "var foo = 'bar';",
            output: "var foo = \"bar\";",
            errors: [{ message: "Strings must use doublequote.", type: "Literal"}]
        },
        {
            code: "var foo = \"bar\";",
            output: "var foo = 'bar';",
            options: ["single"],
            errors: [{ message: "Strings must use singlequote.", type: "Literal"}]
        },
        {
            code: "var foo = `bar`;",
            output: "var foo = 'bar';",
            options: ["single"],
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{ message: "Strings must use singlequote.", type: "TemplateLiteral"}]
        },
        {
            code: "var foo = 'don\\'t';",
            output: "var foo = \"don't\";",
            errors: [{ message: "Strings must use doublequote.", type: "Literal"}]
        },
        {
            code: "var msg = \"Plugin '\" + name + \"' not found\"",
            output: "var msg = 'Plugin \\'' + name + '\\' not found'",
            options: ["single"],
            errors: [
                { message: "Strings must use singlequote.", type: "Literal", column: 11 },
                { message: "Strings must use singlequote.", type: "Literal", column: 31 }
            ]
        },
        {
            code: "var foo = 'bar';",
            output: "var foo = \"bar\";",
            options: ["double"],
            errors: [{ message: "Strings must use doublequote.", type: "Literal"}]
        },
        {
            code: "var foo = `bar`;",
            output: "var foo = \"bar\";",
            options: ["double"],
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{ message: "Strings must use doublequote.", type: "TemplateLiteral"}]
        },
        {
            code: "var foo = \"bar\";",
            output: "var foo = 'bar';",
            options: ["single", "avoid-escape"],
            errors: [{ message: "Strings must use singlequote.", type: "Literal" }]
        },
        {
            code: "var foo = 'bar';",
            output: "var foo = \"bar\";",
            options: ["double", "avoid-escape"],
            errors: [{ message: "Strings must use doublequote.", type: "Literal" }]
        },
        {
            code: "var foo = '\\\\';",
            output: "var foo = \"\\\\\";",
            options: ["double", "avoid-escape"],
            errors: [{ message: "Strings must use doublequote.", type: "Literal" }]
        },
        {
            code: "var foo = 'bar';",
            output: "var foo = `bar`;",
            options: ["backtick"],
            errors: [{ message: "Strings must use backtick.", type: "Literal" }]
        },
        {
            code: "var foo = 'b${x}a$r';",
            output: "var foo = `b\\${x}a$r`;",
            options: ["backtick"],
            errors: [{ message: "Strings must use backtick.", type: "Literal" }]
        },
        {
            code: "var foo = \"bar\";",
            output: "var foo = `bar`;",
            options: ["backtick"],
            errors: [{ message: "Strings must use backtick.", type: "Literal" }]
        },
        {
            code: "var foo = \"bar\";",
            output: "var foo = `bar`;",
            options: ["backtick", "avoid-escape"],
            errors: [{ message: "Strings must use backtick.", type: "Literal" }]
        },
        {
            code: "var foo = 'bar';",
            output: "var foo = `bar`;",
            options: ["backtick", "avoid-escape"],
            errors: [{ message: "Strings must use backtick.", type: "Literal" }]
        },

        // "use strict" is *not* a directive prologue in these statements so is subject to the rule
        {
            code: "var foo = `backtick`; \"use strict\";",
            output: "var foo = `backtick`; `use strict`;",
            options: ["backtick"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Strings must use backtick.", type: "Literal" }]
        },
        {
            code: "{ \"use strict\"; var foo = `backtick`; }",
            output: "{ `use strict`; var foo = `backtick`; }",
            options: ["backtick"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Strings must use backtick.", type: "Literal" }]
        },
        {
            code: "if (1) { \"use strict\"; var foo = `backtick`; }",
            output: "if (1) { `use strict`; var foo = `backtick`; }",
            options: ["backtick"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Strings must use backtick.", type: "Literal" }]
        },

        // `backtick` should not warn computed property names.
        {
            code: "var obj = {[\"key0\"]: 0, ['key1']: 1};",
            output: "var obj = {[`key0`]: 0, [`key1`]: 1};",
            options: ["backtick"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Strings must use backtick.", type: "Literal" },
                { message: "Strings must use backtick.", type: "Literal" }
            ]
        }
    ]
});
