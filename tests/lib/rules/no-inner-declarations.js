/**
 * @fileoverview Tests for declaration-position rule.
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

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-inner-declarations", {

    // Examples of code that should not trigger the rule
    valid: [
        "function doSomething() { }",
        "function doSomething() { function somethingElse() { } }",
        "(function() { function doSomething() { } }());",
        "if (test) { var fn = function() { }; }",
        "if (test) { var fn = function expr() { }; }",
        "function decl() { var fn = function expr() { }; }",
        "function decl(arg) { var fn; if (arg) { fn = function() { }; } }",
        "function decl(arg) { var fn; if (arg) { fn = function expr() { }; } }",
        "if (test) { var foo; }",
        "function doSomething() { while (test) { var foo; } }",
        { code: "var foo;", args: [2, "both"] },
        { code: "var foo = 42;", args: [2, "both"] },
        { code: "function doSomething() { var foo; }", args: [2, "both"] },
        { code: "(function() { var foo; }());", args: [2, "both"] }
    ],

    // Examples of code that should trigger the rule
    invalid: [{
        code: "if (test) { function doSomething() { } }",
        args: [2, "both"],
        errors: [{
            message: "Move function declaration to program root.",
            type: "FunctionDeclaration"
        }]
    }, {
        code: "function doSomething() { do { function somethingElse() { } } while (test); }",
        errors: [{
            message: "Move function declaration to function body root.",
            type: "FunctionDeclaration"
        }]
    }, {
        code: "(function() { if (test) { function doSomething() { } } }());",
        errors: [{
            message: "Move function declaration to function body root.",
            type: "FunctionDeclaration"
        }]
    }, {
        code: "while (test) { var foo; }",
        args: [2, "both"],
        errors: [{
            message: "Move variable declaration to program root.",
            type: "VariableDeclaration"
        }]
    }, {
        code: "function doSomething() { if (test) { var foo = 42; } }",
        args: [2, "both"],
        errors: [{
            message: "Move variable declaration to function body root.",
            type: "VariableDeclaration"
        }]
    }, {
        code: "(function() { if (test) { var foo; } }());",
        args: [2, "both"],
        errors: [{
            message: "Move variable declaration to function body root.",
            type: "VariableDeclaration"
        }]
    }]
});
