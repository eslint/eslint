/**
 * @fileoverview Tests for prefer-spread rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint");
var ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var errors = [{message: "use the spread operator instead of the \".apply()\".", type: "CallExpression"}];

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/prefer-spread", {
    valid: [
        {code: "foo.apply(obj, args);"},
        {code: "obj.foo.apply(null, args);"},
        {code: "obj.foo.apply(otherObj, args);"},
        {code: "a.b(x, y).c.foo.apply(a.b(x, z).c, args);"},

        // ignores computed property.
        {code: "var apply; foo[apply](null, args);"},

        // ignores incomplete things.
        {code: "foo.apply();"},
        {code: "obj.foo.apply();"}
    ],
    invalid: [
        {code: "foo.apply(undefined, args);", errors: errors},
        {code: "foo.apply(void 0, args);", errors: errors},
        {code: "foo.apply(null, args);", errors: errors},
        {code: "obj.foo.apply(obj, args);", errors: errors},
        {code: "a.b.c.foo.apply(a.b.c, args);", errors: errors},
        {code: "a.b(x, y).c.foo.apply(a.b(x, y).c, args);", errors: errors}
    ]
});
