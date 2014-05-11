"use strict";

module.exports = function(context) {

    return {

        "Literal": function(node) {
            context.report(node, "Literal!");
        }
    };
};
