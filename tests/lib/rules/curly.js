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
    .addViolations("Expected { after 'if' condition.", {
        "if (foo) bar()": "IfStatement"
    })
    .addViolations("Expected { after 'else' condition.", {
        "if (foo) { bar() } else baz()": "IfStatement"
    })
    .addViolations("Expected { after 'while' statement.", {
        "while (foo) bar()": "WhileStatement"
    })
    .addViolations("Expected { after 'do'.", {
        "do bar(); while (foo)": "DoWhileStatement"
    })
    .addViolations("Expected { after 'for' statement.", {
        "for (;foo;) bar()": "ForStatement"
    })
    .addNonViolations([
        "if (foo) { bar() }",
        "if (foo) { bar() } else if (foo2) { baz() }",
        "while (foo) { bar() }",
        "do { bar(); } while (foo)",
        "for (;foo;) { bar() }"
    ])
    .export(module);
