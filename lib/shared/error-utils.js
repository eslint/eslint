/**
 * @fileoverview Utilities for error handling in ESLint CLI and Node.js API.
 * @author Nitin Kumar
 */
"use strict";

/**
 * Get the error message of a given value.
 * @param {any} error The value to get.
 * @returns {string} The error message.
 */
function getErrorMessage(error) {

    // Lazy loading because this is used only if an error happened.
    const util = require("util");

    // Foolproof -- third-party module might throw non-object.
    if (typeof error !== "object" || error === null) {
        return String(error);
    }

    // Use templates if `error.messageTemplate` is present.
    if (typeof error.messageTemplate === "string") {
        try {
            const template = require(`../../messages/${error.messageTemplate}.js`);

            return template(error.messageData || {});
        } catch {

            // Ignore template error then fallback to use `error.stack`.
        }
    }

    // Use the stacktrace if it's an error object.
    if (typeof error.stack === "string") {
        return error.stack;
    }

    // Otherwise, dump the object.
    return util.format("%o", error);
}

/**
 * Tracks error messages that are shown to the user so we only ever show the
 * same message once.
 * @type {Set<string>}
 */
const displayedErrors = new Set();

/**
 * Catch and report unexpected error.
 * @param {any} error The thrown error object.
 * @returns {void}
 */
function onFatalError(error) {
    process.exitCode = 2;

    const { version } = require("../../package.json");
    const message = `
Oops! Something went wrong! :(

ESLint: ${version}

${getErrorMessage(error)}`;

    if (!displayedErrors.has(message)) {
        // eslint-disable-next-line no-console -- We need to print the error message
        console.error(message);
        displayedErrors.add(message);
    }
}

module.exports = {
    onFatalError,
    getErrorMessage
};
