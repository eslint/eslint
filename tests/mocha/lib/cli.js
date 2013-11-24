/**
 * @fileoverview Tests for cli.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    cli = require("../../../lib/cli"),
    path = require("path");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("cli", function() {
    describe("when given a config file", function() {
        var code = "conf/eslint.json";

        it("should load the specified config file", function() {
            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            assert.doesNotThrow(function () {
                cli.execute(["-c", code, "lib/cli.js"]);
            });

            console.log = log;
        });
    });

    describe("when there is a local config file", function() {
        var code = ["lib/cli.js"];

        it("should load the local config file", function() {
            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            // Mock CWD
            process.eslintCwd = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes");

            assert.doesNotThrow(function () {
                exitStatus = cli.execute(code);
            });

            cli.execute(code);

            process.eslintCwd = null;
            console.log = log;
        });
    });

    describe("when given a config with rules with options and severity level set to error", function() {
        var code = ["--config", "tests/fixtures/configurations/quotes-error.json", "single-quoted.js"];

        it("should exit with an error status (1)", function() {
            var log = console.log,
                exitStatus;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            assert.doesNotThrow(function () {
                exitStatus = cli.execute(code);
            });
            console.log = log;

            assert.equal(exitStatus, 1);
        });
    });

    describe("when given a config file and a directory of files", function() {
        var code = ["--config","tests/fixtures/configurations/semi-error.json", "tests/fixtures/formatters"];

        it("should load and execute without error", function() {
            var log = console.log,
                exitStatus;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            assert.doesNotThrow(function () {
                exitStatus = cli.execute(code);
            });
            console.log = log;

            assert.equal(exitStatus, 0);
        });
    });

    describe("when given a config with environment set to browser", function() {
        var code = ["--config", "tests/fixtures/configurations/env-browser.json", "tests/fixtures/globals-browser.js"];

        it("should execute without any errors", function() {
            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};
            var exit = cli.execute(code);
            assert.equal(exit, 0);

            console.log = log;
        });
    });

    describe("when given a config with environment set to Node.js", function() {
        var code = ["--config", "tests/fixtures/configurations/env-node.json", "tests/fixtures/globals-node.js"];

        it("should execute without any errors", function() {
            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};
            var exit = cli.execute(code);
            assert.equal(exit, 0);

            console.log = log;
        });
    });

    describe("when given a valid built-in formatter name", function() {
        var code = "checkstyle";

        it("should execute without any errors", function() {
            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            var exit = cli.execute(["-f", code, "tests/fixtures/passing.js"]);
            assert.equal(exit, 0);

            console.log = log;
        });
    });

    describe("when given an invalid built-in formatter name", function() {
        var code = "fakeformatter";

        it("should execute with error", function() {
            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            var exit = cli.execute(["-f", code, "tests/fixtures/passing.js"]);
            assert.equal(exit, 1);

            console.log = log;
        });
    });

    describe("when given a valid formatter path", function() {
        var code = "tests/fixtures/formatters/simple.js";

        it("should execute without any errors", function() {
            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            var exit = cli.execute(["-f", code, "tests/fixtures/passing.js"]);
            assert.equal(exit, 0);

            console.log = log;
        });
    });

    describe("when given an invalid formatter path", function() {
        var code = "tests/fixtures/formatters/file-does-not-exist.js";

        it("should execute with error", function() {
            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            var exit = cli.execute(["-f", code, "tests/fixtures/passing.js"]);
            assert.equal(exit, 1);

            console.log = log;
        });
    });

    describe("when executing a file with an error", function() {
        var code = "tests/fixtures/configurations/semi-error.js";

        it("should execute with error", function() {
            var log = console.log;

            // Assign console.log to noop to skip CLI output
            console.log = function() {};

            var exit = cli.execute([code]);
            assert.equal(exit, 1);

            console.log = log;
        });
    });

    describe("when calling execute more than once", function() {
        var code = ["tests/fixtures/missing-semicolon.js", "tests/fixtures/passing.js"];

        it("should not print the results from previous execution", function() {
            var results = "",
                log = console.log;

            // Collect the CLI output.
            console.log = function(msg) {
                results += msg;
            };

            cli.execute([code[0]]);
            assert.notEqual(results, "");

            // Reset results collected between executions.
            results = "";

            cli.execute([code[1]]);
            assert.equal(results, "");

            console.log = log;
        });
    });
});
