/**
 * @fileoverview Tests for no-sequences rule.
 * @author Brandon Mills
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-sequences"),
    { RuleTester } = require("../../../lib/rule-tester");

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
        messageId: "unexpectedCommaExpression",
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
        { code: "var foo = (1, 2);", options: [{ allowInParentheses: true }] },
        { code: "(0,eval)(\"foo()\");", options: [{ allowInParentheses: true }] },
        "for (i = 1, j = 2;; i++, j++);",
        { code: "foo(a, (b, c), d);", options: [{ allowInParentheses: true }] },
        { code: "do {} while ((doSomething(), !!test));", options: [{ allowInParentheses: true }] },
        { code: "for ((doSomething(), somethingElse()); (doSomething(), !!test); );", options: [{ allowInParentheses: true }] },
        { code: "if ((doSomething(), !!test));", options: [{ allowInParentheses: true }] },
        { code: "switch ((doSomething(), val)) {}", options: [{ allowInParentheses: true }] },
        { code: "while ((doSomething(), !!test));", options: [{ allowInParentheses: true }] },
        { code: "with ((doSomething(), val)) {}", options: [{ allowInParentheses: true }] },
        { code: "a => ((doSomething(), a))", options: [{ allowInParentheses: true }], env: { es6: true } }
    ],

    // Examples of code that should trigger the rule
    invalid: [
        {
            code: "1, 2;",
            errors: [{
                messageId: "unexpectedCommaExpression",
                type: "SequenceExpression",
                line: 1,
                column: 2,
                endLine: 1,
                endColumn: 3
            }]
        },
        { code: "a = 1, 2", errors: errors(6) },
        { code: "var foo = (1, 2);", options: [{ allowInParentheses: false }], errors: errors(13) },
        { code: "(0,eval)(\"foo()\");", errors: errors(3) },
        { code: "foo(a, (b, c), d);", errors: errors(10) },
        { code: "do {} while (doSomething(), !!test);", errors: errors(27) },
        { code: "do {} while ((doSomething(), !!test));", errors: errors(28) },
        { code: "for (; doSomething(), !!test; );", errors: errors(21) },
        { code: "for ((doSomething(), somethingElse()); (doSomething(), !!test); );", errors: errors(54) },
        { code: "if (doSomething(), !!test);", errors: errors(18) },
        { code: "if ((doSomething(), !!test));", errors: errors(19) },
        { code: "switch (doSomething(), val) {}", errors: errors(22) },
        { code: "switch ((doSomething(), val)) {}", errors: errors(23) },
        { code: "while (doSomething(), !!test);", errors: errors(21) },
        { code: "while ((doSomething(), !!test));", errors: errors(22) },
        { code: "with (doSomething(), val) {}", errors: errors(20) },
        { code: "with ((doSomething(), val)) {}", errors: errors(21) },
        { code: "a => (doSomething(), a)", env: { es6: true }, errors: errors(20) },
        { code: "a => ((doSomething(), a))", env: { es6: true }, errors: errors(21) },
        { code: "(1), 2", errors: errors(4) },
        { code: "((1)) , (2)", errors: errors(7) },
        { code: "while((1) , 2);", errors: errors(11) }
    ]
});
