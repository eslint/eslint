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
function deepMergeElements(first, second) {
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

    return Array.from(keysUnion).reduce((acc, key) => {
        const firstValue = first[key];
        const secondValue = second[key];

        if (firstValue !== undefined && secondValue !== undefined) {
            if (isObjectNotArray(firstValue) && isObjectNotArray(secondValue)) {
                acc[key] = deepMergeElements(firstValue, secondValue);
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
        ...first.map((value, i) => deepMergeElements(value, i < second.length ? second[i] : undefined)),
        ...second.slice(first.length)
    ];
}

module.exports = { deepMergeArrays };

/* eslint-enable eqeqeq, no-undefined -- `null` and `undefined` are different in options */
