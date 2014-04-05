/*eslint no-octal-escape: 0 */
/**
 * @fileoverview Tests for no-octal-escape rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-octal-escape", {
    valid: [
        "var foo = \"\\851\";",
        "var foo = \"foo \\\\251 bar\";",
        "var foo = /([abc]) \1/g;"
    ],
    invalid: [
        { code: "var foo = \"foo \\251 bar\";", errors: [{ message: "Don't use octal: '\\2'. Use '\\u....' instead.", type: "Literal"}] },
        { code: "var foo = \"\\751\";", errors: [{ message: "Don't use octal: '\\7'. Use '\\u....' instead.", type: "Literal"}] },
        { code: "var foo = \"\\3s51\";", errors: [{ message: "Don't use octal: '\\3'. Use '\\u....' instead.", type: "Literal"}] },
        { code: "var foo = \"\\\\\\751\";", errors: [{ message: "Don't use octal: '\\7'. Use '\\u....' instead.", type: "Literal"}] }
    ]
});
