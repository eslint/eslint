module.exports = [
    {
        plugins: {
            foo: {
                rules: {
                    bar: {
                        create() {
                            throw new Error("Rule created");
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
