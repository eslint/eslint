"use strict";

module.exports = {
    meta: {schema: [], fixable: "code"},
    create: function(context) {
        return {
            Program: function(node) {
                context.report({
                    node: node,
                    message: "ERROR",
                    fix: function(fixer) {
                        return fixer.insertTextAfter(node, "this is a syntax error.");
                    }
                });
            }
        };
    }
};
