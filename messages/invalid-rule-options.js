"use strict";

const { stringifyValueForError } = require("./shared");

module.exports = function({ ruleId, value }) {
    return `
Configuration for rule "${ruleId}" is invalid. Expected severity of "off", 0, "warn", 1, "error", or 2.

You passed '${stringifyValueForError(value, 4)}'.

If you're attempting to configure rule options, perhaps you meant:

    ["error", ${stringifyValueForError(value, 8)}]

See https://eslint.org/docs/latest/use/configure/rules#using-configuration-files for configuring rules.
`.trimStart();
};
