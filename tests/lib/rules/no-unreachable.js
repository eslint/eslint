/**
 * @fileoverview Tests for no-unreachable rule.
 * @author Joel Feenstra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-unreachable"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-unreachable", rule, {
    valid: [
        "function foo() { function bar() { return 1; } return bar(); }",
        "function foo() { return bar(); function bar() { return 1; } }",
        "function foo() { return x; var x; }",
        "function foo() { var x = 1; var y = 2; }",
        "function foo() { var x = 1; var y = 2; return; }",
        "while (true) { switch (foo) { case 1: x = 1; x = 2;} }",
        "while (true) { break; var x; }",
        "while (true) { continue; var x, y; }",
        "while (true) { throw 'message'; var x; }",
        "while (true) { if (true) break; var x = 1; }",
        "while (true) continue;",
        "switch (foo) { case 1: break; var x; }",
        "var x = 1; y = 2; throw 'uh oh'; var y;"
    ],
    invalid: [
        { code: "function foo() { return x; var x = 1; }", errors: [{ message: "Found unexpected statement after a return.", type: "VariableDeclaration"}] },
        { code: "function foo() { return x; var x, y = 1; }", errors: [{ message: "Found unexpected statement after a return.", type: "VariableDeclaration"}] },
        { code: "while (true) { continue; var x = 1; }", errors: [{ message: "Found unexpected statement after a continue.", type: "VariableDeclaration"}] },
        { code: "function foo() { return; x = 1; }", errors: [{ message: "Found unexpected statement after a return.", type: "ExpressionStatement"}] },
        { code: "function foo() { throw error; x = 1; }", errors: [{ message: "Found unexpected statement after a throw.", type: "ExpressionStatement"}] },
        { code: "while (true) { break; x = 1; }", errors: [{ message: "Found unexpected statement after a break.", type: "ExpressionStatement"}] },
        { code: "while (true) { continue; x = 1; }", errors: [{ message: "Found unexpected statement after a continue.", type: "ExpressionStatement"}] },
        { code: "function foo() { switch (foo) { case 1: return; x = 1; } }", errors: [{ message: "Found unexpected statement after a return.", type: "ExpressionStatement"}] },
        { code: "function foo() { switch (foo) { case 1: throw e; x = 1; } }", errors: [{ message: "Found unexpected statement after a throw.", type: "ExpressionStatement"}] },
        { code: "while (true) { switch (foo) { case 1: break; x = 1; } }", errors: [{ message: "Found unexpected statement after a break.", type: "ExpressionStatement"}] },
        { code: "while (true) { switch (foo) { case 1: continue; x = 1; } }", errors: [{ message: "Found unexpected statement after a continue.", type: "ExpressionStatement"}] },
        { code: "var x = 1; throw 'uh oh'; var y = 2;", errors: [{ message: "Found unexpected statement after a throw.", type: "VariableDeclaration"}] }
    ]
});
