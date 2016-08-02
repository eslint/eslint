/**
 * @fileoverview Tests for no-implicit-coercion rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-implicit-coercion");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-implicit-coercion", rule, {
    valid: [
        {code: "Boolean(foo)"},
        {code: "foo.indexOf(1) !== -1"},
        {code: "Number(foo)"},
        {code: "parseInt(foo)"},
        {code: "parseFloat(foo)"},
        {code: "String(foo)"},
        {code: "!foo"},
        {code: "~foo"},
        {code: "-foo"},
        {code: "+1234"},
        {code: "-1234"},
        {code: "+Number(lol)"},
        {code: "-parseFloat(lol)"},
        {code: "2 * foo"},
        {code: "1 * 1234"},
        {code: "1 * Number(foo)"},
        {code: "1 * parseInt(foo)"},
        {code: "1 * parseFloat(foo)"},
        {code: "Number(foo) * 1"},
        {code: "parseInt(foo) * 1"},
        {code: "parseFloat(foo) * 1"},
        {code: "1 * 1234 * 678 * Number(foo)"},
        {code: "1 * 1234 * 678 * parseInt(foo)"},
        {code: "1234 * 1 * 678 * Number(foo)"},
        {code: "1234 * 1 * Number(foo) * Number(bar)"},
        {code: "1234 * 1 * Number(foo) * parseInt(bar)"},
        {code: "1234 * 1 * Number(foo) * parseFloat(bar)"},
        {code: "1234 * 1 * parseInt(foo) * parseFloat(bar)"},
        {code: "1234 * 1 * parseInt(foo) * Number(bar)"},
        {code: "1234 * 1 * parseFloat(foo) * Number(bar)"},
        {code: "1234 * Number(foo) * 1 * Number(bar)"},
        {code: "1234 * parseInt(foo) * 1 * Number(bar)"},
        {code: "1234 * parseFloat(foo) * 1 * parseInt(bar)"},
        {code: "1234 * parseFloat(foo) * 1 * Number(bar)"},
        {code: "1234*foo*1"},
        {code: "1234*1*foo"},
        {code: "1234*bar*1*foo"},
        {code: "1234*1*foo*bar"},
        {code: "1234*1*foo*Number(bar)"},
        {code: "1234*1*Number(foo)*bar"},
        {code: "1234*1*parseInt(foo)*bar"},
        {code: "0 + foo"},
        {code: "~foo.bar()"},

        {code: "!!foo", options: [{boolean: false}]},
        {code: "~foo.indexOf(1)", options: [{boolean: false}]},
        {code: "+foo", options: [{number: false}]},
        {code: "1*foo", options: [{number: false}]},
        {code: "\"\"+foo", options: [{string: false}]},
        {code: "foo += \"\"", options: [{string: false}]},
        {code: "var a = !!foo", options: [{boolean: true, allow: ["!!"]}]},
        {code: "var a = ~foo.indexOf(1)", options: [{boolean: true, allow: ["~"]}]},
        {code: "var a = ~foo", options: [{boolean: true}]},
        {code: "var a = 1 * foo", options: [{boolean: true, allow: ["*"]}]},
        {code: "var a = +foo", options: [{boolean: true, allow: ["+"]}]},
        {code: "var a = \"\" + foo", options: [{boolean: true, string: true, allow: ["+"]}]}
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
        {code: "\"\"+foo.bar", errors: [{message: "use `String(foo.bar)` instead.", type: "BinaryExpression"}]},
        {code: "foo += \"\"", errors: [{message: "use `foo = String(foo)` instead.", type: "AssignmentExpression"}]},
        {code: "var a = !!foo", options: [{boolean: true, allow: ["~"]}], errors: [{message: "use `Boolean(foo)` instead.", type: "UnaryExpression"}]},
        {code: "var a = ~foo.indexOf(1)", options: [{boolean: true, allow: ["!!"]}], errors: [{message: "use `foo.indexOf(1) !== -1` instead.", type: "UnaryExpression"}]},
        {code: "var a = 1 * foo", options: [{boolean: true, allow: ["+"]}], errors: [{message: "use `Number(foo)` instead.", type: "BinaryExpression"}]},
        {code: "var a = +foo", options: [{boolean: true, allow: ["*"]}], errors: [{message: "use `Number(foo)` instead.", type: "UnaryExpression"}]},
        {code: "var a = \"\" + foo", options: [{boolean: true, allow: ["*"]}], errors: [{message: "use `String(foo)` instead.", type: "BinaryExpression"}]}
    ]
});
