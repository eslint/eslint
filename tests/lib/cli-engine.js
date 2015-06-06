/**
 * @fileoverview Tests for CLIEngine.
 * @author Nicholas C. Zakas
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    proxyquire = require("proxyquire"),
    sinon = require("sinon"),
    rules = require("../../lib/rules"),
    path = require("path"),
    Config = require("../../lib/config");

require("shelljs/global");
proxyquire = proxyquire.noCallThru().noPreserveCache();

/*global tempdir, mkdir, rm, cp*/

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("CLIEngine", function() {

    var examplePluginName = "eslint-plugin-example",
        examplePluginNameWithNamespace = "@eslint/eslint-plugin-example",
        requireStubs = {},
        examplePlugin = { rules: { "example-rule": require("../fixtures/rules/custom-rule") } },
        CLIEngine,
        examplePreprocessorName = "eslint-plugin-processor";

    requireStubs[examplePluginName] = examplePlugin;
    requireStubs[examplePluginNameWithNamespace] = examplePlugin;
    requireStubs[examplePreprocessorName] = require("../fixtures/processors/custom-processor");

    beforeEach(function() {
        CLIEngine = proxyquire("../../lib/cli-engine", requireStubs);
    });

    describe("executeOnText()", function() {

        var engine;

        it("should report one message when using local cwd .eslintrc", function() {

            engine = new CLIEngine();

            var report = engine.executeOnText("var foo = 'bar';");
            assert.equal(report.results.length, 1);
            assert.equal(report.errorCount, 4);
            assert.equal(report.warningCount, 0);
            assert.equal(report.results[0].messages.length, 4);
            assert.equal(report.results[0].messages[0].ruleId, "strict");
            assert.equal(report.results[0].messages[1].ruleId, "eol-last");
            assert.equal(report.results[0].messages[2].ruleId, "no-unused-vars");
            assert.equal(report.results[0].messages[3].ruleId, "quotes");
        });

        it("should report one message when using specific config file", function() {

            engine = new CLIEngine({
                configFile: "tests/fixtures/configurations/quotes-error.json",
                useEslintrc: false
            });

            var report = engine.executeOnText("var foo = 'bar';");
            assert.equal(report.results.length, 1);
            assert.equal(report.errorCount, 1);
            assert.equal(report.warningCount, 0);
            assert.equal(report.results[0].messages.length, 1);
            assert.equal(report.results[0].messages[0].ruleId, "quotes");
            assert.equal(report.results[0].errorCount, 1);
            assert.equal(report.results[0].warningCount, 0);
        });

        it("should report the filename when passed in", function() {

            engine = new CLIEngine();

            var report = engine.executeOnText("var foo = 'bar';", "test.js");
            assert.equal(report.results[0].filePath, "test.js");
        });

        it("should return a warning when given a filename by --stdin-filename in excluded files list", function() {
            engine = new CLIEngine({
                ignorePath: "tests/fixtures/.eslintignore"
            });

            var report = engine.executeOnText("var bar = foo;", "tests/fixtures/passing.js");

            assert.equal(report.results.length, 1);
            assert.equal(report.errorCount, 0);
            assert.equal(report.warningCount, 1);
            assert.equal(report.results[0].filePath, "tests/fixtures/passing.js");
            assert.equal(report.results[0].messages[0].severity, 1);
            assert.equal(report.results[0].messages[0].message, "File ignored because of your .eslintignore file. Use --no-ignore to override.");
            assert.equal(report.results[0].errorCount, 0);
            assert.equal(report.results[0].warningCount, 1);
        });

        it("should return a message when given a filename by --stdin-filename in excluded files list and ignore is off", function() {

            engine = new CLIEngine({
                ignorePath: "tests/fixtures/.eslintignore",
                ignore: false,
                useEslintrc: false,
                rules: {
                    "no-undef": 2
                }
            });

            var report = engine.executeOnText("var bar = foo;", "tests/fixtures/passing.js");
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "tests/fixtures/passing.js");
            assert.equal(report.results[0].messages[0].ruleId, "no-undef");
            assert.equal(report.results[0].messages[0].severity, 2);
        });

    });

    describe("executeOnFiles()", function() {

        var engine;

        it("should report zero messages when given a config file and a valid file", function() {

            engine = new CLIEngine({
                configFile: path.join(__dirname, "..", "..", ".eslintrc")
            });

            var report = engine.executeOnFiles(["lib/cli.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should report zero messages when given a directory with a .js2 file", function() {

            engine = new CLIEngine({
                extensions: [".js2"]
            });

            var report = engine.executeOnFiles(["tests/fixtures/files/"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should report zero messages when given a directory with a .js and a .js2 file", function() {

            engine = new CLIEngine({
                extensions: [".js", ".js2"]
            });

            var report = engine.executeOnFiles(["tests/fixtures/files/"]);
            assert.equal(report.results.length, 2);
            assert.equal(report.results[0].messages.length, 0);
            assert.equal(report.results[1].messages.length, 0);
        });

        it("should return one error message when given a config with rules with options and severity level set to error", function() {

            engine = new CLIEngine({
                configFile: "tests/fixtures/configurations/quotes-error.json"
            });

            var report = engine.executeOnFiles(["tests/fixtures/single-quoted.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 1);
            assert.equal(report.errorCount, 1);
            assert.equal(report.warningCount, 0);
            assert.equal(report.results[0].messages[0].ruleId, "quotes");
            assert.equal(report.results[0].messages[0].severity, 2);
            assert.equal(report.results[0].errorCount, 1);
            assert.equal(report.results[0].warningCount, 0);
        });

        it("should return two messages when given a config file and a directory of files", function() {

            engine = new CLIEngine({
                configFile: "tests/fixtures/configurations/semi-error.json"
            });

            var report = engine.executeOnFiles(["tests/fixtures/formatters"]);
            assert.equal(report.results.length, 2);
            assert.equal(report.errorCount, 0);
            assert.equal(report.warningCount, 0);
            assert.equal(report.results[0].messages.length, 0);
            assert.equal(report.results[1].messages.length, 0);
            assert.equal(report.results[0].errorCount, 0);
            assert.equal(report.results[0].warningCount, 0);
            assert.equal(report.results[1].errorCount, 0);
            assert.equal(report.results[1].warningCount, 0);
        });

        it("should return zero messages when given a config with environment set to browser", function() {

            engine = new CLIEngine({
                configFile: "tests/fixtures/configurations/env-browser.json"
            });

            var report = engine.executeOnFiles(["tests/fixtures/globals-browser.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages when given an option to set environment to browser", function() {

            engine = new CLIEngine({
                envs: ["browser"],
                rules: {
                    "no-alert": 0,
                    "no-undef": 2
                }
            });

            var report = engine.executeOnFiles(["tests/fixtures/globals-browser.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages when given a config with environment set to Node.js", function() {

            engine = new CLIEngine({
                configFile: "tests/fixtures/configurations/env-node.json"
            });

            var report = engine.executeOnFiles(["tests/fixtures/globals-node.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should not return results from previous call when calling more than once", function() {

            engine = new CLIEngine({
                ignore: false,
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

        it("should return zero messages when all given files are ignored", function() {
            engine = new CLIEngine({
                ignorePath: "tests/fixtures/.eslintignore"
            });

            var report = engine.executeOnFiles(["tests/fixtures/"]);
            assert.equal(report.results.length, 0);
        });

        it("should return a warning when an explicitly given file is ignored", function() {
            engine = new CLIEngine({
                ignorePath: "tests/fixtures/.eslintignore"
            });

            var report = engine.executeOnFiles(["tests/fixtures/passing.js"]);

            assert.equal(report.results.length, 1);
            assert.equal(report.errorCount, 0);
            assert.equal(report.warningCount, 1);
            assert.equal(report.results[0].filePath, "tests/fixtures/passing.js");
            assert.equal(report.results[0].messages[0].severity, 1);
            assert.equal(report.results[0].messages[0].message, "File ignored because of your .eslintignore file. Use --no-ignore to override.");
            assert.equal(report.results[0].errorCount, 0);
            assert.equal(report.results[0].warningCount, 1);
        });

        it("should return two messages when given a file in excluded files list while ignore is off", function() {

            engine = new CLIEngine({
                ignorePath: "tests/fixtures/.eslintignore",
                ignore: false,
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
                ignore: false
            });

            var report = engine.executeOnFiles(["tests/fixtures/shebang.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });


        it("should give a warning when loading a custom rule that doesn't exist", function() {

            engine = new CLIEngine({
                ignore: false,
                rulesPaths: ["./tests/fixtures/rules/dir1"],
                configFile: "./tests/fixtures/rules/missing-rule.json"
            });
            var report = engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 2);
            assert.equal(report.results[0].messages[0].ruleId, "missing-rule");
            assert.equal(report.results[0].messages[0].severity, 1);
            assert.equal(report.results[0].messages[0].message, "Definition for rule \'missing-rule\' was not found");


        });

        it("should throw an error when loading a bad custom rule", function() {

            engine = new CLIEngine({
                ignore: false,
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

        it("should return zero messages when executing without useEslintrc flag", function() {

            engine = new CLIEngine({
                ignore: false,
                useEslintrc: false
            });

            var report = engine.executeOnFiles(["./tests/fixtures/missing-semicolon.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "./tests/fixtures/missing-semicolon.js");
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages when executing without useEslintrc flag in Node.js environment", function() {

            engine = new CLIEngine({
                ignore: false,
                useEslintrc: false,
                envs: ["node"]
            });

            var report = engine.executeOnFiles(["./tests/fixtures/process-exit.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "./tests/fixtures/process-exit.js");
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages when executing with base-config flag set to false", function() {

            engine = new CLIEngine({
                ignore: false,
                baseConfig: false,
                useEslintrc: false
            });

            var report = engine.executeOnFiles(["./tests/fixtures/missing-semicolon.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "./tests/fixtures/missing-semicolon.js");
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages and ignore .eslintrc files when executing with no-eslintrc flag", function() {

            engine = new CLIEngine({
                ignore: false,
                useEslintrc: false,
                envs: ["node"]
            });

            var report = engine.executeOnFiles(["./tests/fixtures/eslintrc/quotes.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "./tests/fixtures/eslintrc/quotes.js");
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages and ignore package.json files when executing with no-eslintrc flag", function() {

            engine = new CLIEngine({
                ignore: false,
                useEslintrc: false,
                envs: ["node"]
            });

            var report = engine.executeOnFiles(["./tests/fixtures/packagejson/quotes.js"]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, "./tests/fixtures/packagejson/quotes.js");
            assert.equal(report.results[0].messages.length, 0);
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
            it("should return zero messages when executing with no .eslintrc", function() {

                engine = new CLIEngine({
                    useEslintrc: false
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // No default configuration rules - conf/environments.js (/*eslint-env node*/)
            it("should return zero messages when executing with no .eslintrc in the Node.js environment", function() {

                engine = new CLIEngine({
                    reset: true,
                    useEslintrc: false
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/console-wrong-quotes-node.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Project configuration - first level .eslintrc
            it("should return zero messages when executing with .eslintrc in the Node.js environment", function() {

                engine = new CLIEngine();

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/process-exit.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Project configuration - first level .eslintrc
            it("should return zero messages when executing with .eslintrc in the Node.js environment", function() {

                engine = new CLIEngine();

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/process-exit.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Project configuration - first level .eslintrc
            it("should return one message when executing with .eslintrc", function() {

                engine = new CLIEngine();

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 2);
            });

            // Project configuration - second level .eslintrc
            it("should return one message when executing with local .eslintrc that overrides parent .eslintrc", function() {

                engine = new CLIEngine();

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/subbroken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "no-console");
                assert.equal(report.results[0].messages[0].severity, 1);
            });

            // Project configuration - third level .eslintrc
            it("should return one message when executing with local .eslintrc that overrides parent and grandparent .eslintrc", function() {

                engine = new CLIEngine();

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/subbroken/subsubbroken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 1);
            });

            // Project configuration - first level package.json
            it("should return one message when executing with package.json", function() {

                engine = new CLIEngine();

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/packagejson/subdir/wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 1);
            });

             // Project configuration - second level package.json
            it("should return zero messages when executing with local package.json that overrides parent package.json", function() {

                engine = new CLIEngine();

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/packagejson/subdir/subsubdir/wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Project configuration - third level package.json
            it("should return one message when executing with local package.json that overrides parent and grandparent package.json", function() {

                engine = new CLIEngine();

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/packagejson/subdir/subsubdir/subsubsubdir/wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 2);
            });

            // Project configuration - .eslintrc overrides package.json in same directory
            it("should return one message when executing with .eslintrc that overrides a package.json in the same directory", function() {

                engine = new CLIEngine();

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/packagejson/wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 2);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should return two messages when executing with config file that adds to local .eslintrc", function() {

                engine = new CLIEngine({
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
            it("should return no messages when executing with config file that overrides local .eslintrc", function() {

                engine = new CLIEngine({
                    configFile: fixtureDir + "/config-hierarchy/broken/override-conf.yaml"
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Command line configuration - --config with second level .eslintrc
            it("should return two messages when executing with config file that adds to local and parent .eslintrc", function() {

                engine = new CLIEngine({
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
            it("should return one message when executing with config file that overrides local and parent .eslintrc", function() {

                engine = new CLIEngine({
                    configFile: fixtureDir + "/config-hierarchy/broken/override-conf.yaml"
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/subbroken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "no-console");
                assert.equal(report.results[0].messages[0].severity, 1);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should return no messages when executing with config file that overrides local .eslintrc", function() {

                engine = new CLIEngine({
                    configFile: fixtureDir + "/config-hierarchy/broken/override-conf.yaml"
                });

                var report = engine.executeOnFiles([fixtureDir + "/config-hierarchy/broken/console-wrong-quotes.js"]);
                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Command line configuration - --rule with --config and first level .eslintrc
            it("should return one message when executing with command line rule and config file that overrides local .eslintrc", function() {

                engine = new CLIEngine({
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
            it("should return one message when executing with command line rule and config file that overrides local .eslintrc", function() {

                engine = new CLIEngine({
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

        describe("plugins", function() {
            it("should return two messages when executing with config file that specifies a plugin", function() {
                engine = new CLIEngine({
                    configFile: "./tests/fixtures/configurations/plugins-with-prefix.json",
                    useEslintrc: false
                });

                var report = engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with config file that specifies a plugin with namespace", function() {
                engine = new CLIEngine({
                    configFile: "./tests/fixtures/configurations/plugins-with-prefix-and-namespace.json",
                    useEslintrc: false
                });

                var report = engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with config file that specifies a plugin without prefix", function() {
                engine = new CLIEngine({
                    configFile: "./tests/fixtures/configurations/plugins-without-prefix.json",
                    useEslintrc: false
                });

                var report = engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with config file that specifies a plugin without prefix and with namespace", function() {
                engine = new CLIEngine({
                    configFile: "./tests/fixtures/configurations/plugins-without-prefix-with-namespace.json",
                    useEslintrc: false
                });

                var report = engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should import the same plugin only once if it is configured multiple times", sinon.test(function() {
                var importPlugin = this.spy(rules, "import");

                engine = new CLIEngine({
                    configFile: "./tests/fixtures/configurations/plugins-with-prefix.json",
                    useEslintrc: false
                });

                engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);
                engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);

                assert.equal(importPlugin.calledOnce, true, "same plugin was imported more than once");
                assert.equal(importPlugin.calledWithExactly(examplePlugin.rules, "example"), true);
            }));

            it("should return two messages when executing with cli option that specifies a plugin", function() {
                engine = new CLIEngine({
                    useEslintrc: false,
                    plugins: ["example"],
                    rules: { "example/example-rule": 1 }
                });

                var report = engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with cli option that specifies preloaded plugin", function() {
                engine = new CLIEngine({
                    useEslintrc: false,
                    plugins: ["test"],
                    rules: { "test/example-rule": 1 }
                });

                engine.addPlugin("eslint-plugin-test", { rules: { "example-rule": require("../fixtures/rules/custom-rule") } });

                var report = engine.executeOnFiles(["tests/fixtures/rules/test/test-custom-rule.js"]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "test/example-rule");
            });
        });

        describe("processors", function() {
            it("should return two messages when executing with config file that specifies a processor", function() {
                engine = new CLIEngine({
                    configFile: "./tests/fixtures/configurations/processors.json",
                    useEslintrc: false,
                    extensions: ["js", "txt"]
                });

                var report = engine.executeOnFiles(["tests/fixtures/processors/test/test-processor.txt"]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
            });
            it("should return two messages when executing with config file that specifies preloaded processor", function() {
                engine = new CLIEngine({
                    useEslintrc: false,
                    plugins: ["test-processor"],
                    rules: {
                        "no-console": 2,
                        "no-unused-vars": 2
                    },
                    extensions: ["js", "txt"]
                });

                engine.addPlugin("test-processor", {
                    processors: {
                        ".txt": {
                            preprocess: function(text) {
                                return [text];
                            },
                            postprocess: function(messages) {
                                return messages[0];
                            }
                        }
                    }
                });

                var report = engine.executeOnFiles(["tests/fixtures/processors/test/test-processor.txt"]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
            });
            it("should run processors when calling executeOnFiles with config file that specifies a processor", function() {
                engine = new CLIEngine({
                    configFile: "./tests/fixtures/configurations/processors.json",
                    useEslintrc: false,
                    extensions: ["js", "txt"]
                });

                var report = engine.executeOnFiles(["tests/fixtures/processors/test/test-processor.txt"]);

                assert.equal(report.results[0].messages[0].message, "b is defined but never used");
                assert.equal(report.results[0].messages[0].ruleId, "post-processed");
            });
            it("should run processors when calling executeOnFiles with config file that specifies preloaded processor", function() {
                engine = new CLIEngine({
                    useEslintrc: false,
                    plugins: ["test-processor"],
                    rules: {
                        "no-console": 2,
                        "no-unused-vars": 2
                    },
                    extensions: ["js", "txt"]
                });

                engine.addPlugin("test-processor", {
                    processors: {
                        ".txt": {
                            preprocess: function(text) {
                                return [text.replace("a()", "b()")];
                            },
                            postprocess: function(messages) {
                                messages[0][0].ruleId = "post-processed";
                                return messages[0];
                            }
                        }
                    }
                });

                var report = engine.executeOnFiles(["tests/fixtures/processors/test/test-processor.txt"]);

                assert.equal(report.results[0].messages[0].message, "b is defined but never used");
                assert.equal(report.results[0].messages[0].ruleId, "post-processed");
            });
            it("should run processors when calling executeOnText with config file that specifies a processor", function() {
                engine = new CLIEngine({
                    configFile: "./tests/fixtures/configurations/processors.json",
                    useEslintrc: false,
                    extensions: ["js", "txt"]
                });

                var report = engine.executeOnText("function a() {console.log(\"Test\");}", "tests/fixtures/processors/test/test-processor.txt");

                assert.equal(report.results[0].messages[0].message, "b is defined but never used");
                assert.equal(report.results[0].messages[0].ruleId, "post-processed");
            });
            it("should run processors when calling executeOnText with config file that specifies preloaded processor", function() {
                engine = new CLIEngine({
                    useEslintrc: false,
                    plugins: ["test-processor"],
                    rules: {
                        "no-console": 2,
                        "no-unused-vars": 2
                    },
                    extensions: ["js", "txt"]
                });

                engine.addPlugin("test-processor", {
                    processors: {
                        ".txt": {
                            preprocess: function(text) {
                                return [text.replace("a()", "b()")];
                            },
                            postprocess: function(messages) {
                                messages[0][0].ruleId = "post-processed";
                                return messages[0];
                            }
                        }
                    }
                });

                var report = engine.executeOnText("function a() {console.log(\"Test\");}", "tests/fixtures/processors/test/test-processor.txt");

                assert.equal(report.results[0].messages[0].message, "b is defined but never used");
                assert.equal(report.results[0].messages[0].ruleId, "post-processed");
            });
        });
    });

    describe("getConfigForFile", function() {

        it("should return the info from Config#getConfig when called", function() {

            var engine = new CLIEngine({
                configFile: "tests/fixtures/configurations/quotes-error.json"
            });

            var configHelper = new Config(engine.options);

            assert.deepEqual(
                engine.getConfigForFile("tests/fixtures/single-quoted.js"),
                configHelper.getConfig("tests/fixtures/single-quoted.js")
            );

        });

    });

    describe("isPathIgnored", function() {

        it("should check if the given path is ignored", function() {
            var engine = new CLIEngine({
                ignorePath: "tests/fixtures/.eslintignore2"
            });

            assert.isTrue(engine.isPathIgnored("undef.js"));
            assert.isFalse(engine.isPathIgnored("passing.js"));
        });

        it("should always return false if ignoring is disabled", function() {
            var engine = new CLIEngine({
                ignorePath: "tests/fixtures/.eslintignore2",
                ignore: false
            });

            assert.isFalse(engine.isPathIgnored("undef.js"));
            assert.isFalse(engine.isPathIgnored("passing.js"));
        });

    });

    describe("getFormatter()", function() {

        it("should return a function when a bundled formatter is requested", function() {
            var engine = new CLIEngine(),
                formatter = engine.getFormatter("compact");

            assert.isFunction(formatter);
        });

        it("should return a function when no argument is passed", function() {
            var engine = new CLIEngine(),
                formatter = engine.getFormatter();

            assert.isFunction(formatter);
        });

        it("should return a function when a custom formatter is requested", function() {
            var engine = new CLIEngine(),
                formatter = engine.getFormatter("./tests/fixtures/formatters/simple.js");

            assert.isFunction(formatter);
        });

        it("should return a function when a custom formatter is requested, also if the path has backslashes", function() {
            var engine = new CLIEngine(),
                formatter = engine.getFormatter(".\\tests\\fixtures\\formatters\\simple.js");

            assert.isFunction(formatter);
        });

        it("should return null when a customer formatter doesn't exist", function() {
            var engine = new CLIEngine(),
                formatter = engine.getFormatter("./tests/fixtures/formatters/doesntexist.js");

            assert.isNull(formatter);
        });

        it("should return null when a built-in formatter doesn't exist", function() {
            var engine = new CLIEngine(),
                formatter = engine.getFormatter("special");

            assert.isNull(formatter);
        });

        it("should return null when a non-string formatter name is passed", function() {
            var engine = new CLIEngine(),
                formatter = engine.getFormatter(5);

            assert.isNull(formatter);
        });

    });

});
