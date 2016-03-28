/**
 * @fileoverview Tests for configInitializer.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    fs = require("fs"),
    path = require("path"),
    os = require("os"),
    sinon = require("sinon"),
    sh = require("shelljs"),
    proxyquire = require("proxyquire"),
    autoconfig = require("../../../lib/config/autoconfig"),
    npmUtil = require("../../../lib/util/npm-util");

var originalDir = process.cwd();

proxyquire = proxyquire.noPreserveCache();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var answers = {};

describe("configInitializer", function() {

    var fixtureDir,
        npmCheckStub,
        npmInstallStub,
        init;

    var log = {
        info: sinon.spy(),
        error: sinon.spy()
    };
    var requireStubs = {
        "../logging": log
    };

    /**
     * Returns the path inside of the fixture directory.
     * @returns {string} The path inside the fixture directory.
     * @private
     */
    function getFixturePath() {
        var args = Array.prototype.slice.call(arguments);

        args.unshift(fixtureDir);
        var filepath = path.join.apply(path, args);

        try {
            filepath = fs.realpathSync(filepath);
            return filepath;
        } catch (e) {
            return filepath;
        }
    }

    // copy into clean area so as not to get "infected" by this project's .eslintrc files
    before(function() {
        fixtureDir = os.tmpdir() + "/eslint/fixtures/config-initializer";
        sh.mkdir("-p", fixtureDir);
        sh.cp("-r", "./tests/fixtures/config-initializer/.", fixtureDir);
        fixtureDir = fs.realpathSync(fixtureDir);
    });

    beforeEach(function() {
        npmInstallStub = sinon.stub(npmUtil, "installSyncSaveDev");
        npmCheckStub = sinon.stub(npmUtil, "checkDevDeps", function(packages) {
            return packages.reduce(function(status, pkg) {
                status[pkg] = false;
                return status;
            }, {});
        });
        init = proxyquire("../../../lib/config/config-initializer", requireStubs);
    });

    afterEach(function() {
        log.info.reset();
        log.error.reset();
        npmInstallStub.restore();
        npmCheckStub.restore();
    });

    after(function() {
        sh.rm("-r", fixtureDir);
    });

    describe("processAnswers()", function() {

        describe("prompt", function() {

            beforeEach(function() {
                answers = {
                    source: "prompt",
                    extendDefault: true,
                    indent: 2,
                    quotes: "single",
                    linebreak: "unix",
                    semi: true,
                    es6: true,
                    modules: true,
                    env: ["browser"],
                    jsx: false,
                    react: false,
                    format: "JSON",
                    commonjs: false
                };
            });

            it("should create default config", function() {
                var config = init.processAnswers(answers);

                assert.deepEqual(config.rules.indent, ["error", 2]);
                assert.deepEqual(config.rules.quotes, ["error", "single"]);
                assert.deepEqual(config.rules["linebreak-style"], ["error", "unix"]);
                assert.deepEqual(config.rules.semi, ["error", "always"]);
                assert.equal(config.env.es6, true);
                assert.equal(config.parserOptions.sourceType, "module");
                assert.equal(config.env.browser, true);
                assert.equal(config.extends, "eslint:recommended");
            });

            it("should disable semi", function() {
                answers.semi = false;
                var config = init.processAnswers(answers);

                assert.deepEqual(config.rules.semi, ["error", "never"]);
            });

            it("should enable jsx flag", function() {
                answers.jsx = true;
                var config = init.processAnswers(answers);

                assert.equal(config.parserOptions.ecmaFeatures.jsx, true);
            });

            it("should enable react plugin", function() {
                answers.jsx = true;
                answers.react = true;
                var config = init.processAnswers(answers);

                assert.equal(config.parserOptions.ecmaFeatures.jsx, true);
                assert.equal(config.parserOptions.ecmaFeatures.experimentalObjectRestSpread, true);
                assert.deepEqual(config.plugins, ["react"]);
            });

            it("should not enable es6", function() {
                answers.es6 = false;
                var config = init.processAnswers(answers);

                assert.isUndefined(config.env.es6);
            });

            it("should extend eslint:recommended", function() {
                var config = init.processAnswers(answers);

                assert.equal(config.extends, "eslint:recommended");
            });

            it("should not use commonjs by default", function() {
                var config = init.processAnswers(answers);

                assert.isUndefined(config.env.commonjs);
            });

            it("should use commonjs when set", function() {
                answers.commonjs = true;
                var config = init.processAnswers(answers);

                assert.isTrue(config.env.commonjs);
            });
        });

        describe("guide", function() {
            it("should support the google style guide", function() {
                var config = init.getConfigForStyleGuide("google");

                assert.deepEqual(config, {extends: "google"});
            });

            it("should support the airbnb style guide", function() {
                var config = init.getConfigForStyleGuide("airbnb");

                assert.deepEqual(config, {extends: "airbnb", plugins: ["react"]});
            });

            it("should support the standard style guide", function() {
                var config = init.getConfigForStyleGuide("standard");

                assert.deepEqual(config, {extends: "standard", plugins: ["standard"]});
            });

            it("should throw when encountering an unsupported style guide", function() {
                assert.throws(function() {
                    init.getConfigForStyleGuide("non-standard");
                }, "You referenced an unsupported guide.");
            });

            it("should install required sharable config", function() {
                init.getConfigForStyleGuide("google");
                assert(npmInstallStub.calledOnce);
                assert.deepEqual(npmInstallStub.firstCall.args[0], ["eslint-config-google"]);
            });
        });

        describe("auto", function() {
            var config,
                origLog,
                completeSpy = sinon.spy();

            before(function() {
                var patterns = [
                    getFixturePath("lib"),
                    getFixturePath("tests")
                ].join(" ");

                answers = {
                    source: "auto",
                    patterns: patterns,
                    es6: false,
                    env: ["browser"],
                    jsx: false,
                    react: false,
                    format: "JSON",
                    commonjs: false
                };
                origLog = console.log;
                console.log = function() {}; // necessary to replace, because of progress bar
                process.chdir(fixtureDir);
                try {
                    config = init.processAnswers(answers);
                    process.chdir(originalDir);
                } catch (err) {

                    // if processAnswers crashes, we need to be sure to restore cwd and console.log
                    console.log = origLog;
                    process.chdir(originalDir);
                    throw err;
                }
            });

            beforeEach(function() {
                console.log = origLog;
            });

            it("should create a config", function() {
                assert.isTrue(completeSpy.notCalled);
                assert.ok(config);
            });

            it("should create the config based on examined files", function() {
                assert.deepEqual(config.rules.quotes, ["error", "double"]);
                assert.equal(config.rules.semi, "off");
            });

            it("should extend and not disable recommended rules", function() {
                assert.equal(config.extends, "eslint:recommended");
                assert.notProperty(config.rules, "no-console");
            });

            it("should throw on fatal parsing error", function() {
                var filename = getFixturePath("parse-error");

                sinon.stub(autoconfig, "extendFromRecommended");
                answers.patterns = filename;
                process.chdir(fixtureDir);
                assert.throws(function() {
                    config = init.processAnswers(answers);
                }, "Parsing error: Unexpected token ;");
                process.chdir(originalDir);
                autoconfig.extendFromRecommended.restore();
            });

            it("should throw if no files are matched from patterns", function() {
                sinon.stub(autoconfig, "extendFromRecommended");
                answers.patterns = "not-a-real-filename";
                process.chdir(fixtureDir);
                assert.throws(function() {
                    config = init.processAnswers(answers);
                }, "Automatic Configuration failed.  No files were able to be parsed.");
                process.chdir(originalDir);
                autoconfig.extendFromRecommended.restore();
            });
        });
    });
});
