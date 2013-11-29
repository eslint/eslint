/**
 * @fileoverview Tests for no-extend-native rule.
 * @author David Nelson
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester"),
	environment = require("../../../conf/environments.json"),
	builtins = Object.keys(environment.builtin),
	invalid = builtins.map(function(builtin) {
		return {
			code: builtin + ".prototype.awesome = NOEXTEND",
			errors: [
				{
					message: builtin + " prototype is read only, properties should not be added.",
					type: "AssignmentExpression"
				}
			]
		};
	});

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest( "no-extend-native", {
	valid: [
		"x.prototype.a = a",
		"m = Math; m.prototype.times = 'x'",
		"Object.defineProperty(Array.prototype, 'forEach', {value: 'forEach'})",
		"eval('Object.prototype.seven = 7')"
	],
	invalid: invalid
});