/**
 * @fileoverview Tests for options.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    options = require("../../lib/options");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

/*
 * This is testing the interface of the options object.
 */

describe("options", function() {
    describe("when passed --help", function() {
        var code = ["--help"];

        it("should return true for .help", function() {
            var currentOptions = options.parse(code);
            assert.isTrue(currentOptions.help);
        });
    });

    describe("when passed -h", function() {
        var code = ["-h"];

        it("should return true for .help", function() {
            var currentOptions = options.parse(code);
            assert.isTrue(currentOptions.help);
        });
    });

    describe("when passed --config", function() {
        var code = ["--config", "file"];

        it("should return a string for .config", function() {
            var currentOptions = options.parse(code);
            assert.isString(currentOptions.config);
            assert.equal(currentOptions.config, "file");
        });
    });

    describe("when passed -c", function() {
        var code = ["-c", "file"];

        it("should return a string for .config", function() {
            var currentOptions = options.parse(code);
            assert.isString(currentOptions.config);
            assert.equal(currentOptions.config, "file");
        });
    });

    describe("when passed --rulesdir", function() {
        var code = ["--rulesdir", "/morerules"];

        it("should return a string for .rulesdir", function() {
            var currentOptions = options.parse(code);
            assert.isString(currentOptions.rulesdir);
            assert.equal(currentOptions.rulesdir, "/morerules");
        });
    });

    describe("when passed --format", function() {
        var code = ["--format", "compact"];

        it("should return a string for .format", function() {
            var currentOptions = options.parse(code);
            assert.isString(currentOptions.format);
            assert.equal(currentOptions.format, "compact");
        });
    });

    describe("when passed -f", function() {
        var code = ["-f", "compact"];

        it("should return a string for .format", function() {
            var currentOptions = options.parse(code);
            assert.isString(currentOptions.format);
            assert.equal(currentOptions.format, "compact");
        });
    });

    describe("when passed --version", function() {
        var code = ["--version"];

        it("should return true for .version", function() {
            var currentOptions = options.parse(code);
            assert.isTrue(currentOptions.version);
        });
    });

    describe("when passed -v", function() {
        var code = ["-v"];

        it("should return true for .version", function() {
            var currentOptions = options.parse(code);
            assert.isTrue(currentOptions.version);
        });
    });

    describe("when asking for help", function() {
        it("should log the help content to the console", function() {
            var log = console.log;

            var loggedMessages = [];
            console.log = function(message) {
                loggedMessages.push(message);
            };

            options.help();
            assert.equal(loggedMessages.length, 1);

            console.log = log;
        });
    });

    describe("when not passed --no-eslintrc", function() {
        it("should default .eslintrc to true", function() {
            var currentOptions = options.parse([]);
            assert.isTrue(currentOptions.eslintrc);
        });
    });

    describe("when passed --no-eslintrc", function() {
        var code = ["--no-eslintrc"];

        it("should return false for .eslintrc", function() {
            var currentOptions = options.parse(code);
            assert.isFalse(currentOptions.eslintrc);
        });
    });

    describe("when passed --env", function() {
        var envs = ["--env", "browser", "--env", "node"];

        it("should return an array for a single env", function() {
            var currentOptions = options.parse(envs.slice(0, 2));
            assert.equal(currentOptions.env.length, 1);
            assert.equal(currentOptions.env[0], "browser");
        });

        it("should concat consecutive occurrences", function() {
            var currentOptions = options.parse(envs);
            assert.equal(currentOptions.env.length, 2);
            assert.equal(currentOptions.env[0], "browser");
            assert.equal(currentOptions.env[1], "node");
        });
    });
});
