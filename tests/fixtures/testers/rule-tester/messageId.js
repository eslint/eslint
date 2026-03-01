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

module.exports.withMissingData = {
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
                    });
                }
            }
        };
    }
};

module.exports.withMultipleMissingDataProperties = {
    meta: {
        messages: {
            avoidFoo: "Avoid using {{ type }} named '{{ name }}'.",
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
                    });
                }
            }
        };
    }
};

module.exports.withPlaceholdersInData = {
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
                        data:      { name: '{{ placeholder }}' },
                    });
                }
            }
        };
    }
};

module.exports.withSamePlaceholdersInData = {
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
                        data:      { name: '{{ name }}' },
                    });
                }
            }
        };
    }
};

module.exports.withNonStringData = {
    meta: {
        messages: {
            avoid: "Avoid using the value '{{ value }}'.",
        }
    },
    create(context) {
        return {
            Literal(node) {
                if (node.value === 0) {
                    context.report({
                        node,
                        messageId: "avoid",
                        data:      { value: 0 },
                    });
                }
            }
        };
    }
};
