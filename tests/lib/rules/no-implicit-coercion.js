/**
 * @fileoverview Tests for no-implicit-coercion rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-implicit-coercion");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-implicit-coercion", rule, {
    valid: [
        {code: "Boolean(foo)"},
        {code: "foo.indexOf(1) !== -1"},
        {code: "Number(foo)"},
        {code: "String(foo)"},
        {code: "!foo"},
        {code: "~foo"},
        {code: "-foo"},
        {code: "2 * foo"},
        {code: "0 + foo"},
        {code: "~foo.bar()"},

        {code: "!!foo", options: [{boolean: false}]},
        {code: "~foo.indexOf(1)", options: [{boolean: false}]},
        {code: "+foo", options: [{number: false}]},
        {code: "1*foo", options: [{number: false}]},
        {code: "\"\"+foo", options: [{string: false}]}
    ],
    invalid: [
        {code: "!!foo", errors: [{message: "use `Boolean(foo)` instead.", type: "UnaryExpression"}]},
        {code: "!!(foo + bar)", errors: [{message: "use `Boolean(foo + bar)` instead.", type: "UnaryExpression"}]},
        {code: "~foo.indexOf(1)", errors: [{message: "use `foo.indexOf(1) !== -1` instead.", type: "UnaryExpression"}]},
        {code: "~foo.bar.indexOf(2)", errors: [{message: "use `foo.bar.indexOf(2) !== -1` instead.", type: "UnaryExpression"}]},
        {code: "+foo", errors: [{message: "use `Number(foo)` instead.", type: "UnaryExpression"}]},
        {code: "+foo.bar", errors: [{message: "use `Number(foo.bar)` instead.", type: "UnaryExpression"}]},
        {code: "1*foo", errors: [{message: "use `Number(foo)` instead.", type: "BinaryExpression"}]},
        {code: "foo*1", errors: [{message: "use `Number(foo)` instead.", type: "BinaryExpression"}]},
        {code: "1*foo.bar", errors: [{message: "use `Number(foo.bar)` instead.", type: "BinaryExpression"}]},
        {code: "\"\"+foo", errors: [{message: "use `String(foo)` instead.", type: "BinaryExpression"}]},
        {code: "foo+\"\"", errors: [{message: "use `String(foo)` instead.", type: "BinaryExpression"}]},
        {code: "\"\"+foo.bar", errors: [{message: "use `String(foo.bar)` instead.", type: "BinaryExpression"}]}
    ]
});
