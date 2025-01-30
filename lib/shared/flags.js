/**
 * @fileoverview Shared flags for ESLint.
 */

"use strict";

/**
 * The set of flags that change ESLint behavior with a description.
 * @type {Map<string, string>}
 */
const activeFlags = new Map([
    ["test_only", "Used only for testing."],
    ["unstable_config_lookup_from_file", "Look up `eslint.config.js` from the file being linted."]
]);

/**
 * The set of flags that used to be active.
 *
 * `replacedBy` can be either:
 *   - An active flag (string) that enables the same feature.
 *   - `null` if the feature is now enabled by default.
 *   - Omitted if the feature has been abandoned.
 * @type {Map<string, {description: string, replacedBy?: string | null}>}
 */
const inactiveFlags = new Map([
    ["test_only_replaced", { description: "Used only for testing flags that have been replaced by other flags.", replacedBy: "test_only" }],
    ["test_only_enabled_by_default", { description: "Used only for testing flags whose features have been enabled by default.", replacedBy: null }],
    ["test_only_abandoned", { description: "Used only for testing flags whose features have been abandoned." }],
    ["unstable_ts_config", { description: "This flag is no longer required to enable TypeScript configuration files.", replacedBy: null }]
]);

module.exports = {
    activeFlags,
    inactiveFlags
};
