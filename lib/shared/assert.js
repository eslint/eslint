/**
 * @fileoverview Assertion utilities equivalent to the Node.js node:asserts module.
 * @author Josh Goldberg
 */

"use strict";

/**
 * Throws an error if the input is not truthy.
 * @param {unknown} value The input that is checked for being truthy.
 * @param {string} message Message to throw if the input is not truthy.
 * @returns {void}
 * @throws {Error} When the condition is not truthy.
 */
function ok(value, message) {
    if (!value) {
        throw new Error(message);
    }
}

/**
 * Throws an error if the input is not strictly equal to expected.
 * @template T
 * @param {T} value The input that is checked for being strictly equal.
 * @param {T} expected The expected value.
 * @param {string} message Message to throw if the input is not strictly equal.
 * @returns {void}
 * @throws {Error} if the input is not strictly equal to the expected value.
 */
function strictEqual(value, expected, message) {
    if (value !== expected) {
        throw new Error(message);
    }
}

/**
 * Throws an error if the input is strictly equal to expected.
 * @template T
 * @param {T} value The input that is checked for being strictly equal.
 * @param {T} expected The expected value.
 * @param {string} message Message to throw if the input is strictly equal.
 * @returns {void}
 * @throws {Error}  if the input is not strictly equal to the expected value.
 */
function notStrictEqual(value, expected, message) {
    if (value === expected) {
        throw new Error(message);
    }
}

module.exports = {
    ok,
    strictEqual,
    notStrictEqual,

    /*
     * Intentionally mirroring the node:assert interface, instead of normal Knip CommonJS patterns.
     * https://knip.dev/guides/working-with-commonjs
     */
    __esModule: true
};
