/**
 * @fileoverview Tests for `no-restricted-syntax` rule
 * @author Burak Yigit Kaya
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-syntax"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-restricted-syntax", rule, {
    valid: [
        { code: "doSomething();" },
        { code: "var foo = 42;", options: ["ConditionalExpression"] },
        { code: "foo += 42;", options: ["VariableDeclaration", "FunctionExpression"] }
    ],
    invalid: [
        {
            code: "var foo = 41;",
            options: ["VariableDeclaration"],
            errors: [{ message: "Using 'VariableDeclaration' is not allowed.", type: "VariableDeclaration"}]
        },
        {
            code: ";function lol(a) { return 42; }",
            options: ["EmptyStatement"],
            errors: [{ message: "Using 'EmptyStatement' is not allowed.", type: "EmptyStatement"}]
        },
        {
            code: "try { voila(); } catch (e) { oops(); }",
            options: ["TryStatement", "CallExpression", "CatchClause"],
            errors: [
                { message: "Using 'TryStatement' is not allowed.", type: "TryStatement"},
                { message: "Using 'CallExpression' is not allowed.", type: "CallExpression"},
                { message: "Using 'CatchClause' is not allowed.", type: "CatchClause"},
                { message: "Using 'CallExpression' is not allowed.", type: "CallExpression"}
            ]
        }
    ]
});
