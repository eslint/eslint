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
        { code: "var foo = `backtick`;", args: [1, "double"], ecmaFeatures: { templateStrings: true }}
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
          errors: [{ message: "Strings must use backtick.", type: "Literal" }]}
    ]
});
