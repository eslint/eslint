/**
 * @fileoverview Tests for ConfigArray class.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

const path = require("path");
const { assert } = require("chai");
const { ConfigArray, OverrideTester, getUsedExtractedConfigs } = require("../../../../lib/cli-engine/config-array");

describe("ConfigArray", () => {
    it("should be a sub class of Array.", () => {
        assert(new ConfigArray() instanceof Array);
    });

    describe("'constructor(...elements)' should adopt the elements as array elements.", () => {
        const patterns = [
            { elements: [] },
            { elements: [{ value: 1 }] },
            { elements: [{ value: 2 }, { value: 3 }] },
            { elements: [{ value: 4 }, { value: 5 }, { value: 6 }] }
        ];

        for (const { elements } of patterns) {
            describe(`if it gave ${JSON.stringify(elements)} then`, () => {
                let configArray;

                beforeEach(() => {
                    configArray = new ConfigArray(...elements);
                });

                it(`should have ${elements.length} as the length.`, () => {
                    assert.strictEqual(configArray.length, elements.length);
                });

                for (let i = 0; i < elements.length; ++i) {
                    it(`should have ${JSON.stringify(elements[i])} at configArray[${i}].`, () => { // eslint-disable-line no-loop-func
                        assert.strictEqual(configArray[i], elements[i]);
                    });
                }
            });
        }
    });

    describe("'isRoot()' method should be the value of the last element which has 'root' property.", () => {
        const patterns = [
            { elements: [], expected: false },
            { elements: [{}], expected: false },
            { elements: [{}, {}], expected: false },
            { elements: [{ root: false }], expected: false },
            { elements: [{ root: true }], expected: true },
            { elements: [{ root: true }, { root: false }], expected: false },
            { elements: [{ root: false }, { root: true }], expected: true },
            { elements: [{ root: false }, { root: true }, { rules: {} }], expected: true }, // ignore undefined.
            { elements: [{ root: true }, { root: 1 }], expected: true } // ignore non-boolean value
        ];

        for (const { elements, expected } of patterns) {
            it(`should be ${expected} if the elements are ${JSON.stringify(elements)}.`, () => {
                assert.strictEqual(new ConfigArray(...elements).isRoot(), expected);
            });
        }
    });

    describe("'pluginEnvironments' property should be the environments of all plugins.", () => {
        const env = {
            "aaa/xxx": {},
            "bbb/xxx": {}
        };
        let configArray;

        beforeEach(() => {
            configArray = new ConfigArray(
                {
                    plugins: {
                        aaa: {
                            definition: {
                                environments: {
                                    xxx: env["aaa/xxx"]
                                }
                            }
                        }
                    }
                },
                {
                    criteria: OverrideTester.create(["*.ts"], [], process.cwd()),
                    plugins: {
                        bbb: {
                            definition: {
                                environments: {
                                    xxx: env["bbb/xxx"]
                                }
                            }
                        }
                    }
                }
            );
        });

        it("should return null for built-in env", () => {
            assert.strictEqual(configArray.pluginEnvironments.get("node"), void 0);
        });

        it("should return 'aaa/xxx' if it exists.", () => {
            assert.strictEqual(configArray.pluginEnvironments.get("aaa/xxx"), env["aaa/xxx"]);
        });

        it("should return 'bbb/xxx' if it exists.", () => {
            assert.strictEqual(configArray.pluginEnvironments.get("bbb/xxx"), env["bbb/xxx"]);
        });

        it("should throw an error if it tried to mutate.", () => {
            assert.throws(() => {
                configArray.pluginEnvironments.set("ccc/xxx", {});
            });
        });
    });

    describe("'pluginProcessors' property should be the processors of all plugins.", () => {
        const processors = {
            "aaa/.xxx": {},
            "bbb/.xxx": {}
        };
        let configArray;

        beforeEach(() => {
            configArray = new ConfigArray(
                {
                    plugins: {
                        aaa: {
                            definition: {
                                processors: {
                                    ".xxx": processors["aaa/.xxx"]
                                }
                            }
                        }
                    }
                },
                {
                    criteria: OverrideTester.create(["*.ts"], [], process.cwd()),
                    plugins: {
                        bbb: {
                            definition: {
                                processors: {
                                    ".xxx": processors["bbb/.xxx"]
                                }
                            }
                        }
                    }
                }
            );
        });

        it("should return 'aaa/.xxx' if it exists.", () => {
            assert.strictEqual(configArray.pluginProcessors.get("aaa/.xxx"), processors["aaa/.xxx"]);
        });

        it("should return 'bbb/.xxx' if it exists.", () => {
            assert.strictEqual(configArray.pluginProcessors.get("bbb/.xxx"), processors["bbb/.xxx"]);
        });

        it("should throw an error if it tried to mutate.", () => {
            assert.throws(() => {
                configArray.pluginProcessors.set("ccc/.xxx", {});
            });
        });
    });

    describe("'pluginRules' property should be the rules of all plugins.", () => {
        const rules = {
            "aaa/xxx": {},
            "bbb/xxx": {}
        };
        let configArray;

        beforeEach(() => {
            configArray = new ConfigArray(
                {
                    plugins: {
                        aaa: {
                            definition: {
                                rules: {
                                    xxx: rules["aaa/xxx"]
                                }
                            }
                        }
                    }
                },
                {
                    criteria: OverrideTester.create(["*.ts"], [], process.cwd()),
                    plugins: {
                        bbb: {
                            definition: {
                                rules: {
                                    xxx: rules["bbb/xxx"]
                                }
                            }
                        }
                    }
                }
            );
        });

        it("should return null for built-in rules", () => {
            assert.strictEqual(configArray.pluginRules.get("eqeqeq"), void 0);
        });

        it("should return 'aaa/xxx' if it exists.", () => {
            assert.strictEqual(configArray.pluginRules.get("aaa/xxx"), rules["aaa/xxx"]);
        });

        it("should return 'bbb/xxx' if it exists.", () => {
            assert.strictEqual(configArray.pluginRules.get("bbb/xxx"), rules["bbb/xxx"]);
        });

        it("should throw an error if it tried to mutate.", () => {
            assert.throws(() => {
                configArray.pluginRules.set("ccc/xxx", {});
            });
        });
    });

    describe("'extractConfig(filePath)' method should retrieve the merged config for a given file.", () => {
        it("should throw an error if a 'parser' has the loading error.", () => {
            assert.throws(() => {
                new ConfigArray(
                    {
                        parser: { error: new Error("Failed to load a parser.") }
                    }
                ).extractConfig(__filename);
            }, "Failed to load a parser.");
        });

        it("should not throw if the errored 'parser' was not used; overwriten", () => {
            const parser = { id: "a parser" };
            const config = new ConfigArray(
                {
                    parser: { error: new Error("Failed to load a parser.") }
                },
                {
                    parser
                }
            ).extractConfig(__filename);

            assert.strictEqual(config.parser, parser);
        });

        it("should not throw if the errored 'parser' was not used; not matched", () => {
            const config = new ConfigArray(
                {
                    criteria: OverrideTester.create(["*.ts"], [], process.cwd()),
                    parser: { error: new Error("Failed to load a parser.") }
                }
            ).extractConfig(__filename);

            assert.strictEqual(config.parser, null);
        });

        it("should throw an error if a 'plugins' value has the loading error.", () => {
            assert.throws(() => {
                new ConfigArray(
                    {
                        plugins: {
                            foo: { error: new Error("Failed to load a plugin.") }
                        }
                    }
                ).extractConfig(__filename);
            }, "Failed to load a plugin.");
        });

        it("should not throw if the errored 'plugins' value was not used; not matched", () => {
            const config = new ConfigArray(
                {
                    criteria: OverrideTester.create(["*.ts"], [], process.cwd()),
                    plugins: {
                        foo: { error: new Error("Failed to load a plugin.") }
                    }
                }
            ).extractConfig(__filename);

            assert.deepStrictEqual(config.plugins, {});
        });

        it("should not merge the elements which were not matched.", () => {
            const config = new ConfigArray(
                {
                    rules: {
                        "no-redeclare": "error"
                    }
                },
                {
                    criteria: OverrideTester.create(["*.js"], [], process.cwd()),
                    rules: {
                        "no-undef": "error"
                    }
                },
                {
                    criteria: OverrideTester.create(["*.js"], [path.basename(__filename)], process.cwd()),
                    rules: {
                        "no-use-before-define": "error"
                    }
                },
                {
                    criteria: OverrideTester.create(["*.ts"], [], process.cwd()),
                    rules: {
                        "no-unused-vars": "error"
                    }
                }
            ).extractConfig(__filename);

            assert.deepStrictEqual(config.rules, {
                "no-redeclare": ["error"],
                "no-undef": ["error"]
            });
        });

        it("should return the same instance for every the same matching.", () => {
            const configArray = new ConfigArray(
                {
                    rules: {
                        "no-redeclare": "error"
                    }
                },
                {
                    criteria: OverrideTester.create(["*.js"], [], process.cwd()),
                    rules: {
                        "no-undef": "error"
                    }
                },
                {
                    criteria: OverrideTester.create(["*.js"], [path.basename(__filename)], process.cwd()),
                    rules: {
                        "no-use-before-define": "error"
                    }
                },
                {
                    criteria: OverrideTester.create(["*.ts"], [], process.cwd()),
                    rules: {
                        "no-unused-vars": "error"
                    }
                }
            );

            assert.strictEqual(
                configArray.extractConfig(path.join(__dirname, "a.js")),
                configArray.extractConfig(path.join(__dirname, "b.js"))
            );
        });

        /**
         * Merge two config data.
         *
         * The test cases which depend on this function were moved from
         * 'tests/lib/config/config-ops.js' when refactoring to keep the
         * cumulated test cases.
         *
         * Previously, the merging logic of multiple config data had been
         * implemented in `ConfigOps.merge()` function. But currently, it's
         * implemented in `ConfigArray#extractConfig()` method.
         * @param {Object} target A config data.
         * @param {Object} source Another config data.
         * @returns {Object} The merged config data.
         */
        function merge(target, source) {
            return new ConfigArray(target, source).extractConfig(__filename);
        }

        it("should combine two objects when passed two objects with different top-level properties", () => {
            const config = [
                { env: { browser: true } },
                { globals: { foo: "bar" } }
            ];

            const result = merge(config[0], config[1]);

            assert.strictEqual(result.globals.foo, "bar");
            assert.isTrue(result.env.browser);
        });

        it("should combine without blowing up on null values", () => {
            const config = [
                { env: { browser: true } },
                { env: { node: null } }
            ];

            const result = merge(config[0], config[1]);

            assert.strictEqual(result.env.node, null);
            assert.isTrue(result.env.browser);
        });

        it("should combine two objects with parser when passed two objects with different top-level properties", () => {
            const config = [
                { env: { browser: true }, parser: "espree" },
                { globals: { foo: "bar" } }
            ];

            const result = merge(config[0], config[1]);

            assert.strictEqual(result.parser, "espree");
        });

        it("should combine configs and override rules when passed configs with the same rules", () => {
            const config = [
                { rules: { "no-mixed-requires": [0, false] } },
                { rules: { "no-mixed-requires": [1, true] } }
            ];

            const result = merge(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.strictEqual(result.rules["no-mixed-requires"][0], 1);
            assert.strictEqual(result.rules["no-mixed-requires"][1], true);
        });

        it("should combine configs when passed configs with parserOptions", () => {
            const config = [
                { parserOptions: { ecmaFeatures: { jsx: true } } },
                { parserOptions: { ecmaFeatures: { globalReturn: true } } }
            ];

            const result = merge(config[0], config[1]);

            assert.deepStrictEqual(result, {
                configNameOfNoInlineConfig: "",
                env: {},
                globals: {},
                noInlineConfig: void 0,
                parser: null,
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                        globalReturn: true
                    }
                },
                plugins: {},
                processor: null,
                reportUnusedDisableDirectives: void 0,
                rules: {},
                settings: {}
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

            const result = merge(config[0], config[1]);

            assert.deepStrictEqual(result, {
                configNameOfNoInlineConfig: "",
                env: {},
                globals: {},
                noInlineConfig: void 0,
                parser: null,
                parserOptions: {
                    ecmaFeatures: {
                        globalReturn: true
                    }
                },
                plugins: {},
                processor: null,
                reportUnusedDisableDirectives: void 0,
                rules: {},
                settings: {}
            });
        });

        it("should combine configs and override rules when merging two configs with arrays and int", () => {

            const config = [
                { rules: { "no-mixed-requires": [0, false] } },
                { rules: { "no-mixed-requires": 1 } }
            ];

            const result = merge(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.strictEqual(result.rules["no-mixed-requires"][0], 1);
            assert.strictEqual(result.rules["no-mixed-requires"][1], false);
            assert.deepStrictEqual(config[0], { rules: { "no-mixed-requires": [0, false] } });
            assert.deepStrictEqual(config[1], { rules: { "no-mixed-requires": 1 } });
        });

        it("should combine configs and override rules options completely", () => {

            const config = [
                { rules: { "no-mixed-requires1": [1, { event: ["evt", "e"] }] } },
                { rules: { "no-mixed-requires1": [1, { err: ["error", "e"] }] } }
            ];

            const result = merge(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires1"]);
            assert.deepStrictEqual(result.rules["no-mixed-requires1"][1], { err: ["error", "e"] });
            assert.deepStrictEqual(config[0], { rules: { "no-mixed-requires1": [1, { event: ["evt", "e"] }] } });
            assert.deepStrictEqual(config[1], { rules: { "no-mixed-requires1": [1, { err: ["error", "e"] }] } });
        });

        it("should combine configs and override rules options without array or object", () => {

            const config = [
                { rules: { "no-mixed-requires1": ["warn", "nconf", "underscore"] } },
                { rules: { "no-mixed-requires1": [2, "requirejs"] } }
            ];

            const result = merge(config[0], config[1]);

            assert.strictEqual(result.rules["no-mixed-requires1"][0], 2);
            assert.strictEqual(result.rules["no-mixed-requires1"][1], "requirejs");
            assert.isUndefined(result.rules["no-mixed-requires1"][2]);
            assert.deepStrictEqual(config[0], { rules: { "no-mixed-requires1": ["warn", "nconf", "underscore"] } });
            assert.deepStrictEqual(config[1], { rules: { "no-mixed-requires1": [2, "requirejs"] } });
        });

        it("should combine configs and override rules options without array or object but special case", () => {

            const config = [
                { rules: { "no-mixed-requires1": [1, "nconf", "underscore"] } },
                { rules: { "no-mixed-requires1": "error" } }
            ];

            const result = merge(config[0], config[1]);

            assert.strictEqual(result.rules["no-mixed-requires1"][0], "error");
            assert.strictEqual(result.rules["no-mixed-requires1"][1], "nconf");
            assert.strictEqual(result.rules["no-mixed-requires1"][2], "underscore");
            assert.deepStrictEqual(config[0], { rules: { "no-mixed-requires1": [1, "nconf", "underscore"] } });
            assert.deepStrictEqual(config[1], { rules: { "no-mixed-requires1": "error" } });
        });

        it("should combine configs correctly", () => {

            const config = [
                {
                    rules: {
                        "no-mixed-requires1": [1, { event: ["evt", "e"] }],
                        "valid-jsdoc": 1,
                        semi: 1,
                        quotes1: [2, { exception: ["hi"] }],
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
                        "no-mixed-requires1": [1, { err: ["error", "e"] }],
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

            const result = merge(config[0], config[1]);

            assert.deepStrictEqual(result, {
                configNameOfNoInlineConfig: "",
                parser: null,
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                        globalReturn: true
                    }
                },
                plugins: {},
                env: {
                    browser: false
                },
                globals: {
                    foo: true
                },
                rules: {
                    "no-mixed-requires1": [1,
                        {
                            err: [
                                "error",
                                "e"
                            ]
                        }
                    ],
                    quotes1: [2,
                        {
                            exception: [
                                "hi"
                            ]
                        }
                    ],
                    semi: [1],
                    smile: [1, ["xxx", "yyy"]],
                    test: [1],
                    "valid-jsdoc": [2]
                },
                settings: {},
                processor: null,
                noInlineConfig: void 0,
                reportUnusedDisableDirectives: void 0
            });
            assert.deepStrictEqual(config[0], {
                rules: {
                    "no-mixed-requires1": [1, { event: ["evt", "e"] }],
                    "valid-jsdoc": 1,
                    semi: 1,
                    quotes1: [2, { exception: ["hi"] }],
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
                    "no-mixed-requires1": [1, { err: ["error", "e"] }],
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
            const b = { settings: { bar: 1 } };

            const result = merge(a, b);

            assert(a.settings === void 0);
            assert(b.settings.bar === 1);
            assert(result.settings.bar === 1);

            result.settings.bar = 2;
            assert(b.settings.bar === 1);
            assert(result.settings.bar === 2);
        });
    });

    describe("'getUsedExtractedConfigs(instance)' function should retrieve used extracted configs from the instance's internal cache.", () => {
        let configArray;

        beforeEach(() => {
            configArray = new ConfigArray(
                {
                    rules: {
                        "no-redeclare": "error"
                    }
                },
                {
                    criteria: OverrideTester.create(["*.js"], [], process.cwd()),
                    rules: {
                        "no-undef": "error"
                    }
                },
                {
                    criteria: OverrideTester.create(["*.js"], [path.basename(__filename)], process.cwd()),
                    rules: {
                        "no-use-before-define": "error"
                    }
                },
                {
                    criteria: OverrideTester.create(["*.ts"], [], process.cwd()),
                    rules: {
                        "no-unused-vars": "error"
                    }
                }
            );
        });

        it("should return empty array before it called 'extractConfig(filePath)'.", () => {
            assert.deepStrictEqual(getUsedExtractedConfigs(configArray), []);
        });

        for (const { filePaths } of [
            { filePaths: [__filename] },
            { filePaths: [__filename, `${path.resolve(__filename)}.ts`] },
            { filePaths: [__filename, `${path.resolve(__filename)}.ts`, path.join(__dirname, "foo.js")] }
        ]) {
            describe(`after it called 'extractConfig(filePath)' ${filePaths.length} time(s) with ${JSON.stringify(filePaths, null, 4)}, the returned array`, () => { // eslint-disable-line no-loop-func
                let configs;
                let usedConfigs;

                beforeEach(() => {
                    configs = filePaths.map(filePath => configArray.extractConfig(filePath));
                    usedConfigs = getUsedExtractedConfigs(configArray);
                });

                it(`should have ${filePaths.length} as the length.`, () => {
                    assert.strictEqual(usedConfigs.length, configs.length);
                });

                for (let i = 0; i < filePaths.length; ++i) {
                    it(`should contain 'configs[${i}]'.`, () => { // eslint-disable-line no-loop-func
                        assert(usedConfigs.includes(configs[i]));
                    });
                }
            });
        }

        it("should not contain duplicate values.", () => {

            // Call some times, including with the same arguments.
            configArray.extractConfig(__filename);
            configArray.extractConfig(`${path.resolve(__filename)}.ts`);
            configArray.extractConfig(path.join(__dirname, "foo.js"));
            configArray.extractConfig(__filename);
            configArray.extractConfig(path.join(__dirname, "foo.js"));
            configArray.extractConfig(path.join(__dirname, "bar.js"));
            configArray.extractConfig(path.join(__dirname, "baz.js"));

            const usedConfigs = getUsedExtractedConfigs(configArray);

            assert.strictEqual(new Set(usedConfigs).size, usedConfigs.length);
        });
    });
});
