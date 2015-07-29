/**
 * @fileoverview Tests for quotes rule.
 * @author Matt DuVall <http://www.mattduvall.com/>, Michael Paulukonis
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
        { code: "var foo = 'bar';", options: ["single"] },
        { code: "var foo = \"bar\";", options: ["double"] },
        { code: "var foo = 1;", options: ["single"] },
        { code: "var foo = 1;", options: ["double"] },
        { code: "var foo = \"'\";", options: ["single", "avoid-escape"] },
        { code: "var foo = '\"';", options: ["double", "avoid-escape"] },
        { code: "var foo = <div>Hello world</div>;", options: ["single"], ecmaFeatures: { jsx: true } },
        { code: "var foo = <div id=\"foo\"></div>;", options: ["single"], ecmaFeatures: { jsx: true } },
        { code: "var foo = <div>Hello world</div>;", options: ["double"], ecmaFeatures: { jsx: true } },
        { code: "var foo = <div>Hello world</div>;", options: ["double", "avoid-escape"], ecmaFeatures: { jsx: true } },
        { code: "var foo = `bar`;", options: ["backtick"], ecmaFeatures: { templateStrings: true }},
        { code: "var foo = `bar 'baz'`;", options: ["backtick"], ecmaFeatures: { templateStrings: true }},
        { code: "var foo = `bar \"baz\"`;", options: ["backtick"], ecmaFeatures: { templateStrings: true }},
        { code: "var foo = 1;", options: ["backtick"]},
        { code: "var foo = \"a string containing `backtick` quotes\";", options: ["backtick", "avoid-escape"] },
        { code: "var foo = <div id=\"foo\"></div>;", options: ["backtick"], ecmaFeatures: { jsx: true } },
        { code: "var foo = <div>Hello world</div>;", options: ["backtick"], ecmaFeatures: { jsx: true }},
        { code: "var foo = `backtick`;", options: ["single"], ecmaFeatures: { templateStrings: true }},
        { code: "var foo = `backtick`;", options: ["double"], ecmaFeatures: { templateStrings: true }},

        // `backtick` should not warn the directive prologues.
        { code: "\"use strict\"; var foo = `backtick`;", options: ["backtick"], ecmaFeatures: { templateStrings: true }},
        { code: "\"use strict\"; 'use strong'; \"use asm\"; var foo = `backtick`;", options: ["backtick"], ecmaFeatures: { templateStrings: true }},
        { code: "function foo() { \"use strict\"; \"use strong\"; \"use asm\"; var foo = `backtick`; }", options: ["backtick"], ecmaFeatures: { templateStrings: true }},
        { code: "(function() { 'use strict'; 'use strong'; 'use asm'; var foo = `backtick`; })();", options: ["backtick"], ecmaFeatures: { templateStrings: true }},
        { code: "(() => { \"use strict\"; \"use strong\"; \"use asm\"; var foo = `backtick`; })();", options: ["backtick"], ecmaFeatures: { arrowFunctions: true, templateStrings: true }}
    ],
    invalid: [
        { code: "var foo = 'bar';",
          errors: [{ message: "Strings must use doublequote.", type: "Literal"}] },
        { code: "var foo = \"bar\";",
          options: ["single"],
          errors: [{ message: "Strings must use singlequote.", type: "Literal"}] },
        { code: "var foo = 'bar';",
          options: ["double"],
          errors: [{ message: "Strings must use doublequote.", type: "Literal"}] },
        { code: "var foo = \"bar\";",
          options: ["single", "avoid-escape"],
          errors: [{ message: "Strings must use singlequote.", type: "Literal" }]},
        { code: "var foo = 'bar';",
          options: ["double", "avoid-escape"],
          errors: [{ message: "Strings must use doublequote.", type: "Literal" }]},
        { code: "var foo = 'bar';",
          options: ["backtick"],
          errors: [{ message: "Strings must use backtick.", type: "Literal" }]},
        { code: "var foo = \"bar\";",
          options: ["backtick"],
          errors: [{ message: "Strings must use backtick.", type: "Literal" }]},
        { code: "var foo = \"bar\";",
          options: ["backtick", "avoid-escape"],
          errors: [{ message: "Strings must use backtick.", type: "Literal" }]},
        { code: "var foo = 'bar';",
          options: ["backtick", "avoid-escape"],
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
          errors: [{ message: "Strings must use backtick.", type: "Literal" }]}
    ]
});
