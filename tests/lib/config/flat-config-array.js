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
const stringify = require("json-stable-stringify-without-jsonify");
const espree = require("espree");
const jslang = require("../../../lib/languages/js");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const baseConfig = {
    files: ["**/*.js"],
    language: "@/js",
    plugins: {
        "@": {
            languages: {
                js: jslang
            },
            rules: {
                foo: {
                    meta: {
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
                    }

                },
                bar: {

                },
                baz: {

                },
                "prefer-const": {
                    meta: {
                        schema: [
                            {
                                type: "object",
                                properties: {
                                    destructuring: { enum: ["any", "all"], default: "any" },
                                    ignoreReadBeforeAssign: { type: "boolean", default: false }
                                },
                                additionalProperties: false
                            }
                        ]
                    }
                },
                "prefer-destructuring": {
                    meta: {
                        schema: [
                            {
                                oneOf: [
                                    {
                                        type: "object",
                                        properties: {
                                            VariableDeclarator: {
                                                type: "object",
                                                properties: {
                                                    array: {
                                                        type: "boolean"
                                                    },
                                                    object: {
                                                        type: "boolean"
                                                    }
                                                },
                                                additionalProperties: false
                                            },
                                            AssignmentExpression: {
                                                type: "object",
                                                properties: {
                                                    array: {
                                                        type: "boolean"
                                                    },
                                                    object: {
                                                        type: "boolean"
                                                    }
                                                },
                                                additionalProperties: false
                                            }
                                        },
                                        additionalProperties: false
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            array: {
                                                type: "boolean"
                                            },
                                            object: {
                                                type: "boolean"
                                            }
                                        },
                                        additionalProperties: false
                                    }
                                ]
                            },
                            {
                                type: "object",
                                properties: {
                                    enforceForRenamedProperties: {
                                        type: "boolean"
                                    }
                                },
                                additionalProperties: false
                            }
                        ]
                    }
                },

                // old-style
                boom() {},

                foo2: {
                    meta: {
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

    if (!result.language) {
        result.language = jslang;
    }

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


    assert.throws(() => {
        configs.normalizeSync();
        configs.getConfig("foo.js");
    }, message);
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
            baseConfig: base
        });

        // should not throw error
        configs.normalizeSync();
    });

    it("should not reuse languageOptions.parserOptions across configs", () => {
        const base = [{
            files: ["**/*.js"],
            plugins: {
                "@": {
                    languages: {
                        js: jslang
                    }
                }
            },
            language: "@/js",
            languageOptions: {
                parserOptions: {
                    foo: true
                }
            }
        }];

        const configs = new FlatConfigArray([], {
            baseConfig: base
        });

        configs.normalizeSync();

        const config = configs.getConfig("foo.js");

        assert.notStrictEqual(base[0].languageOptions, config.languageOptions);
        assert.notStrictEqual(base[0].languageOptions.parserOptions, config.languageOptions.parserOptions, "parserOptions should be new object");
    });

    describe("Serialization of configs", () => {

        it("should convert config into normalized JSON object", () => {

            const configs = new FlatConfigArray([{
                plugins: {
                    a: {},
                    b: {}
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");
            const expected = {
                plugins: ["@", "a", "b"],
                language: "@/js",
                languageOptions: {
                    ecmaVersion: "latest",
                    sourceType: "module",
                    parser: `espree@${espree.version}`,
                    parserOptions: {}
                },
                linterOptions: {
                    reportUnusedDisableDirectives: 1
                },
                processor: void 0
            };
            const actual = config.toJSON();

            assert.deepStrictEqual(actual, expected);

            assert.strictEqual(stringify(actual), stringify(expected));
        });

        it("should convert config with plugin name/version into normalized JSON object", () => {

            const configs = new FlatConfigArray([{
                plugins: {
                    a: {},
                    b: {
                        name: "b-plugin",
                        version: "2.3.1"
                    }
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");
            const expected = {
                plugins: ["@", "a", "b:b-plugin@2.3.1"],
                language: "@/js",
                languageOptions: {
                    ecmaVersion: "latest",
                    sourceType: "module",
                    parser: `espree@${espree.version}`,
                    parserOptions: {}
                },
                linterOptions: {
                    reportUnusedDisableDirectives: 1
                },
                processor: void 0
            };
            const actual = config.toJSON();

            assert.deepStrictEqual(actual, expected);

            assert.strictEqual(stringify(actual), stringify(expected));
        });

        it("should convert config with plugin meta into normalized JSON object", () => {

            const configs = new FlatConfigArray([{
                plugins: {
                    a: {},
                    b: {
                        meta: {
                            name: "b-plugin",
                            version: "2.3.1"
                        }
                    }
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");
            const expected = {
                plugins: ["@", "a", "b:b-plugin@2.3.1"],
                language: "@/js",
                languageOptions: {
                    ecmaVersion: "latest",
                    sourceType: "module",
                    parser: `espree@${espree.version}`,
                    parserOptions: {}
                },
                linterOptions: {
                    reportUnusedDisableDirectives: 1
                },
                processor: void 0
            };
            const actual = config.toJSON();

            assert.deepStrictEqual(actual, expected);

            assert.strictEqual(stringify(actual), stringify(expected));
        });

        it("should convert config with languageOptions.globals.name into normalized JSON object", () => {

            const configs = new FlatConfigArray([{
                languageOptions: {
                    globals: {
                        name: "off"
                    }
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");
            const expected = {
                plugins: ["@"],
                language: "@/js",
                languageOptions: {
                    ecmaVersion: "latest",
                    sourceType: "module",
                    parser: `espree@${espree.version}`,
                    parserOptions: {},
                    globals: {
                        name: "off"
                    }
                },
                linterOptions: {
                    reportUnusedDisableDirectives: 1
                },
                processor: void 0
            };
            const actual = config.toJSON();

            assert.deepStrictEqual(actual, expected);

            assert.strictEqual(stringify(actual), stringify(expected));
        });

        it("should throw an error when config with unnamed parser object is normalized", () => {

            const configs = new FlatConfigArray([{
                languageOptions: {
                    parser: {
                        parse() { /* empty */ }
                    }
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");

            assert.throws(() => {
                config.toJSON();
            }, /Cannot serialize key "parse"/u);

        });

        it("should throw an error when config with unnamed parser object with empty meta object is normalized", () => {

            const configs = new FlatConfigArray([{
                languageOptions: {
                    parser: {
                        meta: {},
                        parse() { /* empty */ }
                    }
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");

            assert.throws(() => {
                config.toJSON();
            }, /Cannot serialize key "parse"/u);

        });

        it("should throw an error when config with unnamed parser object with only meta version is normalized", () => {

            const configs = new FlatConfigArray([{
                languageOptions: {
                    parser: {
                        meta: {
                            version: "0.1.1"
                        },
                        parse() { /* empty */ }
                    }
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");

            assert.throws(() => {
                config.toJSON();
            }, /Cannot serialize key "parse"/u);

        });

        it("should not throw an error when config with named parser object is normalized", () => {

            const configs = new FlatConfigArray([{
                languageOptions: {
                    parser: {
                        meta: {
                            name: "custom-parser"
                        },
                        parse() { /* empty */ }
                    }
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");

            assert.deepStrictEqual(config.toJSON(), {
                language: "@/js",
                languageOptions: {
                    ecmaVersion: "latest",
                    parser: "custom-parser",
                    parserOptions: {},
                    sourceType: "module"
                },
                linterOptions: {
                    reportUnusedDisableDirectives: 1
                },
                plugins: ["@"],
                processor: void 0
            });

        });

        it("should not throw an error when config with named and versioned parser object is normalized", () => {

            const configs = new FlatConfigArray([{
                languageOptions: {
                    parser: {
                        meta: {
                            name: "custom-parser",
                            version: "0.1.0"
                        },
                        parse() { /* empty */ }
                    }
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");

            assert.deepStrictEqual(config.toJSON(), {
                language: "@/js",
                languageOptions: {
                    ecmaVersion: "latest",
                    parser: "custom-parser@0.1.0",
                    parserOptions: {},
                    sourceType: "module"
                },
                linterOptions: {
                    reportUnusedDisableDirectives: 1
                },
                plugins: ["@"],
                processor: void 0
            });

        });

        it("should not throw an error when config with meta-named and versioned parser object is normalized", () => {

            const configs = new FlatConfigArray([{
                languageOptions: {
                    parser: {
                        meta: {
                            name: "custom-parser"
                        },
                        version: "0.1.0",
                        parse() { /* empty */ }
                    }
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");

            assert.deepStrictEqual(config.toJSON(), {
                language: "@/js",
                languageOptions: {
                    ecmaVersion: "latest",
                    parser: "custom-parser@0.1.0",
                    parserOptions: {},
                    sourceType: "module"
                },
                linterOptions: {
                    reportUnusedDisableDirectives: 1
                },
                plugins: ["@"],
                processor: void 0
            });

        });

        it("should not throw an error when config with named and versioned parser object outside of meta object is normalized", () => {

            const configs = new FlatConfigArray([{
                languageOptions: {
                    parser: {
                        name: "custom-parser",
                        version: "0.1.0",
                        parse() { /* empty */ }
                    }
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");

            assert.deepStrictEqual(config.toJSON(), {
                language: "@/js",
                languageOptions: {
                    ecmaVersion: "latest",
                    parser: "custom-parser@0.1.0",
                    parserOptions: {},
                    sourceType: "module"
                },
                linterOptions: {
                    reportUnusedDisableDirectives: 1
                },
                plugins: ["@"],
                processor: void 0
            });

        });

        it("should throw an error when config with unnamed processor object is normalized", () => {

            const configs = new FlatConfigArray([{
                processor: {
                    preprocess() { /* empty */ },
                    postprocess() { /* empty */ }
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");

            assert.throws(() => {
                config.toJSON();
            }, /Could not serialize processor/u);

        });

        it("should throw an error when config with processor object with empty meta object is normalized", () => {

            const configs = new FlatConfigArray([{
                processor: {
                    meta: {},
                    preprocess() { /* empty */ },
                    postprocess() { /* empty */ }
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");

            assert.throws(() => {
                config.toJSON();
            }, /Could not serialize processor/u);

        });


        it("should not throw an error when config with named processor object is normalized", () => {

            const configs = new FlatConfigArray([{
                processor: {
                    meta: {
                        name: "custom-processor"
                    },
                    preprocess() { /* empty */ },
                    postprocess() { /* empty */ }
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");

            assert.deepStrictEqual(config.toJSON(), {
                language: "@/js",
                languageOptions: {
                    ecmaVersion: "latest",
                    parser: `espree@${espree.version}`,
                    parserOptions: {},
                    sourceType: "module"
                },
                linterOptions: {
                    reportUnusedDisableDirectives: 1
                },
                plugins: ["@"],
                processor: "custom-processor"
            });

        });

        it("should not throw an error when config with named processor object without meta is normalized", () => {

            const configs = new FlatConfigArray([{
                processor: {
                    name: "custom-processor",
                    preprocess() { /* empty */ },
                    postprocess() { /* empty */ }
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");

            assert.deepStrictEqual(config.toJSON(), {
                language: "@/js",
                languageOptions: {
                    ecmaVersion: "latest",
                    parser: `espree@${espree.version}`,
                    parserOptions: {},
                    sourceType: "module"
                },
                linterOptions: {
                    reportUnusedDisableDirectives: 1
                },
                plugins: ["@"],
                processor: "custom-processor"
            });

        });

        it("should not throw an error when config with named and versioned processor object is normalized", () => {

            const configs = new FlatConfigArray([{
                processor: {
                    meta: {
                        name: "custom-processor",
                        version: "1.2.3"
                    },
                    preprocess() { /* empty */ },
                    postprocess() { /* empty */ }
                }
            }]);


            configs.normalizeSync();

            const config = configs.getConfig("foo.js");

            assert.deepStrictEqual(config.toJSON(), {
                language: "@/js",
                languageOptions: {
                    ecmaVersion: "latest",
                    parser: `espree@${espree.version}`,
                    parserOptions: {},
                    sourceType: "module"
                },
                linterOptions: {
                    reportUnusedDisableDirectives: 1
                },
                plugins: ["@"],
                processor: "custom-processor@1.2.3"
            });

        });

        it("should not throw an error when config with named and versioned processor object without meta is normalized", () => {

            const configs = new FlatConfigArray([{
                processor: {
                    name: "custom-processor",
                    version: "1.2.3",
                    preprocess() { /* empty */ },
                    postprocess() { /* empty */ }
                }
            }]);


            configs.normalizeSync();

            const config = configs.getConfig("foo.js");

            assert.deepStrictEqual(config.toJSON(), {
                language: "@/js",
                languageOptions: {
                    ecmaVersion: "latest",
                    parser: `espree@${espree.version}`,
                    parserOptions: {},
                    sourceType: "module"
                },
                linterOptions: {
                    reportUnusedDisableDirectives: 1
                },
                plugins: ["@"],
                processor: "custom-processor@1.2.3"
            });

        });

    });

    describe("Config array elements", () => {
        it("should error on 'eslint:recommended' string config", async () => {

            await assertInvalidConfig(["eslint:recommended"], "Config (unnamed): Unexpected non-object config at original index 0.");
        });

        it("should error on 'eslint:all' string config", async () => {

            await assertInvalidConfig(["eslint:all"], "Config (unnamed): Unexpected non-object config at original index 0.");
        });


        it("should throw an error when undefined original config is normalized", () => {

            const configs = new FlatConfigArray([void 0]);

            assert.throws(() => {
                configs.normalizeSync();
            }, "Config (unnamed): Unexpected undefined config at original index 0.");

        });

        it("should throw an error when undefined original config is normalized asynchronously", async () => {

            const configs = new FlatConfigArray([void 0]);

            try {
                await configs.normalize();
                assert.fail("Error not thrown");
            } catch (error) {
                assert.strictEqual(error.message, "Config (unnamed): Unexpected undefined config at original index 0.");
            }

        });

        it("should throw an error when null original config is normalized", () => {

            const configs = new FlatConfigArray([null]);

            assert.throws(() => {
                configs.normalizeSync();
            }, "Config (unnamed): Unexpected null config at original index 0.");

        });

        it("should throw an error when null original config is normalized asynchronously", async () => {

            const configs = new FlatConfigArray([null]);

            try {
                await configs.normalize();
                assert.fail("Error not thrown");
            } catch (error) {
                assert.strictEqual(error.message, "Config (unnamed): Unexpected null config at original index 0.");
            }

        });

        it("should throw an error when undefined base config is normalized", () => {

            const configs = new FlatConfigArray([], { baseConfig: [void 0] });

            assert.throws(() => {
                configs.normalizeSync();
            }, "Config (unnamed): Unexpected undefined config at base index 0.");

        });

        it("should throw an error when undefined base config is normalized asynchronously", async () => {

            const configs = new FlatConfigArray([], { baseConfig: [void 0] });

            try {
                await configs.normalize();
                assert.fail("Error not thrown");
            } catch (error) {
                assert.strictEqual(error.message, "Config (unnamed): Unexpected undefined config at base index 0.");
            }

        });

        it("should throw an error when null base config is normalized", () => {

            const configs = new FlatConfigArray([], { baseConfig: [null] });

            assert.throws(() => {
                configs.normalizeSync();
            }, "Config (unnamed): Unexpected null config at base index 0.");

        });

        it("should throw an error when null base config is normalized asynchronously", async () => {

            const configs = new FlatConfigArray([], { baseConfig: [null] });

            try {
                await configs.normalize();
                assert.fail("Error not thrown");
            } catch (error) {
                assert.strictEqual(error.message, "Config (unnamed): Unexpected null config at base index 0.");
            }

        });

        it("should throw an error when undefined user-defined config is normalized", () => {

            const configs = new FlatConfigArray([]);

            configs.push(void 0);

            assert.throws(() => {
                configs.normalizeSync();
            }, "Config (unnamed): Unexpected undefined config at user-defined index 0.");

        });

        it("should throw an error when undefined user-defined config is normalized asynchronously", async () => {

            const configs = new FlatConfigArray([]);

            configs.push(void 0);

            try {
                await configs.normalize();
                assert.fail("Error not thrown");
            } catch (error) {
                assert.strictEqual(error.message, "Config (unnamed): Unexpected undefined config at user-defined index 0.");
            }

        });

        it("should throw an error when null user-defined config is normalized", () => {

            const configs = new FlatConfigArray([]);

            configs.push(null);

            assert.throws(() => {
                configs.normalizeSync();
            }, "Config (unnamed): Unexpected null config at user-defined index 0.");

        });

        it("should throw an error when null user-defined config is normalized asynchronously", async () => {

            const configs = new FlatConfigArray([]);

            configs.push(null);

            try {
                await configs.normalize();
                assert.fail("Error not thrown");
            } catch (error) {
                assert.strictEqual(error.message, "Config (unnamed): Unexpected null config at user-defined index 0.");
            }

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
                                reportUnusedDisableDirectives: {}
                            }
                        }
                    ], /Key "linterOptions": Key "reportUnusedDisableDirectives": Expected one of: "error", "warn", "off", 0, 1, 2, or a boolean./u);
                });

                it("should merge two objects when second object has overrides", () => assertMergedResult([
                    {
                        linterOptions: {
                            reportUnusedDisableDirectives: "off"
                        }
                    },
                    {
                        linterOptions: {
                            reportUnusedDisableDirectives: "warn"
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    linterOptions: {
                        reportUnusedDisableDirectives: 1
                    }
                }));

                it("should merge an object and undefined into one object", () => assertMergedResult([
                    {},
                    {
                        linterOptions: {
                            reportUnusedDisableDirectives: "warn"
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,

                    linterOptions: {
                        reportUnusedDisableDirectives: 1
                    }
                }));


            });

        });

        describe("languageOptions", () => {

            it("should error when an unexpected key is found", async () => {

                await assertInvalidConfig([
                    {
                        language: "@/js",
                        languageOptions: {
                            foo: true
                        }
                    }
                ], "Unexpected key \"foo\" found.");

            });

            it("should merge two languageOptions objects with different properties", () => assertMergedResult([
                {
                    language: "@/js",
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
                language: jslang,
                languageOptions: {
                    ecmaVersion: 2019,
                    sourceType: "commonjs"
                }
            }));

            describe("ecmaVersion", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            language: "@/js",
                            languageOptions: {
                                ecmaVersion: "true"
                            }
                        }
                    ], /Key "languageOptions": Key "ecmaVersion": Expected a number or "latest"\./u);
                });

                it("should merge two objects when second object has overrides", () => assertMergedResult([
                    {
                        language: "@/js",
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
                    language: jslang,
                    languageOptions: {
                        ecmaVersion: 2021
                    }
                }));

                it("should merge an object and undefined into one object", () => assertMergedResult([
                    {
                        language: "@/js",
                        languageOptions: {
                            ecmaVersion: 2021
                        }
                    },
                    {
                    }
                ], {
                    plugins: baseConfig.plugins,
                    language: jslang,
                    languageOptions: {
                        ecmaVersion: 2021
                    }
                }));


                it("should merge undefined and an object into one object", () => assertMergedResult([
                    {
                    },
                    {
                        language: "@/js",
                        languageOptions: {
                            ecmaVersion: 2021
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,
                    language: jslang,
                    languageOptions: {
                        ecmaVersion: 2021
                    }
                }));


            });

            describe("sourceType", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            language: "@/js",
                            languageOptions: {
                                sourceType: "true"
                            }
                        }
                    ], "Expected \"script\", \"module\", or \"commonjs\".");
                });

                it("should merge two objects when second object has overrides", () => assertMergedResult([
                    {
                        language: "@/js",
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
                    language: jslang,
                    languageOptions: {
                        sourceType: "script"
                    }
                }));

                it("should merge an object and undefined into one object", () => assertMergedResult([
                    {
                        language: "@/js",
                        languageOptions: {
                            sourceType: "script"
                        }
                    },
                    {
                    }
                ], {
                    plugins: baseConfig.plugins,
                    language: jslang,
                    languageOptions: {
                        sourceType: "script"
                    }
                }));


                it("should merge undefined and an object into one object", () => assertMergedResult([
                    {
                    },
                    {
                        language: "@/js",
                        languageOptions: {
                            sourceType: "module"
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,
                    language: jslang,
                    languageOptions: {
                        sourceType: "module"
                    }
                }));


            });

            describe("globals", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            language: "@/js",
                            languageOptions: {
                                globals: "true"
                            }
                        }
                    ], "Expected an object.");
                });

                it("should error when an unexpected key value is found", async () => {

                    await assertInvalidConfig([
                        {
                            language: "@/js",
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
                            language: "@/js",
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
                            language: "@/js",
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
                        language: "@/js",
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
                    language: jslang,
                    languageOptions: {
                        globals: {
                            foo: "readonly",
                            bar: "writable"
                        }
                    }
                }));

                it("should merge two objects when second object has overrides", () => assertMergedResult([
                    {
                        language: "@/js",
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
                    language: jslang,
                    languageOptions: {
                        globals: {
                            foo: "writeable"
                        }
                    }
                }));

                it("should merge an object and undefined into one object", () => assertMergedResult([
                    {
                        language: "@/js",
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
                    language: jslang,
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
                        language: "@/js",
                        languageOptions: {
                            globals: {
                                foo: "false"
                            }
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,
                    language: jslang,
                    languageOptions: {
                        globals: {
                            foo: "false"
                        }
                    }
                }));

                it("should merge string and an object into one object", () => assertMergedResult([
                    {
                        language: "@/js",
                        languageOptions: {
                            globals: "foo"
                        }
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
                    language: jslang,
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
                            language: "@/js",
                            languageOptions: {
                                parser: true
                            }
                        }
                    ], "Key \"languageOptions\": Key \"parser\": Expected object with parse() or parseForESLint() method.");
                });

                it("should error when a null is found", async () => {

                    await assertInvalidConfig([
                        {
                            language: "@/js",
                            languageOptions: {
                                parser: null
                            }
                        }
                    ], "Key \"languageOptions\": Key \"parser\": Expected object with parse() or parseForESLint() method.");
                });

                it("should error when a parser is a string", async () => {

                    await assertInvalidConfig([
                        {
                            language: "@/js",
                            languageOptions: {
                                parser: "foo/bar"
                            }
                        }
                    ], "Key \"languageOptions\": Key \"parser\": Expected object with parse() or parseForESLint() method.");
                });

                it("should error when a value doesn't have a parse() method", async () => {

                    await assertInvalidConfig([
                        {
                            language: "@/js",
                            languageOptions: {
                                parser: {}
                            }
                        }
                    ], "Key \"languageOptions\": Key \"parser\": Expected object with parse() or parseForESLint() method.");
                });

                it("should merge two objects when second object has overrides", () => {

                    const parser = { parse() {} };
                    const stubParser = { parse() { } };

                    return assertMergedResult([
                        {
                            language: "@/js",
                            languageOptions: {
                                parser
                            }
                        },
                        {
                            languageOptions: {
                                parser: stubParser
                            }
                        }
                    ], {
                        plugins: {
                            ...baseConfig.plugins
                        },
                        language: jslang,
                        languageOptions: {
                            parser: stubParser
                        }
                    });
                });

                it("should merge an object and undefined into one object", () => {

                    const stubParser = { parse() { } };

                    return assertMergedResult([
                        {
                            language: "@/js",
                            languageOptions: {
                                parser: stubParser
                            }
                        },
                        {
                        }
                    ], {
                        plugins: {
                            ...baseConfig.plugins
                        },
                        language: jslang,
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
                            language: "@/js",
                            languageOptions: {
                                parser: stubParser
                            }
                        }
                    ], {
                        plugins: {
                            ...baseConfig.plugins
                        },
                        language: jslang,
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
                            language: "@/js",
                            languageOptions: {
                                parserOptions: "true"
                            }
                        }
                    ], "Expected an object.");
                });

                it("should merge two objects when second object has different keys", () => assertMergedResult([
                    {
                        language: "@/js",
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
                    language: jslang,
                    languageOptions: {
                        parserOptions: {
                            foo: "whatever",
                            bar: "baz"
                        }
                    }
                }));

                it("should deeply merge two objects when second object has different keys", () => assertMergedResult([
                    {
                        language: "@/js",
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
                    language: jslang,
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
                        language: "@/js",
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
                    language: jslang,
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
                        language: "@/js",
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
                    language: jslang,
                    languageOptions: {
                        parserOptions: {
                            foo: "bar"
                        }
                    }
                }));

                it("should merge an object and undefined into one object", () => assertMergedResult([
                    {
                        language: "@/js",
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
                    language: jslang,
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
                        language: "@/js",
                        languageOptions: {
                            parserOptions: {
                                foo: "bar"
                            }
                        }
                    }
                ], {
                    plugins: baseConfig.plugins,
                    language: jslang,
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
                ], "Key \"rules\": Key \"foo\": Expected severity of \"off\", 0, \"warn\", 1, \"error\", or 2.");
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

            it("should error when a string rule severity is not in lowercase", async () => {

                await assertInvalidConfig([
                    {
                        rules: {
                            foo: "Error"
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

            [null, true, 0, 1, "", "always", () => {}].forEach(schema => {
                it(`should error with a message that contains the rule name when a configured rule has invalid \`meta.schema\` (${schema})`, async () => {

                    await assertInvalidConfig([
                        {
                            plugins: {
                                foo: {
                                    rules: {
                                        bar: {
                                            meta: {
                                                schema
                                            }
                                        }
                                    }
                                }
                            },
                            rules: {
                                "foo/bar": "error"
                            }
                        }
                    ], "Error while processing options validation schema of rule 'foo/bar': Rule's `meta.schema` must be an array or object");
                });
            });

            it("should error with a message that contains the rule name when a configured rule has invalid `meta.schema` (invalid JSON Schema definition)", async () => {

                await assertInvalidConfig([
                    {
                        plugins: {
                            foo: {
                                rules: {
                                    bar: {
                                        meta: {
                                            schema: { minItems: [] }
                                        }
                                    }
                                }
                            }
                        },
                        rules: {
                            "foo/bar": "error"
                        }
                    }
                ], "Error while processing options validation schema of rule 'foo/bar': minItems must be number");
            });

            it("should allow rules with `schema:false` to have any configurations", async () => {

                const configs = new FlatConfigArray([
                    {
                        plugins: {
                            foo: {
                                rules: {
                                    bar: {
                                        meta: {
                                            schema: false
                                        },
                                        create() {
                                            return {};
                                        }
                                    },
                                    baz: {
                                        meta: {
                                            schema: false
                                        },
                                        create() {
                                            return {};
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        rules: {
                            "foo/bar": "error",
                            "foo/baz": ["error", "always"]
                        }
                    }
                ]);

                await configs.normalize();

                // does not throw
                const config = configs.getConfig("foo.js");

                assert.deepStrictEqual(config.rules, {
                    "foo/bar": [2],
                    "foo/baz": [2, "always"]
                });
            });

            it("should allow rules without `meta` to be configured without options", async () => {

                const configs = new FlatConfigArray([
                    {
                        plugins: {
                            foo: {
                                rules: {
                                    bar: {
                                        create() {
                                            return {};
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        rules: {
                            "foo/bar": "error"
                        }
                    }
                ]);

                await configs.normalize();

                // does not throw
                const config = configs.getConfig("foo.js");

                assert.deepStrictEqual(config.rules, {
                    "foo/bar": [2]
                });
            });

            it("should allow rules without `meta.schema` to be configured without options", async () => {

                const configs = new FlatConfigArray([
                    {
                        plugins: {
                            foo: {
                                rules: {
                                    meta: {},
                                    bar: {
                                        create() {
                                            return {};
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        rules: {
                            "foo/bar": "error"
                        }
                    }
                ]);

                await configs.normalize();

                // does not throw
                const config = configs.getConfig("foo.js");

                assert.deepStrictEqual(config.rules, {
                    "foo/bar": [2]
                });
            });

            it("should throw if a rule without `meta` is configured with an option", async () => {
                await assertInvalidConfig([
                    {
                        plugins: {
                            foo: {
                                rules: {
                                    bar: {
                                        create() {
                                            return {};
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        rules: {
                            "foo/bar": ["error", "always"]
                        }
                    }
                ], /should NOT have more than 0 items/u);
            });

            it("should throw if a rule without `meta.schema` is configured with an option", async () => {
                await assertInvalidConfig([
                    {
                        plugins: {
                            foo: {
                                rules: {
                                    bar: {
                                        meta: {},
                                        create() {
                                            return {};
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        rules: {
                            "foo/bar": ["error", "always"]
                        }
                    }
                ], /should NOT have more than 0 items/u);
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
                        foo2: "error"
                    }
                },
                {
                    rules: {
                        foo: ["error", "never"],
                        foo2: ["warn", "foo"]
                    }
                }
            ], {
                plugins: baseConfig.plugins,
                rules: {
                    foo: [2, "never"],
                    foo2: [1, "foo"]
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
                        "@foo/baz/boom": {
                            rules: {
                                bang: {}
                            }
                        }
                    },
                    rules: {
                        foo: ["error"],
                        bar: 0,
                        "@foo/baz/boom/bang": "error"
                    }
                }
            ], {
                plugins: {
                    ...baseConfig.plugins,
                    "@foo/baz/boom": {
                        rules: {
                            bang: {}
                        }
                    }
                },
                rules: {
                    foo: [2, "always"],
                    bar: [0],
                    "@foo/baz/boom/bang": [2]
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

            it("should error show expected properties", async () => {

                await assertInvalidConfig([
                    {
                        rules: {
                            "prefer-const": ["error", { destruct: true }]
                        }
                    }
                ], "Unexpected property \"destruct\". Expected properties: \"destructuring\", \"ignoreReadBeforeAssign\"");

                await assertInvalidConfig([
                    {
                        rules: {
                            "prefer-destructuring": ["error", { obj: true }]
                        }
                    }
                ], "Unexpected property \"obj\". Expected properties: \"VariableDeclarator\", \"AssignmentExpression\"");

                await assertInvalidConfig([
                    {
                        rules: {
                            "prefer-destructuring": ["error", { obj: true }]
                        }
                    }
                ], "Unexpected property \"obj\". Expected properties: \"array\", \"object\"");

                await assertInvalidConfig([
                    {
                        rules: {
                            "prefer-destructuring": ["error", { object: true }, { enforceRenamedProperties: true }]
                        }
                    }
                ], "Unexpected property \"enforceRenamedProperties\". Expected properties: \"enforceForRenamedProperties\"");
            });

        });

        describe("Invalid Keys", () => {

            [
                "env",
                "extends",
                "globals",
                "ignorePatterns",
                "noInlineConfig",
                "overrides",
                "parser",
                "parserOptions",
                "reportUnusedDisableDirectives",
                "root"
            ].forEach(key => {

                it(`should error when a ${key} key is found`, async () => {
                    await assertInvalidConfig([
                        {
                            [key]: "foo"
                        }
                    ], `Key "${key}": This appears to be in eslintrc format rather than flat config format.`);

                });
            });

            it("should error when plugins is an array", async () => {
                await assertInvalidConfig([
                    {
                        plugins: ["foo"]
                    }
                ], "Key \"plugins\": This appears to be in eslintrc format (array of strings) rather than flat config format (object).");

            });


        });

    });

    // https://github.com/eslint/eslint/issues/12592
    describe("Shared references between rule configs", () => {

        it("shared rule config should not cause a rule validation error", () => {

            const ruleConfig = ["error", {}];

            const configs = new FlatConfigArray([{
                rules: {
                    camelcase: ruleConfig,
                    "default-case": ruleConfig
                }
            }]);

            configs.normalizeSync();

            const config = configs.getConfig("foo.js");

            assert.deepStrictEqual(config.rules, {
                camelcase: [2, {
                    ignoreDestructuring: false,
                    ignoreGlobals: false,
                    ignoreImports: false
                }],
                "default-case": [2, {}]
            });

        });


        it("should throw rule validation error for camelcase", async () => {

            const ruleConfig = ["error", {}];

            const configs = new FlatConfigArray([
                {
                    rules: {
                        camelcase: ruleConfig
                    }
                },
                {
                    rules: {
                        "default-case": ruleConfig,


                        camelcase: [
                            "error",
                            {
                                ignoreDestructuring: Date
                            }

                        ]
                    }
                }
            ]);

            configs.normalizeSync();

            // exact error may differ based on structuredClone implementation so just test prefix
            assert.throws(() => {
                configs.getConfig("foo.js");
            }, /Key "rules": Key "camelcase":/u);

        });

    });

});
