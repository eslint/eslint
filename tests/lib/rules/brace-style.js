/**
 * @fileoverview Tests for one-true-brace rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    eslintTest = require('../../eslint-test');

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "brace-style";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function isViolationForType(type) {
    return eslintTest.violation(RULE_ID,
            "Opening curly brace does not appear on the same line as the block identifier.",
            type);
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating function declaration without one true brace style": {

        topic: "function foo() \n { \n return; }",

        "should report a violation": isViolationForType("FunctionDeclaration")
    },

    "when evaluating function declaration with one true brace style": {

        topic: "function foo () { return; }",

        "should not report a violation": eslintTest.noViolation
    },

    "when evaluating if statement without one true brace style": {

        topic: "if (foo) \n { \n bar(); }",

        "should report a violation": isViolationForType("IfStatement")
    },

    "when evaluating if statement with one true brace style": {

        topic: "if (foo) { \n bar(); }",

        "should not report a violation": eslintTest.noViolation
    },

    "when evaluating while statement without one true brace style": {

        topic: "while (foo) \n { \n bar(); }",

        "should report a violation": isViolationForType("WhileStatement")
    },

    "when evaluating while statement with one true brace style": {

        topic: "while (foo) { \n bar(); }",

        "should not report a violation": eslintTest.noViolation
    },

    "when evaluating for statement without one true brace style": {

        topic: "for (;;) \n { \n bar(); }",

        "should report a violation": isViolationForType("ForStatement")
    },

    "when evaluating for statement with one true brace style": {

        topic: "for (;;) { \n bar(); }",

        "should not report a violation": eslintTest.noViolation
    },

    "when evaluating with statement without one true brace style": {

        topic: "with (foo) \n { \n bar(); }",

        "should report a violation": isViolationForType("WithStatement")
    },

    "when evaluating with statement with one true brace style": {

        topic: "with (foo) { \n bar(); }",

        "should not report a violation": eslintTest.noViolation
    },

    "when evaluating switch statement without one true brace style": {

        topic: "switch (foo) \n { \n case \"bar\": break; }",

        "should report a violation": isViolationForType("SwitchStatement")
    },

    "when evaluating switch statement with one true brace style": {

        topic: "switch (foo) { \n case \"bar\": break; }",

        "should not report a violation": eslintTest.noViolation
    },

    "when evaluating try statement without one true brace style": {

        topic: "try \n { \n bar(); \n } catch (e) {}",

        "should report a violation": isViolationForType("TryStatement")
    },

    "when evaluating try/catch statement with one true brace style": {

        topic: "try { \n bar();\n } catch (e) {\n baz(); \n }",

        "should not report a violation": eslintTest.noViolation
    },

    "when evaluating do/while statement without one true brace style": {

        topic: "do \n { \n bar(); \n} while (true)",

        "should report a violation": isViolationForType("DoWhileStatement")
    },

    "when evaluating do/while statement with one true brace style": {

        topic: "do { \n bar();\n } while (true)",

        "should not report a violation": eslintTest.noViolation
    },

    "when evaluating for/in statement without one true brace style": {

        topic: "for (foo in bar) \n { \n baz(); \n }",

        "should report a violation": isViolationForType("ForInStatement")
    },

    "when evaluating for/in statement with one true brace style": {

        topic: "for (foo in bar) { \n baz(); \n }",

        "should not report a violation": eslintTest.noViolation
    },

}).export(module);
