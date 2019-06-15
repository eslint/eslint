/**
 * @fileoverview Providing `describe` and `it` static properties to costomize those.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

/* global describe, it */

const assert = require("assert");
const util = require("util");
const DESCRIBE = Symbol("describe");
const IT = Symbol("it");

/**
 * This is `describe` default handler if `describe` don't exist.
 * @this {Mocha}
 * @param {string} text - The description of the test case.
 * @param {Function} method - The logic of the test case.
 * @returns {any} Returned value of `method`.
 */
function defaultDescribe(text, method) {
    return method.call(this);
}

/**
 * This is `it` default handler if `it` don't exist.
 * @this {Mocha}
 * @param {string} text - The description of the test case.
 * @param {Function} method - The logic of the test case.
 * @returns {any} Returned value of `method`.
 */
function defaultIt(text, method) {
    try {
        return method.call(this);
    } catch (err) {
        if (err instanceof assert.AssertionError) {
            err.message += ` (${util.inspect(err.actual)} ${err.operator} ${util.inspect(err.expected)})`;
        }
        throw err;
    }
}

/**
 * Providing `describe` and `it` static properties to costomize those.
 *
 * If people use `mocha test.js --watch` command, `describe` and `it` function
 * instances are different for each execution. So `describe` and `it` properties
 * should return fresh instances always.
 */
class TesterBase {
    static get describe() {
        return (
            this[DESCRIBE] ||
            (typeof describe === "function" ? describe : null) ||
            defaultDescribe
        );
    }

    static set describe(value) {
        this[DESCRIBE] = value;
    }

    static get it() {
        return (
            this[IT] ||
            (typeof it === "function" ? it : null) ||
            defaultIt
        );
    }

    static set it(value) {
        this[IT] = value;
    }
}

module.exports = { TesterBase };
