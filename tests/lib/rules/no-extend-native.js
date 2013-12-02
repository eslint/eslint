/**
 * @fileoverview Tests for no-extend-native rule.
 * @author David Nelson
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester"),
    environment = require("../../../conf/environments.json"),
    builtins = Object.keys(environment.builtin);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest( "no-extend-native", {
    valid: [
        "x.prototype.newthing = 'good'",
        "Object.defineProperty(x, 'newthing', {value: 'good'})",
        "m = Math; m.prototype.times = 3",
        "with(Object) { prototype.blast = 'off'; }",
        "eval('Object.prototype.seven = 7')"
    ],
    invalid: [{
        code: "Math.prototype.gonzo = 333",
        errors: [{
            message: "Math prototype is read only, properties should not be added.",
            type: "AssignmentExpression"
        }]
    }, {
        code: "Object.defineProperty(Array.prototype, 'toast', {value:666})",
        errors: [{
            message: "Array prototype is read only, properties should not be added.",
            type: "CallExpression"
        }]
    // loop through all of the builtins and test for adding to the prototype
    }].concat(builtins.map(function(builtin) {
        return {
            code: builtin + ".prototype.fake = 'fake'",
            errors: [{
                message: builtin + " prototype is read only, properties should not be added.",
                type: "AssignmentExpression"
            }]
        };
    // loop through all of the builtins and test for using Object.defineProperty
    })).concat(builtins.map(function(builtin) {
        return {
            code: "Object.defineProperty(" + builtin + ".prototype, 'fake', {value: 'fake'})",
            errors: [{
                message: builtin + " prototype is read only, properties should not be added.",
                type: "CallExpression"
            }]
        };
    }))
});