/**
 * @fileoverview Tests for prefer-spread rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/prefer-spread");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var errors = [{message: "use the spread operator instead of the \".apply()\".", type: "CallExpression"}];

var ruleTester = new RuleTester();
ruleTester.run("prefer-spread", rule, {
    valid: [
        {code: "foo.apply(obj, args);", ecmaFeatures: {spread: true}},
        {code: "obj.foo.apply(null, args);", ecmaFeatures: {spread: true}},
        {code: "obj.foo.apply(otherObj, args);", ecmaFeatures: {spread: true}},
        {code: "a.b(x, y).c.foo.apply(a.b(x, z).c, args);", ecmaFeatures: {spread: true}},
        {code: "a.b.foo.apply(a.b.c, args);", ecmaFeatures: {spread: true}},

        // ignores non variadic.
        {code: "foo.apply(undefined, [1, 2]);", ecmaFeatures: {spread: true}},
        {code: "foo.apply(null, [1, 2]);", ecmaFeatures: {spread: true}},
        {code: "obj.foo.apply(obj, [1, 2]);", ecmaFeatures: {spread: true}},

        // ignores computed property.
        {code: "var apply; foo[apply](null, args);", ecmaFeatures: {spread: true}},

        // ignores incomplete things.
        {code: "foo.apply();", ecmaFeatures: {spread: true}},
        {code: "obj.foo.apply();", ecmaFeatures: {spread: true}},

        // noop when rule is used in wrong environment
        {code: "foo.apply(undefined, args);", ecmaFeatures: {spread: false}}
    ],
    invalid: [
        {code: "foo.apply(undefined, args);", ecmaFeatures: {spread: true}, errors: errors},
        {code: "foo.apply(void 0, args);", ecmaFeatures: {spread: true}, errors: errors},
        {code: "foo.apply(null, args);", ecmaFeatures: {spread: true}, errors: errors},
        {code: "obj.foo.apply(obj, args);", ecmaFeatures: {spread: true}, errors: errors},
        {code: "a.b.c.foo.apply(a.b.c, args);", ecmaFeatures: {spread: true}, errors: errors},
        {code: "a.b(x, y).c.foo.apply(a.b(x, y).c, args);", ecmaFeatures: {spread: true}, errors: errors},
        {code: "[].concat.apply([ ], args);", ecmaFeatures: {spread: true}, errors: errors},
        {code: "[].concat.apply([\n/*empty*/\n], args);", ecmaFeatures: {spread: true}, errors: errors}
    ]
});
