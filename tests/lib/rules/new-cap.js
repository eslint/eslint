/**
 * @fileoverview Tests for new-cap rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var Test = require('../../eslint-test');

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "new-cap";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

new Test(RULE_ID)
    .addViolations({
        "var x = new c();": {
            message: "A constructor name should start with an uppercase letter.",
            nodeType: "NewExpression"
        }
    })
    .addNonViolations([
        "var x = new C();",
        "var x = new foo.C();"
    ])
    .export(module);
