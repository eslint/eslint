/**
 * @fileoverview Provide the function that emits deprecation warnings.
 * @author Toru Nagashima <http://github.com/mysticatea>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path");
const lodash = require("lodash");

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

// Defitions for deprecation warnings.
const deprecationWarningMessages = {
    ESLINT_LEGACY_ECMAFEATURES:
        "The 'ecmaFeatures' config file property is deprecated and has no effect.",
    ESLINT_PERSONAL_CONFIG_LOAD:
        "'~/.eslintrc.*' config files have been deprecated. " +
        "Please use a config file per project or the '--config' option.",
    ESLINT_PERSONAL_CONFIG_SUPPRESS:
        "'~/.eslintrc.*' config files have been deprecated. " +
        "Please remove it or add 'root:true' to the config files in your " +
        "projects in order to avoid loading '~/.eslintrc.*' accidentally.",
    ESLINT_LEGACY_GET_RULES:
        "'CLIEngine::getRules()' method has been deprecated. " +
        "ESLint may use plugins that have the same name but different " +
        "implementations in each target file. This method will be confused in " +
        "such a case. " +
        "Please use 'CLIEngine::getRulesForFile(filePath)' method instead.",
    ESLINT_LEGACY_RULES_META:
        "'metadata.rulesMeta' property in formatters has been deprecated. " +
        "ESLint may use plugins that have the same name but different " +
        "implementations in each target file. This method will be confused in " +
        "such a case. " +
        "Please use 'metadata.getRuleMeta(ruleId, filePath)' method instead."
};

/**
 * Emits a deprecation warning containing a given filepath. A new deprecation warning is emitted
 * for each unique file path, but repeated invocations with the same file path have no effect.
 * No warnings are emitted if the `--no-deprecation` or `--no-warnings` Node runtime flags are active.
 * @param {string} source The name of the configuration source to report the warning for.
 * @param {string} errorCode The warning message to show.
 * @returns {void}
 */
const emitDeprecationWarning = lodash.memoize((source, errorCode) => {
    const rel = path.relative(process.cwd(), source);
    const message = deprecationWarningMessages[errorCode];

    process.emitWarning(
        `${message} (found in "${rel}")`,
        "DeprecationWarning",
        errorCode
    );
}, (...args) => JSON.stringify(args));

/**
 * Reset warning emission counts.
 * @returns {void}
 */
function resetDeprecationWarning() {
    emitDeprecationWarning.cache.clear();
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    emitDeprecationWarning,
    resetDeprecationWarning
};
