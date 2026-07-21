"use strict";

module.exports = {
    create(context) {
        return {

            "Literal": function(node) {
                if (typeof node.value === 'string') {
                    context.report(node, "String!");
                }

            }
        };
    }
};
