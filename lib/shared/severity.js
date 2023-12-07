"use strict";

/**
 * Convert severity value of different types to string.
 * @param {string|number} severity severity value
 * @throws error if severity is invalid
 * @returns {string} severity string
 */
function normalizeSeverityToString(severity) {
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
    normalizeSeverityToString
};
