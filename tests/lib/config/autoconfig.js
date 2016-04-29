/**
 * @fileoverview Used for creating a suggested configuration based on project code.
 * @author Ian VanSchooten
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var lodash = require("lodash"),
    assert = require("chai").assert,
    autoconfig = require("../../../lib/config/autoconfig"),
    sourceCodeUtil = require("../../../lib/util/source-code-util"),
    defaultOptions = require("../../../conf/cli-options");

defaultOptions = lodash.assign({}, defaultOptions, {cwd: process.cwd()});

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

var SOURCE_CODE_FIXTURE_FILENAME = "./tests/fixtures/autoconfig/source.js";
var CONFIG_COMMENTS_FILENAME = "./tests/fixtures/autoconfig/source-with-comments.js";
var SEVERITY = 2;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var rulesConfig = {
    semi: [ SEVERITY, [SEVERITY, "always"], [SEVERITY, "never"] ],
    "semi-spacing": [ SEVERITY,
        [ SEVERITY, { before: true, after: true } ],
        [ SEVERITY, { before: true, after: false } ],
        [ SEVERITY, { before: false, after: true } ],
        [ SEVERITY, { before: false, after: false } ]
    ],
    quotes: [ SEVERITY,
        [ SEVERITY, "single" ],
        [ SEVERITY, "double" ],
        [ SEVERITY, "backtick" ],
        [ SEVERITY, "single", "avoid-escape" ],
        [ SEVERITY, "double", "avoid-escape" ],
        [ SEVERITY, "backtick", "avoid-escape" ] ]
};

var errorRulesConfig = {
    "no-unused-vars": [ SEVERITY ],
    "semi-spacing": [ SEVERITY,
        [ SEVERITY, { before: true, after: true } ],
        [ SEVERITY, { before: true, after: false } ],
        [ SEVERITY, { before: false, after: true } ],
        [ SEVERITY, { before: false, after: false } ]
    ]
};

describe("autoconfig", function() {

    describe("Registry", function() {

        it("should set up a registry for rules in a provided rulesConfig", function() {
            var expectedRules = Object.keys(rulesConfig);
            var registry = new autoconfig.Registry(rulesConfig);

            assert.equal(Object.keys(registry.rules).length, 3);
            assert.sameMembers(Object.keys(registry.rules), expectedRules);
            assert.isArray(registry.rules.semi);
            assert.isArray(registry.rules["semi-spacing"]);
            assert.isArray(registry.rules.quotes);
            assert.lengthOf(registry.rules.semi, 3);
            assert.lengthOf(registry.rules["semi-spacing"], 5);
            assert.lengthOf(registry.rules.quotes, 7);
        });

        it("should not have any rules if constructed without a config argument", function() {
            var registry = new autoconfig.Registry();

            assert.isObject(registry.rules);
            assert.lengthOf(Object.keys(registry.rules), 0);
        });

        it("should create registryItems for each rule with the proper keys", function() {
            var registry = new autoconfig.Registry(rulesConfig);

            assert.isObject(registry.rules.semi[0]);
            assert.isObject(registry.rules["semi-spacing"][0]);
            assert.isObject(registry.rules.quotes[0]);
            assert.property(registry.rules.semi[0], "config");
            assert.property(registry.rules.semi[0], "specificity");
            assert.property(registry.rules.semi[0], "errorCount");
        });

        it("should populate the config property correctly", function() {
            var registry = new autoconfig.Registry(rulesConfig);

            assert.equal(registry.rules.quotes[0].config, SEVERITY);
            assert.deepEqual(registry.rules.quotes[1].config, [SEVERITY, "single"]);
            assert.deepEqual(registry.rules.quotes[2].config, [SEVERITY, "double"]);
            assert.deepEqual(registry.rules.quotes[3].config, [SEVERITY, "backtick"]);
            assert.deepEqual(registry.rules.quotes[4].config, [SEVERITY, "single", "avoid-escape"]);
            assert.deepEqual(registry.rules.quotes[5].config, [SEVERITY, "double", "avoid-escape"]);
            assert.deepEqual(registry.rules.quotes[6].config, [SEVERITY, "backtick", "avoid-escape"]);
        });

        it("should assign the correct specificity", function() {
            var registry = new autoconfig.Registry(rulesConfig);

            assert.equal(registry.rules.quotes[0].specificity, 1);
            assert.equal(registry.rules.quotes[1].specificity, 2);
            assert.equal(registry.rules.quotes[6].specificity, 3);
        });

        it("should initially leave the errorCount as undefined", function() {
            var registry = new autoconfig.Registry(rulesConfig);

            assert.isUndefined(registry.rules.quotes[0].errorCount);
            assert.isUndefined(registry.rules.quotes[1].errorCount);
            assert.isUndefined(registry.rules.quotes[6].errorCount);
        });

        describe("populateFromCoreRules()", function() {

            it("should add core rules to registry", function() {
                var registry = new autoconfig.Registry();

                registry.populateFromCoreRules();
                var finalRuleCount = Object.keys(registry.rules).length;

                assert(finalRuleCount > 0);
                assert.include(Object.keys(registry.rules), "eqeqeq");
            });

            it("should not add duplicate rules", function() {
                var registry = new autoconfig.Registry(rulesConfig);

                registry.populateFromCoreRules();
                var semiCount = Object.keys(registry.rules).filter(function(ruleId) {
                    return ruleId === "semi";
                }).length;

                assert.equal(semiCount, 1);
            });
        });

        describe("buildRuleSets()", function() {
            var ruleSets;

            beforeEach(function() {
                var registry = new autoconfig.Registry(rulesConfig);

                ruleSets = registry.buildRuleSets();
            });

            it("should create an array of rule configuration sets", function() {
                assert.isArray(ruleSets);
            });

            it("should include configs for each rule (at least for the first set)", function() {
                assert.sameMembers(Object.keys(ruleSets[0]), ["semi", "semi-spacing", "quotes"]);
            });

            it("should create the first set from default rule configs (severity only)", function() {
                assert.deepEqual(ruleSets[0], { semi: SEVERITY, "semi-spacing": SEVERITY, quotes: SEVERITY });
            });

            it("should create as many ruleSets as the highest number of configs in a rule", function() {

                // `quotes` has 7 possible configurations
                assert.lengthOf(ruleSets, 7);
            });
        });

        describe("lintSourceCode()", function() {
            var registry;

            beforeEach(function() {
                var config = {ignore: false};
                var sourceCode = sourceCodeUtil.getSourceCodeOfFiles(SOURCE_CODE_FIXTURE_FILENAME, config);

                registry = new autoconfig.Registry(rulesConfig);
                registry = registry.lintSourceCode(sourceCode, defaultOptions);
            });

            it("should populate the errorCount of all registryItems", function() {
                var expectedRules = ["semi", "semi-spacing", "quotes"];

                assert.sameMembers(Object.keys(registry.rules), expectedRules);
                expectedRules.forEach(function(ruleId) {
                    assert(registry.rules[ruleId].length > 0);
                    registry.rules[ruleId].forEach(function(conf) {
                        assert.isNumber(conf.errorCount);
                    });
                });
            });

            it("should correctly set the error count of configurations", function() {
                assert.equal(registry.rules.semi[0].config, SEVERITY);
                assert.equal(registry.rules.semi[0].errorCount, 0);
                assert.deepEqual(registry.rules.semi[2].config, [SEVERITY, "never"]);
                assert.equal(registry.rules.semi[2].errorCount, 3);
            });

            it("should respect inline eslint config comments (and not crash when they make linting errors)", function() {
                var config = {ignore: false};
                var sourceCode = sourceCodeUtil.getSourceCodeOfFiles(CONFIG_COMMENTS_FILENAME, config);
                var expectedRegistry = [
                    { config: 2, specificity: 1, errorCount: 3 },
                    { config: [ 2, "always" ], specificity: 2, errorCount: 3 },
                    { config: [ 2, "never" ], specificity: 2, errorCount: 3 }
                ];

                registry = new autoconfig.Registry(rulesConfig);
                registry = registry.lintSourceCode(sourceCode, defaultOptions);

                assert.deepEqual(registry.rules.semi, expectedRegistry);
            });
        });

        describe("stripFailingConfigs()", function() {
            var registry;

            beforeEach(function() {
                var config = {ignore: false};
                var sourceCode = sourceCodeUtil.getSourceCodeOfFiles(SOURCE_CODE_FIXTURE_FILENAME, config);

                registry = new autoconfig.Registry(rulesConfig);
                registry = registry.lintSourceCode(sourceCode, defaultOptions);
                registry = registry.stripFailingConfigs();
            });

            it("should remove all registryItems with a non-zero errorCount", function() {
                assert.lengthOf(registry.rules.semi, 2);
                assert.lengthOf(registry.rules["semi-spacing"], 3);
                assert.lengthOf(registry.rules.quotes, 1);
                registry.rules.semi.forEach(function(registryItem) {
                    assert.equal(registryItem.errorCount, 0);
                });
                registry.rules["semi-spacing"].forEach(function(registryItem) {
                    assert.equal(registryItem.errorCount, 0);
                });
                registry.rules.quotes.forEach(function(registryItem) {
                    assert.equal(registryItem.errorCount, 0);
                });
            });
        });

        describe("getFailingRulesRegistry()", function() {
            var failingRegistry;

            beforeEach(function() {
                var config = {ignore: false};
                var sourceCode = sourceCodeUtil.getSourceCodeOfFiles(SOURCE_CODE_FIXTURE_FILENAME, config);
                var registry = new autoconfig.Registry(errorRulesConfig);

                registry = registry.lintSourceCode(sourceCode, defaultOptions);
                failingRegistry = registry.getFailingRulesRegistry();
            });

            it("should return a registry with no registryItems with an errorCount of zero", function() {
                var failingRules = Object.keys(failingRegistry.rules);

                assert.deepEqual(failingRules, ["no-unused-vars"]);
                assert.lengthOf(failingRegistry.rules["no-unused-vars"], 1);
                assert(failingRegistry.rules["no-unused-vars"][0].errorCount > 0);
            });
        });

        describe("createConfig()", function() {
            var createdConfig;

            beforeEach(function() {
                var config = {ignore: false};
                var sourceCode = sourceCodeUtil.getSourceCodeOfFiles(SOURCE_CODE_FIXTURE_FILENAME, config);
                var registry = new autoconfig.Registry(rulesConfig);

                registry = registry.lintSourceCode(sourceCode, defaultOptions);
                registry = registry.stripFailingConfigs();
                createdConfig = registry.createConfig();
            });

            it("should create a config with a rules property", function() {
                assert.property(createdConfig, "rules");
            });

            it("should add rules which have only one registryItem to the config", function() {
                var configuredRules = Object.keys(createdConfig.rules);

                assert.deepEqual(configuredRules, ["quotes"]);
            });

            it("should set the configuration of the rule to the registryItem's `config` value", function() {
                assert.deepEqual(createdConfig.rules.quotes, [ 2, "double", "avoid-escape" ]);
            });

            it("should not care how many errors the config has", function() {
                var config = {ignore: false};
                var sourceCode = sourceCodeUtil.getSourceCodeOfFiles(SOURCE_CODE_FIXTURE_FILENAME, config);
                var registry = new autoconfig.Registry(errorRulesConfig);

                registry = registry.lintSourceCode(sourceCode, defaultOptions);
                var failingRegistry = registry.getFailingRulesRegistry();

                createdConfig = failingRegistry.createConfig();
                var configuredRules = Object.keys(createdConfig.rules);

                assert.deepEqual(configuredRules, ["no-unused-vars"]);
            });
        });

        describe("filterBySpecificity()", function() {
            var registry;

            beforeEach(function() {
                registry = new autoconfig.Registry(rulesConfig);
            });

            it("should return a registry where all configs have a desired specificity", function() {
                var filteredRegistry1 = registry.filterBySpecificity(1);
                var filteredRegistry2 = registry.filterBySpecificity(2);
                var filteredRegistry3 = registry.filterBySpecificity(3);

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
