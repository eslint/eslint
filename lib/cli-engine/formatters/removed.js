/**
 * @fileoverview Metadata on removed formatters.
 * @author Josh Goldberg
 */

"use strict";

const removedFormatters = new Set([
    "checkstyle",
    "codeframe",
    "compact",
    "jslint-xml",
    "junit",
    "table",
    "tap",
    "unix",
    "visualstudio"
]);

module.exports = { removedFormatters };
