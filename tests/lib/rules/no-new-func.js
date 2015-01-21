/**
 * @fileoverview Tests for no-new-func rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-new-func", {
    valid: [
        "var a = new _function(\"b\", \"c\", \"return b+c\");"
    ],
    invalid: [
        { code: "var a = new Function(\"b\", \"c\", \"return b+c\");", errors: [{ message: "The Function constructor is eval.", type: "NewExpression"}] }
    ]
});
