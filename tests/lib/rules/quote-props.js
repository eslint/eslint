/**
 * @fileoverview Tests for quote-props rule.
 * @author Mathias Bynens <http://mathiasbynens.be/>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/quote-props", {
    valid: [
        "var x = { 'foo': 42 }",
        "var x = { \"foo\": 42 }"
           ],
    invalid: [
        { code: "var x = { foo: 42 }",
          errors: [{ message: "Non-quoted property `foo` found.", type: "Property"}] }
    ]
});
