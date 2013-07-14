/**
 * @fileoverview Rule to flag when initializing to undefined
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "VariableDeclarator": function(node) {
        	var name = node.id.name;
        	var init = node.init.name;

            if (init === "undefined") {
            	context.report(node, "Veriable '" + name + "' initialized to undefined.");
            }
        }
    };

};
