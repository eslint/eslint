/**
 * @fileoverview Tests for no-redeclare-func rule.
 * @author Adam Meadows
 * @copyright 2015 Adam Meadows. All rights reserved.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-redeclare-func", {
    valid: [
        "var foo = {}; foo.bar = function () {}; foo.baz = function () {};",
        "function Foo () {}\nFoo.prototype.bar = function () {}; Foo.prototype.baz = function () {};"
    ],
    invalid: [
        {
          code: "var proto = {}; proto.foo = function () {}; proto.foo = function () {};",
          errors: [{ message: "Duplicate function 'proto.foo'.", type: "AssignmentExpression"}]
        },
        {
          code: "function Foo () {}\nFoo.prototype.bar = function () {}; Foo.prototype.bar = function () {};",
          errors: [{ message: "Duplicate function 'Foo.prototype.bar'.", type: "AssignmentExpression"}]
        }
    ]
});
