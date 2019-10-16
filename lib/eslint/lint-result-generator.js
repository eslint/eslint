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
 * @property {LintResult[]} [knownResults] The known results.
 * @property {(yieldResult: (result: LintResult) => void) => Promise<void>} main The main logic. The first argument is the function that yields values.
 * @property {() => void} [onEnd] The function that is called after linted all files. (it doesn't wait for `next()` calls)
 * @property {(result:LintResult) => void} [onResult] The function that is called on linted a file immediately. (it doesn't wait for `next()` calls)
 */

/**
 * @typedef {Object} LintResultGeneratorInternalSlots
 * @property {boolean} iterated If `[Symbol.asyncIterator]()` method is called then this is set `true`.
 * @property {Observer[] | null} observers The `resolve`/`reject` pair of the pending `next()` calls. If all results are yielded or queued then this property is `null`.
 * @property {() => void} onEnd The function that is called after linted all files. (it doesn't wait for `next()` calls)
 * @property {(result:LintResult) => void} onResult The function that is called on linted a file immediately. (it doesn't wait for `next()` calls)
 * @property {Promise<LintResult[]> | null} promise The promise object to collect all results.
 * @property {LintResult[]} queuedResults The results. The following `next()` calls will be resolved with this values.
 * @property {Error|null} thrownError The thrown error. The following `next()` calls will be rejected with this error.
 */

/** @type {WeakMap<Object, LintResultGeneratorInternalSlots>} */
const internalSlotsMap = new WeakMap();

/** @type {() => void} */
const noop = Function.prototype;

/**
 * Yield a value.
 * @param {LintResultGeneratorInternalSlots} slots The internal slots.
 * @param {LintResult} result The value to yield.
 * @returns {void}
 */
function send(slots, result) {
    const { observers, onResult, queuedResults } = slots;

    if (!observers) {
        return;
    }
    const observer = observers.shift();

    // Resolve the pending `next()` calls or queue the result.
    if (observer) {
        log("Yield result %O", result.filePath);
        observer.resolve({ done: false, value: result });
    } else {
        log("Queue result %O", result.filePath);
        queuedResults.push(result);
    }
    onResult(result);
}

/**
 * Resolve all existing `next()` calls with done.
 * @param {LintResultGeneratorInternalSlots} slots The internal slots.
 * @param {boolean} isAbort If `true` then abort.
 * @returns {void}
 */
function done(slots, isAbort) {
    const { observers, onEnd } = slots;

    if (!observers) {
        return;
    }
    log("Done");

    // Force to resolve the all pending `next()` calls with `done:true`.
    for (const { resolve } of observers) {
        resolve({ done: true, value: void 0 });
    }
    slots.observers = null;

    // Clear results if aborted.
    if (isAbort) {
        slots.queuedResults.length = 0;
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
    const { observers, onEnd } = slots;

    if (!observers) {
        return;
    }
    log("Failed %O", error.message);

    // Force to reject the all pending `next()` calls with the given error.
    for (const { reject } of observers) {
        reject(error);
    }
    slots.observers = null;
    slots.queuedResults.length = 0;
    slots.thrownError = error;

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
     * Initialize a `LintResultGenerator` instance.
     * @param {LintResultGeneratorOptions} config The initialization data.
     */
    constructor({
        knownResults = [],
        main,
        onEnd = noop,
        onResult = noop
    }) {
        const slots = {
            iterated: false,
            observers: [],
            onEnd,
            onResult,
            promise: null,
            queuedResults: [...knownResults],
            thrownError: null
        };

        internalSlotsMap.set(this, slots);

        // Run the main function.
        Promise.resolve(value => send(slots, value))
            .then(main)
            .then(() => done(slots, false), error => fail(slots, error));
    }

    /**
     * `then()` method to use with `await` expressions.
     * @template T, U
     * @param {(results:LintResult[]) => T | Promise<T>} onfulfilled The function to be called with results.
     * @param {(error:any) => U | Promise<U>} onrejected The function to be called with error.
     * @returns {Promise<T | U>} The promise will be fulfilled with the all results.
     */
    then(onfulfilled, onrejected) {
        const slots = internalSlotsMap.get(this);

        // Collect all results.
        if (!slots.promise) {
            slots.promise = (async() => {
                if (slots.iterated) {
                    throw new Error("This generator has been consumed as an iterator already.");
                }
                const results = [];

                for await (const result of this) {
                    results.push(result);
                }
                return results;
            })();
        }

        return slots.promise.then(onfulfilled, onrejected);
    }

    /**
     * Get the next result.
     * @returns {Promise<IteratorResult<LintResult>>} The lint result.
     */
    next() {
        const slots = internalSlotsMap.get(this);
        const { observers, queuedResults, thrownError } = slots;

        slots.iterated = true;

        if (thrownError) {
            return Promise.reject(thrownError);
        }
        if (queuedResults.length >= 1) {
            const result = queuedResults.shift();

            log("Yield result from stored results: %O", result.filePath);
            return Promise.resolve({ done: false, value: result });
        }
        if (observers === null) {
            log("No more result");
            return Promise.resolve({ done: true, value: void 0 });
        }

        log("Wait for a new result");
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
    return(value) {
        log("Detect escaping");
        const slots = internalSlotsMap.get(this);

        done(slots, true);

        return Promise.resolve({ done: true, value });
    }

    /**
     * Get the iterator of this.
     * @returns {AsyncIterableIterator<LintResult>} `this`.
     */
    [Symbol.asyncIterator]() {
        const slots = internalSlotsMap.get(this);

        if (slots.promise) {
            throw new Error("This generator has been consumed as a promise already");
        }
        if (slots.iterated) {
            throw new Error("This generator has been consumed already");
        }
        slots.iterated = true;

        return this;
    }
}

module.exports = { LintResultGenerator };
