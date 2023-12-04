"use strict";

/**
 * Convert string string/number to string.
 * @param {string|number} severity severity string or number
 * @throws error if severity is invalid
 * @returns {string} severity string
 */
function normalizeSeverity(severity) {
    if ([2, "2", "error"].includes(severity)) {
        return "error";
    }
    if ([1, "1", "warn"].includes(severity)) {
        return "warn";
    }
    if ([0, "0", "off"].includes(severity)) {
        return "off";
    }
    throw new Error(`Invalid severity value: ${severity}`);
}

module.exports = {
    normalizeSeverity
};
