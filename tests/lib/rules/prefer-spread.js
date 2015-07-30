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
        {code: "foo.apply(obj, args);"},
        {code: "obj.foo.apply(null, args);"},
        {code: "obj.foo.apply(otherObj, args);"},
        {code: "a.b(x, y).c.foo.apply(a.b(x, z).c, args);"},
        {code: "a.b.foo.apply(a.b.c, args);"},

        // ignores non variadic.
        {code: "foo.apply(undefined, [1, 2]);"},
        {code: "foo.apply(null, [1, 2]);"},
        {code: "obj.foo.apply(obj, [1, 2]);"},

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
        {code: "a.b(x, y).c.foo.apply(a.b(x, y).c, args);", errors: errors},
        {code: "[].concat.apply([ ], args);", errors: errors},
        {code: "[].concat.apply([\n/*empty*/\n], args);", errors: errors}
    ]
});
