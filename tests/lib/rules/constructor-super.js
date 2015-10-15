/**
 * @fileoverview Tests for constructor-super rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/constructor-super");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("constructor-super", rule, {
    valid: [
        // non derived classes.
        { code: "class A { }", ecmaFeatures: {classes: true} },
        { code: "class A { constructor() { } }", ecmaFeatures: {classes: true} },
        { code: "class A extends null { }", ecmaFeatures: {classes: true} },
        { code: "class A extends null { constructor() { } }", ecmaFeatures: {classes: true} },

        // derived classes.
        { code: "class A extends B { }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { super(); } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { if (true) { super(); } else { super(); } } }", ecmaFeatures: {classes: true} },

        // nested.
        { code: "class A { constructor() { class B extends C { constructor() { super(); } } } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { super(); class C extends D { constructor() { super(); } } } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { super(); class C { constructor() { } } } }", ecmaFeatures: {classes: true} },

        // ignores out of constructors.
        { code: "class A { b() { super(); } }", ecmaFeatures: {classes: true} },
        { code: "function a() { super(); }", ecmaFeatures: {classes: true} },

        // multi code path.
        { code: "class A extends B { constructor() { a ? super() : super(); } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { if (a) super(); else super(); } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { switch (a) { case 0: super(); break; default: super(); } } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { try {} finally { super(); } } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { if (a) throw Error(); super(); } }", ecmaFeatures: {classes: true} }
    ],
    invalid: [
        // non derived classes.
        {
            code: "class A { constructor() { super(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Unexpected \"super()\".", type: "CallExpression"}]
        },
        {
            code: "class A extends null { constructor() { super(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Unexpected \"super()\".", type: "CallExpression"}]
        },

        // derived classes.
        {
            code: "class A extends B { constructor() { } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Expected to call \"super()\".", type: "MethodDefinition"}]
        },

        // nested execution scope.
        {
            code: "class A extends B { constructor() { function c() { super(); } } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Expected to call \"super()\".", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { var c = function() { super(); } } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Expected to call \"super()\".", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { var c = () => super(); } }",
            ecmaFeatures: {classes: true, arrowFunctions: true},
            errors: [{ message: "Expected to call \"super()\".", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { class C extends D { constructor() { super(); } } } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Expected to call \"super()\".", type: "MethodDefinition", column: 21}]
        },
        {
            code: "class A extends B { constructor() { var C = class extends D { constructor() { super(); } } } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Expected to call \"super()\".", type: "MethodDefinition", column: 21}]
        },
        {
            code: "class A extends B { constructor() { super(); class C extends D { constructor() { } } } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Expected to call \"super()\".", type: "MethodDefinition", column: 66}]
        },
        {
            code: "class A extends B { constructor() { super(); var C = class extends D { constructor() { } } } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Expected to call \"super()\".", type: "MethodDefinition", column: 72}]
        },

        // lacked in some code path.
        {
            code: "class A extends B { constructor() { if (a) super(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Lacked a call of \"super()\" in some code paths.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { if (a); else super(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Lacked a call of \"super()\" in some code paths.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { a && super(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Lacked a call of \"super()\" in some code paths.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { switch (a) { case 0: super(); } } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Lacked a call of \"super()\" in some code paths.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { switch (a) { case 0: break; default: super(); } } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Lacked a call of \"super()\" in some code paths.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { try { super(); } catch (err) {} } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Lacked a call of \"super()\" in some code paths.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { try { a; } catch (err) { super(); } } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Lacked a call of \"super()\" in some code paths.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { if (a) return; super(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Lacked a call of \"super()\" in some code paths.", type: "MethodDefinition"}]
        },

        // duplicate.
        {
            code: "class A extends B { constructor() { super(); super(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Unexpected duplicate \"super()\".", type: "CallExpression", column: 46}]
        },
        {
            code: "class A extends B { constructor() { super() || super(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Unexpected duplicate \"super()\".", type: "CallExpression", column: 48}]
        },
        {
            code: "class A extends B { constructor() { if (a) super(); super(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Unexpected duplicate \"super()\".", type: "CallExpression", column: 53}]
        },
        {
            code: "class A extends B { constructor() { switch (a) { case 0: super(); default: super(); } } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "Unexpected duplicate \"super()\".", type: "CallExpression", column: 76}]
        }
    ]
});
