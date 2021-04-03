/**
 * @fileoverview RulesSchema Class
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const ajv = require("../shared/ajv")();
const {
    assertIsObject,
    assertIsObjectOrString,
    assertIsPluginMemberName
} = require("./assertions");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const ruleSeverities = new Map([
    [0, 0], ["off", 0],
    [1, 1], ["warn", 1],
    [2, 2], ["error", 2]
]);

/**
 * Validates that a value is a valid rule options entry.
 * @param {any} value The value to check.
 * @returns {void}
 * @throws {TypeError} If the value isn't a valid rule options.
 */
function assertIsRuleOptions(value) {

    if (typeof value !== "string" && typeof value !== "number" && !Array.isArray(value)) {
        throw new TypeError(`Expected a string, number, or array.`);
    }
}

/**
 * Validates that a value is valid rule severity.
 * @param {any} value The value to check.
 * @returns {void}
 * @throws {TypeError} If the value isn't a valid rule severity.
 */
function assertIsRuleSeverity(value) {
    const severity = typeof value === "string"
        ? ruleSeverities.get(value.toLowerCase())
        : ruleSeverities.get(value);

    if (typeof severity === "undefined") {
        throw new TypeError(`Expected severity of "off", 0, "warn", 1, "error", or 2.`);
    }
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------


class RulesSchema {

    merge(first = {}, second = {}) {

        const result = {
            ...first,
            ...second
        };

        for (const ruleId of Object.keys(result)) {

            /*
             * If either rule config is missing, then no more work
             * is necessary; the correct config is already there.
             */
            if (!(ruleId in first) || !(ruleId in second)) {
                continue;
            }

            const firstIsArray = Array.isArray(first[ruleId]);
            const secondIsArray = Array.isArray(second[ruleId]);
            
            /*
             * If the first rule config is an array and the second isn't, just
             * create a new array where the first element is the severity from
             * the second rule config and the other elements are copied over
             * from the first rule config.
             */
            if (firstIsArray && !secondIsArray) {
                result[ruleId] = [second[ruleId], ...first[ruleId].slice(1)];
                continue;
            }
            
            /*
             * If the first rule config isn't an array, then the second rule
             * config takes precedence. If it's an array, we return a copy;
             * otherwise we return the full value (for just severity);
             */
            if (!firstIsArray) {
                result[ruleId] = secondIsArray
                    ? second[ruleId].slice(0)
                    : second[ruleId];
                continue;
            }

            /*
             * If both the first rule config and the second rule config are
             * arrays, then we need to do this complicated merging, which is no
             * fun.
             */
            result[ruleId] = [

                // second severity always takes precedence
                second[ruleId][0]
            ];

            const length = Math.max(first.length, second.length);

            for (let i = 1; i < length; i++) {
                
            }

        }

        return result;
    }

    /**
     * Checks to see if the rules object is valid. This does not validate
     * rule options -- that step happens after configuration is calculated.
     * @param {any} value The value to check.
     * @throws {TypeError} If the rules object isn't valid. 
     */
    validate(value) {
        assertIsObject(value);

        let lastRuleId;

        // Performance: One try-catch has less overhead than one per loop iteration
        try {

            for (const ruleId of Object.keys(value)) {
                lastRuleId = ruleId;
 
                const ruleOptions = value[ruleId];

                assertIsRuleOptions(ruleOptions);

                if (Array.isArray(ruleOptions)) {
                    assertIsRuleSeverity(ruleOptions[0]);
                } else {
                    assertIsRuleSeverity(ruleOptions);
                }
            }
        } catch (error) {
            error.message = `Key "${lastRuleId}": ${error.message}`;
            throw error;
        }
    }
}


exports.RulesSchema = RulesSchema;
