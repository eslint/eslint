/**
 * @fileoverview Rule to flag non-camelcased identifiers
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "Identifier": function(node) {
            var name = node.name;

            // if there's an underscore, it might be A_CONSTANT, which is okay
            if (name.indexOf("_") > -1 && name !== name.toUpperCase()) {

                // Node.js exception: __dirname and __filename
                if (!(context.isNodeJS() && name.match(/^__(dirname|filename)$/))) {
                    context.report(node, "Non-camelcased identifier '" + name + "' found.");
                }

            }
        }
    };

};
