/**
 * @fileoverview Tests for no-sync.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-sync"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-sync", rule, {
    valid: [
        "var foo = fs.foo.foo();",
        { code: "var foo = fs.fooSync;", options: [{ allowAtRootLevel: true }] },
        { code: "if (true) {fs.fooSync();}", options: [{ allowAtRootLevel: true }] }
    ],
    invalid: [
        { code: "var foo = fs.fooSync();", errors: [{ message: "Unexpected sync method: 'fooSync'.", type: "MemberExpression" }] },
        { code: "var foo = fs.fooSync();", options: [{ allowAtRootLevel: false }], errors: [{ message: "Unexpected sync method: 'fooSync'.", type: "MemberExpression" }] },
        { code: "if (true) {fs.fooSync();}", errors: [{ message: "Unexpected sync method: 'fooSync'.", type: "MemberExpression" }] },
        { code: "var foo = fs.fooSync;", errors: [{ message: "Unexpected sync method: 'fooSync'.", type: "MemberExpression" }] },
        { code: "function someFunction() {fs.fooSync();}", errors: [{ message: "Unexpected sync method: 'fooSync'.", type: "MemberExpression" }] },
        { code: "function someFunction() {fs.fooSync();}", options: [{ allowAtRootLevel: true }], errors: [{ message: "Unexpected sync method: 'fooSync'.", type: "MemberExpression" }] },
        { code: "var a = function someFunction() {fs.fooSync();}", options: [{ allowAtRootLevel: true }], errors: [{ message: "Unexpected sync method: 'fooSync'.", type: "MemberExpression" }] }

    ]
});
