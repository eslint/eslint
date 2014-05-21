/**
 * @fileoverview Tests for max-nested-callbacks rule.
 * @author Ian Christian Myers
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
eslintTester.addRuleTest("lib/rules/max-nested-callbacks", {
    valid: [
        { code: "foo(function () { bar(thing, function (data) {}); });", args: [1, 3] },
        { code: "var foo = function () {}; bar(function(){ baz(function() { qux(foo); }) });", args: [1, 2] },
        { code: "fn(function(){}, function(){}, function(){});", args: [1,2] }
    ],
    invalid: [
        { code: "foo(function () { bar(thing, function (data) { baz(function () {}); }); });", args: [1, 2], errors: [{ message: "Too many nested callbacks (3). Maximum allowed is 2.", type: "FunctionExpression"}] },
        { code: "foo(function () { if (isTrue) { bar(function (data) { baz(function () {}); }); } });", args: [1, 2], errors: [{ message: "Too many nested callbacks (3). Maximum allowed is 2.", type: "FunctionExpression"}] }
    ]
});
