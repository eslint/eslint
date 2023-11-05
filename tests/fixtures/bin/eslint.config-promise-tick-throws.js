function throwError() {
    const error = new Error();
    error.stack = "test_error_stack";
    throw error;
}

process.nextTick(throwError);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getConfig() {
    await delay(100);
    return [];
}

/*
 * Exporting the config as an initially unsettled Promise should ensure that
 * the error in next tick will be thrown before any linting is done
 */
module.exports = getConfig();
