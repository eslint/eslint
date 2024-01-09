"use strict";

module.exports = function(context) {

    return {

        "Literal": function(node) {
            if (typeof node.value === 'string') {
                context.report(node, "String!");
            }

        }
    };
};
