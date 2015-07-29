/**
 * @fileoverview Tests for no-else-return rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-else-return"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-else-return", rule, {
    valid: [
        "function foo() { if (true) { if (false) { return x; } } else { return y; } }",
        "function foo() { if (true) { return x; } return y; }",
        "function foo() { if (true) { for (;;) { return x; } } else { return y; } }",
        "function foo() { var x = true; if (x) { return x; } else if (x === false) { return false; } }",
        "function foo() { if (true) notAReturn(); else return y; }",
        "function foo() {if (x) { notAReturn(); } else if (y) { return true; } else { notAReturn(); } }",
        "function foo() {if (x) { return true; } else if (y) { notAReturn() } else { notAReturn(); } }",
        "if (0) { if (0) {} else {} } else {}"
    ],
    invalid: [
        { code: "function foo() { if (true) { return x; } else { return y; } }", errors: [{ message: "Unexpected 'else' after 'return'.", type: "BlockStatement"}] },
        { code: "function foo() { if (true) { var x = bar; return x; } else { var y = baz; return y; } }", errors: [{ message: "Unexpected 'else' after 'return'.", type: "BlockStatement"}] },
        { code: "function foo() { if (true) return x; else return y; }", errors: [{ message: "Unexpected 'else' after 'return'.", type: "ReturnStatement"}] },
        { code: "function foo() { if (true) { if (false) return x; else return y; } else { return z; } }", errors: [{ message: "Unexpected 'else' after 'return'.", type: "ReturnStatement"}, { message: "Unexpected 'else' after 'return'.", type: "BlockStatement"}] },
        { code: "function foo() { if (true) { if (false) { if (true) return x; else w = y; } else { w = x; } } else { return z; } }", errors: [{ message: "Unexpected 'else' after 'return'.", type: "ExpressionStatement"}] },
        { code: "function foo() { if (true) { if (false) { if (true) return x; else return y; } } else { return z; } }", errors: [{ message: "Unexpected 'else' after 'return'.", type: "ReturnStatement"}] },
        { code: "function foo() { if (true) { if (false) { if (true) return x; else return y; } return w; } else { return z; } }", errors: [
            { message: "Unexpected 'else' after 'return'.", type: "ReturnStatement"},
            { message: "Unexpected 'else' after 'return'.", type: "BlockStatement"}
        ] },
        { code: "function foo() { if (true) { if (false) { if (true) return x; else return y; } else { w = x; } } else { return z; } }", errors: [
            { message: "Unexpected 'else' after 'return'.", type: "ReturnStatement"},
            { message: "Unexpected 'else' after 'return'.", type: "BlockStatement"}
        ] },
        {
            code: "function foo() {if (x) { return true; } else if (y) { return true; } else { notAReturn(); } }",
            errors: [{message: "Unexpected 'else' after 'return'.", type: "BlockStatement"}]
        }
    ]
});
