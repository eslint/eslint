/**
 * @fileoverview Tests for regex-spaces rule.
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

eslintTester.addRuleTest("lib/rules/regex-spaces", {
    valid: [
        "var foo = /bar {3}baz/;",
        "var foo = /bar\t\t\tbaz/;"
           ],
    invalid: [
        { code: "var foo = /bar    baz/;",
          errors: [{ message: "Spaces are hard to count. Use {4}.", type: "Literal"}] }
    ]
});
