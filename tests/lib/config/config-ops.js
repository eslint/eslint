/**
 * @fileoverview Tests for ConfigOps
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    leche = require("leche"),
    util = require("util"),
    environments = require("../../../conf/environments"),
    Environments = require("../../../lib/config/environments"),
    ConfigCache = require("../../../lib/config/config-cache"),
    ConfigOps = require("../../../lib/config/config-ops");

const envContext = new Environments();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ConfigOps", () => {

    describe("applyEnvironments()", () => {
        it("should apply environment settings to config without destroying original settings", () => {
            const config = {
                env: {
                    node: true
                },
                rules: {
                    foo: 2
                }
            };

            const result = ConfigOps.applyEnvironments(config, envContext);

            assert.deepStrictEqual(result, {
                env: config.env,
                rules: config.rules,
                parserOptions: {
                    ecmaFeatures: environments.node.parserOptions.ecmaFeatures
                },
                globals: environments.node.globals
            });
        });

        it("should not apply environment settings to config without environments", () => {
            const config = {
                rules: {
                    foo: 2
                }
            };

            const result = ConfigOps.applyEnvironments(config, envContext);

            assert.strictEqual(result, config);
        });

        it("should apply multiple environment settings to config without destroying original settings", () => {
            const config = {
                env: {
                    node: true,
                    es6: true
                },
                rules: {
                    foo: 2
                }
            };

            const result = ConfigOps.applyEnvironments(config, envContext);

            assert.deepStrictEqual(result, {
                env: config.env,
                rules: config.rules,
                parserOptions: {
                    ecmaVersion: 6,
                    ecmaFeatures: environments.node.parserOptions.ecmaFeatures
                },
                globals: Object.assign({}, environments.node.globals, environments.es6.globals)
            });
        });
    });

    describe("createEnvironmentConfig()", () => {

        it("should return empty config if called without any config", () => {
            const config = ConfigOps.createEnvironmentConfig(null, envContext);

            assert.deepStrictEqual(config, {
                globals: {},
                env: {},
                rules: {},
                parserOptions: {}
            });
        });

        it("should return correct config for env with no globals", () => {
            const config = ConfigOps.createEnvironmentConfig({ test: true }, new Environments());

            assert.deepStrictEqual(config, {
                globals: {},
                env: {
                    test: true
                },
                rules: {},
                parserOptions: {}
            });
        });

        it("should create the correct config for Node.js environment", () => {
            const config = ConfigOps.createEnvironmentConfig({ node: true }, envContext);

            assert.deepStrictEqual(config, {
                env: {
                    node: true
                },
                parserOptions: {
                    ecmaFeatures: environments.node.parserOptions.ecmaFeatures
                },
                globals: environments.node.globals,
                rules: {}
            });
        });

        it("should create the correct config for ES6 environment", () => {
            const config = ConfigOps.createEnvironmentConfig({ es6: true }, envContext);

            assert.deepStrictEqual(config, {
                env: {
                    es6: true
                },
                parserOptions: {
                    ecmaVersion: 6
                },
                globals: environments.es6.globals,
                rules: {}
            });
        });

        it("should create empty config when no environments are specified", () => {
            const config = ConfigOps.createEnvironmentConfig({}, envContext);

            assert.deepStrictEqual(config, {
                env: {},
                parserOptions: {},
                globals: {},
                rules: {}
            });
        });

        it("should create empty config when an unknown environment is specified", () => {
            const config = ConfigOps.createEnvironmentConfig({ foo: true }, envContext);

            assert.deepStrictEqual(config, {
                env: {
                    foo: true
                },
                parserOptions: {},
                globals: {},
                rules: {}
            });
        });

    });

    describe("merge()", () => {

        it("should combine two objects when passed two objects with different top-level properties", () => {
            const config = [
                { env: { browser: true } },
                { globals: { foo: "bar" } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.strictEqual(result.globals.foo, "bar");
            assert.isTrue(result.env.browser);
        });

        it("should combine without blowing up on null values", () => {
            const config = [
                { env: { browser: true } },
                { env: { node: null } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.strictEqual(result.env.node, null);
            assert.isTrue(result.env.browser);
        });

        it("should combine two objects with parser when passed two objects with different top-level properties", () => {
            const config = [
                { env: { browser: true }, parser: "espree" },
                { globals: { foo: "bar" } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.strictEqual(result.parser, "espree");
        });

        it("should combine configs and override rules when passed configs with the same rules", () => {
            const config = [
                { rules: { "no-mixed-requires": [0, false] } },
                { rules: { "no-mixed-requires": [1, true] } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.strictEqual(result.rules["no-mixed-requires"][0], 1);
            assert.strictEqual(result.rules["no-mixed-requires"][1], true);
        });

        it("should combine configs when passed configs with parserOptions", () => {
            const config = [
                { parserOptions: { ecmaFeatures: { jsx: true } } },
                { parserOptions: { ecmaFeatures: { globalReturn: true } } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.deepStrictEqual(result, {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                        globalReturn: true
                    }
                }
            });

            // double-check that originals were not changed
            assert.deepStrictEqual(config[0], { parserOptions: { ecmaFeatures: { jsx: true } } });
            assert.deepStrictEqual(config[1], { parserOptions: { ecmaFeatures: { globalReturn: true } } });
        });

        it("should override configs when passed configs with the same ecmaFeatures", () => {
            const config = [
                { parserOptions: { ecmaFeatures: { globalReturn: false } } },
                { parserOptions: { ecmaFeatures: { globalReturn: true } } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.deepStrictEqual(result, {
                parserOptions: {
                    ecmaFeatures: {
                        globalReturn: true
                    }
                }
            });
        });

        it("should combine configs and override rules when merging two configs with arrays and int", () => {

            const config = [
                { rules: { "no-mixed-requires": [0, false] } },
                { rules: { "no-mixed-requires": 1 } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.strictEqual(result.rules["no-mixed-requires"][0], 1);
            assert.strictEqual(result.rules["no-mixed-requires"][1], false);
            assert.deepStrictEqual(config[0], { rules: { "no-mixed-requires": [0, false] } });
            assert.deepStrictEqual(config[1], { rules: { "no-mixed-requires": 1 } });
        });

        it("should combine configs and override rules options completely", () => {

            const config = [
                { rules: { "no-mixed-requires": [1, { event: ["evt", "e"] }] } },
                { rules: { "no-mixed-requires": [1, { err: ["error", "e"] }] } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.deepStrictEqual(result.rules["no-mixed-requires"][1], { err: ["error", "e"] });
            assert.deepStrictEqual(config[0], { rules: { "no-mixed-requires": [1, { event: ["evt", "e"] }] } });
            assert.deepStrictEqual(config[1], { rules: { "no-mixed-requires": [1, { err: ["error", "e"] }] } });
        });

        it("should combine configs and override rules options without array or object", () => {

            const config = [
                { rules: { "no-mixed-requires": ["warn", "nconf", "underscore"] } },
                { rules: { "no-mixed-requires": [2, "requirejs"] } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.strictEqual(result.rules["no-mixed-requires"][0], 2);
            assert.strictEqual(result.rules["no-mixed-requires"][1], "requirejs");
            assert.isUndefined(result.rules["no-mixed-requires"][2]);
            assert.deepStrictEqual(config[0], { rules: { "no-mixed-requires": ["warn", "nconf", "underscore"] } });
            assert.deepStrictEqual(config[1], { rules: { "no-mixed-requires": [2, "requirejs"] } });
        });

        it("should combine configs and override rules options without array or object but special case", () => {

            const config = [
                { rules: { "no-mixed-requires": [1, "nconf", "underscore"] } },
                { rules: { "no-mixed-requires": "error" } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.strictEqual(result.rules["no-mixed-requires"][0], "error");
            assert.strictEqual(result.rules["no-mixed-requires"][1], "nconf");
            assert.strictEqual(result.rules["no-mixed-requires"][2], "underscore");
            assert.deepStrictEqual(config[0], { rules: { "no-mixed-requires": [1, "nconf", "underscore"] } });
            assert.deepStrictEqual(config[1], { rules: { "no-mixed-requires": "error" } });
        });

        it("should combine extends correctly", () => {

            const config = [
                { extends: ["a", "b", "c", "d", "e"] },
                { extends: ["f", "g", "h", "i"] }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.sameDeepMembers(result.extends, ["a", "b", "c", "d", "e", "f", "g", "h", "i"]);
        });

        it("should combine configs correctly", () => {

            const config = [
                {
                    rules: {
                        "no-mixed-requires": [1, { event: ["evt", "e"] }],
                        "valid-jsdoc": 1,
                        semi: 1,
                        quotes: [2, { exception: ["hi"] }],
                        smile: [1, ["hi", "bye"]]
                    },
                    parserOptions: {
                        ecmaFeatures: { jsx: true }
                    },
                    env: { browser: true },
                    globals: { foo: false }
                },
                {
                    rules: {
                        "no-mixed-requires": [1, { err: ["error", "e"] }],
                        "valid-jsdoc": 2,
                        test: 1,
                        smile: [1, ["xxx", "yyy"]]
                    },
                    parserOptions: {
                        ecmaFeatures: { globalReturn: true }
                    },
                    env: { browser: false },
                    globals: { foo: true }
                }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.deepStrictEqual(result, {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                        globalReturn: true
                    }
                },
                env: {
                    browser: false
                },
                globals: {
                    foo: true
                },
                rules: {
                    "no-mixed-requires": [1,
                        {
                            err: [
                                "error",
                                "e"
                            ]
                        }
                    ],
                    quotes: [2,
                        {
                            exception: [
                                "hi"
                            ]
                        }
                    ],
                    semi: 1,
                    smile: [1, ["xxx", "yyy"]],
                    test: 1,
                    "valid-jsdoc": 2
                }
            });
            assert.deepStrictEqual(config[0], {
                rules: {
                    "no-mixed-requires": [1, { event: ["evt", "e"] }],
                    "valid-jsdoc": 1,
                    semi: 1,
                    quotes: [2, { exception: ["hi"] }],
                    smile: [1, ["hi", "bye"]]
                },
                parserOptions: {
                    ecmaFeatures: { jsx: true }
                },
                env: { browser: true },
                globals: { foo: false }
            });
            assert.deepStrictEqual(config[1], {
                rules: {
                    "no-mixed-requires": [1, { err: ["error", "e"] }],
                    "valid-jsdoc": 2,
                    test: 1,
                    smile: [1, ["xxx", "yyy"]]
                },
                parserOptions: {
                    ecmaFeatures: { globalReturn: true }
                },
                env: { browser: false },
                globals: { foo: true }
            });
        });

        it("should copy deeply if there is not the destination's property", () => {
            const a = {};
            const b = { foo: { bar: 1 } };

            const result = ConfigOps.merge(a, b);

            assert(a.foo === void 0);
            assert(b.foo.bar === 1);
            assert(result.foo.bar === 1);

            result.foo.bar = 2;
            assert(b.foo.bar === 1);
            assert(result.foo.bar === 2);
        });

        describe("plugins", () => {
            let baseConfig;

            beforeEach(() => {
                baseConfig = { plugins: ["foo", "bar"] };
            });

            it("should combine the plugin entries when each config has different plugins", () => {
                const customConfig = { plugins: ["baz"] },
                    expectedResult = { plugins: ["foo", "bar", "baz"] },
                    result = ConfigOps.merge(baseConfig, customConfig);

                assert.deepStrictEqual(result, expectedResult);
                assert.deepStrictEqual(baseConfig, { plugins: ["foo", "bar"] });
                assert.deepStrictEqual(customConfig, { plugins: ["baz"] });
            });

            it("should avoid duplicate plugin entries when each config has the same plugin", () => {
                const customConfig = { plugins: ["bar"] },
                    expectedResult = { plugins: ["foo", "bar"] },
                    result = ConfigOps.merge(baseConfig, customConfig);

                assert.deepStrictEqual(result, expectedResult);
            });

            it("should create a valid config when one argument is an empty object", () => {
                const customConfig = { plugins: ["foo"] },
                    result = ConfigOps.merge({}, customConfig);

                assert.deepStrictEqual(result, customConfig);
                assert.notStrictEqual(result, customConfig);
            });
        });

        describe("overrides", () => {
            it("should combine the override entries in the correct order", () => {
                const baseConfig = { overrides: [{ files: ["**/*Spec.js"], env: { mocha: true } }] };
                const customConfig = { overrides: [{ files: ["**/*.jsx"], ecmaFeatures: { jsx: true } }] };
                const expectedResult = {
                    overrides: [
                        { files: ["**/*Spec.js"], env: { mocha: true } },
                        { files: ["**/*.jsx"], ecmaFeatures: { jsx: true } }
                    ]
                };

                const result = ConfigOps.merge(baseConfig, customConfig);

                assert.deepStrictEqual(result, expectedResult);
            });

            it("should work if the base config doesn’t have an overrides property", () => {
                const baseConfig = {};
                const customConfig = { overrides: [{ files: ["**/*.jsx"], ecmaFeatures: { jsx: true } }] };
                const expectedResult = {
                    overrides: [
                        { files: ["**/*.jsx"], ecmaFeatures: { jsx: true } }
                    ]
                };

                const result = ConfigOps.merge(baseConfig, customConfig);

                assert.deepStrictEqual(result, expectedResult);
            });

            it("should work if the custom config doesn’t have an overrides property", () => {
                const baseConfig = { overrides: [{ files: ["**/*Spec.js"], env: { mocha: true } }] };
                const customConfig = {};
                const expectedResult = {
                    overrides: [
                        { files: ["**/*Spec.js"], env: { mocha: true } }
                    ]
                };

                const result = ConfigOps.merge(baseConfig, customConfig);

                assert.deepStrictEqual(result, expectedResult);
            });

            it("should work if overrides are null in the base config", () => {
                const baseConfig = { overrides: null };
                const customConfig = { overrides: [{ files: ["**/*.jsx"], ecmaFeatures: { jsx: true } }] };
                const expectedResult = {
                    overrides: [
                        { files: ["**/*.jsx"], ecmaFeatures: { jsx: true } }
                    ]
                };

                const result = ConfigOps.merge(baseConfig, customConfig);

                assert.deepStrictEqual(result, expectedResult);
            });

            it("should work if overrides are null in the custom config", () => {
                const baseConfig = { overrides: [{ files: ["**/*Spec.js"], env: { mocha: true } }] };
                const customConfig = { overrides: null };
                const expectedResult = {
                    overrides: [
                        { files: ["**/*Spec.js"], env: { mocha: true } }
                    ]
                };

                const result = ConfigOps.merge(baseConfig, customConfig);

                assert.deepStrictEqual(result, expectedResult);
            });
        });
    });

    describe("getRuleSeverity()", () => {
        const EXPECTED_RESULTS = new Map([
            [0, 0],
            [1, 1],
            [2, 2],
            [[0], 0],
            [[1], 1],
            [[2], 2],
            ["off", 0],
            ["warn", 1],
            ["error", 2],
            [["off"], 0],
            [["warn"], 1],
            [["error"], 2],
            ["OFF", 0],
            ["wArN", 1],
            [["ErRoR"], 2],
            ["invalid config", 0],
            [["invalid config"], 0],
            [3, 0],
            [[3], 0],
            [1.5, 0],
            [[1.5], 0]
        ]);

        for (const key of EXPECTED_RESULTS.keys()) {
            it(`returns ${util.inspect(EXPECTED_RESULTS.get(key))} for ${util.inspect(key)}`, () => {
                assert.strictEqual(ConfigOps.getRuleSeverity(key), EXPECTED_RESULTS.get(key));
            });
        }
    });

    describe("normalizeToStrings()", () => {
        it("should convert 2 rule setting to error when rule has just a severity", () => {
            const config = {
                rules: {
                    foo: 2,
                    bar: 2
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: "error",
                    bar: "error"
                }
            });
        });

        it("should convert 2 rule setting to error when rule has array with severity", () => {
            const config = {
                rules: {
                    foo: [2, "something"],
                    bar: 2
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: ["error", "something"],
                    bar: "error"
                }
            });
        });

        it("should convert 1 rule setting to warn when rule has just a severity", () => {
            const config = {
                rules: {
                    foo: 1,
                    bar: 1
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: "warn",
                    bar: "warn"
                }
            });
        });

        it("should convert 1 rule setting to warn when rule has array with severity", () => {
            const config = {
                rules: {
                    foo: [1, "something"],
                    bar: 1
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: ["warn", "something"],
                    bar: "warn"
                }
            });
        });

        it("should convert 0 rule setting to off when rule has just a severity", () => {
            const config = {
                rules: {
                    foo: 0,
                    bar: 0
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: "off",
                    bar: "off"
                }
            });
        });

        it("should convert 0 rule setting to off when rule has array with severity", () => {
            const config = {
                rules: {
                    foo: [0, "something"],
                    bar: 0
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: ["off", "something"],
                    bar: "off"
                }
            });
        });

        it("should convert 256 rule setting to off when rule has just a severity", () => {
            const config = {
                rules: {
                    foo: 256,
                    bar: 256
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: "off",
                    bar: "off"
                }
            });
        });

        it("should convert 256 rule setting to off when rule has array with severity", () => {
            const config = {
                rules: {
                    foo: [256, "something"],
                    bar: 256
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: ["off", "something"],
                    bar: "off"
                }
            });
        });
    });

    describe("isError()", () => {

        leche.withData([
            ["error", true],
            ["Error", true],
            [2, true],
            [["error"], true],
            [["erRor"], true],
            [[2], true],
            [["error", "foo"], true],
            [["eRror", "bar"], true],
            [[2, "baz"], true]
        ], (input, expected) => {

            it(`should return ${expected}when passed ${input}`, () => {
                const result = ConfigOps.isErrorSeverity(input);

                assert.strictEqual(result, expected);
            });

        });

    });

    describe("getConfigFromVector()", () => {
        let configCache;

        beforeEach(() => {
            configCache = new ConfigCache();
        });

        it("should get from merged vector cache when present", () => {
            const vector = [
                { filePath: "configFile1", matchingOverrides: [1] },
                { filePath: "configFile2", matchingOverrides: [0, 1] }
            ];
            const merged = { merged: true };

            configCache.setMergedVectorConfig(vector, merged);

            const result = ConfigOps.getConfigFromVector(vector, configCache);

            assert.deepStrictEqual(result, merged);
        });

        it("should get from raw cached configs when no merged vectors are cached", () => {
            const config = [
                {
                    rules: { foo1: "off" },
                    overrides: [
                        { files: "pattern1", rules: { foo1: "warn" } },
                        { files: "pattern2", rules: { foo1: "error" } }
                    ]
                },
                {
                    rules: { foo2: "warn" },
                    overrides: [
                        { files: "pattern1", rules: { foo2: "error" } },
                        { files: "pattern2", rules: { foo2: "off" } }
                    ]
                }
            ];

            configCache.setConfig("configFile1", config[0]);
            configCache.setConfig("configFile2", config[1]);

            const vector = [
                { filePath: "configFile1", matchingOverrides: [1] },
                { filePath: "configFile2", matchingOverrides: [0, 1] }
            ];

            const result = ConfigOps.getConfigFromVector(vector, configCache);

            assert.strictEqual(result.rules.foo1, "error");
            assert.strictEqual(result.rules.foo2, "off");
        });
    });

    describe("pathMatchesGlobs", () => {

        /**
         * Emits a test that confirms the specified file path matches the specified combination of patterns.
         * @param {string} filePath The file path to test patterns against
         * @param {string|string[]} patterns One or more glob patterns
         * @param {string|string[]} [excludedPatterns] One or more glob patterns
         * @returns {void}
         */
        function match(filePath, patterns, excludedPatterns) {
            it(`matches ${filePath} given '${patterns.join("','")}' includes and '${excludedPatterns.join("','")}' excludes`, () => {
                const result = ConfigOps.pathMatchesGlobs(filePath, patterns, excludedPatterns);

                assert.strictEqual(result, true);
            });
        }

        /**
         * Emits a test that confirms the specified file path does not match the specified combination of patterns.
         * @param {string} filePath The file path to test patterns against
         * @param {string|string[]} patterns One or more glob patterns
         * @param {string|string[]} [excludedPatterns] One or more glob patterns
         * @returns {void}
         */
        function noMatch(filePath, patterns, excludedPatterns) {
            it(`does not match ${filePath} given '${patterns.join("','")}' includes and '${excludedPatterns.join("','")}' excludes`, () => {
                const result = ConfigOps.pathMatchesGlobs(filePath, patterns, excludedPatterns);

                assert.strictEqual(result, false);
            });
        }

        /**
         * Emits a test that confirms the specified pattern throws an error.
         * @param {string} filePath The file path to test the pattern against
         * @param {string} pattern The glob pattern that should trigger the error condition
         * @param {string} expectedMessage The expected error's message
         * @returns {void}
         */
        function error(filePath, pattern, expectedMessage) {
            it(`emits an error given '${pattern}'`, () => {
                let errorMessage;

                try {
                    ConfigOps.pathMatchesGlobs(filePath, pattern);
                } catch (e) {
                    errorMessage = e.message;
                }

                assert.strictEqual(errorMessage, expectedMessage);
            });
        }

        // files in the project root
        match("foo.js", ["foo.js"], []);
        match("foo.js", ["*"], []);
        match("foo.js", ["*.js"], []);
        match("foo.js", ["**/*.js"], []);
        match("bar.js", ["*.js"], ["foo.js"]);

        noMatch("foo.js", ["./foo.js"], []);
        noMatch("foo.js", ["./*"], []);
        noMatch("foo.js", ["./**"], []);
        noMatch("foo.js", ["*"], ["foo.js"]);
        noMatch("foo.js", ["*.js"], ["foo.js"]);
        noMatch("foo.js", ["**/*.js"], ["foo.js"]);

        // files in a subdirectory
        match("subdir/foo.js", ["foo.js"], []);
        match("subdir/foo.js", ["*"], []);
        match("subdir/foo.js", ["*.js"], []);
        match("subdir/foo.js", ["**/*.js"], []);
        match("subdir/foo.js", ["subdir/*.js"], []);
        match("subdir/foo.js", ["subdir/foo.js"], []);
        match("subdir/foo.js", ["subdir/*"], []);
        match("subdir/second/foo.js", ["subdir/**"], []);

        noMatch("subdir/foo.js", ["./foo.js"], []);
        noMatch("subdir/foo.js", ["./**"], []);
        noMatch("subdir/foo.js", ["./subdir/**"], []);
        noMatch("subdir/foo.js", ["./subdir/*"], []);
        noMatch("subdir/foo.js", ["*"], ["subdir/**"]);
        noMatch("subdir/very/deep/foo.js", ["*.js"], ["subdir/**"]);
        noMatch("subdir/second/foo.js", ["subdir/*"], []);
        noMatch("subdir/second/foo.js", ["subdir/**"], ["subdir/second/*"]);

        // error conditions
        error("foo.js", ["/*.js"], "Invalid override pattern (expected relative path not containing '..'): /*.js");
        error("foo.js", ["/foo.js"], "Invalid override pattern (expected relative path not containing '..'): /foo.js");
        error("foo.js", ["../**"], "Invalid override pattern (expected relative path not containing '..'): ../**");
    });

    describe("normalizeConfigGlobal", () => {
        [
            ["off", "off"],
            [true, "writeable"],
            ["true", "writeable"],
            [false, "readable"],
            ["false", "readable"],
            [null, "readable"],
            ["writeable", "writeable"],
            ["writable", "writeable"],
            ["readable", "readable"],
            ["readonly", "readable"],
            ["writable", "writeable"],
            ["something else", "writeable"]
        ].forEach(([input, output]) => {
            it(util.inspect(input), () => {
                assert.strictEqual(ConfigOps.normalizeConfigGlobal(input), output);
            });
        });
    });
});
