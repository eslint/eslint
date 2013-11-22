/**
 * @fileoverview Tests for no-global-strict rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-global-strict", {
    valid: [
        "function foo () { \"use strict\"; return; }"
    ],
    invalid: [
        { code: "\"use strict\"; function foo() \n { \n return; }", errors: [{ message: "Use the function form of \"use strict\".", type: "ExpressionStatement"}] }
    ]
});
