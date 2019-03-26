/**
 * @fileoverview ConfigSchema
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { ObjectSchema } = require("@humanwhocodes/object-schema");
const deepMerge = require("deepmerge");
const ConfigOps = require("../config/config-ops");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function isObject(value) {
    return (value !== null && typeof value === "object");
}

function assignThrough(value1, value2) {
    if (value1 === undefined) {
        return value2;
    }

    return (value1 === undefined) ? value2 : value1;
}

function assignObjectThrough(value1, value2) {
    if (value1 === undefined) {
        return Object.assign({}, value2);
    }

    if (value2 === undefined) {
        return Object.assign({}, value1);
    }

    return Object.assign({}, value1, value2);
}

function mergeObjectThrough(value1, value2) {
    const validValue1 = (value1 != null);
    const validValue2 = (value2 != null);

    if (validValue1 && validValue2) {
        return deepMerge(value1, value2);
    }

    if (validValue1 && !validValue2) {
        return Object.assign({}, value1);
    }

    if (validValue2 && !validValue1) {
        return Object.assign({}, value2);
    }

    return undefined;
}

function mergeRuleOptions(options1, options2) {
    
    // if the first options is not an array, just return a clone of the second
    if (!Array.isArray(options1)) {
        return options2.concat();
    }

    /*
     * If options2 is not an array, just update the severity of options1
     * We already know options1 is an array here.
     * options1: ["error", something]
     * options2: "warn"
     * result: ["warn", something]
     */ 
    if (!Array.isArray(options2)) {
        const [, ...optionsWithoutSeverity] = options1;
        return [options2, ...optionsWithoutSeverity];
    }

    /*
     * Complicated part. If both options1 and options2 are an array then
     * we need to merge them.
     * options1: ["error", { foo: true }]
     * options2: ["warn", { bar: true }]
     * result: ["warn", { foo: true, bar: true }]
     */
    const length = Math.max(options1.length, options2.length);
    const result = new Array(length);

    return result.map((value, index) => {

        // second severity always wins
        if (index === 0) {
            return options2[index];
        }

        // one option missing
        if (typeof options1[index] === "undefined") {
            return options2[index];
        }

        if (typeof options2[index] === "undefined") {
            return options1[index];
        }

        // works for both arrays and objects
        if (isObject(options1[index]) && isObject(options2[index])) {
            return deepMerge(options1[index], options2[index]);
        }


    });
}

function assertIsArray(value) {
    if (!Array.isArray(value)) {
        throw new TypeError(`Expected value to be an array.`);
    }
}

function assertIsNotArray(value, name) {
    if (Array.isArray(value)) {
        throw new TypeError(`Expected value to not be an array.`);
    }
}

function assertIsObject(value, name) {
    if (value == null || typeof value !== "object") {
        throw new TypeError(`Expected value to be an object.`);
    }

}

function assertIsArrayOfStrings(value, name) {
    assertIsArray(value, name);

    if (value.some(item => typeof item !== "string")) {
        throw new TypeError(`Expected array to only contain strings.`);
    }
}

const defsSchema = new ObjectSchema({
    ruleNamespaces: {
        required: false,
        merge(value1, value2) {
            if (value1 == undefined) {
                return value2;
            }

            if (value2 == undefined) {
                return value1;
            }

            for (const key of Object.keys(value1)) {
                if (key in value2 && !Object.is(value2[key], value1[key])) {
                    throw new Error(`Rule namespace "${key}" is already defined and cannot be redefined.`);
                }
            }

            return Object.assign({}, value1, value2);
        },
        validate(value) {
            assertIsObject(value);
        }
    }
});

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = new ObjectSchema({
    files: {
        required: false,
        merge() {
            return undefined;
        },
        validate(value) {
            if (value !== undefined) {

                // assertIsArrayOfStrings(value);
            }
        }
    },
    ignores: {
        required: false,
        requires: ["files"],
        merge() {
            return undefined;
        },
        validate(value) {
            if (value !== undefined) {

                // assertIsArrayOfStrings(value);
            }
        }
    },
    globals: {
        required: false,
        merge: assignObjectThrough,
        validate(value) {
            assertIsObject(value);
        }
    },
    settings: {
        required: false,
        merge: mergeObjectThrough,
        validate(value) {
            assertIsObject(value);
        }
    },
    parser: {
        required: false,
        merge: assignThrough,
        validate(value) {
            assertIsObject(value);
        }
    },
    parserOptions: {
        required: false,
        merge: mergeObjectThrough,
        validate(value) {
            assertIsObject(value);
        }
    },
    rules: {
        required: false,
        merge(object1, object2) {
            const validValue1 = (object1 != null);
            const validValue2 = (object2 != null);

            if (validValue1 && validValue2) {
                const result = {};
                const keys = new Set([...Object.keys(object1), ...Object.keys(object2)]);

                for (const key of keys) {
                    if ((key in object1) && (key in object2)) {
                        if (isObject(object1[key]) || isObject(object2[key])) {
                            result[key] = ConfigOps.merge(object1[key], object2[key], false, true);
                        } else {
                            result[key] = object2[key];
                        }
                    } else if (key in object2) {
                        result[key] = object2[key];
                    } else {
                        result[key] = object1[key];
                    }
                }

                return result;
            }

            return mergeObjectThrough(object1, object2);
        },
        validate(value) {
            assertIsObject(value);
        }
    },
    defs: {
        required: false,
        merge(value1, value2) {
            
            if (!value1) {
                return value2;
            }

            if (!value2) {
                return value1;
            }
            
            return defsSchema.merge(value1, value2);
        },
        validate(value) {
            assertIsObject(value);
            defsSchema.validate(value);
        }
    },
    processor: {
        required: false,
        merge: assignThrough,
        validate(value) {
            assertIsObject(value);
        }
    }

});
