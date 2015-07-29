/**
 * @fileoverview Tests for no-useless-call rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-useless-call");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-useless-call", rule, {
    valid: [
        // `this` binding is different.
        {code: "foo.apply(obj, 1, 2);"},
        {code: "obj.foo.apply(null, 1, 2);"},
        {code: "obj.foo.apply(otherObj, 1, 2);"},
        {code: "a.b(x, y).c.foo.apply(a.b(x, z).c, 1, 2);"},
        {code: "foo.apply(obj, [1, 2]);"},
        {code: "obj.foo.apply(null, [1, 2]);"},
        {code: "obj.foo.apply(otherObj, [1, 2]);"},
        {code: "a.b(x, y).c.foo.apply(a.b(x, z).c, [1, 2]);"},
        {code: "a.b.foo.apply(a.b.c, [1, 2]);"},

        // ignores variadic.
        {code: "foo.apply(null, args);"},
        {code: "obj.foo.apply(obj, args);"},

        // ignores computed property.
        {code: "var call; foo[call](null, 1, 2);"},
        {code: "var apply; foo[apply](null, [1, 2]);"},

        // ignores incomplete things.
        {code: "foo.call();"},
        {code: "obj.foo.call();"},
        {code: "foo.apply();"},
        {code: "obj.foo.apply();"}
    ],
    invalid: [
        // call.
        {code: "foo.call(undefined, 1, 2);", errors: [{message: "unnecessary \".call()\".", type: "CallExpression"}]},
        {code: "foo.call(void 0, 1, 2);", errors: [{message: "unnecessary \".call()\".", type: "CallExpression"}]},
        {code: "foo.call(null, 1, 2);", errors: [{message: "unnecessary \".call()\".", type: "CallExpression"}]},
        {code: "obj.foo.call(obj, 1, 2);", errors: [{message: "unnecessary \".call()\".", type: "CallExpression"}]},
        {code: "a.b.c.foo.call(a.b.c, 1, 2);", errors: [{message: "unnecessary \".call()\".", type: "CallExpression"}]},
        {code: "a.b(x, y).c.foo.call(a.b(x, y).c, 1, 2);", errors: [{message: "unnecessary \".call()\".", type: "CallExpression"}]},

        // apply.
        {code: "foo.apply(undefined, [1, 2]);", errors: [{message: "unnecessary \".apply()\".", type: "CallExpression"}]},
        {code: "foo.apply(void 0, [1, 2]);", errors: [{message: "unnecessary \".apply()\".", type: "CallExpression"}]},
        {code: "foo.apply(null, [1, 2]);", errors: [{message: "unnecessary \".apply()\".", type: "CallExpression"}]},
        {code: "obj.foo.apply(obj, [1, 2]);", errors: [{message: "unnecessary \".apply()\".", type: "CallExpression"}]},
        {code: "a.b.c.foo.apply(a.b.c, [1, 2]);", errors: [{message: "unnecessary \".apply()\".", type: "CallExpression"}]},
        {code: "a.b(x, y).c.foo.apply(a.b(x, y).c, [1, 2]);", errors: [{message: "unnecessary \".apply()\".", type: "CallExpression"}]},
        {code: "[].concat.apply([ ], [1, 2]);", errors: [{message: "unnecessary \".apply()\".", type: "CallExpression"}]},
        {code: "[].concat.apply([\n/*empty*/\n], [1, 2]);", errors: [{message: "unnecessary \".apply()\".", type: "CallExpression"}]},
        {code: "abc.get(\"foo\", 0).concat.apply(abc . get(\"foo\",  0 ), [1, 2]);", errors: [{message: "unnecessary \".apply()\".", type: "CallExpression"}]}
    ]
});
