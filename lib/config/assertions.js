/**
 * @fileoverview Assertions for configs
 * @author Nicholas C. Zakas
 */

/**
 * Validates that a given string is the form pluginName/objectName.
 * @param {string} value The string to check. 
 * @returns {void}
 * @throws {TypeError} If the string isn't in the correct format.
 */
exports.assertIsPluginMemberName = function(value) {
    if (!/[a-z0-9-_$]+\/[a-z0-9-_$]+/i.test(value)) {
        throw new TypeError("Expected string in the form \"plugin-name/object-name\".")
    }
}

/**
 * Validates that a value is an object.
 * @param {any} value The value to check.
 * @returns {void}
 * @throws {TypeError} If the value isn't an object. 
 */
exports.assertIsObject = function(value) {
    if (!value || typeof value !== "object") {
        throw new TypeError("Expected an object.");
    }
}

/**
 * Validates that a value is an object or a string.
 * @param {any} value The value to check.
 * @returns {void}
 * @throws {TypeError} If the value isn't an object or a string. 
 */
exports.assertIsObjectOrString = function(value) {
    if ((!value || typeof value !== "object") && typeof value !== "string") {
        throw new TypeError("Expected an object or string.");
    }
}
