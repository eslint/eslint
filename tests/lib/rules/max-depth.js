/**
 * @fileoverview Tests for max-depth.
 * @author Ian Christian Myers
 * @copyright 2013 Ian Christian Myers. All rights reserved.
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
eslintTester.addRuleTest("lib/rules/max-depth", {
    valid: [
        { code: "function foo() { if (true) { if (false) { if (true) { } } } }", args: [1, 3] },
        { code: "function foo() { if (true) { } else if (false) { } else if (true) { } else if (false) {} }", args: [1, 3] },
        { code: "var foo = () => { if (true) { if (false) { if (true) { } } } }", args: [1, 3], ecmaFeatures: { arrowFunctions: true } },
        "function foo() { if (true) { if (false) { if (true) { } } } }"
    ],
    invalid: [
        { code: "function foo() { if (true) { if (false) { if (true) { } } } }", args: [1, 2], errors: [{ message: "Blocks are nested too deeply (3).", type: "IfStatement"}] },
        { code: "var foo = () => { if (true) { if (false) { if (true) { } } } }", args: [1, 2], ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "Blocks are nested too deeply (3).", type: "IfStatement"}] },
        { code: "function foo() { if (true) {} else { for(;;) {} } }", args: [1, 1], errors: [{ message: "Blocks are nested too deeply (2).", type: "ForStatement"}] },
        { code: "function foo() { while (true) { if (true) {} } }", args: [1, 1], errors: [{ message: "Blocks are nested too deeply (2).", type: "IfStatement"}] },
        { code: "function foo() { for (let x of foo) { if (true) {} } }", args: [1, 1], ecmaFeatures: { blockBindings: true, forOf: true }, errors: [{ message: "Blocks are nested too deeply (2).", type: "IfStatement"}] },
        { code: "function foo() { while (true) { if (true) { if (false) { } } } }", args: [1, 1], errors: [{ message: "Blocks are nested too deeply (2).", type: "IfStatement"}, { message: "Blocks are nested too deeply (3).", type: "IfStatement"}] }
    ]
});
