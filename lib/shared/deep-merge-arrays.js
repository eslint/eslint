/**
 * @fileoverview Applies default rule options
 * @author JoshuaKGoldberg
 */
/* eslint-disable eqeqeq, no-undefined -- `null` and `undefined` are different in options */

"use strict";

/**
 * Check if the variable contains an object strictly rejecting arrays
 * @param {unknown} value an object
 * @returns {boolean} Whether value is an object
 */
function isObjectNotArray(value) {
    return typeof value === "object" && value != null && !Array.isArray(value);
}

/**
 * Deeply merges second on top of first, creating a new {} object if needed.
 * @param {T} first Base, default value.
 * @param {U} second User-specified value.
 * @returns {T | U | (T & U)} Merged equivalent of second on top of first.
 */
function deepMergeObjects(first, second) {
    if (second === null || (second !== undefined && typeof second !== "object")) {
        return second;
    }

    if (first === null || second === undefined) {
        return first;
    }

    if (Array.isArray(first) || typeof first !== "object") {
        return second;
    }

    const keysUnion = new Set(Object.keys(first).concat(Object.keys(second)));

    return Array.from(keysUnion).reduce((result, key) => {
        const firstValue = first[key];
        const secondValue = second[key];

        if (firstValue !== undefined && secondValue !== undefined) {
            if (isObjectNotArray(firstValue) && isObjectNotArray(secondValue)) {
                result[key] = deepMergeObjects(firstValue, secondValue);
            } else {
                result[key] = secondValue;
            }
        } else if (firstValue !== undefined) {
            result[key] = firstValue;
        } else {
            result[key] = secondValue;
        }

        return result;
    }, {});
}

/**
 * Deeply merges second on top of first, creating a new [] array if needed.
 * @param {T[]} first Base, default values.
 * @param {U[]} second User-specified values.
 * @returns {(T | U | (T & U))[]} Merged equivalent of second on top of first.
 */
function deepMergeArrays(first, second) {
    if (!first || !second) {
        return second || first || [];
    }

    return [
        ...first.map((value, i) => deepMergeObjects(value, i < second.length ? second[i] : undefined)),
        ...second.slice(first.length)
    ];
}

module.exports = { deepMergeArrays };

/* eslint-enable eqeqeq, no-undefined -- `null` and `undefined` are different in options */
