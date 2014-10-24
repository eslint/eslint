/**
 * @fileoverview Tests for CLIEngine.
 * @author Nicholas C. Zakas
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    proxyquire = require("proxyquire"),
    sinon = require("sinon"),
    rules = require("../../lib/rules"),
    Config = require("../../lib/config");

require("shelljs/global");
proxyquire = proxyquire.noCallThru().noPreserveCache();

/*global tempdir, mkdir, rm, cp*/

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("CLIEngine", function() {

    var examplePluginName = "eslint-plugin-example",
        requireStubs = {},
        examplePlugin = { rules: { "example-rule": require("../fixtures/rules/custom-rule") } },
        CLIEngine;

    requireStubs[examplePluginName] = examplePlugin;

    beforeEach(function () {
        CLIEngine = proxyquire("../../lib/cli-engine", requireStubs);
    });

    describe("executeOnText()", function() {

        var engine;

        it("should report three messages when using local cwd .eslintrc", function() {

            engine = new CLIEngine();

            var report = engine.executeOnText("var foo = 'bar';");
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 3);
            assert.equal(report.results[0].messages[0].ruleId, "eol-last");
            assert.equal(report.results[0].messages[1].ruleId, "no-unused-vars");
            assert.equal(report.results[0].messages[2].ruleId, "quotes");
        });

        it("should report one message when using specific config file", function() {

            engine = new CLIEngine({
                configFile: "tests/fixtures/configurations/quotes-error.json",
                reset: true
            });

            var report = engine.executeOnText("var foo = 'bar';");
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 1);
            assert.equal(report.results[0].messages[0].ruleId, "quotes");
        });

    });

    describe("executeOnFiles()", function() {

        var engine;

        it("should report zero messages when given a config file and a valid file", function() {

            engine = new CLIEngine({
                // configFile: path.join(__dirname, "..", "..", ".eslintrc")
            });

            var report = engine.executeOnFiles(["lib/cli.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return one error message when given a config with rules with options and severity level set to error", function() {

            engine = new CLIEngine({
                configFile: "tests/fixtures/configurations/quotes-error.json",
                reset: true
            });

            var report = engine.executeOnFiles(["tests/fixtures/single-quoted.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 1);
            assert.equal(report.results[0].messages[0].ruleId, "quotes");
            assert.equal(report.results[0].messages[0].severity, 2);
        });

        it("should return two messages when given a config file and a directory of files", function() {

            engine = new CLIEngine({
                configFile: "tests/fixtures/configurations/semi-error.json",
                reset: true
            });

            var report = engine.executeOnFiles(["tests/fixtures/formatters"]);
            assert.equal(report.results.length, 2);
            assert.equal(report.results[0].messages.length, 0);
            assert.equal(report.results[1].messages.length, 0);
        });

        it("should return zero messages when given a config with environment set to browser", function() {

            engine = new CLIEngine({
                configFile: "tests/fixtures/configurations/env-browser.json",
                reset: true
            });

            var report = engine.executeOnFiles(["tests/fixtures/globals-browser.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages when given an option to set environment to browser", function() {

            engine = new CLIEngine({
                envs: ["browser"],
                rules: {
                    "no-undef": 2
                },
                reset: true
            });

            var report = engine.executeOnFiles(["tests/fixtures/globals-browser.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages when given a config with environment set to Node.js", function() {

            engine = new CLIEngine({
                configFile: "tests/fixtures/configurations/env-node.json",
                reset: true
            });

            var report = engine.executeOnFiles(["tests/fixtures/globals-node.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should not return results from previous call when calling more than once", function() {

            engine = new CLIEngine({
                ignore: false,
                reset: true,
                rules: {
                    semi: 2
                }
            });

            var report = engine.executeOnFiles(["tests/fixtures/missing-semicolon.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "tests/fixtures/missing-semicolon.js");
            assert.equal(report.results[0].messages.length, 1);
            assert.equal(report.results[0].messages[0].ruleId, "semi");
            assert.equal(report.results[0].messages[0].severity, 2);


            report = engine.executeOnFiles(["tests/fixtures/passing.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "tests/fixtures/passing.js");
            assert.equal(report.results[0].messages.length, 0);

        });

        it("should return zero messages when given a directory with eslint excluded files in the directory", function() {

            engine = new CLIEngine({
                ignorePath: "tests/fixtures/.eslintignore"
            });

            var report = engine.executeOnFiles(["tests/fixtures/"]);
            assert.equal(report.results.length, 0);
        });

        it("should return zero messages when given a file in excluded files list", function() {

            engine = new CLIEngine({
                ignorePath: "tests/fixtures/.eslintignore"
            });

            var report = engine.executeOnFiles(["tests/fixtures/passing"]);
            assert.equal(report.results.length, 0);

        });

        it("should return two messages when given a file in excluded files list while ignore is off", function() {

            engine = new CLIEngine({
                ignorePath: "tests/fixtures/.eslintignore",
                ignore: false,
                reset: true,
                rules: {
                    "no-undef": 2
                }
            });

            var report = engine.executeOnFiles(["tests/fixtures/undef.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "tests/fixtures/undef.js");
            assert.equal(report.results[0].messages[0].ruleId, "no-undef");
            assert.equal(report.results[0].messages[0].severity, 2);
            assert.equal(report.results[0].messages[1].ruleId, "no-undef");
            assert.equal(report.results[0].messages[1].severity, 2);
        });

        it("should return zero messages when executing a file with a shebang", function() {

            engine = new CLIEngine({
                ignore: false,
                reset: true
            });

            var report = engine.executeOnFiles(["tests/fixtures/shebang.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });


        it("should thrown an error when loading a custom rule that doesn't exist", function() {

            engine = new CLIEngine({
                ignore: false,
                reset: true,
                rulesPaths: ["./tests/fixtures/rules/wrong"],
                configFile: "./tests/fixtures/rules/eslint.json"
            });


            assert.throws(function() {
                engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);
            }, /Definition for rule 'custom-rule' was not found/);

        });

        it("should thrown an error when loading a custom rule that doesn't exist", function() {

            engine = new CLIEngine({
                ignore: false,
                reset: true,
                rulePaths: ["./tests/fixtures/rules/wrong"],
                configFile: "./tests/fixtures/rules/eslint.json"
            });


            assert.throws(function() {
                engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);
            }, /Error while loading rule 'custom-rule'/);
        });

        it("should return one message when a custom rule matches a file", function() {

            engine = new CLIEngine({
                ignore: false,
                reset: true,
                useEslintrc: false,
                rulePaths: ["./tests/fixtures/rules/"],
                configFile: "./tests/fixtures/rules/eslint.json"
            });

            var report = engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "tests/fixtures/rules/test/test-custom-rule.js");
            assert.equal(report.results[0].messages.length, 2);
            assert.equal(report.results[0].messages[0].ruleId, "custom-rule");
            assert.equal(report.results[0].messages[0].severity, 1);
        });

        it("should return messages when multiple custom rules match a file", function() {

            engine = new CLIEngine({
                ignore: false,
                reset: true,
                rulePaths: [
                    "./tests/fixtures/rules/dir1",
                    "./tests/fixtures/rules/dir2"
                ],
                configFile: "./tests/fixtures/rules/multi-rulesdirs.json"
            });

            var report = engine.executeOnFiles(["tests/fixtures/rules/test-multi-rulesdirs.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "tests/fixtures/rules/test-multi-rulesdirs.js");
            assert.equal(report.results[0].messages.length, 2);
            assert.equal(report.results[0].messages[0].ruleId, "no-literals");
            assert.equal(report.results[0].messages[0].severity, 2);
            assert.equal(report.results[0].messages[1].ruleId, "no-strings");
            assert.equal(report.results[0].messages[1].severity, 2);
        });

        it("should return zero messages when executing with reset flag", function() {

            engine = new CLIEngine({
                ignore: false,
                reset: true,
                useEslintrc: false
            });

            var report = engine.executeOnFiles(["./tests/fixtures/missing-semicolon.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "./tests/fixtures/missing-semicolon.js");
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages when executing with reset flag in Node.js environment", function() {

            engine = new CLIEngine({
                ignore: false,
                reset: true,
                useEslintrc: false,
                envs: ["node"]
            });

            var report = engine.executeOnFiles(["./tests/fixtures/process-exit.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "./tests/fixtures/process-exit.js");
            assert.equal(report.results[0].messages.length, 0);
        });


        it("should return zero messages and ignore local config file when executing with no-eslintrc flag", function () {

            engine = new CLIEngine({
                ignore: false,
                reset: true,
                useEslintrc: false,
                envs: ["node"]
            });

            var report = engine.executeOnFiles(["./tests/fixtures/eslintrc/quotes.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "./tests/fixtures/eslintrc/quotes.js");
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages when executing with local config file", function () {

            engine = new CLIEngine({
                ignore: false,
                reset: true
            });

            var report = engine.executeOnFiles(["./tests/fixtures/eslintrc/quotes.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "./tests/fixtures/eslintrc/quotes.js");
            assert.equal(report.results[0].messages.length, 1);
        });

        // These tests have to do with https://github.com/eslint/eslint/issues/963

        describe("configuration hierarchy", function() {

            var fixtureDir;

            // copy into clean area so as not to get "infected" by this project's .eslintrc files
            before(function() {
                fixtureDir = tempdir() + "/eslint/fixtures";
                mkdir("-p", fixtureDir);
                cp("-r", "./tests/fixtures/config-hierarchy", fixtureDir);
            });

            after(function() {
                rm("-r", fixtureDir);
            });

            // Default configuration - blank
            it("should return zero messages when executing with reset and no .eslintrc", function () {

                engine = new CLIEngine({
                    reset: true,
                    useEslintrc: false
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Default configuration - conf/eslint.json
            it("should return one message when executing with no .eslintrc", function () {

                engine = new CLIEngine({
                    useEslintrc: false
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 3);
                assert.equal(report.results[0].messages[0].ruleId, "no-undef");
                assert.equal(report.results[0].messages[0].severity, 2);
                assert.equal(report.results[0].messages[1].ruleId, "no-console");
                assert.equal(report.results[0].messages[1].severity, 2);
                assert.equal(report.results[0].messages[2].ruleId, "quotes");
                assert.equal(report.results[0].messages[2].severity, 2);
            });

            // Default configuration - conf/environments.json (/*eslint-env node*/)
            it("should return one message when executing with no .eslintrc in the Node.js environment", function () {

                engine = new CLIEngine({
                    useEslintrc: false
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/console-wrong-quotes-node.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 2);
            });

            // Project configuration - first level .eslintrc
            it("should return one message when executing with .eslintrc in the Node.js environment", function () {

                engine = new CLIEngine();

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/process-exit.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "no-process-exit");
                assert.equal(report.results[0].messages[0].severity, 2);
            });

            // Project configuration - first level .eslintrc
            it("should return zero messages when executing with .eslintrc in the Node.js environment and reset", function () {

                engine = new CLIEngine({
                    reset: true
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/process-exit.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Project configuration - first level .eslintrc
            it("should return one message when executing with .eslintrc", function () {

                engine = new CLIEngine({
                    reset: true
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 2);
            });

            // Project configuration - package.json (TODO)

            // Project configuration - second level .eslintrc
            it("should return one message when executing with local .eslintrc that overrides parent .eslintrc", function () {

                engine = new CLIEngine({
                    reset: true
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/subbroken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "no-console");
                assert.equal(report.results[0].messages[0].severity, 1);
            });

            // Project configuration - third level .eslintrc
            it("should return one message when executing with local .eslintrc that overrides parent and grandparent .eslintrc", function () {

                engine = new CLIEngine({
                    reset: true
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/subbroken/subsubbroken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 1);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should return two messages when executing with config file that adds to local .eslintrc", function () {

                engine = new CLIEngine({
                    reset: true,
                    configFile: fixtureDir + "/config-hierarchy/broken/add-conf.yaml"
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 2);
                assert.equal(report.results[0].messages[1].ruleId, "semi");
                assert.equal(report.results[0].messages[1].severity, 1);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should return no messages when executing with config file that overrides local .eslintrc", function () {

                engine = new CLIEngine({
                    reset: true,
                    configFile: fixtureDir + "/config-hierarchy/broken/override-conf.yaml"
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Command line configuration - --config with second level .eslintrc
            it("should return two messages when executing with config file that adds to local and parent .eslintrc", function () {

                engine = new CLIEngine({
                    reset: true,
                    configFile: fixtureDir + "/config-hierarchy/broken/add-conf.yaml"
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/subbroken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "no-console");
                assert.equal(report.results[0].messages[0].severity, 1);
                assert.equal(report.results[0].messages[1].ruleId, "semi");
                assert.equal(report.results[0].messages[1].severity, 1);
            });

            // Command line configuration - --config with second level .eslintrc
            it("should return one message when executing with config file that overrides local and parent .eslintrc", function () {

                engine = new CLIEngine({
                    reset: true,
                    configFile: fixtureDir + "/config-hierarchy/broken/override-conf.yaml"
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/subbroken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "no-console");
                assert.equal(report.results[0].messages[0].severity, 1);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should return no messages when executing with config file that overrides local .eslintrc", function () {

                engine = new CLIEngine({
                    reset: true,
                    configFile: fixtureDir + "/config-hierarchy/broken/override-conf.yaml"
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Command line configuration - --rule with --config and first level .eslintrc
            it("should return one message when executing with command line rule and config file that overrides local .eslintrc", function () {

                engine = new CLIEngine({
                    reset: true,
                    configFile: fixtureDir + "/config-hierarchy/broken/override-conf.yaml",
                    rules: {
                        quotes: [1, "double"]
                    }
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 1);
            });

            // Command line configuration - --rule with --config and first level .eslintrc
            it("should return one message when executing with command line rule and config file that overrides local .eslintrc", function () {

                engine = new CLIEngine({
                    reset: true,
                    configFile: fixtureDir + "/config-hierarchy/broken/override-conf.yaml",
                    rules: {
                        quotes: [1, "double"]
                    }
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 1);
            });

        });

        describe("plugins", function () {
            it("should return two messages when executing with config file that specifies a plugin", function () {
                engine = new CLIEngine({
                    configFile: "./tests/fixtures/configurations/plugins-with-prefix.json",
                    reset: true,
                    useEslintrc: false
                });

                var report = engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with config file that specifies a plugin without prefix", function () {
                engine = new CLIEngine({
                    configFile: "./tests/fixtures/configurations/plugins-without-prefix.json",
                    reset: true,
                    useEslintrc: false
                });

                var report = engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should import the same plugin only once if it is configured multiple times", sinon.test(function () {
                var importPlugin = this.spy(rules, "import");

                engine = new CLIEngine({
                    configFile: "./tests/fixtures/configurations/plugins-with-prefix.json",
                    reset: true,
                    useEslintrc: false
                });

                engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);
                engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);

                assert.equal(importPlugin.calledOnce, true, "same plugin was imported more than once");
                assert.equal(importPlugin.calledWithExactly(examplePlugin.rules, "example"), true);
            }));

            it("should return two messages when executing with cli option that specifies a plugin", function () {
                engine = new CLIEngine({
                    reset: true,
                    useEslintrc: false,
                    plugins: ["example"],
                    rules: { "example/example-rule": 1 }
                });

                var report = engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "example/example-rule");
            });
        });

    });

    describe("getConfigForFile", function() {

        it("should return the info from Config#getConfig when called", function() {

            var engine = new CLIEngine({
                configFile: "tests/fixtures/configurations/quotes-error.json",
                reset: true
            });

            var configHelper = new Config(engine.options);

            assert.deepEqual(
                engine.getConfigForFile("tests/fixtures/single-quoted.js"),
                configHelper.getConfig("tests/fixtures/single-quoted.js")
            );

        });

    });

});
