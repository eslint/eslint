/**
 * @fileoverview Flat config schema
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Type Definitions
//-----------------------------------------------------------------------------

/**
 * @typedef ObjectPropertySchema
 * @property {Function|string} merge The function or name of the function to call
 *      to merge multiple objects with this property.
 * @property {Function|string} validate The function or name of the function to call
 *      to validate the value of this property.
 */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const ruleSeverities = new Map([
    [0, 0], ["off", 0],
    [1, 1], ["warn", 1],
    [2, 2], ["error", 2]
]);

const globalVariablesValues = new Set([
    true, "writable", "writeable",
    false, "readonly",
    "off"
]);

//-----------------------------------------------------------------------------
// Assertions
//-----------------------------------------------------------------------------

/**
 * Validates that a value is a valid rule options entry.
 * @param {any} value The value to check.
 * @returns {void}
 * @throws {TypeError} If the value isn't a valid rule options.
 */
function assertIsRuleOptions(value) {

    if (typeof value !== "string" && typeof value !== "number" && !Array.isArray(value)) {
        throw new TypeError("Expected a string, number, or array.");
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
        throw new TypeError("Expected severity of \"off\", 0, \"warn\", 1, \"error\", or 2.");
    }
}


/**
 * Validates that a given string is the form pluginName/objectName.
 * @param {string} value The string to check.
 * @returns {void}
 * @throws {TypeError} If the string isn't in the correct format.
 */
function assertIsPluginMemberName(value) {
    if (!/[a-z0-9-_$]+\/[a-z0-9-_$]+/iu.test(value)) {
        throw new TypeError("Expected string in the form \"pluginName/objectName\".");
    }
}

/**
 * Validates that a value is an object.
 * @param {any} value The value to check.
 * @returns {void}
 * @throws {TypeError} If the value isn't an object.
 */
function assertIsObject(value) {
    if (!value || typeof value !== "object") {
        throw new TypeError("Expected an object.");
    }
}

/**
 * Validates that a value is an object or a string.
 * @param {any} value The value to check.
 * @returns {void}
 * @throws {TypeError} If the value isn't an object or a string.
 */
function assertIsObjectOrString(value) {
    if ((!value || typeof value !== "object") && typeof value !== "string") {
        throw new TypeError("Expected an object or string.");
    }
}

//-----------------------------------------------------------------------------
// Low-Level Schemas
//-----------------------------------------------------------------------------

/** @type {ObjectPropertySchema} */
const objectAssignSchema = {
    merge: "assign",
    validate: "object"
};

/** @type {ObjectPropertySchema} */
const numberSchema = {
    merge: "replace",
    validate: "number"
};

/** @type {ObjectPropertySchema} */
const booleanSchema = {
    merge: "replace",
    validate: "boolean"
};

//-----------------------------------------------------------------------------
// High-Level Schemas
//-----------------------------------------------------------------------------

/** @type {ObjectPropertySchema} */
const globalsSchema = {
    merge: "assign",
    validate(value) {

        assertIsObject(value);

        for (const key of Object.keys(value)) {

            // avoid hairy edge case
            if (key === "__proto__") {
                continue;
            }

            if (key !== key.trim()) {
                throw new TypeError(`Global "${key}" has leading or trailing whitespace.`);
            }

            if (!globalVariablesValues.has(value[key])) {
                throw new TypeError("Expected \"readonly\", \"writeable\", or \"off\".");
            }
        }
    }
};

/** @type {ObjectPropertySchema} */
const parserSchema = {
    merge: "replace",
    validate(value) {
        assertIsObjectOrString(value);

        if (typeof value === "object" && typeof value.parse !== "function" && typeof value.parseForESLint !== "function") {
            throw new TypeError("Expected object to have a parse() or parseForESLint() method.");
        }

        if (typeof value === "string") {
            assertIsPluginMemberName(value);
        }
    }
};

