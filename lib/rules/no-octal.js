/**
 * @fileoverview Rule to flag when initializing octal literal
 * @author Ilya Volodin
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
                context.report(node, "Variable '" + name + "' initialized to octal literal.");
            }
        }
    };

};
