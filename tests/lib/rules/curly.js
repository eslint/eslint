/**
 * @fileoverview Tests for curly rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/curly", {
    valid: [
        "if (foo) { bar() }",
        "if (foo) { bar() } else if (foo2) { baz() }",
        "while (foo) { bar() }",
        "do { bar(); } while (foo)",
        "for (;foo;) { bar() }"
    ],
    invalid: [
        { code: "if (foo) bar()", errors: [{ message: "Expected { after 'if' condition.", type: "IfStatement"}] },
        { code: "if (foo) { bar() } else baz()", errors: [{ message: "Expected { after 'else'.", type: "IfStatement"}] },
        { code: "while (foo) bar()", errors: [{ message: "Expected { after 'while' condition.", type: "WhileStatement"}] },
        { code: "do bar(); while (foo)", errors: [{ message: "Expected { after 'do'.", type: "DoWhileStatement"}] },
        { code: "for (;foo;) bar()", errors: [{ message: "Expected { after 'for' condition.", type: "ForStatement"}] }
    ]
});
