/**
 * @fileoverview Tests for FlatConfigArray
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { FlatConfigArray } = require("../../../lib/config/flat-config-array");
const assert = require("chai").assert;
const allConfig = require("../../../conf/eslint-all");
const recommendedConfig = require("../../../conf/eslint-recommended");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const baseConfig = {
    plugins: {
        "@": {
            rules: {
                foo: {
                    schema: {
                        type: "array",
                        items: [
                            {
                                enum: ["always", "never"]
                            }
                        ],
                        minItems: 0,
                        maxItems: 1
                    }

                },
                bar: {

                },
                baz: {

                },

                // old-style
                boom() {},

                foo2: {
                    schema: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        uniqueItems: true,
                        minItems: 1
                    }
                }
            }
        },
        test1: {
            rules: {
                match: {}
            }
        },
        test2: {
            rules: {
                nomatch: {}
            }
        }
    }
};

/**
 * Creates a config array with the correct default options.
 * @param {*[]} configs An array of configs to use in the config array.
 * @returns {FlatConfigArray} The config array;
 */
function createFlatConfigArray(configs) {
    return new FlatConfigArray(configs, {
        basePath: __dirname,
        baseConfig: [baseConfig]
    });
}

/**
 * Asserts that a given set of configs will be merged into the given
 * result config.
 * @param {*[]} values An array of configs to use in the config array.
 * @param {Object} result The expected merged result of the configs.
 * @returns {void}
 * @throws {AssertionError} If the actual result doesn't match the
 *      expected result.
 */
async function assertMergedResult(values, result) {
    const configs = createFlatConfigArray(values);

    await configs.normalize();

    const config = configs.getConfig("foo.js");

    assert.deepStrictEqual(config, result);
}

/**
 * Asserts that a given set of configs results in an invalid config.
 * @param {*[]} values An array of configs to use in the config array.
 * @param {string|RegExp} message The expected error message.
 * @returns {void}
 * @throws {AssertionError} If the config is valid or if the error
 *      has an unexpected message.
 */
async function assertInvalidConfig(values, message) {
    const configs = createFlatConfigArray(values);

    await configs.normalize();

    assert.throws(() => {
        configs.getConfig("foo.js");
    }, message);
}

/**
 * Normalizes the rule configs to an array with severity to match
 * how Flat Config merges rule options.
 * @param {Object} rulesConfig The rules config portion of a config.
 * @returns {Array} The rules config object.
 */
