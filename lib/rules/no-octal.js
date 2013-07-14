/**
 * @fileoverview Rule to flag when initializing octal literal
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
        	var init = node.init;

            if (init.type === "Literal" && init.raw !== init.value && init.raw.indexOf("x") < 0) {
            	context.report(node, "Veriable '" + name + "' initialized to octal literal.");
            }
        }
    };

};
