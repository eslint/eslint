/**
 * @fileoverview RuleContext utility for rules
 * @author Nicholas C. Zakas
 * @copyright 2013 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var RuleFixer = require("./util/rule-fixer");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var PASSTHROUGHS = [
    "getAllComments",
    "getAncestors",
    "getComments",
    "getDeclaredVariables",
    "getFilename",
    "getFirstToken",
    "getFirstTokens",
    "getJSDocComment",
    "getLastToken",
    "getLastTokens",
    "getNodeByRangeIndex",
    "getScope",
    "getSource",
    "getSourceLines",
    "getTokenAfter",
    "getTokenBefore",
    "getTokenByRangeStart",
    "getTokens",
    "getTokensAfter",
    "getTokensBefore",
    "getTokensBetween",
    "markVariableAsUsed",
    "isMarkedAsUsed"
];

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/**
 * An error message description
 * @typedef {Object} MessageDescriptor
 * @property {string} nodeType The type of node.
 * @property {Location} loc The location of the problem.
 * @property {string} message The problem message.
 * @property {Object} [data] Optional data to use to fill in placeholders in the
 *      message.
 * @property {Function} fix The function to call that creates a fix command.
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * Construct rule's settings based on the schema and user options
 * @param {object} options User config options
 * @param {array} schema Rule's schema
 * @param {object} meta Rule's metadata
 * @returns {object} Object containing normalized rule settings
 */
function createOptions(options, schema, meta) {

    /**
     * Normalize object schema property based on user options
     * @param {object} properties Properties of the object schema property
     * @param {int} position Position of the property in the schema
     * @param {object} result List of normalized properties
     * @returns {object} Updated list of normalized properties
     */
    function normalizeObjectOptions(properties, position, result) {
        Object.keys(properties).forEach(function(key) {
            result[key] = options[position] && typeof options[position][key] !== "undefined" ? options[position][key] : meta.schema[position].properties[key].default;
        });
        return result;
    }

    /**
     * Normalize enum scheam property based on user optiosn
     * @param {array} enumList List of valid user options based on schema
     * @param {object} value User selected option
     * @param {object} result List of normalized properties
     * @returns {object} Updated list of normalized properties
     */
    function normalizeEnumOptions(enumList, value, result) {
        enumList.forEach(function(enumValue) {
            result[enumValue] = value === enumValue;
        });
        return result;
    }

    if (!meta) {
        return options;
    }
    var result = {};
    for (var i = 0, l = meta.schema.length; i < l; i++) {
        if (meta.schema[i].type && meta.schema[i].type === "object") {
            result = normalizeObjectOptions(meta.schema[i].properties, i, result);
        }
        if (meta.schema[i].enum) {
            var value = options[i];
            result = normalizeEnumOptions(meta.schema[i].enum, value, result);
        }
    }
    return result;
}

/**
 * Acts as an abstraction layer between rules and the main eslint object.
 * @constructor
 * @param {string} ruleId The ID of the rule using this object.
 * @param {eslint} eslint The eslint object.
 * @param {number} severity The configured severity level of the rule.
 * @param {array} options The configuration information to be added to the rule.
 * @param {object} settings The configuration settings passed from the config file.
 * @param {object} ecmaFeatures The ecmaFeatures settings passed from the config file.
 * @param {object} meta The metadata of the rule
 * @param {object} schema The schema of the rule
 */
function RuleContext(ruleId, eslint, severity, options, settings, ecmaFeatures, meta, schema) {

    /**
     * The read-only ID of the rule.
     */
    Object.defineProperty(this, "id", {
        value: ruleId
    });

    /**
     * The read-only options of the rule
     */
    Object.defineProperty(this, "options", {
        value: createOptions(options, schema, meta)
    });

    /**
     * The read-only settings shared between all rules
     */
    Object.defineProperty(this, "settings", {
        value: settings
    });

    /**
     * The read-only ecmaFeatures shared across all rules
     */
    Object.defineProperty(this, "ecmaFeatures", {
        value: Object.create(ecmaFeatures)
    });
    Object.freeze(this.ecmaFeatures);

    // copy over passthrough methods
    PASSTHROUGHS.forEach(function(name) {
        this[name] = function() {
            return eslint[name].apply(eslint, arguments);
        };
    }, this);

    /**
     * Passthrough to eslint.report() that automatically assigns the rule ID and severity.
     * @param {ASTNode|MessageDescriptor} nodeOrDescriptor The AST node related to the message or a message
     *      descriptor.
     * @param {Object=} location The location of the error.
     * @param {string} message The message to display to the user.
     * @param {Object} opts Optional template data which produces a formatted message
     *     with symbols being replaced by this object's values.
     * @returns {void}
     */
    this.report = function(nodeOrDescriptor, location, message, opts) {

        var descriptor,
            fix = null;

        // check to see if it's a new style call
        if (arguments.length === 1) {
            descriptor = nodeOrDescriptor;

            // if there's a fix specified, get it
            if (typeof descriptor.fix === "function") {
                fix = descriptor.fix(new RuleFixer());
            }

            eslint.report(
                ruleId, severity, descriptor.node,
                descriptor.loc || descriptor.node.loc.start,
                descriptor.message, descriptor.data, fix, meta
            );

            return;
        }

        // old style call
        eslint.report(ruleId, severity, nodeOrDescriptor, location, message, opts, meta);
    };

    /**
     * Passthrough to eslint.getSourceCode().
     * @returns {SourceCode} The SourceCode object for the code.
     */
    this.getSourceCode = function() {
        return eslint.getSourceCode();
    };

}

RuleContext.prototype = {
    constructor: RuleContext
};

module.exports = RuleContext;
