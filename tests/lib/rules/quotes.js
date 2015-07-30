/**
 * @fileoverview Tests for quotes rule.
 * @author Matt DuVall <http://www.mattduvall.com/>, Michael Paulukonis
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/quotes", {
    valid: [
        "var foo = \"bar\";",
        { code: "var foo = 'bar';", args: [1, "single"] },
        { code: "var foo = \"bar\";", args: [1, "double"] },
        { code: "var foo = 1;", args: [1, "single"] },
        { code: "var foo = 1;", args: [1, "double"] },
        { code: "var foo = \"'\";", args: [1, "single", "avoid-escape"] },
        { code: "var foo = '\"';", args: [1, "double", "avoid-escape"] },
        { code: "var foo = <div>Hello world</div>;", args: [1, "single"], ecmaFeatures: { jsx: true } },
        { code: "var foo = <div id=\"foo\"></div>;", args: [1, "single"], ecmaFeatures: { jsx: true } },
        { code: "var foo = <div>Hello world</div>;", args: [1, "double"], ecmaFeatures: { jsx: true } },
        { code: "var foo = <div>Hello world</div>;", args: [1, "double", "avoid-escape"], ecmaFeatures: { jsx: true } },
        { code: "var foo = `bar`;", args: [1, "backtick"], ecmaFeatures: { templateStrings: true }},
        { code: "var foo = `bar 'baz'`;", args: [1, "backtick"], ecmaFeatures: { templateStrings: true }},
        { code: "var foo = `bar \"baz\"`;", args: [1, "backtick"], ecmaFeatures: { templateStrings: true }},
        { code: "var foo = 1;", args: [1, "backtick"]},
        { code: "var foo = \"a string containing `backtick` quotes\";", args: [1, "backtick", "avoid-escape"] },
        { code: "var foo = <div id=\"foo\"></div>;", args: [1, "backtick"], ecmaFeatures: { jsx: true } },
        { code: "var foo = <div>Hello world</div>;", args: [1, "backtick"], ecmaFeatures: { jsx: true }},
        { code: "var foo = `backtick`;", args: [1, "single"], ecmaFeatures: { templateStrings: true }},
        { code: "var foo = `backtick`;", args: [1, "double"], ecmaFeatures: { templateStrings: true }},

        // `backtick` should not warn the directive prologues.
        { code: "\"use strict\"; var foo = `backtick`;", options: ["backtick"], ecmaFeatures: { templateStrings: true }},
        { code: "\"use strict\"; 'use strong'; \"use asm\"; var foo = `backtick`;", options: ["backtick"], ecmaFeatures: { templateStrings: true }},
        { code: "function foo() { \"use strict\"; \"use strong\"; \"use asm\"; var foo = `backtick`; }", options: ["backtick"], ecmaFeatures: { templateStrings: true }},
        { code: "(function() { 'use strict'; 'use strong'; 'use asm'; var foo = `backtick`; })();", options: ["backtick"], ecmaFeatures: { templateStrings: true }},
        { code: "(() => { \"use strict\"; \"use strong\"; \"use asm\"; var foo = `backtick`; })();", options: ["backtick"], ecmaFeatures: { arrowFunctions: true, templateStrings: true }},

        // `backtick` should not warn import/export sources.
        { code: "import \"a\"; import 'b';", options: ["backtick"], ecmaFeatures: { modules: true, templateStrings: true }},
        { code: "import a from \"a\"; import b from 'b';", options: ["backtick"], ecmaFeatures: { modules: true, templateStrings: true }},
        { code: "export * from \"a\"; export * from 'b';", options: ["backtick"], ecmaFeatures: { modules: true, templateStrings: true }},

        // `backtick` should not warn property names (not computed).
        { code: "var obj = {\"key0\": 0, 'key1': 1};", options: ["backtick"], ecmaFeatures: { templateStrings: true }}
    ],
    invalid: [
        { code: "var foo = 'bar';",
          errors: [{ message: "Strings must use doublequote.", type: "Literal"}] },
        { code: "var foo = \"bar\";",
          args: [1, "single"],
          errors: [{ message: "Strings must use singlequote.", type: "Literal"}] },
        { code: "var foo = 'bar';",
          args: [1, "double"],
          errors: [{ message: "Strings must use doublequote.", type: "Literal"}] },
        { code: "var foo = \"bar\";",
          args: [1, "single", "avoid-escape"],
          errors: [{ message: "Strings must use singlequote.", type: "Literal" }]},
        { code: "var foo = 'bar';",
          args: [1, "double", "avoid-escape"],
          errors: [{ message: "Strings must use doublequote.", type: "Literal" }]},
        { code: "var foo = 'bar';",
          args: [1, "backtick"],
          errors: [{ message: "Strings must use backtick.", type: "Literal" }]},
        { code: "var foo = \"bar\";",
          args: [1, "backtick"],
          errors: [{ message: "Strings must use backtick.", type: "Literal" }]},
        { code: "var foo = \"bar\";",
          args: [1, "backtick", "avoid-escape"],
          errors: [{ message: "Strings must use backtick.", type: "Literal" }]},
        { code: "var foo = 'bar';",
          args: [1, "backtick", "avoid-escape"],
          errors: [{ message: "Strings must use backtick.", type: "Literal" }]},

        // below are not the directive prologues.
        { code: "var foo = `backtick`; \"use strict\";",
          options: ["backtick"],
          ecmaFeatures: { templateStrings: true },
          errors: [{ message: "Strings must use backtick.", type: "Literal" }]},
        { code: "{ \"use strict\"; var foo = `backtick`; }",
          options: ["backtick"],
          ecmaFeatures: { templateStrings: true },
          errors: [{ message: "Strings must use backtick.", type: "Literal" }]},
        { code: "if (1) { \"use strict\"; var foo = `backtick`; }",
          options: ["backtick"],
          ecmaFeatures: { templateStrings: true },
          errors: [{ message: "Strings must use backtick.", type: "Literal" }]},

        // `backtick` should not warn computed property names.
        { code: "var obj = {[\"key0\"]: 0, ['key1']: 1};",
          options: ["backtick"],
          ecmaFeatures: { objectLiteralComputedProperties: true, templateStrings: true },
          errors: [
              { message: "Strings must use backtick.", type: "Literal" },
              { message: "Strings must use backtick.", type: "Literal" }
          ]}
    ]
});
