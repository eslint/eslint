/**
 * @fileoverview Tests for cli.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    cli = require("../../lib/cli"),
    path = require("path"),
    sinon = require("sinon");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("cli", function() {

    beforeEach(function() {
        sinon.stub(console, "log").returns(undefined);
        sinon.stub(console, "error").returns(undefined);
    });

    afterEach(function() {
        console.log.restore();
        console.error.restore();
    });

    describe("when given a config file", function() {
        it("should load the specified config file", function() {
            assert.doesNotThrow(function () {
                cli.execute("-c " + path.join(__dirname, "..", ".eslintrc") + " lib/cli.js");
            });
        });
    });

    describe("when there is a local config file", function() {
        var code = "lib/cli.js";

        it("should load the local config file", function() {
            // Mock CWD
            process.eslintCwd = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes");

            assert.doesNotThrow(function () {
                cli.execute(code);
            });

            cli.execute(code);

            process.eslintCwd = null;
        });
    });

    describe("when given a config with rules with options and severity level set to error", function() {
        var code = "--config tests/fixtures/configurations/quotes-error.json single-quoted.js";

        it("should exit with an error status (1)", function() {
            var exitStatus;

            assert.doesNotThrow(function () {
                exitStatus = cli.execute(code);
            });

            assert.equal(exitStatus, 1);
        });
    });

    describe("when given a config file and a directory of files", function() {
        var code = "--config tests/fixtures/configurations/semi-error.json tests/fixtures/formatters";

        it("should load and execute without error", function() {
            var exitStatus;

            assert.doesNotThrow(function () {
                exitStatus = cli.execute(code);
            });

            assert.equal(exitStatus, 0);
        });
    });

    describe("when given a config with environment set to browser", function() {
        var code = "--config tests/fixtures/configurations/env-browser.json tests/fixtures/globals-browser.js";

        it("should execute without any errors", function() {
            var exit = cli.execute(code);

            assert.equal(exit, 0);
        });
    });

    describe("when given a config with environment set to Node.js", function() {
        var code = "--config tests/fixtures/configurations/env-node.json tests/fixtures/globals-node.js";

        it("should execute without any errors", function() {
            var exit = cli.execute(code);

            assert.equal(exit, 0);
        });
    });

    describe("when given a valid built-in formatter name", function() {
        it("should execute without any errors", function() {
            var exit = cli.execute("-f checkstyle tests/fixtures/passing.js");

            assert.equal(exit, 0);
        });
    });

    describe("when given an invalid built-in formatter name", function() {
        it("should execute with error", function() {
            var exit = cli.execute("-f fakeformatter tests/fixtures/passing.js");

            assert.equal(exit, 1);
        });
    });

    describe("when given a valid formatter path", function() {
        it("should execute without any errors", function() {
            var exit = cli.execute("-f tests/fixtures/formatters/simple.js tests/fixtures/passing.js");

            assert.equal(exit, 0);
        });
    });

    describe("when given an invalid formatter path", function() {
        it("should execute with error", function() {
            var exit = cli.execute("-f tests/fixtures/formatters/file-does-not-exist.js tests/fixtures/passing.js");

            assert.equal(exit, 1);
        });
    });

    describe("when executing a file with an error", function() {
        it("should exit with error", function() {
            var exit = cli.execute("--force tests/fixtures/undef.js");

            assert.equal(exit, 1);
        });
    });

    describe("when calling execute more than once", function() {
        it("should not print the results from previous execution", function() {
            cli.execute("--force tests/fixtures/missing-semicolon.js");
            assert.isTrue(console.log.called, "Log should have been called.");

            console.log.reset();

            cli.execute("--force tests/fixtures/passing.js");
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

    describe("when given a directory with eslint excluded files", function() {
        it("should not process any files", function() {
            cli.execute("tests/fixtures");

            assert.isTrue(console.log.notCalled);
        });
    });

    describe("when given a directory with jshint excluded files", function() {
        it("should not process any files", function() {
            cli.execute("tests/fixtures");

            assert.isTrue(console.log.notCalled);
        });
    });

    describe("when given a directory with eslint excluded files in the directory", function() {
        it("should not process any files", function() {
            var exit = cli.execute("tests/fixtures");

            assert.isTrue(console.log.notCalled);
            assert.equal(exit, 0);
        });
    });

    describe("when given a file in excluded files list", function() {

        it("should not process the file", function () {
            var exit = cli.execute("tests/fixtures/passing.js");

            // a warning about the ignored file
            assert.isTrue(console.log.called);
            assert.equal(exit, 0);
        });

        it("should process the file when forced", function() {
            var exit = cli.execute("--force tests/fixtures/passing.js");

            // no warnings
            assert.isFalse(console.log.called);
            assert.equal(exit, 0);
        });
    });

    describe("when executing a file with a shebang", function() {

        it("should execute without error", function() {
            var exit = cli.execute("--force tests/fixtures/shebang.js");

            assert.equal(exit, 0);
        });
    });

    describe("when given a custom rule, verify that it's loaded", function() {

        it("should return a warning", function() {
            var code = "--rulesdir ./tests/fixtures/rules/wrong --config ./tests/fixtures/rules/eslint.json --force tests/fixtures/rules/test/test-custom-rule.js";

            assert.throws(function() {
                var exit = cli.execute(code);
                assert.equal(exit, 1);
            }, /Error while loading rule 'custom-rule': Cannot read property/);
        });

        it("should return a warning", function() {
            var code = "--rulesdir ./tests/fixtures/rules --config ./tests/fixtures/rules/eslint.json --force tests/fixtures/rules/test/test-custom-rule.js";
            var exit = cli.execute(code);

            assert.isTrue(console.log.calledOnce);
            assert.isTrue(console.log.neverCalledWith(""));
            assert.equal(exit, 1);
        });

        it("should return warnings from multiple rules in different directories", function() {
            var code = "--rulesdir ./tests/fixtures/rules/dir1 --rulesdir ./tests/fixtures/rules/dir2 --reset --config ./tests/fixtures/rules/multi-rulesdirs.json --force tests/fixtures/rules/test-multi-rulesdirs.js";
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

    describe("when executing with reset flag", function() {
        it("should execute without any errors", function () {
            var exit = cli.execute("--reset --no-eslintrc --force ./tests/fixtures/missing-semicolon.js");

            assert.isTrue(console.log.notCalled);
            assert.equal(exit, 0);
        });

        it("should execute without any errors in Node.js environment", function () {
            var exit = cli.execute("--reset --no-eslintrc --env node --force ./tests/fixtures/process-exit.js");

            assert.isTrue(console.log.notCalled);
            assert.equal(exit, 0);
        });

    });

    describe("when executing with no-eslintrc flag", function () {
        it("should ignore a local config file", function () {
            var exit = cli.execute("--no-eslintrc --force ./tests/fixtures/eslintrc/quotes.js");

            assert.isTrue(console.log.notCalled);
            assert.equal(exit, 0);
        });
    });

    describe("when executing without no-eslintrc flag", function () {
        it("should load a local config file", function () {
            var exit = cli.execute("--force ./tests/fixtures/eslintrc/quotes.js");

            assert.isTrue(console.log.calledOnce);
            assert.equal(exit, 1);
        });
    });

    describe("when executing with env flag", function () {
        var files = [
            "./tests/fixtures/globals-browser.js",
            "./tests/fixtures/globals-node.js"
        ];

        it("should allow environment-specific globals", function () {
            cli.execute("--no-eslintrc --config ./conf/eslint.json --env browser,node --force " + files.join(" "));
            assert.equal(console.log.args[0][0].split("\n").length, 11);
        });

        it("should allow environment-specific globals, with multiple flags", function () {
            cli.execute("--no-eslintrc --config ./conf/eslint.json --env browser --env node --force " + files.join(" "));
            assert.equal(console.log.args[0][0].split("\n").length, 11);
        });
    });

    describe("when executing without env flag", function () {
        var files = [
            "./tests/fixtures/globals-browser.js",
            "./tests/fixtures/globals-node.js"
        ];

        it("should not define environment-specific globals", function () {
            cli.execute("--no-eslintrc --config ./conf/eslint.json --force " + files.join(" "));
            assert.equal(console.log.args[0][0].split("\n").length, 14);
        });
    });

    describe("when executing with global flag", function () {
        it("should default defined variables to read-only", function () {
            var exit = cli.execute("--global baz,bat --force ./tests/fixtures/undef.js");

            assert.isTrue(console.log.calledOnce);
            assert.equal(exit, 1);
        });

        it("should allow defining writable global variables", function () {
            var exit = cli.execute("--global baz:false,bat:true --force ./tests/fixtures/undef.js");

            assert.isTrue(console.log.notCalled);
            assert.equal(exit, 0);
        });

        it("should allow defining variables with multiple flags", function () {
            var exit = cli.execute("--global baz --global bat:true --force ./tests/fixtures/undef.js");

            assert.isTrue(console.log.notCalled);
            assert.equal(exit, 0);
        });
    });
});
