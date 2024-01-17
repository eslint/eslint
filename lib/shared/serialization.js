/**
 * @fileoverview Object serialization utils.
 * @author Bryan Mishkin
 */

"use strict";

const isPlainObject = require("lodash.isplainobject");

/**
 * Check if a value is a primitive or plain object created by the Object constructor.
 * @param {any} val the value to check
 * @returns {boolean} true if so
 * @private
 */
function isPrimitiveOrPlainObject(val) {
    return (val === null || typeof val === "string" || typeof val === "boolean" || typeof val === "number" || Array.isArray(val) || isPlainObject(val));
}

/**
 * Check if an object is serializable.
 * Functions or objects like RegExp cannot be serialized by JSON.stringify().
 * Inspired by: https://stackoverflow.com/questions/30579940/reliable-way-to-check-if-objects-is-serializable-in-javascript
 * @param {any} obj the object
 * @returns {boolean} true if the object is serializable
 */
function isSerializable(obj) {
    if (!isPrimitiveOrPlainObject(obj)) {
        return false;
    }
    for (const property in obj) {
        if (Object.hasOwn(obj, property)) {
            if (!isPrimitiveOrPlainObject(obj[property])) {
                return false;
            }
            if (typeof obj[property] === "object") {
                if (!isSerializable(obj[property])) {
                    return false;
                }
            }
        }
    }
    return true;
}

module.exports = {
    isSerializable
};
