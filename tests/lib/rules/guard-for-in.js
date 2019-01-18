/**
 * @fileoverview Tests for guard-for-in rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/guard-for-in"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const error = { messageId: "wrap", type: "ForInStatement" };

ruleTester.run("guard-for-in", rule, {
    valid: [
        "for (var x in o);",
        "for (var x in o) {}",
        "for (var x in o) if (x) f();",
        "for (var x in o) { if (x) { f(); } }",
        "for (var x in o) { if (x) continue; f(); }",
        "for (var x in o) { if (x) { continue; } f(); }"
    ],
    invalid: [
        { code: "for (var x in o) { if (x) { f(); continue; } g(); }", errors: [error] },
        { code: "for (var x in o) { if (x) { continue; f(); } g(); }", errors: [error] },
        { code: "for (var x in o) { if (x) { f(); } g(); }", errors: [error] },
        { code: "for (var x in o) { if (x) f(); g(); }", errors: [error] },
        { code: "for (var x in o) { foo() }", errors: [error] },
        { code: "for (var x in o) foo();", errors: [error] }
    ]
});
