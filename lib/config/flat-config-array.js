/**
 * @fileoverview Flat Config Array
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { ConfigArray } = require("@humanwhocodes/config-array");
const {
    assertIsObject,
    assertIsObjectOrString,
    assertIsPluginMemberName
} = require("./assertions");

const Rules = require("../rules");
const { RulesSchema } = require("./rules-schema");

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

const globalVariablesValues = new Set([true, false, "readonly", "writeable", "off"]);

//-----------------------------------------------------------------------------
// Schemas
//-----------------------------------------------------------------------------

// values must be an object and properties are merged

/** @type {ObjectPropertySchema} */
const objectAssignSchema = {
    merge: "assign",
    validate: "object"
};

/** @type {ObjectPropertySchema} */
const stringSchema = {
    merge: "replace",
    validate: "string"
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

/** @type {ObjectPropertySchema} */
const globalsSchema = {
    merge: "assign",
    validate(value) {

        assertIsObject(value);

        for (const key of Object.keys(value)) {
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
        if (typeof value !== "string" || !/^off|warn|error$/.test(value)) {
            throw new TypeError("Value must be \"off\", \"warn\", or \"error\".");
        }
    }
};

/** @type {ObjectPropertySchema} */
const sourceTypeSchema = {
    merge: "replace",
    validate(value) {
        if (typeof value !== "string" || !/^(?:script|module|commonjs)$/.test(value)) {
            throw new TypeError("Expected \"script\", \"module\", or \"commonjs\".");
        }
    }
};

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

class FlatConfigArray extends ConfigArray {

    constructor(configs, { basePath, builtInRules }) {
        super(configs, {
            basePath,
            schema: {
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
                rules: new RulesSchema({ builtInRules })
            }
        });

        this.builtInRules = builtInRules;
    }

}

exports.FlatConfigArray = FlatConfigArray;
