/**
 * @fileoverview Define `LintResultGenerator` class.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const debug = require("debug");
const log = debug("eslint:lint-result-generator");

/** @typedef {import("../cli-engine/cli-engine").LintResult} LintResult */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * @typedef {Object} Observer
 * @property {(error: Error) => void} reject The function that rejects an existing `next()` method calls.
 * @property {(result: LintResult) => void} resolve The function that resolves an existing `next()` method calls.
 */

/**
 * @typedef {Object} LintResultGeneratorOptions
 * @property {(yieldResult: (result: LintResult) => void) => Promise<void>} main The main logic. The first argument is the function that yields values.
 * @property {() => Promise<void>} [onAbort] The function that is called on aborted.
 * @property {(result:LintResult) => void} [onResult] The function that is called on linted a file immediately. (it doesn't wait for `next()` calls)
 * @property {() => void} [onEnd] The function that is called after linted all files. (it doesn't wait for `next()` calls)
 */

/**
 * @typedef {Object} LintResultGeneratorInternalSlots
 * @property {boolean} isEnded The flag that the generation process was ended.
 * @property {Observer[]} observers The `resolve`/`reject` pair of the pending `next()` calls.
 * @property {() => Promise<void>} onAbort The function that is called on aborted.
 * @property {() => void} onEnd The function that is called after linted all files. (it doesn't wait for `next()` calls)
 * @property {(result:LintResult) => void} onResult The function that is called on linted a file immediately. (it doesn't wait for `next()` calls)
 * @property {LintResult[]} queuedResults The values that have not been yielded yet. The following `next()` calls will be resolved with this values.
 * @property {Error|null} thrownError The thrown error. The following `next()` calls will be rejected with this error.
 */

/** @type {WeakMap<AsyncGenerator, LintResultGeneratorInternalSlots>} */
const internalSlotsMap = new WeakMap();

/** @type {() => void} */
const noop = Function.prototype;

/**
 * Yield a value.
 * @param {LintResultGeneratorInternalSlots} slots The internal slots.
 * @param {LintResult} value The value to yield.
 * @returns {void}
 */
function send(slots, value) {
    const { observers, onResult, queuedResults, thrownError } = slots;
    const observer = observers && observers.shift();

    if (observer) {
        log("Yield result %O", value.filePath);
        observer.resolve({ done: false, value });
    } else if (observers && !thrownError) {
        log("Queue result %O", value.filePath);
        queuedResults.push(value);
    }

    onResult(value);
}

/**
 * Resolve all existing `next()` calls with done.
 * @param {LintResultGeneratorInternalSlots} slots The internal slots.
 * @param {any} [value] A dummy value to return with `{done:true}`.
 * @returns {void}
 */
function done(slots, value) {
    const { isEnded, observers, onEnd } = slots;

    if (isEnded) {
        return;
    }
    slots.isEnded = true;
    log("Done");

    // Force to resolve the all pending `next()` calls with `done:true`.
    if (observers) {
        for (const { resolve } of observers) {
            resolve({ done: true, value });
        }
        slots.observers = null;
    }

    onEnd();
}

/**
 * Reject all `next()` call.
 * @param {LintResultGeneratorInternalSlots} slots The internal slots.
 * @param {Error} error The reason.
 * @returns {void}
 */
function fail(slots, error) {
    const { isEnded, observers, onEnd } = slots;

    if (isEnded) {
        return;
    }
    slots.isEnded = true;
    log("Failed %O", error.message);

    // Force to reject the all pending `next()` calls with the given error.
    if (observers) {
        for (const { reject } of observers) {
            reject(error);
        }
        slots.observers = null;
        slots.queuedResults.length = 0;
        slots.thrownError = error;
    }

    onEnd();
}

//------------------------------------------------------------------------------
// Public
//------------------------------------------------------------------------------

/**
 * The abstract class to yield values asynchronously.
 * @implements {AsyncIterableIterator<LintResult>}
 */
class LintResultGenerator {

    /**
     * Initialize a `ParallelMaster` instance.
     * @param {LintResultGeneratorOptions} config The initialization data.
     */
    constructor({
        main,
        onAbort = noop,
        onEnd = noop,
        onResult = noop
    }) {
        const slots = {
            isEnded: false,
            observers: [],
            onAbort,
            onEnd,
            onResult,
            queuedResults: [],
            thrownError: null
        };

        internalSlotsMap.set(this, slots);

        // Run the main function.
        Promise.resolve(value => send(slots, value))
            .then(main)
            .then(() => done(slots), error => fail(slots, error));
    }

    /**
     * Get the next result.
     * @returns {Promise<IteratorResult<LintResult>>} The lint result.
     */
    next() {
        const {
            observers,
            queuedResults,
            thrownError
        } = internalSlotsMap.get(this);

        if (thrownError) {
            return Promise.reject(thrownError);
        }
        if (queuedResults.length >= 1) {
            const value = queuedResults.shift();

            log("Yield result from queue: %O", value.filePath);
            return Promise.resolve({ done: false, value });
        }
        if (observers === null) {
            log("No more result");
            return Promise.resolve({ done: true, value: void 0 });
        }

        log("Wait for result");
        return new Promise((resolve, reject) => {
            observers.push({ reject, resolve });
        });
    }

    /**
     * Terminate all workers.
     * This method will be called when it escaped from `for-await-of` loop by `break`, `return`, or `throw`.
     * @param {any} [value] The optional value for the dummy result.
     * @returns {Promise<IteratorResult<any>>} The dummy result.
     */
    async return(value) {
        log("Detect escaping");
        const slots = internalSlotsMap.get(this);

        // Force to reset state to done.
        slots.queuedResults.length = 0;
        done(slots, value);

        // Call cleanup process.
        await slots.onAbort();

        return { done: true, value };
    }

    /**
     * Get the iterator of this.
     * @returns {AsyncIterableIterator<LintResult>} `this`.
     */
    [Symbol.asyncIterator]() {
        return this;
    }
}

module.exports = { LintResultGenerator };
