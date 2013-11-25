/**
 * @fileoverview Tests for no-else-return rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-else-return", {
    valid: [
        "function foo() { if (true) { if (false) { return x; } } else { return y; } }",
        "function foo() { if (true) { return x; } return y; }",
        "function foo() { if (true) { for (;;) { return x; } } else { return y; } }",
        "function foo() { if (true) notAReturn(); else return y; }"
    ],
    invalid: [
        { code: "function foo() { if (true) { return x; } else { return y; } }", errors: [{ message: "Unexpected 'else' after 'return'​.", type: "BlockStatement"}] },
        { code: "function foo() { if (true) { var x = bar; return x; } else { var y = baz; return y; } }", errors: [{ message: "Unexpected 'else' after 'return'​.", type: "BlockStatement"}] },
        { code: "function foo() { if (true) return x; else return y; }", errors: [{ message: "Unexpected 'else' after 'return'​.", type: "ReturnStatement"}] }
    ]
});
