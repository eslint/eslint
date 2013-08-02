/**
 * @fileoverview Rule to flag when label is not used for a loop or switch
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "LabeledStatement": function(node) {
            if (node.body.type !== "ForStatement" && node.body.type !== "WhileStatement" && node.body.type !== "DoWhileStatement" && node.body.type !== "SwitchStatement") {
                context.report(node, "Unexpected label {{l}}", {l: node.label.name});
            }
        }
    };

};
