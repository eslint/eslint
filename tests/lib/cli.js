/**
 * @fileoverview Tests for cli.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    cli = require("../../lib/cli"),
    path = require("path"),
    sinon = require("sinon"),
    fs = require("fs"),
    sh = require("shelljs");

/* global tempdir, mkdir, rm, cp */

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("cli", function() {

    var fixtureDir;

    /**
     * Returns the path inside of the fixture directory.
     * @returns {string} The path inside the fixture directory.
     * @private
     */
    function getFixturePath() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(fixtureDir);
        return path.join.apply(path, args);
    }

    // copy into clean area so as not to get "infected" by this project's .eslintrc files
    before(function() {
        fixtureDir = tempdir() + "/eslint/fixtures";
        mkdir("-p", fixtureDir);
        cp("-r", "./tests/fixtures/.", fixtureDir);
    });

    beforeEach(function() {
        sinon.stub(console, "log").returns(void 0);
        sinon.stub(console, "error").returns(void 0);
    });

    afterEach(function() {
        console.log.restore();
        console.error.restore();
    });

    after(function() {
        rm("-r", fixtureDir);
    });

    describe("execute()", function() {
        it("should return error when text with incorrect quotes is passed as argument", function() {
            var configFile = getFixturePath("configurations", "quotes-error.json");
            var result = cli.execute("-c " + configFile, "var foo = 'bar';");
            assert.equal(result, 1);
        });

        it("should return no error when --ext .js2 is specified", function() {
            var filePath = getFixturePath("files");
            var result = cli.execute("--ext .js2 " + filePath);
            assert.equal(result, 0);
        });

        it("should exit with console error when passed unsupported arguments", function() {
            var filePath = getFixturePath("files");
            var result = cli.execute("--blah --another " + filePath);
            assert.equal(result, 1);
        });

    });

    describe("when given a config file", function() {
        it("should load the specified config file", function() {
            var configPath = getFixturePath(".eslintrc");
            var filePath = getFixturePath("passing.js");

            assert.doesNotThrow(function() {
                cli.execute("--config " + configPath + " " + filePath);
            });
        });
    });

    describe("when there is a local config file", function() {
        var code = "lib/cli.js";

        it("should load the local config file", function() {
            // Mock CWD
            process.eslintCwd = getFixturePath("configurations", "single-quotes");

            assert.doesNotThrow(function() {
                cli.execute(code);
            });

            cli.execute(code);

            process.eslintCwd = null;
        });
    });

    describe("when given a config with rules with options and severity level set to error", function() {
        it("should exit with an error status (1)", function() {
            var configPath = getFixturePath("configurations", "quotes-error.json");
            var filePath = getFixturePath("single-quoted.js");
            var code = "--config " + configPath + " " + filePath;

            var exitStatus;

            exitStatus = cli.execute(code);

            assert.equal(exitStatus, 1);
        });
    });

    describe("when given a config file and a directory of files", function() {
        it("should load and execute without error", function() {
            var configPath = getFixturePath("configurations", "semi-error.json");
            var filePath = getFixturePath("formatters");
            var code = "--config " + configPath + " " + filePath;

            var exitStatus;

            assert.doesNotThrow(function() {
                exitStatus = cli.execute(code);
            });

            assert.equal(exitStatus, 0);
        });
    });

    describe("when given a config with environment set to browser", function() {
        it("should execute without any errors", function() {
            var configPath = getFixturePath("configurations", "env-browser.json");
            var filePath = getFixturePath("globals-browser.js");
            var code = "--config " + configPath + " " + filePath;

            var exit = cli.execute(code);

            assert.equal(exit, 0);
        });
    });

    describe("when given a config with environment set to Node.js", function() {
        it("should execute without any errors", function() {
            var configPath = getFixturePath("configurations", "env-node.json");
            var filePath = getFixturePath("globals-node.js");
            var code = "--config " + configPath + " " + filePath;

            var exit = cli.execute(code);

            assert.equal(exit, 0);
        });
    });

    describe("when given a config that is a sharable config", function() {
        it("should execute without any errors", function() {
            var configPath = "xo";
            var filePath = getFixturePath("passing.js");
            var code = "--config " + configPath + " " + filePath;

            var exit = cli.execute(code);

            assert.equal(exit, 1);
            assert.isTrue(console.log.called);
        });
    });

    describe("when given a valid built-in formatter name", function() {
        it("should execute without any errors", function() {
            var filePath = getFixturePath("passing.js");
            var exit = cli.execute("-f checkstyle " + filePath);

            assert.equal(exit, 0);
        });
    });

    describe("when given an invalid built-in formatter name", function() {
        it("should execute with error", function() {
            var filePath = getFixturePath("passing.js");
            var exit = cli.execute("-f fakeformatter " + filePath);

            assert.equal(exit, 1);
        });
    });

    describe("when given a valid formatter path", function() {
        it("should execute without any errors", function() {
            var formatterPath = getFixturePath("formatters", "simple.js");
            var filePath = getFixturePath("passing.js");
            var exit = cli.execute("-f " + formatterPath + " " + filePath);

            assert.equal(exit, 0);
        });
    });

    describe("when given an invalid formatter path", function() {
        it("should execute with error", function() {
            var formatterPath = getFixturePath("formatters", "file-does-not-exist.js");
            var filePath = getFixturePath("passing.js");
            var exit = cli.execute("-f " + formatterPath + " " + filePath);

            assert.equal(exit, 1);
        });
    });

    describe("when executing a file with a lint error", function() {
        it("should exit with error", function() {
            var filePath = getFixturePath("undef.js");
            var code = "--no-ignore --config --rule no-undef:2 " + filePath;

            var exit = cli.execute(code);

            assert.equal(exit, 1);
        });
    });

    describe("when executing a file with a syntax error", function() {
        it("should exit with error", function() {
            var filePath = getFixturePath("syntax-error.js");
            var exit = cli.execute("--no-ignore " + filePath);

            assert.equal(exit, 1);
        });
    });

    describe("when calling execute more than once", function() {
        it("should not print the results from previous execution", function() {
            var filePath = getFixturePath("missing-semicolon.js");
            var passingPath = getFixturePath("passing.js");

            cli.execute("--no-ignore --rule semi:2 " + filePath);

            assert.isTrue(console.log.called, "Log should have been called.");

            console.log.reset();

            cli.execute("--no-ignore --rule semi:2 " + passingPath);
            assert.isTrue(console.log.notCalled);

        });
    });

    describe("when executing with version flag", function() {
        it("should print out current version", function() {
            cli.execute("-v");

            assert.equal(console.log.callCount, 1);
        });
    });

    describe("when executing with help flag", function() {
        it("should print out help", function() {
            cli.execute("-h");

            assert.equal(console.log.callCount, 1);
        });
    });

    describe("when given a directory with eslint excluded files in the directory", function() {
        it("should not process any files", function() {
            var ignorePath = getFixturePath(".eslintignore");
            var filePath = getFixturePath(".");
            var exit = cli.execute("--ignore-path " + ignorePath + " " + filePath);
            assert.isTrue(console.log.notCalled);
            assert.equal(exit, 0);
        });
    });

    describe("when given a file in excluded files list", function() {

        it("should not process the file", function() {
            var ignorePath = getFixturePath(".eslintignore");
            var filePath = getFixturePath("passing.js");
            var exit = cli.execute("--ignore-path " + ignorePath + " " + filePath);

            // a warning about the ignored file
            assert.isTrue(console.log.called);
            assert.equal(exit, 0);
        });

        it("should process the file when forced", function() {
            var ignorePath = getFixturePath(".eslintignore");
            var filePath = getFixturePath("passing.js");
            var exit = cli.execute("--ignore-path " + ignorePath + " --no-ignore " + filePath);

            // no warnings
            assert.isFalse(console.log.called);
            assert.equal(exit, 0);
        });
    });


    describe("when given a pattern to ignore", function() {
        it("should not process any files", function() {
            var ignorePath = getFixturePath("syntax-error.js");
            var filePath = getFixturePath("passing.js");
            var exit = cli.execute("--ignore-pattern " + ignorePath + " " + ignorePath + " " + filePath);

            // a warning about the ignored file
            assert.isTrue(console.log.called);
            assert.equal(exit, 0);
        });
    });


    describe("when executing a file with a shebang", function() {

        it("should execute without error", function() {
            var filePath = getFixturePath("shebang.js");
            var exit = cli.execute("--no-ignore " + filePath);

            assert.equal(exit, 0);
        });
    });

    describe("when loading a custom rule", function() {

        it("should return an error when rule isn't found", function() {
            var rulesPath = getFixturePath("rules", "wrong");
            var configPath = getFixturePath("rules", "eslint.json");
            var filePath = getFixturePath("rules", "test", "test-custom-rule.js");
            var code = "--rulesdir " + rulesPath + " --config " + configPath + " --no-ignore " + filePath;

            assert.throws(function() {
                var exit = cli.execute(code);
                assert.equal(exit, 1);
            }, /Error while loading rule 'custom-rule': Cannot read property/);
        });

        it("should return a warning when rule is matched", function() {
            var rulesPath = getFixturePath("rules");
            var configPath = getFixturePath("rules", "eslint.json");
            var filePath = getFixturePath("rules", "test", "test-custom-rule.js");
            var code = "--rulesdir " + rulesPath + " --config " + configPath + " --no-ignore " + filePath;

            cli.execute(code);

            assert.isTrue(console.log.calledOnce);
            assert.isTrue(console.log.neverCalledWith(""));
        });

        it("should return warnings from multiple rules in different directories", function() {
            var rulesPath = getFixturePath("rules", "dir1");
            var rulesPath2 = getFixturePath("rules", "dir2");
            var configPath = getFixturePath("rules", "multi-rulesdirs.json");
            var filePath = getFixturePath("rules", "test-multi-rulesdirs.js");
            var code = "--rulesdir " + rulesPath + " --rulesdir " + rulesPath2 + " --config " + configPath + " --no-ignore " + filePath;
            var exit = cli.execute(code);

            var call = console.log.getCall(0);
            assert.isTrue(console.log.calledOnce);
            assert.isTrue(call.args[0].indexOf("String!") > -1);
            assert.isTrue(call.args[0].indexOf("Literal!") > -1);
            assert.isTrue(call.args[0].indexOf("2 problems") > -1);
            assert.isTrue(console.log.neverCalledWith(""));
            assert.equal(exit, 1);
        });


    });

    describe("when executing with no-eslintrc flag", function() {
        it("should ignore a local config file", function() {
            var filePath = getFixturePath("eslintrc", "quotes.js");
            var exit = cli.execute("--no-eslintrc --no-ignore " + filePath);

            assert.isTrue(console.log.notCalled);
            assert.equal(exit, 0);
        });
    });

    describe("when executing without no-eslintrc flag", function() {
        it("should load a local config file", function() {
            var filePath = getFixturePath("eslintrc", "quotes.js");
            var exit = cli.execute("--no-ignore " + filePath);

            assert.isTrue(console.log.calledOnce);
            assert.equal(exit, 1);
        });
    });

    describe("when executing without env flag", function() {
        it("should not define environment-specific globals", function() {
            var files = [
                getFixturePath("globals-browser.js"),
                getFixturePath("globals-node.js")
            ];

            cli.execute("--no-eslintrc --config ./conf/eslint.json --no-ignore " + files.join(" "));
            assert.equal(console.log.args[0][0].split("\n").length, 11);
        });
    });

    describe("when executing with global flag", function() {
        it("should default defined variables to read-only", function() {
            var filePath = getFixturePath("undef.js");
            var exit = cli.execute("--global baz,bat --no-ignore --rule no-undef:2 " + filePath);

            assert.isTrue(console.log.calledOnce);
            assert.equal(exit, 1);
        });

        it("should allow defining writable global variables", function() {
            var filePath = getFixturePath("undef.js");
            var exit = cli.execute("--global baz:false,bat:true --no-ignore " + filePath);

            assert.isTrue(console.log.notCalled);
            assert.equal(exit, 0);
        });

        it("should allow defining variables with multiple flags", function() {
            var filePath = getFixturePath("undef.js");
            var exit = cli.execute("--global baz --global bat:true --no-ignore " + filePath);

            assert.isTrue(console.log.notCalled);
            assert.equal(exit, 0);
        });
    });

    describe("when supplied with rule flag and severity level set to error", function() {
        it("should exit with an error status (2)", function() {
            var filePath = getFixturePath("single-quoted.js");
            var code = "--rule 'quotes: [2, double]' " + filePath;

            var exitStatus;

            exitStatus = cli.execute(code);

            assert.equal(exitStatus, 1);
        });
    });

    describe("when the quiet option is enabled", function() {


        it("should only print error", function() {
            var filePath = getFixturePath("single-quoted.js");
            var cliArgs = "--quiet  -f compact --rule 'quotes: [2, double]' --rule 'no-unused-vars: 1' " + filePath,
                formattedOutput;

            cli.execute(cliArgs);

            sinon.assert.calledOnce(console.log);

            formattedOutput = console.log.firstCall.args[0];
            assert.include(formattedOutput, "Error");
            assert.notInclude(formattedOutput, "Warning");
        });

        it("should print nothing if there are no errors", function() {
            var filePath = getFixturePath("single-quoted.js");
            var cliArgs = "--quiet  -f compact --rule 'quotes: [1, double]' --rule 'no-unused-vars: 1' " + filePath;

            cli.execute(cliArgs);

            sinon.assert.notCalled(console.log);
        });
    });

    describe("when supplied with report output file path", function() {

        afterEach(function() {
            sh.rm("-rf", "tests/output");
        });

        it("should write the file and create dirs if they don't exist", function() {
            var code = "--rule 'quotes: [1, double]' --o tests/output/eslint-output.txt tests/fixtures/single-quoted.js";

            cli.execute(code);

            assert.include(fs.readFileSync("tests/output/eslint-output.txt", "utf8"), "tests/fixtures/single-quoted.js");
            assert.isTrue(console.log.notCalled);
        });

        it("should return an error if the path is a directory", function() {
            var code = "--rule 'quotes: [1, double]' --o tests/output tests/fixtures/single-quoted.js";
            var exit;

            fs.mkdirSync("tests/output");

            exit = cli.execute(code);

            assert.equal(exit, 1);
            assert.isTrue(console.log.notCalled);
            assert.isTrue(console.error.calledOnce);
        });

        it("should return an error if the path could not be written to", function() {
            var code = "--rule 'quotes: [1, double]' --o tests/output/eslint-output.txt tests/fixtures/single-quoted.js";
            var exit;

            fs.writeFileSync("tests/output", "foo");

            exit = cli.execute(code);

            assert.equal(exit, 1);
            assert.isTrue(console.log.notCalled);
            assert.isTrue(console.error.calledOnce);
        });
    });
});
