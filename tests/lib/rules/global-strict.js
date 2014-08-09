/**
 * @fileoverview Tests for global-strict rule.
 * @author Nicholas C. Zakas
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
eslintTester.addRuleTest("lib/rules/global-strict", {

    valid: [{
        code: "function foo () { \"use strict\"; return; }",
        args: [2, "never"]
    }, {
        code: "\"use strict\"; function foo () { return 42; } foo();",
        args: [2, "always"]
    }, {
        code: "// Intentionally empty",
        args: [2, "always"]
    }],

    invalid: [{
        code: "\"use strict\"; function foo() \n { \n return; }",
        args: [2, "never"],
        errors: [{
            message: "Use the function form of \"use strict\".",
            type: "ExpressionStatement"
        }]
    }, {
        code: "function foo () { \"use strict\"; return; }",
        args: [2, "always"],
        errors: [{
            message: "Use the global form of \"use strict\".",
            type: "Program"
        }]
    }]
});
