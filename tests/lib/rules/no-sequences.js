/**
 * @fileoverview Tests for no-sequences rule.
 * @author Brandon Mills
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var errors = [{
    message: "Unexpected use of comma operator.",
    type: "SequenceExpression"
}];

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-sequences", {

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
        "with ((doSomething(), val)) {}"
    ],

    // Examples of code that should trigger the rule
    invalid: [
        { code: "a = 1, 2", errors: errors },
        { code: "do {} while (doSomething(), !!test);", errors: errors },
        { code: "for (; doSomething(), !!test; );", errors: errors },
        { code: "if (doSomething(), !!test);", errors: errors },
        { code: "switch (doSomething(), val) {}", errors: errors },
        { code: "while (doSomething(), !!test);", errors: errors },
        { code: "with (doSomething(), val) {}", errors: errors }
    ]
});
