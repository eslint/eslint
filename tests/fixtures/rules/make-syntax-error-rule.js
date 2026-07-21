module.exports = {
    meta: {
        schema: [],
        fixable: "code"
    },
    create(context) {
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
