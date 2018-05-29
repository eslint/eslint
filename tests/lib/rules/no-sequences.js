/**
 * @fileoverview Tests for no-sequences rule.
 * @author Brandon Mills
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-sequences"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

/**
 * Create error message object for failure cases
 * @param {int} column column of the error
 * @returns {Object} returns the error messages collection
 * @private
 */
function errors(column) {
    return [{
        message: "Unexpected use of comma operator.",
        type: "SequenceExpression",
        line: 1,
        column
    }];
}

const ruleTester = new RuleTester();

ruleTester.run("no-sequences", rule, {

    // Examples of code that should not trigger the rule
    valid: [
        "var arr = [1, 2];",
        "var obj = {a: 1, b: 2};",
        "var a = 1, b = 2;",
        "var foo = (1, 2);",
        "(0,eval)(\"foo()\");",
        "for (i = 1, j = 2;; i++, j++);",
        "foo(a, (b, c), d);",
        "do {} while ((doSomething(), !!test));",
        "for ((doSomething(), somethingElse()); (doSomething(), !!test); );",
        "if ((doSomething(), !!test));",
        "switch ((doSomething(), !!test)) {}",
        "while ((doSomething(), !!test));",
        "with ((doSomething(), val)) {}",
        { code: "a => ((doSomething(), a))", env: { es6: true } }
    ],

    // Examples of code that should trigger the rule
    invalid: [
        { code: "a = 1, 2", errors: errors(6) },
        { code: "do {} while (doSomething(), !!test);", errors: errors(27) },
        { code: "for (; doSomething(), !!test; );", errors: errors(21) },
        { code: "if (doSomething(), !!test);", errors: errors(18) },
        { code: "switch (doSomething(), val) {}", errors: errors(22) },
        { code: "while (doSomething(), !!test);", errors: errors(21) },
        { code: "with (doSomething(), val) {}", errors: errors(20) },
        { code: "a => (doSomething(), a)", errors: errors(20), env: { es6: true } }
    ]
});
