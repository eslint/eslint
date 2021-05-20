"use strict";

module.exports.basic = {
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


