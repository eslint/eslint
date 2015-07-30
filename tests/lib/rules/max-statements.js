/**
 * @fileoverview Tests for max-statements rule.
 * @author Ian Christian Myers
 * @copyright 2013 Ian Christian Myers. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/max-statements"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("max-statements", rule, {
    valid: [
        { code: "var foo = { thing: function() { var bar = 1; var baz = 2; } }", options: [2] },
        { code: "var foo = { thing: () => { var bar = 1; var baz = 2; } }", options: [2], ecmaFeatures: { arrowFunctions: true } },
        { code: "function foo() { var bar = 1; function qux () { var noCount = 2; } return 3; }", options: [3] },
        { code: "function foo() { var bar = 1; if (true) { for (;;) { var qux = null; } } else { quxx(); } return 3; }", options: [6]},
        { code: "function foo() { var x = 5; function bar() { var y = 6; } bar(); z = 10; baz(); }", options: [5]},
        "function foo() { var a; var b; var c; var x; var y; var z; bar(); baz(); qux(); quxx(); }"
    ],
    invalid: [
        { code: "function foo() { var bar = 1; var baz = 2; var qux = 3; }", options: [2], errors: [{ message: "This function has too many statements (3). Maximum allowed is 2."}] },
        { code: "var foo = () => { var bar = 1; var baz = 2; var qux = 3; };", options: [2], ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "This function has too many statements (3). Maximum allowed is 2."}] },
        { code: "var foo = function() { var bar = 1; var baz = 2; var qux = 3; };", options: [2], errors: [{ message: "This function has too many statements (3). Maximum allowed is 2."}] },
        { code: "function foo() { var bar = 1; if (true) { while (false) { var qux = null; } } return 3; }", options: [4], errors: [{ message: "This function has too many statements (5). Maximum allowed is 4."}] },
        { code: "function foo() { var bar = 1; if (true) { for (;;) { var qux = null; } } return 3; }", options: [4], errors: [{ message: "This function has too many statements (5). Maximum allowed is 4."}] },
        { code: "function foo() { var bar = 1; if (true) { for (;;) { var qux = null; } } else { quxx(); } return 3; }", options: [5], errors: [{ message: "This function has too many statements (6). Maximum allowed is 5."}] },
        { code: "function foo() { var x = 5; function bar() { var y = 6; } bar(); z = 10; baz(); }", options: [3], errors: [{ message: "This function has too many statements (5). Maximum allowed is 3."}] },
        { code: "function foo() { var x = 5; function bar() { var y = 6; } bar(); z = 10; baz(); }", options: [4], errors: [{ message: "This function has too many statements (5). Maximum allowed is 4."}] }
    ]
});
