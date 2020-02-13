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
        "(1, 2);",
        "var a = 1, b = 2, c = 3",
        "var a = b = 1, c = 2",
        "var a = b = 1, c",
        { code: "let a = 1, b = 2, c = 3", env: { es6: true } },
        { code: "const a = 1, b = 2, c = 3", env: { es6: true } },
        "var a = ((b = 1, c = 2))",
        "var a = ((b, c = 2))",
        "var a = ((b = 1, c))",
        { code: "let a = ((b = 1, c = 2))", env: { es6: true } },
        { code: "let a = ((b, c = 2))", env: { es6: true } },
        { code: "let a = ((b = 1, c))", env: { es6: true } },
        { code: "const a = ((b = 1, c = 2))", env: { es6: true } },
        { code: "const a = ((b, c = 2))", env: { es6: true } },
        { code: "const a = ((b = 1, c))", env: { es6: true } },
        "a = ((b = 1, c = 2))",
        "a = ((b, c = 2))",
        "a = ((b = 1, c))",
        "if ((a = 1, b = 2));",
        "if ((a = b = 1, c = 2));",
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
        { code: "var a = 1, b = 2, c = (d = 3, e = 4)", errors: errors(29) },
        { code: "var a = b = 1, c = (d = 3, e = 4)", errors: errors(26) },
        { code: "var a = (b = 1, c = 2)", errors: errors(15) },
        { code: "var a = (b, c = 2)", errors: errors(11) },
        { code: "var a = (b = 1, c)", errors: errors(15) },
        { code: "let a = (b = 1, c = 2)", env: { es6: true }, errors: errors(15) },
        { code: "let a = (b, c = 2)", env: { es6: true }, errors: errors(11) },
        { code: "let a = (b = 1, c)", env: { es6: true }, errors: errors(15) },
        { code: "const a = (b = 1, c = 2)", env: { es6: true }, errors: errors(17) },
        { code: "const a = (b, c = 2)", env: { es6: true }, errors: errors(13) },
        { code: "const a = (b = 1, c)", env: { es6: true }, errors: errors(17) },
        { code: "const a = (b = c = 1, d)", env: { es6: true }, errors: errors(21) },
        { code: "a = (b = 1, c = 2)", errors: errors(11) },
        { code: "a = (b, c = 2)", errors: errors(7) },
        { code: "a = (b = 1, c)", errors: errors(11) },
        { code: "a = b = 1, c = 2", errors: errors(10) },
        { code: "a = b = 1, c", errors: errors(10) },
        { code: "if (a = 1, b = 2);", errors: errors(10) },
        { code: "if (a = b = 1, c = 2);", errors: errors(14) },
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
        { code: "while((1) , 2);", errors: errors(11) }
    ]
});
