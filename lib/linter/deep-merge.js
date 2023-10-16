/* eslint-disable eqeqeq, no-undefined -- `null` and `undefined` are different in options */
/**
 * @fileoverview Applies default rule options
 * @author JoshuaKGoldberg
 */

"use strict";

/**
 * Check if the variable contains an object strictly rejecting arrays
 * @param {unknown} obj an object
 * @returns {boolean} Whether obj is an object
 */
function isObjectNotArray(obj) {
    return typeof obj === "object" && obj != null && !Array.isArray(obj);
}

/**
 * Deeply merges second on top of first, creating a new {} object if needed.
 * @param {T} first Base, default value.
 * @param {U} second User-specified value.
 * @returns {T | U | (T & U)} Merged equivalent of second on top of first.
 */
function deepMerge(first, second) {
    if (second === null || (second !== undefined && typeof second !== "object")) {
        return second;
    }

    if (typeof first !== "object" && typeof second === "object" && second !== null) {
        return second;
    }

    if (first === null || Array.isArray(first) || second === undefined) {
        return first;
    }

    const keysUnion = new Set(Object.keys(first).concat(Object.keys(second)));

    return Array.from(keysUnion).reduce((acc, key) => {
        const firstValue = first[key];
        const secondValue = second[key];

        if (firstValue !== undefined && secondValue !== undefined) {
            if (isObjectNotArray(firstValue) && isObjectNotArray(secondValue)) {
                acc[key] = deepMerge(firstValue, secondValue);
            } else {
                acc[key] = secondValue;
            }
        } else if (firstValue !== undefined) {
            acc[key] = firstValue;
        } else {
            acc[key] = secondValue;
        }

        return acc;
    }, {});
}

module.exports = { deepMerge };

/* eslint-enable eqeqeq, no-undefined -- `null` and `undefined` are different in options */
