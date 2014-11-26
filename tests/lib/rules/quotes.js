/**
 * @fileoverview Tests for quotes rule.
 * @author Matt DuVall <http://www.mattduvall.com/>, Michael Paulukonis
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/quotes", {
    valid: [
        { code: "var foo = 'bar';", args: [1, "single"] },
        { code: "var foo = \"bar\";", args: [1, "double"] },
        { code: "var foo = 1;", args: [1, "single"] },
        { code: "var foo = 1;", args: [1, "double"] },
        { code: "var foo = \"'\";", args: [1, "single", "avoid-escape"] },
        { code: "var foo = '\"';", args: [1, "double", "avoid-escape"] },
        { code: "var foo = <div>Hello world</div>;", args: [1, "single"], settings: { jsx: true } },
        { code: "var foo = <div id=\"foo\"></div>;", args: [1, "single"], settings: { jsx: true } },
        { code: "var foo = <div>Hello world</div>;", args: [1, "double"], settings: { jsx: true } },
        { code: "var foo = <div>Hello world</div>;", args: [1, "avoid-escape"], settings: { jsx: true } }
    ],
    invalid: [
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
          errors: [{ message: "Strings must use doublequote.", type: "Literal" }]}
    ]
});
