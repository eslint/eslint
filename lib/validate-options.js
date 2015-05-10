/**
 * @fileoverview Validates rule options.
 * @author Brandon Mills
 * @copyright 2015 Brandon Mills
 */

"use strict";

var rules = require("./rules"),
    validator = require("is-my-json-valid");

var validators = Object.create(null); // Cache generated schema validators

/**
 * Converts a rule's exported, abbreviated schema into a full schema.
 * @param {object} options Exported schema from a rule.
 * @returns {object} Full schema ready for validation.
 */
function makeSchema(options) {

    // If no schema, only validate warning level, and permit anything after
    if (!options) {
        return {
            "type": "array",
            "items": [
                {
                    "enum": [0, 1, 2]
                }
            ],
            "minItems": 1
        };
    }

    // Given a tuple of schemas, insert warning level at the beginning
    if (Array.isArray(options)) {
        return {
            "type": "array",
            "items": [
                {
                    "enum": [0, 1, 2]
                }
            ].concat(options),
            "minItems": 1,
            "maxItems": options.length + 1
        };
    }

    // Given a full schema, leave it alone
    return options;
}

/**
 * Gets an options schema for a rule.
 * @param {string} id The rule's unique name.
 * @returns {object}  vJSON Schema for the rule's options.
 */
function getRuleSchema(id) {
    var rule = rules.get(id);
    return makeSchema(rule && rule.schema);
}

/**
 * Validates a rule's options against its schema.
 * @param {string} id The rule's unique name.
 * @param {object} config The given options for the rule.
 * @param {string} source The name of the configuration source.
 * @returns {void}
 */
module.exports = function (id, config, source) {
    var message, validate;

    // Skip plugin and shared rules, as they may not be available.
    if (id.indexOf("/") >= 0 || id.slice(0, 14) === "eslint-config-") {
        return;
    }

    validate = validators[id];
    if (!validate) {
        validate = validator(getRuleSchema(id), { verbose: true });
        validators[id] = validate;
    }

    if (typeof config === "number") {
        config = [config];
    }

    validate(config);

    if (validate.errors) {
        message = [
            source, ":\n",
            "\tConfiguration for rule \"", id, "\" is invalid:\n"
        ];
        validate.errors.forEach(function (error) {
            message.push(
                "\tValue \"", error.value, "\" ", error.message, ".\n"
            );
        });

        throw new Error(message.join(""));
    }
};

module.exports.getRuleSchema = getRuleSchema;
