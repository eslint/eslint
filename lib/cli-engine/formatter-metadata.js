/**
 * @fileoverview `FormatterMetadata` class.
 *
 * `FormatterMetadata` class is the type for the second parameter of formatters.
 *
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const builtInRules = require("../rules");
const { emitDeprecationWarning } = require("../shared/deprecation-warnings");
const { getCLIEngineInternalSlots } = require("./cli-engine");

/** @typedef {import("../shared/types").RuleMeta} RuleMeta */
/** @typedef {InstanceType<import("./cli-engine")["CLIEngine"]>} CLIEngine */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * @typedef {Object} FormatterMetadataInternalSlots
 * @property {CLIEngine} engine The CLIEngine instance for this formatting.
 */

/** @type {WeakMap<FormatterMetadata, FormatterMetadataInternalSlots>} */
const internalSlots = new WeakMap();

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * The class for the second parameter of formatters.
 */
class FormatterMetadata {

    /**
     * Initialize this instance.
     * @param {CLIEngine} engine The CLIEngine instance.
     */
    constructor(engine) {
        internalSlots.set(this, { engine });

        /*
         * `rulesMeta` must be an instance property for backward compatibility.
         * Otherwise, `JSON.stringify` ignores `rulesMeta`.
         */
        Object.defineProperty(
            this,
            "rulesMeta",
            Object.getOwnPropertyDescriptor(FormatterMetadata.prototype, "rulesMeta")
        );
    }

    /**
     * Get a rule meta.
     * @param {string} ruleId The rule ID to get.
     * @param {string} filePath The path to a target file to determine configuration.
     * @returns {RuleMeta | undefined} The metadata of the rule.
     */
    getRuleMeta(ruleId, filePath) {
        const { engine } = internalSlots.get(this);

        // To avoid using `getRulesForFile(filePath)` because it merges all rules into a map.
        const { configArrayFactory } = getCLIEngineInternalSlots(engine);
        const configArray =
            configArrayFactory.getConfigArrayForFile(
                filePath,
                { ignoreNotFoundError: true }
            );
        const rule =
            configArray.pluginRules.get(ruleId) ||
            builtInRules.get(ruleId);

        return rule && rule.meta;
    }

    /**
     * Get the metadata of all rules.
     * @returns {Record<string, RuleMeta>} The metadata of rules.
     * @deprecated
     */
    get rulesMeta() {
        emitDeprecationWarning("rulesMeta", "ESLINT_LEGACY_RULES_META");

        const { engine } = internalSlots.get(this);
        const rulesMeta = {};

        for (const [ruleId, rule] of engine.getRules()) {
            rulesMeta[ruleId] = rule.meta;
        }

        return rulesMeta;
    }
}
Object.defineProperty(FormatterMetadata.prototype, "rulesMeta", { enumerable: true });

module.exports = { FormatterMetadata };
