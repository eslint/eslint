/**
 * @fileoverview Rule to flag adding properties to native object's prototypes.
 * @author David Nelson
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var environments = require("../../conf/environments.json"),
	builtins = Object.keys(environments.builtin);

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

	"use strict";

	return {

		// handle the Array.prototype.extra style case
		"AssignmentExpression": function(node) {

			if (typeof node.left.object === "undefined" ||
				typeof node.left.object.object === "undefined") {
				return;
			}

			builtins.forEach(function(builtin) {
				var sameName = node.left.object.object.name === builtin;
				var hasLength = node.left.property.name.length > 0;
				if (sameName && hasLength) {
					context.report(node, builtin + " prototype is read only, properties should not be added.");
				}
			});
		},

		// handle the Object.defineProperty(Array.prototype) case
		"CallExpression": function(node) {

			var callee = node.callee,
				subject,
				object;

			// only worry about Object.defineProperty
			if (callee.type === "MemberExpression" &&
				callee.object.name === "Object" &&
				callee.property.name === "defineProperty") {

				// verify the object being added to is a native prototype
				subject = node.arguments[0];
				object = subject.object;

				if (object &&
					object.type === "Identifier" &&
					(builtins.indexOf(object.name) > -1) &&
					subject.property.name === "prototype") {

					context.report(node, object.name + " prototype is read only, properties should not be added.");
				}
			}

		}
	};

};