/**
 * @fileoverview Tests for no-plusplus.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-plusplus"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-plusplus", rule, {
    valid: [
        "var foo = 0; foo=+1;",

        // With "allowForLoopAfterthoughts" allowed
        { code: "var foo = 0; foo=+1;", options: [{allowForLoopAfterthoughts: true}] },
        { code: "for (i = 0; i < l; i++) { console.log(i); }", options: [{allowForLoopAfterthoughts: true}] }
    ],
    invalid: [
        {
            code: "function foo() { return i++; }",
            output: "function foo() { return i++; }",
            errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}]
        },
        {
            code: "foo = ++bar;",
            output: "foo = bar += 1;",
            errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}]
        },
        {
            code: "baz = --qux;",
            output: "baz = qux -= 1;",
            errors: [{ message: "Unary operator '--' used.", type: "UpdateExpression"}]
        },
        { code: "var foo = 0; foo++;", output: "var foo = 0; foo += 1;", errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}] },
        { code: "var foo = 0; foo--;", output: "var foo = 0; foo -= 1;", errors: [{ message: "Unary operator '--' used.", type: "UpdateExpression"}] },
        {
            code: "for (i = 0; i < l; i++) { console.log(i); }",
            output: "for (i = 0; i < l; i += 1) { console.log(i); }",
            errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}]
        },
        {
            code: "var bar = foo++;",
            output: "var bar = foo++;",
            errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}]
        },
        {
            code: "var i = 9; console.log(++i === 10);",
            output: "var i = 9; console.log(++i === 10);",
            errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}]
        },
        {
            code: "var i = 9; console.log((++i) === 10);",
            output: "var i = 9; console.log((i += 1) === 10);",
            errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}]
        },

        // With "allowForLoopAfterthoughts" allowed
        {
            code: "var foo = 0; foo++;",
            output: "var foo = 0; foo += 1;",
            options: [{allowForLoopAfterthoughts: true}],
            errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}]
        },
        {
            code: "for (i = 0; i < l; i++) { v++; }",
            output: "for (i = 0; i < l; i++) { v += 1; }",
            options: [{allowForLoopAfterthoughts: true}],
            errors: [{ message: "Unary operator '++' used.", type: "UpdateExpression"}]
        }
    ]
});
