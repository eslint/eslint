/**
 * @fileoverview Tests for no-multi-str rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-multi-str", {
    valid: [
        "var a = 'Line 1 Line 2';",
        { code: "var a = <div>\n<h1>Wat</h1>\n</div>;", ecmaFeatures: { jsx: true }}
    ],
    invalid: [
        { code: "var x = 'Line 1 \\\n Line 2'", errors: [{ message: "Multiline support is limited to browsers supporting ES5 only.", type: "Literal"}] },
        { code: "test('Line 1 \\\n Line 2');", errors: [{ message: "Multiline support is limited to browsers supporting ES5 only.", type: "Literal"}] }
    ]
});
