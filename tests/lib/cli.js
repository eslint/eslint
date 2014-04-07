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
        var code = path.join(__dirname, "..", ".eslintrc");

        it("should load the specified config file", function() {
            assert.doesNotThrow(function () {
                cli.execute(["-c", code, "lib/cli.js"]);
            });
        });
    });

    describe("when there is a local config file", function() {
        var code = ["lib/cli.js"];

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
        var code = ["--config", "tests/fixtures/configurations/quotes-error.json", "single-quoted.js"];

        it("should exit with an error status (1)", function() {
            var exitStatus;

            assert.doesNotThrow(function () {
                exitStatus = cli.execute(code);
            });

            assert.equal(exitStatus, 1);
        });
    });

    describe("when given a config file and a directory of files", function() {
        var code = ["--config", "tests/fixtures/configurations/semi-error.json", "tests/fixtures/formatters"];

        it("should load and execute without error", function() {
            var exitStatus;

            assert.doesNotThrow(function () {
                exitStatus = cli.execute(code);
            });

            assert.equal(exitStatus, 0);
        });
    });

    describe("when given a config with environment set to browser", function() {
        var code = [
            "--config", "tests/fixtures/configurations/env-browser.json",
            "tests/fixtures/globals-browser.js"
        ];

        it("should execute without any errors", function() {
            var exit = cli.execute(code);

            assert.equal(exit, 0);
        });
    });

    describe("when given a config with environment set to Node.js", function() {
        var code = ["--config", "tests/fixtures/configurations/env-node.json", "tests/fixtures/globals-node.js"];

        it("should execute without any errors", function() {
            var exit = cli.execute(code);

            assert.equal(exit, 0);
        });
    });

    describe("when given a valid built-in formatter name", function() {
        var code = "checkstyle";

        it("should execute without any errors", function() {
            var exit = cli.execute(["-f", code, "tests/fixtures/passing.js"]);

            assert.equal(exit, 0);
        });
    });

    describe("when given an invalid built-in formatter name", function() {
        var code = "fakeformatter";

        it("should execute with error", function() {
            var exit = cli.execute(["-f", code, "tests/fixtures/passing.js"]);

            assert.equal(exit, 1);
        });
    });

    describe("when given a valid formatter path", function() {
        var code = "tests/fixtures/formatters/simple.js";

        it("should execute without any errors", function() {
            var exit = cli.execute(["-f", code, "tests/fixtures/passing.js"]);

            assert.equal(exit, 0);
        });
    });

    describe("when given an invalid formatter path", function() {
        var code = "tests/fixtures/formatters/file-does-not-exist.js";

        it("should execute with error", function() {
            var exit = cli.execute(["-f", code, "tests/fixtures/passing.js"]);

            assert.equal(exit, 1);
        });
    });

    describe("when executing a file with an error", function() {
        var code = "tests/fixtures/configurations/semi-error.js";

        it("should execute with error", function() {
            var exit = cli.execute([code]);

            assert.equal(exit, 1);
        });
    });

    describe("when calling execute more than once", function() {
        var code = ["tests/fixtures/missing-semicolon.js", "tests/fixtures/passing.js"];

        it("should not print the results from previous execution", function() {
            cli.execute([code[0]]);
            assert.isTrue(console.log.called);

            console.log.reset();

            cli.execute([code[1]]);
            assert.isTrue(console.log.notCalled);

        });
    });

    describe("when executing with version flag", function() {
        var code = "-v";

        it("should print out current version", function() {
            cli.execute([code]);

            assert.equal(console.log.callCount, 1);
        });
    });

    describe("when executing with help flag", function() {
        var code = "-h";

        it("should print out help", function() {
            cli.execute([code]);

            assert.equal(console.log.callCount, 1);
        });
    });

    describe("when given a directory with eslint excluded files", function() {
        var code = "tests/fixtures";

        it("should not process any files", function() {
            cli.execute([code]);

            assert.isTrue(console.log.notCalled);
        });
    });

    describe("when given a directory with jshint excluded files", function() {
        var code = "tests/fixtures";

        it("should not process any files", function() {
            cli.execute([code]);

            assert.isTrue(console.log.notCalled);
        });
    });

    describe("when given a directory with eslint excluded files in the directory", function() {
        var code = "tests/fixtures";

        it("should not process any files", function() {
            var exit = cli.execute([code]);

            assert.isTrue(console.log.notCalled);
            assert.equal(exit, 0);
        });
    });

    describe("when given a file in excluded files list", function() {
        var code = "tests/fixtures/missing-semicolon.js";

        it("should process the file anyway", function() {
            var exit = cli.execute([code]);

            assert.isTrue(console.log.called);
            assert.isFalse(console.log.alwaysCalledWith(""));
            assert.equal(exit, 0);
        });
    });

    describe("when executing a file with a shebang", function() {
        var code = "tests/fixtures/shebang.js";

        it("should execute without error", function() {
            var exit = cli.execute([code]);

            assert.equal(exit, 0);
        });
    });

    describe("when given a custom rule, verify that it's loaded", function() {
        var code = ["--rulesdir", "./tests/fixtures/rules", "--config", "./tests/fixtures/rules/eslint.json", "tests/fixtures/rules/test/test-custom-rule.js"];

        it("should return a warning", function() {
            var exit = cli.execute(code);

            assert.isTrue(console.log.calledOnce);
            assert.isTrue(console.log.neverCalledWith(""));
            assert.equal(exit, 1);
        });
    });

    describe("when executing with reset flag", function() {
        it("should execute without any errors", function () {
            var exit = cli.execute(["--reset", "--no-eslintrc", "./tests/fixtures/missing-semicolon.js"]);

            assert.isTrue(console.log.notCalled);
            assert.equal(exit, 0);
        });
    });

    describe("when executing with no-eslintrc flag", function () {
        it("should ignore a local config file", function () {
            var exit = cli.execute(["--no-eslintrc", "./tests/fixtures/eslintrc/quotes.js"]);

            assert.isTrue(console.log.notCalled);
            assert.equal(exit, 0);
        });
    });

    describe("when executing without no-eslintrc flag", function () {
        it("should load a local config file", function () {
            var exit = cli.execute(["./tests/fixtures/eslintrc/quotes.js"]);

            assert.isTrue(console.log.calledOnce);
            assert.equal(exit, 1);
        });
    });

    describe("when executing with env flag", function () {
        var code = [
            "--no-eslintrc",
            "--config", "./conf/eslint.json",
            "--env", "browser",
            "--env", "node",
            "./tests/fixtures/globals-browser.js",
            "./tests/fixtures/globals-node.js"
        ];

        it("should allow environment-specific globals", function () {
            cli.execute(code);
            assert.equal(console.log.args[0][0].split("\n").length, 11);
        });
    });

    describe("when executing without env flag", function () {
        var code = [
            "--no-eslintrc",
            "--config", "./conf/eslint.json",
            "./tests/fixtures/globals-browser.js",
            "./tests/fixtures/globals-node.js"
        ];

        it("should not define environment-specific globals", function () {
            cli.execute(code);
            assert.equal(console.log.args[0][0].split("\n").length, 14);
        });
    });
});
