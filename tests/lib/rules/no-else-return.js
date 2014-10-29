/**
 * @fileoverview Tests for no-else-return rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-else-return", {
    valid: [
        "function foo() { if (true) { if (false) { return x; } } else { return y; } }",
        "function foo() { if (true) { return x; } return y; }",
        "function foo() { if (true) { for (;;) { return x; } } else { return y; } }",
        "function foo() { var x = true; if (x) { return x; } else if (x === false) { return false; } }",
        "function foo() { if (true) notAReturn(); else return y; }"
    ],
    invalid: [
        { code: "function foo() { if (true) { return x; } else { return y; } }", errors: [{ message: "Unexpected 'else' after 'return'.", type: "BlockStatement"}] },
        { code: "function foo() { if (true) { var x = bar; return x; } else { var y = baz; return y; } }", errors: [{ message: "Unexpected 'else' after 'return'.", type: "BlockStatement"}] },
        { code: "function foo() { if (true) return x; else return y; }", errors: [{ message: "Unexpected 'else' after 'return'.", type: "ReturnStatement"}] },
        { code: "function foo() { if (true) { if (false) return x; else return y; } else { return z; } }", errors: [{ message: "Unexpected 'else' after 'return'.", type: "ReturnStatement"}, { message: "Unexpected 'else' after 'return'.", type: "BlockStatement"}] },
        { code: "function foo() { if (true) { if (false) { if (true) return x; else w = y; } else { w = x; } } else { return z; } }", errors: [{ message: "Unexpected 'else' after 'return'.", type: "ExpressionStatement"}] },
        { code: "function foo() { if (true) { if (false) { if (true) return x; else return y; } } else { return z; } }", errors: [{ message: "Unexpected 'else' after 'return'.", type: "ReturnStatement"}] },
        { code: "function foo() { if (true) { if (false) { if (true) return x; else return y; } return w; } else { return z; } }", errors: [
            { message: "Unexpected 'else' after 'return'.", type: "ReturnStatement"},
            { message: "Unexpected 'else' after 'return'.", type: "BlockStatement"}
        ] },
        { code: "function foo() { if (true) { if (false) { if (true) return x; else return y; } else { w = x; } } else { return z; } }", errors: [
            { message: "Unexpected 'else' after 'return'.", type: "ReturnStatement"},
            { message: "Unexpected 'else' after 'return'.", type: "BlockStatement"}
        ] }
    ]
});
