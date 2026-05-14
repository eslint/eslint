function throwError() {
    const error = new Error();
    error.stack = "test_error_stack";
    throw error;
}

module.exports = [{
    plugins: {
        foo: {
            rules: {
                bar: {
                    create() {
                        process.nextTick(throwError);
                        process.nextTick(throwError);
                        return {};
                    }
                }
            }
        }
    },
    rules: {
        "foo/bar": "error"
    }
}];