/** @type {ObjectPropertySchema} */
const pluginsSchema = {
    merge(first = {}, second = {}) {
        const keys = new Set([...Object.keys(first), ...Object.keys(second)]);
        const result = {};

        // manually validate that plugins are not redefined
        for (const key of keys) {

            // avoid hairy edge case
            if (key === "__proto__") {
                continue;
            }

            if (key in first && key in second && first[key] !== second[key]) {
                throw new TypeError(`Cannot redefine plugin "${key}".`);
            }

            result[key] = second[key] || first[key];
        }

        return result;
    },
    validate(value) {

        // first check the value to be sure it's an object
        if (value === null || typeof value !== "object") {
            throw new TypeError("Expected an object.");
        }

        // second check the keys to make sure they are objects
        for (const key of Object.keys(value)) {

            // avoid hairy edge case
            if (key === "__proto__") {
                continue;
            }

            if (value[key] === null || typeof value[key] !== "object") {
                throw new TypeError(`Key "${key}": Expected an object.`);
            }
        }
    }
};

/** @type {ObjectPropertySchema} */
const processorSchema = {
    merge: "replace",
    validate(value) {
        if (typeof value === "string") {
            assertIsPluginMemberName(value);
        } else if (value && typeof value === "object") {
            if (typeof value.preprocess !== "function" || typeof value.postprocess !== "function") {
                throw new TypeError("Object must have a preprocess() and a postprocess() method.");
            }
        } else {
            throw new TypeError("Expected an object or a string.");
        }
    }
};

/** @type {ObjectPropertySchema} */
const reportUnusedDisableDirectivesSchema = {
    merge: "replace",
    validate(value) {
        if (typeof value !== "string" || !/^off|warn|error$/u.test(value)) {
            throw new TypeError("Value must be \"off\", \"warn\", or \"error\".");
        }
    }
};

/** @type {ObjectPropertySchema} */
const rulesSchema = {
    merge(first = {}, second = {}) {

        const result = {
            ...first,
            ...second
        };

        for (const ruleId of Object.keys(result)) {

            // avoid hairy edge case
            if (ruleId === "__proto__") {

                /* eslint-disable-next-line no-proto */
                delete result.__proto__;
                continue;
            }

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
             * In any other situation, then the second rule config takes
             * precedence. If it's an array, we return a copy;
             * otherwise we return the value, which is just the severity.
             */
            result[ruleId] = secondIsArray
                ? second[ruleId].slice(0)
                : second[ruleId];
        }

        return result;
    },

    validate(value) {
        assertIsObject(value);

        let lastRuleId;

        // Performance: One try-catch has less overhead than one per loop iteration
        try {

            /*
             * We are not checking the rule schema here because there is no
             * guarantee that the rule definition is present at this point. Instead
             * we wait and check the rule schema during the finalization step
             * of calculating a config.
             */
            for (const ruleId of Object.keys(value)) {

                // avoid hairy edge case
                if (ruleId === "__proto__") {
                    continue;
                }

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
};

/** @type {ObjectPropertySchema} */
const sourceTypeSchema = {
    merge: "replace",
    validate(value) {
        if (typeof value !== "string" || !/^(?:script|module|commonjs)$/u.test(value)) {
            throw new TypeError("Expected \"script\", \"module\", or \"commonjs\".");
        }
    }
};

//-----------------------------------------------------------------------------
// Full schema
//-----------------------------------------------------------------------------

exports.flatConfigSchema = {
    settings: objectAssignSchema,
    linterOptions: {
        schema: {
            noInlineConfig: booleanSchema,
            reportUnusedDisableDirectives: reportUnusedDisableDirectivesSchema
        }
    },
    languageOptions: {
        schema: {
            ecmaVersion: numberSchema,
            sourceType: sourceTypeSchema,
            globals: globalsSchema,
            parser: parserSchema,
            parserOptions: objectAssignSchema
        }
    },
    processor: processorSchema,
    plugins: pluginsSchema,
    rules: rulesSchema
};
