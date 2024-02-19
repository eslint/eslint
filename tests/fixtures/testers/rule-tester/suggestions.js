"use strict";

module.exports.basic = {
    meta: { hasSuggestions: true },
    create(context) {
        return {
            Identifier(node) {
                if (node.name === "foo") {
                    context.report({
                        node,
                        message: "Avoid using identifiers named 'foo'.",
                        suggest: [{
                            desc: "Rename identifier 'foo' to 'bar'",
                            fix: fixer => fixer.replaceText(node, 'bar')
                        }]
                    });
                }
            }
        };
    }
};

module.exports.withMessageIds = {
    meta: {
        messages: {
            avoidFoo: "Avoid using identifiers named '{{ name }}'.",
            unused: "An unused key",
            renameFoo: "Rename identifier 'foo' to '{{ newName }}'"
        },
        hasSuggestions: true
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
                        },
                        suggest: [{
                            messageId: "renameFoo",
                            data: {
                                newName: "bar"
                            },
                            fix: fixer => fixer.replaceText(node, "bar")
                        }, {
                            messageId: "renameFoo",
                            data: {
                                newName: "baz"
                            },
                            fix: fixer => fixer.replaceText(node, "baz")
                        }]
                    });
                }
            }
        };
    }
};

module.exports.withDuplicateDescriptions = {
    meta: {
        hasSuggestions: true
    },
    create(context) {
        return {
            Identifier(node) {
                if (node.name === "foo") {
                    context.report({
                        node,
                        message: "Avoid using identifiers name 'foo'.",
                        suggest: [{
                            desc: "Rename 'foo' to 'bar'",
                            fix: fixer => fixer.replaceText(node, "bar")
                        }, {
                            desc: "Rename 'foo' to 'bar'",
                            fix: fixer => fixer.replaceText(node, "baz")
                        }]
                    });
                }
            }
        };
    }
};

module.exports.withDuplicateMessageIdsNoData = {
    meta: {
        messages: {
            avoidFoo: "Avoid using identifiers named '{{ name }}'.",
            renameFoo: "Rename identifier"
        },
        hasSuggestions: true
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
                        },
                        suggest: [{
                            messageId: "renameFoo",
                            fix: fixer => fixer.replaceText(node, "bar")
                        }, {
                            messageId: "renameFoo",
                            fix: fixer => fixer.replaceText(node, "baz")
                        }]
                    });
                }
            }
        };
    }
};

module.exports.withDuplicateMessageIdsWithData = {
    meta: {
        messages: {
            avoidFoo: "Avoid using identifiers named foo.",
            renameFoo: "Rename identifier 'foo' to '{{ newName }}'"
        },
        hasSuggestions: true
    },
    create(context) {
        return {
            Identifier(node) {
                if (node.name === "foo") {
                    context.report({
                        node,
                        messageId: "avoidFoo",
                        suggest: [{
                            messageId: "renameFoo",
                            data: {
                                newName: "bar"
                            },
                            fix: fixer => fixer.replaceText(node, "bar")
                        }, {
                            messageId: "renameFoo",
                            data: {
                                newName: "bar"
                            },
                            fix: fixer => fixer.replaceText(node, "baz")
                        }]
                    });
                }
            }
        };
    }
};

module.exports.withoutHasSuggestionsProperty = {
    create(context) {
        return {
            Identifier(node) {
                context.report({
                    node,
                    message: "some message",
                    suggest: [{ desc: "some suggestion", fix: fixer => fixer.replaceText(node, 'bar') }]
                });
            }
        };
    }
};

module.exports.withFixerWithoutChanges = {
    meta: { hasSuggestions: true },
    create(context) {
        return {
            Identifier(node) {
                if (node.name === "foo") {
                    context.report({
                        node,
                        message: "Avoid using identifiers named 'foo'.",
                        suggest: [{
                            desc: "Rename identifier 'foo' to 'bar'",
                            fix: fixer => fixer.replaceText(node, 'foo')
                        }]
                    });
                }
            }
        };
    }
};

module.exports.withFailingFixer = {
    create(context) {
        return {
            Identifier(node) {
                context.report({
                    node,
                    message: "some message",
                    suggest: [{ desc: "some suggestion", fix: fixer => null }]
                });
            }
        };
    }
};

module.exports.withMissingPlaceholderData = {
    meta: {
        messages: {
            avoidFoo: "Avoid using identifiers named '{{ name }}'.",
            renameFoo: "Rename identifier 'foo' to '{{ newName }}'"
        },
        hasSuggestions: true
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
                        },
                        suggest: [{
                            messageId: "renameFoo",
                            fix: fixer => fixer.replaceText(node, "bar")
                        }]
                    });
                }
            }
        };
    }
};

module.exports.withMultipleMissingPlaceholderDataProperties = {
    meta: {
        messages: {
            avoidFoo: "Avoid using identifiers named '{{ name }}'.",
            rename: "Rename identifier '{{ currentName }}' to '{{ newName }}'"
        },
        hasSuggestions: true
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
                        },
                        suggest: [{
                            messageId: "rename",
                            fix: fixer => fixer.replaceText(node, "bar")
                        }]
                    });
                }
            }
        };
    }
};
