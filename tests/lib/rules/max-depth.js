/**
 * @fileoverview Tests for max-depth.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/max-depth"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("max-depth", rule, {
    valid: [
        { code: "function foo() { if (true) { if (false) { if (true) { } } } }", options: [3] },
        { code: "function foo() { if (true) { } else if (false) { } else if (true) { } else if (false) {} }", options: [3] },
        { code: "var foo = () => { if (true) { if (false) { if (true) { } } } }", options: [3], parserOptions: { ecmaVersion: 6 } },
        "function foo() { if (true) { if (false) { if (true) { } } } }",

        // object property options
        { code: "function foo() { if (true) { if (false) { if (true) { } } } }", options: [{ max: 3 }] }
    ],
    invalid: [
        { code: "function foo() { if (true) { if (false) { if (true) { } } } }", options: [2], errors: [{ messageId: "tooDeeply", data: { depth: 3 }, type: "IfStatement" }] },
        { code: "var foo = () => { if (true) { if (false) { if (true) { } } } }", options: [2], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "tooDeeply", data: { depth: 3 }, type: "IfStatement" }] },
        { code: "function foo() { if (true) {} else { for(;;) {} } }", options: [1], errors: [{ messageId: "tooDeeply", data: { depth: 2 }, type: "ForStatement" }] },
        { code: "function foo() { while (true) { if (true) {} } }", options: [1], errors: [{ messageId: "tooDeeply", data: { depth: 2 }, type: "IfStatement" }] },
        { code: "function foo() { for (let x of foo) { if (true) {} } }", options: [1], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "tooDeeply", data: { depth: 2 }, type: "IfStatement" }] },
        { code: "function foo() { while (true) { if (true) { if (false) { } } } }", options: [1], errors: [{ messageId: "tooDeeply", data: { depth: 2 }, type: "IfStatement" }, { messageId: "tooDeeply", data: { depth: 3 }, type: "IfStatement" }] },
        { code: "function foo() { if (true) { if (false) { if (true) { if (false) { if (true) { } } } } } }", errors: [{ messageId: "tooDeeply", data: { depth: 5 }, type: "IfStatement" }] },

        // object property options
        { code: "function foo() { if (true) { if (false) { if (true) { } } } }", options: [{ max: 2 }], errors: [{ messageId: "tooDeeply", data: { depth: 3 }, type: "IfStatement" }] },

        { code: "function foo() { if (a) { if (b) { if (c) { if (d) { if (e) {} } } } } }", options: [{}], errors: [{ messageId: "tooDeeply", data: { depth: 5 } }] },
        { code: "function foo() { if (true) {} }", options: [{ max: 0 }], errors: [{ messageId: "tooDeeply", data: { depth: 1 } }] }
    ]
});
