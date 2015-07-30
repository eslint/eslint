/**
 * @fileoverview Tests for max-depth.
 * @author Ian Christian Myers
 * @copyright 2013 Ian Christian Myers. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/max-depth"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("max-depth", rule, {
    valid: [
        { code: "function foo() { if (true) { if (false) { if (true) { } } } }", options: [3] },
        { code: "function foo() { if (true) { } else if (false) { } else if (true) { } else if (false) {} }", options: [3] },
        { code: "var foo = () => { if (true) { if (false) { if (true) { } } } }", options: [3], ecmaFeatures: { arrowFunctions: true } },
        "function foo() { if (true) { if (false) { if (true) { } } } }"
    ],
    invalid: [
        { code: "function foo() { if (true) { if (false) { if (true) { } } } }", options: [2], errors: [{ message: "Blocks are nested too deeply (3).", type: "IfStatement"}] },
        { code: "var foo = () => { if (true) { if (false) { if (true) { } } } }", options: [2], ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "Blocks are nested too deeply (3).", type: "IfStatement"}] },
        { code: "function foo() { if (true) {} else { for(;;) {} } }", options: [1], errors: [{ message: "Blocks are nested too deeply (2).", type: "ForStatement"}] },
        { code: "function foo() { while (true) { if (true) {} } }", options: [1], errors: [{ message: "Blocks are nested too deeply (2).", type: "IfStatement"}] },
        { code: "function foo() { for (let x of foo) { if (true) {} } }", options: [1], ecmaFeatures: { blockBindings: true, forOf: true }, errors: [{ message: "Blocks are nested too deeply (2).", type: "IfStatement"}] },
        { code: "function foo() { while (true) { if (true) { if (false) { } } } }", options: [1], errors: [{ message: "Blocks are nested too deeply (2).", type: "IfStatement"}, { message: "Blocks are nested too deeply (3).", type: "IfStatement"}] }
    ]
});
