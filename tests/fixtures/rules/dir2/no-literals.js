"use strict";

module.exports = {
    create(context) {
        return {

            "Literal": function(node) {
                context.report(node, "Literal!");
            }
        };
    }
};
