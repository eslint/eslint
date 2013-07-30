/**
 * @fileoverview Tests for one-true-brace rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var Test = require('../../eslint-test');

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "brace-style";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

new Test(RULE_ID)
    .addViolations("Opening curly brace does not appear on the same line as the block identifier.", {
        "function foo() \n { \n return; }": "FunctionDeclaration",
        "if (foo) \n { \n bar(); }": "IfStatement",
        "while (foo) \n { \n bar(); }": "WhileStatement",
        "for (;;) \n { \n bar(); }": "ForStatement",
        "with (foo) \n { \n bar(); }": "WithStatement",
        "switch (foo) \n { \n case \"bar\": break; }": "SwitchStatement",
        "try \n { \n bar(); \n } catch (e) {}": "TryStatement",
        "do \n { \n bar(); \n} while (true)": "DoWhileStatement",
        "for (foo in bar) \n { \n baz(); \n }": "ForInStatement"
    })
    .addNonViolations([
        "function foo () { return; }",
        "if (foo) { \n bar(); }",
        "while (foo) { \n bar(); }",
        "for (;;) { \n bar(); }",
        "with (foo) { \n bar(); }",
        "switch (foo) { \n case \"bar\": break; }",
        "try { \n bar();\n } catch (e) {\n baz(); \n }",
        "do { \n bar();\n } while (true)",
        "for (foo in bar) { \n baz(); \n }"
    ])
    .export(module)