function normalizeRuleConfig(rulesConfig) {
    const rulesConfigCopy = {
        ...rulesConfig
    };

    for (const ruleId of Object.keys(rulesConfigCopy)) {
        rulesConfigCopy[ruleId] = [2];
    }

    return rulesConfigCopy;
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("FlatConfigArray", () => {

    it("should allow noniterable baseConfig objects", () => {
        const base = {
            languageOptions: {
                parserOptions: {
                    foo: true
                }
            }
        };

        const configs = new FlatConfigArray([], {
            basePath: __dirname,
            baseConfig: base
        });

        // should not throw error
        configs.normalizeSync();
    });

    it("should not reuse languageOptions.parserOptions across configs", () => {
        const base = [{
            languageOptions: {
                parserOptions: {
                    foo: true
                }
            }
        }];

        const configs = new FlatConfigArray([], {
            basePath: __dirname,
            baseConfig: base
        });

        configs.normalizeSync();

        const config = configs.getConfig("foo.js");

        assert.notStrictEqual(base[0].languageOptions, config.languageOptions);
        assert.notStrictEqual(base[0].languageOptions.parserOptions, config.languageOptions.parserOptions, "parserOptions should be new object");
    });

    describe("Special configs", () => {
        it("eslint:recommended is replaced with an actual config", async () => {
            const configs = new FlatConfigArray(["eslint:recommended"], { basePath: __dirname });

            await configs.normalize();
            const config = configs.getConfig("foo.js");

            assert.deepStrictEqual(config.rules, normalizeRuleConfig(recommendedConfig.rules));
        });

        it("eslint:all is replaced with an actual config", async () => {
            const configs = new FlatConfigArray(["eslint:all"], { basePath: __dirname });

            await configs.normalize();
            const config = configs.getConfig("foo.js");

            assert.deepStrictEqual(config.rules, normalizeRuleConfig(allConfig.rules));
        });
    });

    describe("Config Properties", () => {

        describe("settings", () => {

            it("should merge two objects", () => assertMergedResult([
                {
                    settings: {
                        a: true,
                        b: false
                    }
                },
                {
                    settings: {
                        c: true,
                        d: false
                    }
                }
            ], {
                plugins: baseConfig.plugins,

                settings: {
                    a: true,
                    b: false,
                    c: true,
                    d: false
                }
            }));

            it("should merge two objects when second object has overrides", () => assertMergedResult([
                {
                    settings: {
                        a: true,
                        b: false,
                        d: [1, 2],
                        e: [5, 6]
                    }
                },
                {
                    settings: {
                        c: true,
                        a: false,
                        d: [3, 4]
                    }
                }
            ], {
                plugins: baseConfig.plugins,

                settings: {
                    a: false,
                    b: false,
                    c: true,
                    d: [3, 4],
                    e: [5, 6]
                }
            }));

            it("should deeply merge two objects when second object has overrides", () => assertMergedResult([
                {
                    settings: {
                        object: {
                            a: true,
                            b: false
                        }
                    }
                },
                {
                    settings: {
                        object: {
                            c: true,
                            a: false
                        }
                    }
                }
            ], {
                plugins: baseConfig.plugins,

                settings: {
                    object: {
                        a: false,
                        b: false,
                        c: true
                    }
                }
            }));

            it("should merge an object and undefined into one object", () => assertMergedResult([
                {
                    settings: {
                        a: true,
                        b: false
                    }
                },
                {
                }
            ], {
                plugins: baseConfig.plugins,

                settings: {
                    a: true,
                    b: false
                }
            }));

            it("should merge undefined and an object into one object", () => assertMergedResult([
                {
                },
                {
                    settings: {
                        a: true,
                        b: false
                    }
                }
            ], {
                plugins: baseConfig.plugins,

                settings: {
                    a: true,
                    b: false
                }
            }));

        });

        describe("plugins", () => {

            const pluginA = {};
            const pluginB = {};
            const pluginC = {};

            it("should merge two objects", () => assertMergedResult([
                {
                    plugins: {
                        a: pluginA,
                        b: pluginB
                    }
                },
                {
                    plugins: {
                        c: pluginC
                    }
                }
            ], {
                plugins: {
                    a: pluginA,
                    b: pluginB,
                    c: pluginC,
                    ...baseConfig.plugins
                }
            }));

            it("should merge an object and undefined into one object", () => assertMergedResult([
                {
                    plugins: {
                        a: pluginA,
                        b: pluginB
                    }
                },
                {
                }
            ], {
                plugins: {
                    a: pluginA,
                    b: pluginB,
                    ...baseConfig.plugins
                }
            }));

            it("should error when attempting to redefine a plugin", async () => {

                await assertInvalidConfig([
                    {
                        plugins: {
                            a: pluginA,
                            b: pluginB
                        }
                    },
                    {
                        plugins: {
                            a: pluginC
                        }
                    }
                ], "Cannot redefine plugin \"a\".");
            });

            it("should error when plugin is not an object", async () => {

                await assertInvalidConfig([
                    {
                        plugins: {
                            a: true
                        }
                    }
                ], "Key \"a\": Expected an object.");
            });


        });

        describe("processor", () => {

            it("should merge two values when second is a string", () => {

                const stubProcessor = {
                    preprocess() {},
                    postprocess() {}
                };

                return assertMergedResult([
                    {
                        processor: {
                            preprocess() {},
                            postprocess() {}
                        }
                    },
                    {
                        plugins: {
                            markdown: {
                                processors: {
                                    markdown: stubProcessor
                                }
                            }
                        },
                        processor: "markdown/markdown"
                    }
                ], {
                    plugins: {
                        markdown: {
                            processors: {
                                markdown: stubProcessor
                            }
                        },
                        ...baseConfig.plugins
                    },
                    processor: stubProcessor
                });
            });

            it("should merge two values when second is an object", () => {

                const processor = {
                    preprocess() { },
                    postprocess() { }
                };

                return assertMergedResult([
                    {
                        processor: "markdown/markdown"
                    },
                    {
                        processor
                    }
                ], {
                    plugins: baseConfig.plugins,

                    processor
                });
            });

            it("should error when an invalid string is used", async () => {

                await assertInvalidConfig([
                    {
                        processor: "foo"
                    }
                ], "pluginName/objectName");
            });

            it("should error when an empty string is used", async () => {

                await assertInvalidConfig([
                    {
                        processor: ""
                    }
                ], "pluginName/objectName");
            });

            it("should error when an invalid processor is used", async () => {
                await assertInvalidConfig([
                    {
                        processor: {}
                    }
                ], "Object must have a preprocess() and a postprocess() method.");

            });

            it("should error when a processor cannot be found in a plugin", async () => {
                await assertInvalidConfig([
                    {
                        plugins: {
                            foo: {}
                        },
                        processor: "foo/bar"
                    }
                ], /Could not find "bar" in plugin "foo"/u);

            });

        });

        describe("linterOptions", () => {

            it("should error when an unexpected key is found", async () => {

                await assertInvalidConfig([
                    {
                        linterOptions: {
                            foo: true
                        }
                    }
                ], "Unexpected key \"foo\" found.");

            });

            describe("noInlineConfig", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            linterOptions: {
                                noInlineConfig: "true"
                            }
                        }
                    ], "Expected a Boolean.");
                });

                it("should merge two objects when second object has overrides", () => assertMergedResult([
                    {
                        linterOptions: {
                            noInlineConfig: true
                        }
                    },
                    {
                        linterOptions: {
                            noInlineConfig: false
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    linterOptions: {
                        noInlineConfig: false
                    }
                }));

                it("should merge an object and undefined into one object", () => assertMergedResult([
                    {
                        linterOptions: {
                            noInlineConfig: false
                        }
                    },
                    {
                    }
                ], {
                    plugins: baseConfig.plugins,

                    linterOptions: {
                        noInlineConfig: false
                    }
                }));

                it("should merge undefined and an object into one object", () => assertMergedResult([
                    {
                    },
                    {
                        linterOptions: {
                            noInlineConfig: false
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    linterOptions: {
                        noInlineConfig: false
                    }
                }));


            });
            describe("reportUnusedDisableDirectives", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            linterOptions: {
                                reportUnusedDisableDirectives: "true"
                            }
                        }
                    ], /Expected a Boolean/u);
                });

                it("should merge two objects when second object has overrides", () => assertMergedResult([
                    {
                        linterOptions: {
                            reportUnusedDisableDirectives: false
                        }
                    },
                    {
                        linterOptions: {
                            reportUnusedDisableDirectives: true
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    linterOptions: {
                        reportUnusedDisableDirectives: true
                    }
                }));

                it("should merge an object and undefined into one object", () => assertMergedResult([
                    {},
                    {
                        linterOptions: {
                            reportUnusedDisableDirectives: true
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    linterOptions: {
                        reportUnusedDisableDirectives: true
                    }
                }));


            });

        });

        describe("languageOptions", () => {

            it("should error when an unexpected key is found", async () => {

                await assertInvalidConfig([
                    {
                        languageOptions: {
                            foo: true
                        }
                    }
                ], "Unexpected key \"foo\" found.");

            });

            it("should merge two languageOptions objects with different properties", () => assertMergedResult([
                {
                    languageOptions: {
                        ecmaVersion: 2019
                    }
                },
                {
                    languageOptions: {
                        sourceType: "commonjs"
                    }
                }
            ], {
                plugins: baseConfig.plugins,

                languageOptions: {
                    ecmaVersion: 2019,
                    sourceType: "commonjs"
                }
            }));

            describe("ecmaVersion", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                ecmaVersion: "true"
                            }
                        }
                    ], /Key "languageOptions": Key "ecmaVersion": Expected a number or "latest"\./u);
                });

                it("should merge two objects when second object has overrides", () => assertMergedResult([
                    {
                        languageOptions: {
                            ecmaVersion: 2019
                        }
                    },
                    {
                        languageOptions: {
                            ecmaVersion: 2021
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        ecmaVersion: 2021
                    }
                }));

                it("should merge an object and undefined into one object", () => assertMergedResult([
                    {
                        languageOptions: {
                            ecmaVersion: 2021
                        }
                    },
                    {
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        ecmaVersion: 2021
                    }
                }));


                it("should merge undefined and an object into one object", () => assertMergedResult([
                    {
                    },
                    {
                        languageOptions: {
                            ecmaVersion: 2021
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        ecmaVersion: 2021
                    }
                }));


            });

            describe("sourceType", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                sourceType: "true"
                            }
                        }
                    ], "Expected \"script\", \"module\", or \"commonjs\".");
                });

                it("should merge two objects when second object has overrides", () => assertMergedResult([
                    {
                        languageOptions: {
                            sourceType: "module"
                        }
                    },
                    {
                        languageOptions: {
                            sourceType: "script"
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        sourceType: "script"
                    }
                }));

                it("should merge an object and undefined into one object", () => assertMergedResult([
                    {
                        languageOptions: {
                            sourceType: "script"
                        }
                    },
                    {
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        sourceType: "script"
                    }
                }));


                it("should merge undefined and an object into one object", () => assertMergedResult([
                    {
                    },
                    {
                        languageOptions: {
                            sourceType: "module"
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        sourceType: "module"
                    }
                }));


            });

            describe("globals", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                globals: "true"
                            }
                        }
                    ], "Expected an object.");
                });

                it("should error when an unexpected key value is found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                globals: {
                                    foo: "truex"
                                }
                            }
                        }
                    ], "Key \"foo\": Expected \"readonly\", \"writable\", or \"off\".");
                });

                it("should error when a global has leading whitespace", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                globals: {
                                    " foo": "readonly"
                                }
                            }
                        }
                    ], /Global " foo" has leading or trailing whitespace/u);
                });

                it("should error when a global has trailing whitespace", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                globals: {
                                    "foo ": "readonly"
                                }
                            }
                        }
                    ], /Global "foo " has leading or trailing whitespace/u);
                });

                it("should merge two objects when second object has different keys", () => assertMergedResult([
                    {
                        languageOptions: {
                            globals: {
                                foo: "readonly"
                            }
                        }
                    },
                    {
                        languageOptions: {
                            globals: {
                                bar: "writable"
                            }
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        globals: {
                            foo: "readonly",
                            bar: "writable"
                        }
                    }
                }));

                it("should merge two objects when second object has overrides", () => assertMergedResult([
                    {
                        languageOptions: {
                            globals: {
                                foo: null
                            }
                        }
                    },
                    {
                        languageOptions: {
                            globals: {
                                foo: "writeable"
                            }
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        globals: {
                            foo: "writeable"
                        }
                    }
                }));

                it("should merge an object and undefined into one object", () => assertMergedResult([
                    {
                        languageOptions: {
                            globals: {
                                foo: "readable"
                            }
                        }
                    },
                    {
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        globals: {
                            foo: "readable"
                        }
                    }
                }));


                it("should merge undefined and an object into one object", () => assertMergedResult([
                    {
                    },
                    {
                        languageOptions: {
                            globals: {
                                foo: "false"
                            }
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        globals: {
                            foo: "false"
                        }
                    }
                }));


            });

            describe("parser", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                parser: true
                            }
                        }
                    ], "Expected an object or string.");
                });

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                parser: "true"
                            }
                        }
                    ], /Expected string in the form "pluginName\/objectName"/u);
                });

                it("should error when a plugin parser can't be found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                parser: "foo/bar"
                            }
                        }
                    ], "Key \"parser\": Could not find \"bar\" in plugin \"foo\".");
                });

                it("should error when a value doesn't have a parse() method", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                parser: {}
                            }
                        }
                    ], "Expected object to have a parse() or parseForESLint() method.");
                });

                it("should merge two objects when second object has overrides", () => {

                    const parser = { parse() {} };
                    const stubParser = { parse() { } };

                    return assertMergedResult([
                        {
                            languageOptions: {
                                parser
                            }
                        },
                        {
                            plugins: {
                                "@foo/baz": {
                                    parsers: {
                                        bar: stubParser
                                    }
                                }
                            },
                            languageOptions: {
                                parser: "@foo/baz/bar"
                            }
                        }
                    ], {
                        plugins: {
                            "@foo/baz": {
                                parsers: {
                                    bar: stubParser
                                }
                            },
                            ...baseConfig.plugins
                        },
                        languageOptions: {
                            parser: stubParser
                        }
                    });
                });

                it("should merge an object and undefined into one object", () => {

                    const stubParser = { parse() { } };

                    return assertMergedResult([
                        {
                            plugins: {
                                foo: {
                                    parsers: {
                                        bar: stubParser
                                    }
                                }
                            },

                            languageOptions: {
                                parser: "foo/bar"
                            }
                        },
                        {
                        }
                    ], {
                        plugins: {
                            foo: {
                                parsers: {
                                    bar: stubParser
                                }
                            },
                            ...baseConfig.plugins
                        },

                        languageOptions: {
                            parser: stubParser
                        }
                    });

                });


                it("should merge undefined and an object into one object", () => {

                    const stubParser = { parse() {} };

                    return assertMergedResult([
                        {
                        },
                        {
                            plugins: {
                                foo: {
                                    parsers: {
                                        bar: stubParser
                                    }
                                }
                            },

                            languageOptions: {
                                parser: "foo/bar"
                            }
                        }
                    ], {
                        plugins: {
                            foo: {
                                parsers: {
                                    bar: stubParser
                                }
                            },
                            ...baseConfig.plugins
                        },

                        languageOptions: {
                            parser: stubParser
                        }
                    });

                });

            });


            describe("parserOptions", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                parserOptions: "true"
                            }
                        }
                    ], "Expected an object.");
                });

                it("should merge two objects when second object has different keys", () => assertMergedResult([
                    {
                        languageOptions: {
                            parserOptions: {
                                foo: "whatever"
                            }
                        }
                    },
                    {
                        languageOptions: {
                            parserOptions: {
                                bar: "baz"
                            }
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        parserOptions: {
                            foo: "whatever",
                            bar: "baz"
                        }
                    }
                }));

                it("should deeply merge two objects when second object has different keys", () => assertMergedResult([
                    {
                        languageOptions: {
                            parserOptions: {
                                ecmaFeatures: {
                                    jsx: true
                                }
                            }
                        }
                    },
                    {
                        languageOptions: {
                            parserOptions: {
                                ecmaFeatures: {
                                    globalReturn: true
                                }
                            }
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        parserOptions: {
                            ecmaFeatures: {
                                jsx: true,
                                globalReturn: true
                            }
                        }
                    }
                }));

                it("should deeply merge two objects when second object has missing key", () => assertMergedResult([
                    {
                        languageOptions: {
                            parserOptions: {
                                ecmaFeatures: {
                                    jsx: true
                                }
                            }
                        }
                    },
                    {
                        languageOptions: {
                            ecmaVersion: 2021
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        ecmaVersion: 2021,
                        parserOptions: {
                            ecmaFeatures: {
                                jsx: true
                            }
                        }
                    }
                }));

                it("should merge two objects when second object has overrides", () => assertMergedResult([
                    {
                        languageOptions: {
                            parserOptions: {
                                foo: "whatever"
                            }
                        }
                    },
                    {
                        languageOptions: {
                            parserOptions: {
                                foo: "bar"
                            }
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        parserOptions: {
                            foo: "bar"
                        }
                    }
                }));

                it("should merge an object and undefined into one object", () => assertMergedResult([
                    {
                        languageOptions: {
                            parserOptions: {
                                foo: "whatever"
                            }
                        }
                    },
                    {
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        parserOptions: {
                            foo: "whatever"
                        }
                    }
                }));


                it("should merge undefined and an object into one object", () => assertMergedResult([
                    {
                    },
                    {
                        languageOptions: {
                            parserOptions: {
                                foo: "bar"
                            }
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        parserOptions: {
                            foo: "bar"
                        }
                    }
                }));


            });


        });

        describe("rules", () => {

            it("should error when an unexpected value is found", async () => {

                await assertInvalidConfig([
                    {
                        rules: true
                    }
                ], "Expected an object.");
            });

            it("should error when an invalid rule severity is set", async () => {

                await assertInvalidConfig([
                    {
                        rules: {
                            foo: true
                        }
                    }
                ], "Key \"rules\": Key \"foo\": Expected a string, number, or array.");
            });

            it("should error when an invalid rule severity of the right type is set", async () => {

                await assertInvalidConfig([
                    {
                        rules: {
                            foo: 3
                        }
                    }
                ], "Key \"rules\": Key \"foo\": Expected severity of \"off\", 0, \"warn\", 1, \"error\", or 2.");
            });

            it("should error when an invalid rule severity is set in an array", async () => {

                await assertInvalidConfig([
                    {
                        rules: {
                            foo: [true]
                        }
                    }
                ], "Key \"rules\": Key \"foo\": Expected severity of \"off\", 0, \"warn\", 1, \"error\", or 2.");
            });

            it("should error when rule doesn't exist", async () => {

                await assertInvalidConfig([
                    {
                        rules: {
                            foox: [1, "bar"]
                        }
                    }
                ], /Key "rules": Key "foox": Could not find "foox" in plugin "@"./u);
            });

            it("should error and suggest alternative when rule doesn't exist", async () => {

                await assertInvalidConfig([
                    {
                        rules: {
                            "test2/match": "error"
                        }
                    }
                ], /Key "rules": Key "test2\/match": Could not find "match" in plugin "test2"\. Did you mean "test1\/match"\?/u);
            });

            it("should error when plugin for rule doesn't exist", async () => {

                await assertInvalidConfig([
                    {
                        rules: {
                            "doesnt-exist/match": "error"
                        }
                    }
                ], /Key "rules": Key "doesnt-exist\/match": Could not find plugin "doesnt-exist"\./u);
            });

            it("should error when rule options don't match schema", async () => {

                await assertInvalidConfig([
                    {
                        rules: {
                            foo: [1, "bar"]
                        }
                    }
                ], /Value "bar" should be equal to one of the allowed values/u);
            });

            it("should error when rule options don't match schema requiring at least one item", async () => {

                await assertInvalidConfig([
                    {
                        rules: {
                            foo2: 1
                        }
                    }
                ], /Value \[\] should NOT have fewer than 1 items/u);
            });

            it("should merge two objects", () => assertMergedResult([
                {
                    rules: {
                        foo: 1,
                        bar: "error"
                    }
                },
                {
                    rules: {
                        baz: "warn",
                        boom: 0
                    }
                }
            ], {
                plugins: baseConfig.plugins,

                rules: {
                    foo: [1],
                    bar: [2],
                    baz: [1],
                    boom: [0]
                }
            }));

            it("should merge two objects when second object has simple overrides", () => assertMergedResult([
                {
                    rules: {
                        foo: [1, "always"],
                        bar: "error"
                    }
                },
                {
                    rules: {
                        foo: "error",
                        bar: 0
                    }
                }
            ], {
                plugins: baseConfig.plugins,

                rules: {
                    foo: [2, "always"],
                    bar: [0]
                }
            }));

            it("should merge two objects when second object has array overrides", () => assertMergedResult([
                {
                    rules: {
                        foo: 1,
                        bar: "error"
                    }
                },
                {
                    rules: {
                        foo: ["error", "never"],
                        bar: ["warn", "foo"]
                    }
                }
            ], {
                plugins: baseConfig.plugins,
                rules: {
                    foo: [2, "never"],
                    bar: [1, "foo"]
                }
            }));

            it("should merge two objects and options when second object overrides without options", () => assertMergedResult([
                {
                    rules: {
                        foo: [1, "always"],
                        bar: "error"
                    }
                },
                {
                    plugins: {
                        "foo/baz/boom": {
                            rules: {
                                bang: {}
                            }
                        }
                    },
                    rules: {
                        foo: ["error"],
                        bar: 0,
                        "foo/baz/boom/bang": "error"
                    }
                }
            ], {
                plugins: {
                    ...baseConfig.plugins,
                    "foo/baz/boom": {
                        rules: {
                            bang: {}
                        }
                    }
                },
                rules: {
                    foo: [2, "always"],
                    bar: [0],
                    "foo/baz/boom/bang": [2]
                }
            }));

            it("should merge an object and undefined into one object", () => assertMergedResult([
                {
                    rules: {
                        foo: 0,
                        bar: 1
                    }
                },
                {
                }
            ], {
                plugins: baseConfig.plugins,
                rules: {
                    foo: [0],
                    bar: [1]
                }
            }));

            it("should merge a rule that doesn't exist without error when the rule is off", () => assertMergedResult([
                {
                    rules: {
                        foo: 0,
                        bar: 1
                    }
                },
                {
                    rules: {
                        nonExistentRule: 0,
                        nonExistentRule2: ["off", "bar"]
                    }
                }
            ], {
                plugins: baseConfig.plugins,
                rules: {
                    foo: [0],
                    bar: [1],
                    nonExistentRule: [0],
                    nonExistentRule2: [0, "bar"]
                }
            }));

        });

    });
});
