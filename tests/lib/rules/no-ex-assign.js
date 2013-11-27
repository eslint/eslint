/**
 * @fileoverview Tests for no-ex-assign rule.
 * @author Stephen Murray <spmurrayzzz>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("no-ex-assign", {
    valid: [
        "try { } catch (e) { three = 2 + 1; }",
        "function foo() { try { } catch (e) { return false; } }"
    ],
    invalid: [
        { code: "try { } catch (e) { e = 10; }", errors: [{ message: "Do not assign to the exception parameter.", type: "AssignmentExpression"}] },
        { code: "try { } catch (ex) { ex = 10; }", errors: [{ message: "Do not assign to the exception parameter.", type: "AssignmentExpression"}] }
    ]
});
