/**
 * @fileoverview Tests for no-sync.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-sync"),
    { RuleTester } = require("../../../lib/rule-tester");

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
        { code: "var foo = fs.fooSync();", errors: [{ messageId: "noSync", data: { propertyName: "fooSync" }, type: "MemberExpression" }] },
        {
            code: "var foo = fs.fooSync();",
            options: [{ allowAtRootLevel: false }],
            errors: [{ messageId: "noSync", data: { propertyName: "fooSync" }, type: "MemberExpression" }]
        },
        { code: "if (true) {fs.fooSync();}", errors: [{ messageId: "noSync", data: { propertyName: "fooSync" }, type: "MemberExpression" }] },
        { code: "var foo = fs.fooSync;", errors: [{ messageId: "noSync", data: { propertyName: "fooSync" }, type: "MemberExpression" }] },
        { code: "function someFunction() {fs.fooSync();}", errors: [{ messageId: "noSync", data: { propertyName: "fooSync" }, type: "MemberExpression" }] },
        {
            code: "function someFunction() {fs.fooSync();}",
            options: [{ allowAtRootLevel: true }],
            errors: [{ messageId: "noSync", data: { propertyName: "fooSync" }, type: "MemberExpression" }]
        },
        {
            code: "var a = function someFunction() {fs.fooSync();}",
            options: [{ allowAtRootLevel: true }],
            errors: [{ messageId: "noSync", data: { propertyName: "fooSync" }, type: "MemberExpression" }]
        }

    ]
});
