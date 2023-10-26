function throwError() {
    const error = new Error();
    error.stack = "test_error_stack";
    throw error;
}

process.nextTick(throwError);

/*
 * Promise ensures that this config must be await-ed and therefore
 * the error in next tick will be thrown before any linting is done
 */
module.exports = Promise.resolve([{}]);
