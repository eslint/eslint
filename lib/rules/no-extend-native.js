/**
 * @fileoverview Rule to flag adding properties to native object's prototypes.
 * @author David Nelson
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var builtins = require("../../conf/environments.json").builtin;

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

	"use strict";

	return {
		"AssignmentExpression": function(node) {
			if (typeof node.left.object === "undefined") {
				return;
			}
			if (typeof node.left.object.object === "undefined") {
				return;
			}
			for (var builtin in builtins) {
				var sameName = node.left.object.object.name === builtin;
				var hasLength = node.left.property.name.length > 0;
				if (sameName && hasLength) {
					context.report(node, builtin + " prototype is read only, properties should not be added.");
				}
			}
		}
	};

};