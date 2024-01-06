module.exports = [
    {
        plugins: {
            foo: {
                rules: {
                    bar: {
                        create(context) {
                            // Rule was executed if this is logged
                            console.log("Rule Created.");
                            return {
                                Program(node) {
                                    context.report({
                                        node,
                                        message: "Rule created",
                                    });
                                },
                            };
                        }
                    }
                }
            }
        }
    },
    {
        rules: {
            "foo/bar": "warn"
        }
    }
];
