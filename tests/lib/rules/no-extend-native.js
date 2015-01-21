/**
 * @fileoverview Tests for no-extend-native rule.
 * @author David Nelson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-extend-native", {
    valid: [
        "x.prototype.p = 0",
        "x.prototype['p'] = 0",
        "Math.prototype.p = 0",
        "Object.p = 0",
        "Object.toString.bind = 0",
        "Object['toString'].bind = 0",
        "Object.defineProperty(x, 'p', {value: 0})",
        "global.Object.prototype.toString = 0",
        "this.Object.prototype.toString = 0",
        "with(Object) { prototype.p = 0; }",
        "o = Object; o.prototype.toString = 0",
        "eval('Object.prototype.toString = 0')"
    ],
    invalid: [{
        code: "Object.prototype.p = 0",
        errors: [{
            message: "Object prototype is read only, properties should not be added.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "Function.prototype['p'] = 0",
        errors: [{
            message: "Function prototype is read only, properties should not be added.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "String['prototype'].p = 0",
        errors: [{
            message: "String prototype is read only, properties should not be added.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "Number['prototype']['p'] = 0",
        errors: [{
            message: "Number prototype is read only, properties should not be added.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "Object.defineProperty(Array.prototype, 'p', {value: 0})",
        errors: [{
            message: "Array prototype is read only, properties should not be added.",
            type: "CallExpression"
        }]
    }]
});
