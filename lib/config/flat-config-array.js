/**
 * @fileoverview Flat Config Array
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { ConfigArray } = require("@humanwhocodes/config-array");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Validates that a value is an object.
 * @param {any} value The value to check.
 * @returns {void}
 * @throws {TypeError} If the value isn't an object. 
 */
function assertIsObject(value) {
    if (value && typeof value !== "object") {
        throw new TypeError("Expected an object.");
    }
}

/**
 * Validates that a value is an object or a string.
 * @param {any} value The value to check.
 * @returns {void}
 * @throws {TypeError} If the value isn't an object or a string. 
 */
function assertIsObjectOrString(value) {
    if (value && typeof value !== "object" && typeof value !== "string") {
        throw new TypeError("Expected an object or string.");
    }
}

/**
 * Validates that a value is a string.
 * @param {any} value The value to check.
 * @returns {void}
 * @throws {TypeError} If the value isn't a string.
 */
function assertIsString(value) {
    if (typeof value !== "string") {
        throw new TypeError("Expected a string.");
    }
}

/**
 * Validates that a value is a number.
 * @param {any} value The value to check.
 * @returns {void}
 * @throws {TypeError} If the value isn't a number.
 */
function assertIsNumber(value) {
    if (typeof value !== "number") {
        throw new TypeError("Expected a number.");
    }
}

/**
 * Merges two objects into a new object with combined properties.
 * @param {Object} first The base object. 
 * @param {Object} second The object with overrides to merge.
 * @returns {Object} A new object with a combination of the properties from
 *      the two parameter objects.
 */
function mergeByMix(first, second) {
    return {
        ...first,
        ...second
    };
}

/**
 * Replaces one value with an override if present.
 * @param {any} first The original value. 
 * @param {any} second The value to override the first with.
 * @returns {any} The final value.
 */
function mergeByReplace(first, second) {

    // as long as the second value isn't undefined, return it
    if (second !== void 0) {
        return second;
    } 

    return first;
}

//-----------------------------------------------------------------------------
// Schemas
//-----------------------------------------------------------------------------

// values must be an object and properties are merged
const objectMixSchema = {
    merge: mergeByMix,
    validate: assertIsObject
};

const stringSchema = {
    merge: mergeByReplace,
    validate: assertIsString
};

const numberSchema = {
    merge: mergeByReplace,
    validate: assertIsNumber
};

const languageOptionsSchema = {
    ecmaVersion: numberSchema,
    sourceType: stringSchema,
    globals: objectMixSchema,
    parser: {
        merge: mergeByReplace,
        validate: assertIsObjectOrString
    },
    parserOptions: objectMixSchema,
};

const linterOptionsSchema = {
    reportUnusedDisableDirectives: {
        merge: mergeByReplace,
        validate(value) {
            if (typeof value !== "string" || !/^off|warn|error$/.test(value)) {
                throw new TypeError("Value must be 'off', 'warn', or 'error'.");
            }
        }
    }
};

const topLevelSchema = {
    settings: objectMixSchema
};

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

class FlatConfigArray extends ConfigArray {

    constructor(configs, options) {
        super(configs, {
            ...options,
            schema: topLevelSchema
        });
    }

}

exports.FlatConfigArray = FlatConfigArray;
