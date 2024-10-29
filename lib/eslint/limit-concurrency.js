"use strict";

/**
 * Returns the first element in an iterable collection.
 * @template T
 * @param {Iterable<T>} iterable A collection of non-undefined elements.
 * @returns {T | undefined}
 *      The first element in the collection, or `undefined` if the collection is empty.
 */
function pickFirst(iterable) {
    return iterable[Symbol.iterator]().next().value;
}

/**
 * Wraps a specified async function to ensure that it doesn't run more that a certain number of
 * times concurrently.
 * @template T extends Function
 * @param {T} fn An async function.
 * @param {number} maxConcurrency The maximum concurrency.
 * @returns {T} A wrapper around the specified function.
 */
function limitConcurrency(fn, maxConcurrency = 100) {
    let concurrency = 0;
    const pendingSet = new Set();

    /**
     * Returns a promise that resolves when the number of concurrent tasks is less than the
     * specified maximum and this job is first in the queue.
     * @returns {Promise<void>} A new promise.
     */
    function nextTurn() {
        return new Promise(resolve => {
            pendingSet.add(resolve);
        });
    }

    return async function(...args) {
        if (concurrency >= maxConcurrency) {
            await nextTurn();
        }
        ++concurrency;
        try {
            // eslint-disable-next-line no-invalid-this -- forward `this` to the wrapped function
            return await Reflect.apply(fn, this, args);
        } finally {
            --concurrency;
            const pending = pickFirst(pendingSet);

            if (pending) {
                pendingSet.delete(pending);
                process.nextTick(pending);
            }
        }
    };
}

module.exports = limitConcurrency;
