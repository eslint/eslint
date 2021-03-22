/**
 * @fileoverview Flat Config Array
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { ConfigArray } = require("@humanwhocodes/config-array");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

function assertIsPluginMemberName(value) {
    if (!/[a-z0-9-_$]+\/[a-z0-9-_$]+/i.test(value)) {
        throw new TypeError("Expected string in the form \"plugin-name/object-name\".")
    }
}

/**
 * Validates that a value is an object or a string.
 * @param {any} value The value to check.
 * @returns {void}
 * @throws {TypeError} If the value isn't an object or a string. 
 */
function assertIsObjectOrString(value) {
    if (value && typeof value !== "object" && typeof value !== "string") {
        throw new TypeError("Expected an object or string.");
    }
}

//-----------------------------------------------------------------------------
// Schemas
//-----------------------------------------------------------------------------

// values must be an object and properties are merged
const objectAssignSchema = {
    merge: "assign",
    validate: "object"
};

const stringSchema = {
    merge: "replace",
    validate: "string"
};

const numberSchema = {
    merge: "replace",
    validate: "number"
};

const booleanSchema = {
    merge: "replace",
    validate: "boolean"
};

const languageOptionsSchema = {
    ecmaVersion: numberSchema,
    sourceType: stringSchema,
    globals: objectAssignSchema,
    parser: {
        merge: "replace",
        validate: assertIsObjectOrString
    },
    parserOptions: objectAssignSchema,
};

const linterOptionsSchema = {
    noInlineConfig: booleanSchema,
    reportUnusedDisableDirectives: {
        merge: "replace",
        validate(value) {
            if (typeof value !== "string" || !/^off|warn|error$/.test(value)) {
                throw new TypeError("Value must be \"off\", \"warn\", or \"error\".");
            }
        }
    }
};

const topLevelSchema = {
    settings: objectAssignSchema,
    linterOptions: {
        schema: linterOptionsSchema
    },
    // languageOptions: {

    // },
    processor: {
        merge: "replace",
        validate(value) {
            if (typeof value === "string") {
                assertIsPluginMemberName(value);
            } else if (typeof value === "object") {
                if (typeof value.preprocess !== "function" || typeof value.postprocess !== "function") {
                    throw new TypeError("Object must have a preprocess() and a postprocess() method.");
                }
            } else {
                throw new TypeError("Expected an object or a string.");
            }
        }
    },
    plugins: {
        merge(first={}, second={}) {
            const keys = new Set([...Object.keys(first), ...Object.keys(second)]);
            const result = {};

            // manually validate that plugins are not redefined
            for (const key of keys) {
                if (key in first && key in second && first[key] !== second[key]) {
                    throw new TypeError(`Cannot redefine plugin "${key}".`);
                }

                result[key] = second[key] ?? first[key];
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
                if (value[key] === null || typeof value[key] !== "object") {
                    throw new TypeError(`Key "${key}": Expected an object.`);
                }
            }
        }
    },
    // rules: {

    // }
};

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

class FlatConfigArray extends ConfigArray {

    constructor(configs, options) {
        super(configs, {
            ...options,
            schema: topLevelSchema
        });
    }

}

exports.FlatConfigArray = FlatConfigArray;
