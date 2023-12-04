"use strict";

/**
 * Convert severity value of different types to string.
 * @param {string|number|boolean} severity severity value
 * @param {string} severityForTrue what severity to use for true
 * @throws error if severity is invalid
 * @returns {string} severity string
 */
function normalizeSeverity(severity, severityForTrue = "warn") {
    if ([true, "true"].includes(severity)) {
        return severityForTrue;
    }
    if ([false, "false"].includes(severity)) {
        return "off";
    }
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
