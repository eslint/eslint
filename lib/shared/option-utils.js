/**
 * @fileoverview Utilities to operate on arrays.
 * @author Josh Goldberg
 */

"use strict";

/**
 * Determines whether any of input's properties are different
 * from values that already exist in original.
 * @template T
 * @param {Partial<T>} input New value.
 * @param {T} original Original value.
 * @returns {boolean} Whether input includes an explicit difference.
 */
function containsDifferentProperty(input, original) {
    if (input === original) {
        return false;
    }

    if (Array.isArray(input)) {
        return (
            !Array.isArray(original) ||
            input.length !== original.length ||
            input.some((value, i) =>
                containsDifferentProperty(value, original[i]))
        );
    }

    if (typeof input !== typeof original) {
        return true;
    }

    if (typeof input === "object") {
        const inputKeys = Object.keys(input);
        const originalKeys = Object.keys(original);

        return inputKeys.length !== originalKeys.length || inputKeys.some(
            inputKey =>
                !Object.hasOwn(original, inputKey) ||
                containsDifferentProperty(input[inputKey], original[inputKey])
        );
    }

    return true;
}

module.exports = {
    containsDifferentProperty
};
