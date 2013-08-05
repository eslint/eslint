/**
 * @fileoverview Rule to flag non-camelcased identifiers
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "Identifier": function(node) {
            // Leading and trailing underscores are commonly used to flag private/protected identifiers, strip them
            var name = node.name.replace(/^_+|_+$/g, "");

            // if there's an underscore, it might be A_CONSTANT, which is okay
            if (name.indexOf("_") > -1 && name !== name.toUpperCase()) {
                context.report(node, "Identifier '{{name}}' is not in camel case.", { name: node.name });
            }
        }
    };

};
