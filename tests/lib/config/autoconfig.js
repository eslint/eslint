/**
 * @fileoverview Used for creating a suggested configuration based on project code.
 * @author Ian VanSchooten
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    autoconfig = require("../../../lib/config/autoconfig"),
    sourceCodeUtils = require("../../../lib/util/source-code-utils"),
    baseDefaultOptions = require("../../../conf/default-cli-options");

const defaultOptions = Object.assign({}, baseDefaultOptions, { cwd: process.cwd() });

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

const SOURCE_CODE_FIXTURE_FILENAME = "./tests/fixtures/autoconfig/source.js";
const CONFIG_COMMENTS_FILENAME = "./tests/fixtures/autoconfig/source-with-comments.js";
const SEVERITY = 2;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const rulesConfig = {
    semi: [SEVERITY, [SEVERITY, "always"], [SEVERITY, "never"]],
    "semi-spacing": [SEVERITY,
        [SEVERITY, { before: true, after: true }],
        [SEVERITY, { before: true, after: false }],
        [SEVERITY, { before: false, after: true }],
        [SEVERITY, { before: false, after: false }]
    ],
    quotes: [SEVERITY,
        [SEVERITY, "single"],
        [SEVERITY, "double"],
        [SEVERITY, "backtick"],
        [SEVERITY, "single", "avoid-escape"],
        [SEVERITY, "double", "avoid-escape"],
        [SEVERITY, "backtick", "avoid-escape"]]
};

const errorRulesConfig = {
    "no-unused-vars": [SEVERITY],
    "semi-spacing": [SEVERITY,
        [SEVERITY, { before: true, after: true }],
        [SEVERITY, { before: true, after: false }],
        [SEVERITY, { before: false, after: true }],
        [SEVERITY, { before: false, after: false }]
    ]
};

describe("autoconfig", () => {

    describe("Registry", () => {

        it("should set up a registry for rules in a provided rulesConfig", () => {
            const expectedRules = Object.keys(rulesConfig);
            const registry = new autoconfig.Registry(rulesConfig);

            assert.strictEqual(Object.keys(registry.rules).length, 3);
            assert.sameMembers(Object.keys(registry.rules), expectedRules);
            assert.isArray(registry.rules.semi);
            assert.isArray(registry.rules["semi-spacing"]);
            assert.isArray(registry.rules.quotes);
            assert.lengthOf(registry.rules.semi, 3);
            assert.lengthOf(registry.rules["semi-spacing"], 5);
            assert.lengthOf(registry.rules.quotes, 7);
        });

        it("should not have any rules if constructed without a config argument", () => {
            const registry = new autoconfig.Registry();

            assert.isObject(registry.rules);
            assert.lengthOf(Object.keys(registry.rules), 0);
        });

        it("should create registryItems for each rule with the proper keys", () => {
            const registry = new autoconfig.Registry(rulesConfig);

            assert.isObject(registry.rules.semi[0]);
            assert.isObject(registry.rules["semi-spacing"][0]);
            assert.isObject(registry.rules.quotes[0]);
            assert.property(registry.rules.semi[0], "config");
            assert.property(registry.rules.semi[0], "specificity");
            assert.property(registry.rules.semi[0], "errorCount");
        });

        it("should populate the config property correctly", () => {
            const registry = new autoconfig.Registry(rulesConfig);

            assert.strictEqual(registry.rules.quotes[0].config, SEVERITY);
            assert.deepStrictEqual(registry.rules.quotes[1].config, [SEVERITY, "single"]);
            assert.deepStrictEqual(registry.rules.quotes[2].config, [SEVERITY, "double"]);
            assert.deepStrictEqual(registry.rules.quotes[3].config, [SEVERITY, "backtick"]);
            assert.deepStrictEqual(registry.rules.quotes[4].config, [SEVERITY, "single", "avoid-escape"]);
            assert.deepStrictEqual(registry.rules.quotes[5].config, [SEVERITY, "double", "avoid-escape"]);
            assert.deepStrictEqual(registry.rules.quotes[6].config, [SEVERITY, "backtick", "avoid-escape"]);
        });

        it("should assign the correct specificity", () => {
            const registry = new autoconfig.Registry(rulesConfig);

            assert.strictEqual(registry.rules.quotes[0].specificity, 1);
            assert.strictEqual(registry.rules.quotes[1].specificity, 2);
            assert.strictEqual(registry.rules.quotes[6].specificity, 3);
        });

        it("should initially leave the errorCount as undefined", () => {
            const registry = new autoconfig.Registry(rulesConfig);

            assert.isUndefined(registry.rules.quotes[0].errorCount);
            assert.isUndefined(registry.rules.quotes[1].errorCount);
            assert.isUndefined(registry.rules.quotes[6].errorCount);
        });

        describe("populateFromCoreRules()", () => {

            it("should add core rules to registry", () => {
                const registry = new autoconfig.Registry();

                registry.populateFromCoreRules();
                const finalRuleCount = Object.keys(registry.rules).length;

                assert(finalRuleCount > 0);
                assert.include(Object.keys(registry.rules), "eqeqeq");
            });

            it("should not add duplicate rules", () => {
                const registry = new autoconfig.Registry(rulesConfig);

                registry.populateFromCoreRules();
                const semiCount = Object.keys(registry.rules).filter(ruleId => ruleId === "semi").length;

                assert.strictEqual(semiCount, 1);
            });
        });

        describe("buildRuleSets()", () => {
            let ruleSets;

            beforeEach(() => {
                const registry = new autoconfig.Registry(rulesConfig);

                ruleSets = registry.buildRuleSets();
            });

            it("should create an array of rule configuration sets", () => {
                assert.isArray(ruleSets);
            });

            it("should include configs for each rule (at least for the first set)", () => {
                assert.sameMembers(Object.keys(ruleSets[0]), ["semi", "semi-spacing", "quotes"]);
            });

            it("should create the first set from default rule configs (severity only)", () => {
                assert.deepStrictEqual(ruleSets[0], { semi: SEVERITY, "semi-spacing": SEVERITY, quotes: SEVERITY });
            });

            it("should create as many ruleSets as the highest number of configs in a rule", () => {

                // `quotes` has 7 possible configurations
                assert.lengthOf(ruleSets, 7);
            });
        });

        describe("lintSourceCode()", () => {
            let registry;

            beforeEach(() => {
                const config = { ignore: false };
                const sourceCode = sourceCodeUtils.getSourceCodeOfFiles(SOURCE_CODE_FIXTURE_FILENAME, config);

                registry = new autoconfig.Registry(rulesConfig);
                registry = registry.lintSourceCode(sourceCode, defaultOptions);
            });

            it("should populate the errorCount of all registryItems", () => {
                const expectedRules = ["semi", "semi-spacing", "quotes"];

                assert.sameMembers(Object.keys(registry.rules), expectedRules);
                expectedRules.forEach(ruleId => {
                    assert(registry.rules[ruleId].length > 0);
                    registry.rules[ruleId].forEach(conf => {
                        assert.isNumber(conf.errorCount);
                    });
                });
            });

            it("should correctly set the error count of configurations", () => {
                assert.strictEqual(registry.rules.semi[0].config, SEVERITY);
                assert.strictEqual(registry.rules.semi[0].errorCount, 0);
                assert.deepStrictEqual(registry.rules.semi[2].config, [SEVERITY, "never"]);
                assert.strictEqual(registry.rules.semi[2].errorCount, 3);
            });

            it("should respect inline eslint config comments (and not crash when they make linting errors)", () => {
                const config = { ignore: false };
                const sourceCode = sourceCodeUtils.getSourceCodeOfFiles(CONFIG_COMMENTS_FILENAME, config);
                const expectedRegistry = [
                    { config: 2, specificity: 1, errorCount: 3 },
                    { config: [2, "always"], specificity: 2, errorCount: 3 },
                    { config: [2, "never"], specificity: 2, errorCount: 3 }
                ];

                registry = new autoconfig.Registry(rulesConfig);
                registry = registry.lintSourceCode(sourceCode, defaultOptions);

                assert.deepStrictEqual(registry.rules.semi, expectedRegistry);
            });
        });

        describe("stripFailingConfigs()", () => {
            let registry;

            beforeEach(() => {
                const config = { ignore: false };
                const sourceCode = sourceCodeUtils.getSourceCodeOfFiles(SOURCE_CODE_FIXTURE_FILENAME, config);

                registry = new autoconfig.Registry(rulesConfig);
                registry = registry.lintSourceCode(sourceCode, defaultOptions);
                registry = registry.stripFailingConfigs();
            });

            it("should remove all registryItems with a non-zero errorCount", () => {
                assert.lengthOf(registry.rules.semi, 2);
                assert.lengthOf(registry.rules["semi-spacing"], 3);
                assert.lengthOf(registry.rules.quotes, 1);
                registry.rules.semi.forEach(registryItem => {
                    assert.strictEqual(registryItem.errorCount, 0);
                });
                registry.rules["semi-spacing"].forEach(registryItem => {
                    assert.strictEqual(registryItem.errorCount, 0);
                });
                registry.rules.quotes.forEach(registryItem => {
                    assert.strictEqual(registryItem.errorCount, 0);
                });
            });
        });

        describe("getFailingRulesRegistry()", () => {
            let failingRegistry;

            beforeEach(() => {
                const config = { ignore: false };
                const sourceCode = sourceCodeUtils.getSourceCodeOfFiles(SOURCE_CODE_FIXTURE_FILENAME, config);
                let registry = new autoconfig.Registry(errorRulesConfig);

                registry = registry.lintSourceCode(sourceCode, defaultOptions);
                failingRegistry = registry.getFailingRulesRegistry();
            });

            it("should return a registry with no registryItems with an errorCount of zero", () => {
                const failingRules = Object.keys(failingRegistry.rules);

                assert.deepStrictEqual(failingRules, ["no-unused-vars"]);
                assert.lengthOf(failingRegistry.rules["no-unused-vars"], 1);
                assert(failingRegistry.rules["no-unused-vars"][0].errorCount > 0);
            });
        });

        describe("createConfig()", () => {
            let createdConfig;

            beforeEach(() => {
                const config = { ignore: false };
                const sourceCode = sourceCodeUtils.getSourceCodeOfFiles(SOURCE_CODE_FIXTURE_FILENAME, config);
                let registry = new autoconfig.Registry(rulesConfig);

                registry = registry.lintSourceCode(sourceCode, defaultOptions);
                registry = registry.stripFailingConfigs();
                createdConfig = registry.createConfig();
            });

            it("should create a config with a rules property", () => {
                assert.property(createdConfig, "rules");
            });

            it("should add rules which have only one registryItem to the config", () => {
                const configuredRules = Object.keys(createdConfig.rules);

                assert.deepStrictEqual(configuredRules, ["quotes"]);
            });

            it("should set the configuration of the rule to the registryItem's `config` value", () => {
                assert.deepStrictEqual(createdConfig.rules.quotes, [2, "double", "avoid-escape"]);
            });

            it("should not care how many errors the config has", () => {
                const config = { ignore: false };
                const sourceCode = sourceCodeUtils.getSourceCodeOfFiles(SOURCE_CODE_FIXTURE_FILENAME, config);
                let registry = new autoconfig.Registry(errorRulesConfig);

                registry = registry.lintSourceCode(sourceCode, defaultOptions);
                const failingRegistry = registry.getFailingRulesRegistry();

                createdConfig = failingRegistry.createConfig();
                const configuredRules = Object.keys(createdConfig.rules);

                assert.deepStrictEqual(configuredRules, ["no-unused-vars"]);
            });
        });

        describe("filterBySpecificity()", () => {
            let registry;

            beforeEach(() => {
                registry = new autoconfig.Registry(rulesConfig);
            });

            it("should return a registry where all configs have a desired specificity", () => {
                const filteredRegistry1 = registry.filterBySpecificity(1);
                const filteredRegistry2 = registry.filterBySpecificity(2);
                const filteredRegistry3 = registry.filterBySpecificity(3);

                assert.lengthOf(filteredRegistry1.rules.semi, 1);
                assert.lengthOf(filteredRegistry1.rules["semi-spacing"], 1);
                assert.lengthOf(filteredRegistry1.rules.quotes, 1);
                assert.lengthOf(filteredRegistry2.rules.semi, 2);
                assert.lengthOf(filteredRegistry2.rules["semi-spacing"], 4);
                assert.lengthOf(filteredRegistry2.rules.quotes, 3);
                assert.lengthOf(filteredRegistry3.rules.quotes, 3);
            });
        });
    });
});
