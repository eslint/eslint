/**
 * @fileoverview Tests for curly rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var Test = require('../../eslint-test');

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "curly";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

new Test(RULE_ID)
    .addViolations({
        "if (foo) bar()": {
            message: "Expected { after 'if' condition.",
            nodeType: "IfStatement"
        },
        "if (foo) { bar() } else baz()": {
            message: "Expected { after 'else' condition.",
            nodeType: "IfStatement"
        },
        "while (foo) bar()": {
            message: "Expected { after 'while' statement.",
            nodeType: "WhileStatement"
        },
        "do bar(); while (foo)": {
            message: "Expected { after 'do'.",
            nodeType: "DoWhileStatement"
        },
        "for (;foo;) bar()": {
            message: "Expected { after 'for' statement.",
            nodeType: "ForStatement"
        }
    })
    .addNonViolations([
        "if (foo) { bar() }",
        "if (foo) { bar() } else if (foo2) { baz() }",
        "while (foo) { bar() }",
        "do { bar(); } while (foo)",
        "for (;foo;) { bar() }"
    ])
    .export(module);
