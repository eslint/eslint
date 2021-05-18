"use strict";
module.exports.withMetaWithData = {
    meta: {
        messages: {
            avoidFoo: "Avoid using variables named '{{ name }}'.",
            unused: "An unused key"
        }
    },
    create(context) {
        return {
            Identifier(node) {
                if (node.name === "foo") {
                    context.report({
                        node,
                        messageId: "avoidFoo",
                        data: {
                            name: "foo"
                        }
                    });
                }
            }
        };
    }
};

module.exports.withMessageOnly = {
    create(context) {
        return {
            Identifier(node) {
                if (node.name === "foo") {
                    context.report({ node, message: "Avoid using variables named 'foo'."});
                }
            }
        };
    }
};
