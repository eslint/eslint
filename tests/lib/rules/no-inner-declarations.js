/**
 * @fileoverview Tests for no-inner-declarations rule.
 * @author Brandon Mills
 * @copyright 2014 Brandon Mills. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-inner-declarations"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-inner-declarations", rule, {

    // Examples of code that should not trigger the rule
    valid: [
        "function doSomething() { }",
        "function doSomething() { function somethingElse() { } }",
        "(function() { function doSomething() { } }());",
        "if (test) { var fn = function() { }; }",
        "if (test) { var fn = function expr() { }; }",
        "function decl() { var fn = function expr() { }; }",
        "function decl(arg) { var fn; if (arg) { fn = function() { }; } }",
        {code: "var x = {doSomething() {function doSomethingElse() {}}}", ecmaFeatures: {objectLiteralShorthandMethods: true}},
        { code: "function decl(arg) { var fn; if (arg) { fn = function expr() { }; } }", ecmaFeatures: { arrowFunctions: true } },
        "function decl(arg) { var fn; if (arg) { fn = function expr() { }; } }",
        "if (test) { var foo; }",
        { code: "if (test) { let x = 1; }", ecmaFeatures: { blockBindings: true }, options: ["both"] },
        { code: "if (test) { const x = 1; }", ecmaFeatures: { blockBindings: true }, options: ["both"] },
        "function doSomething() { while (test) { var foo; } }",
        { code: "var foo;", options: ["both"] },
        { code: "var foo = 42;", options: ["both"] },
        { code: "function doSomething() { var foo; }", options: ["both"] },
        { code: "(function() { var foo; }());", options: ["both"] },
        { code: "foo(() => { function bar() { } });", ecmaFeatures: { arrowFunctions: true } },
        { code: "var fn = () => {var foo;}", ecmaFeatures: { arrowFunctions: true }, options: ["both"] },
        {
            code: "var x = {doSomething() {var foo;}}",
            ecmaFeatures: {objectLiteralShorthandMethods: true},
            options: ["both"]
        }

    ],

    // Examples of code that should trigger the rule
    invalid: [{
        code: "if (test) { function doSomething() { } }",
        options: ["both"],
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
        options: ["both"],
        errors: [{
            message: "Move variable declaration to program root.",
            type: "VariableDeclaration"
        }]
    }, {
        code: "function doSomething() { if (test) { var foo = 42; } }",
        options: ["both"],
        errors: [{
            message: "Move variable declaration to function body root.",
            type: "VariableDeclaration"
        }]
    }, {
        code: "(function() { if (test) { var foo; } }());",
        options: ["both"],
        errors: [{
            message: "Move variable declaration to function body root.",
            type: "VariableDeclaration"
        }]
    }]
});
