"use strict";

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
    const resolveList = [];

    /**
     * Returns a promise that resolves when the number of concurrent tasks is less than the
     * specified maximum and this job is first in the queue.
     * @returns {Promise<void>} A new promise.
     */
    function nextTurn() {
        return new Promise(resolve => {
            resolveList.push(resolve);
        });
    }

    return async function(...args) {
        if (concurrency >= maxConcurrency) {
            await nextTurn();
        } else {
            ++concurrency;
        }
        try {
            // eslint-disable-next-line no-invalid-this -- forward `this` to the wrapped function
            return await Reflect.apply(fn, this, args);
        } finally {
            const resolve = resolveList.shift();

            if (resolve) {
                process.nextTick(resolve);
            } else {
                --concurrency;
            }
        }
    };
}

module.exports = limitConcurrency;
