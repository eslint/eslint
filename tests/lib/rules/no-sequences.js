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
        "var foo = (1, 2);",
        "(0,eval)(\"foo()\");",
        "for (i = 1, j = 2;; i++, j++);",
        "foo(a, (b, c), d);",
        "do {} while ((doSomething(), !!test));",
        "for ((doSomething(), somethingElse()); (doSomething(), !!test); );",
        "if ((doSomething(), !!test));",
        "switch ((doSomething(), val)) {}",
        "while ((doSomething(), !!test));",
        "with ((doSomething(), val)) {}",
        { code: "a => ((doSomething(), a))", env: { es6: true } },

        // options object without "allowInParentheses" property
        { code: "var foo = (1, 2);", options: [{}] },

        // explicitly set option "allowInParentheses" to default value
        { code: "var foo = (1, 2);", options: [{ allowInParentheses: true }] },

        // valid code with "allowInParentheses" set to `false`
        { code: "for ((i = 0, j = 0); test; );", options: [{ allowInParentheses: false }] },
        { code: "for (; test; (i++, j++));", options: [{ allowInParentheses: false }] },

        // https://github.com/eslint/eslint/issues/14572
        { code: "const foo = () => { return ((bar = 123), 10) }", env: { es6: true } },
        { code: "const foo = () => (((bar = 123), 10));", env: { es6: true } }
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
        { code: "do {} while (doSomething(), !!test);", errors: errors(27) },
        { code: "for (; doSomething(), !!test; );", errors: errors(21) },
        { code: "if (doSomething(), !!test);", errors: errors(18) },
        { code: "switch (doSomething(), val) {}", errors: errors(22) },
        { code: "while (doSomething(), !!test);", errors: errors(21) },
        { code: "with (doSomething(), val) {}", errors: errors(20) },
        { code: "a => (doSomething(), a)", env: { es6: true }, errors: errors(20) },
        { code: "(1), 2", errors: errors(4) },
        { code: "((1)) , (2)", errors: errors(7) },
        { code: "while((1) , 2);", errors: errors(11) },

        // option "allowInParentheses": do not allow sequence in parentheses
        { code: "var foo = (1, 2);", options: [{ allowInParentheses: false }], errors: errors(13) },
        { code: "(0,eval)(\"foo()\");", options: [{ allowInParentheses: false }], errors: errors(3) },
        { code: "foo(a, (b, c), d);", options: [{ allowInParentheses: false }], errors: errors(10) },
        { code: "do {} while ((doSomething(), !!test));", options: [{ allowInParentheses: false }], errors: errors(28) },
        { code: "for (; (doSomething(), !!test); );", options: [{ allowInParentheses: false }], errors: errors(22) },
        { code: "if ((doSomething(), !!test));", options: [{ allowInParentheses: false }], errors: errors(19) },
        { code: "switch ((doSomething(), val)) {}", options: [{ allowInParentheses: false }], errors: errors(23) },
        { code: "while ((doSomething(), !!test));", options: [{ allowInParentheses: false }], errors: errors(22) },
        { code: "with ((doSomething(), val)) {}", options: [{ allowInParentheses: false }], errors: errors(21) },
        { code: "a => ((doSomething(), a))", options: [{ allowInParentheses: false }], env: { es6: true }, errors: errors(21) }
    ]
});
