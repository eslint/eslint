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
                boom() {}
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
        baseConfig
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

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("FlatConfigArray", () => {

    describe("Special configs", () => {
        it("eslint:recommended is replaced with an actual config", async () => {
            const configs = new FlatConfigArray(["eslint:recommended"], { basePath: __dirname });

            await configs.normalize();
            const config = configs.getConfig("foo.js");

            assert.deepStrictEqual(config.rules, recommendedConfig.rules);
        });

        it("eslint:all is replaced with an actual config", async () => {
            const configs = new FlatConfigArray(["eslint:all"], { basePath: __dirname });

            await configs.normalize();
            const config = configs.getConfig("foo.js");

            assert.deepStrictEqual(config.rules, allConfig.rules);
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
                        b: false
                    }
                },
                {
                    settings: {
                        c: true,
                        a: false
                    }
                }
            ], {
                plugins: baseConfig.plugins,

                settings: {
                    a: false,
                    b: false,
                    c: true
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
                ], "redefine plugin");
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
                ], "preprocess() and a postprocess()");

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
                    ], "Expected a number.");
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
                                    foo: "true"
                                }
                            }
                        }
                    ], "Expected \"readonly\", \"writeable\", or \"off\".");
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
                                bar: "writeable"
                            }
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        globals: {
                            foo: "readonly",
                            bar: "writeable"
                        }
                    }
                }));

                it("should merge two objects when second object has overrides", () => assertMergedResult([
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
                                foo: "readonly"
                            }
                        }
                    },
                    {
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        globals: {
                            foo: "readonly"
                        }
                    }
                }));


                it("should merge undefined and an object into one object", () => assertMergedResult([
                    {
                    },
                    {
                        languageOptions: {
                            globals: {
                                foo: "readonly"
                            }
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    languageOptions: {
                        globals: {
                            foo: "readonly"
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

            it("should error when rule options don't match schema", async () => {

                await assertInvalidConfig([
                    {
                        rules: {
                            foo: [1, "bar"]
                        }
                    }
                ], /Value "bar" should be equal to one of the allowed values/u);
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
                    foo: 1,
                    bar: "error",
                    baz: "warn",
                    boom: 0
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
                    foo: ["error", "always"],
                    bar: 0
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
                    foo: ["error", "never"],
                    bar: ["warn", "foo"]
                }
            }));

            it("should merge two objects and clear options when second object overrides without options", () => assertMergedResult([
                {
                    rules: {
                        foo: [1, "always"],
                        bar: "error"
                    }
                },
                {
                    plugins: {
                        "foo/baz": {
                            rules: {
                                bang: {}
                            }
                        }
                    },
                    rules: {
                        foo: ["error"],
                        bar: 0,
                        "foo/baz/bang": "error"
                    }
                }
            ], {
                plugins: {
                    ...baseConfig.plugins,
                    "foo/baz": {
                        rules: {
                            bang: {}
                        }
                    }
                },
                rules: {
                    foo: ["error"],
                    bar: 0,
                    "foo/baz/bang": "error"
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
                    foo: 0,
                    bar: 1
                }
            }));

        });

    });
});
