/**
 * @fileoverview Tests for max-depth.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/max-depth", {
    valid: [
        { code: "function foo() { if (true) { if (false) { if (true) { } } } }", args: [1, 3] },
        "function foo() { if (true) { if (false) { if (true) { } } } }"
    ],
    invalid: [
        { code: "function foo() { if (true) { if (false) { if (true) { } } } }", args: [1, 2], errors: [{ message: "Blocks are nested too deeply (3).", type: "IfStatement"}] },
        { code: "function foo() { if (true) {} else { for(;;) {} } }", args: [1, 1], errors: [{ message: "Blocks are nested too deeply (2).", type: "ForStatement"}] },
        { code: "function foo() { while (true) { if (true) {} } }", args: [1, 1], errors: [{ message: "Blocks are nested too deeply (2).", type: "IfStatement"}] },
        { code: "function foo() { while (true) { if (true) { if (false) { } } } }", args: [1, 1], errors: [{ message: "Blocks are nested too deeply (2).", type: "IfStatement"}, { message: "Blocks are nested too deeply (3).", type: "IfStatement"}] }
    ]
});
