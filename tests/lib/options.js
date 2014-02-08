/**
 * @fileoverview Tests for options.
 * @author George Zahariev
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
        it("should return true for .help", function() {
            var currentOptions = options.parse("--help");
            assert.isTrue(currentOptions.help);
        });
    });

    describe("when passed -h", function() {
        it("should return true for .help", function() {
            var currentOptions = options.parse("-h");
            assert.isTrue(currentOptions.help);
        });
    });

    describe("when passed --config", function() {
        it("should return a string for .config", function() {
            var currentOptions = options.parse("--config file");
            assert.isString(currentOptions.config);
            assert.equal(currentOptions.config, "file");
        });
    });

    describe("when passed -c", function() {
        it("should return a string for .config", function() {
            var currentOptions = options.parse("-c file");
            assert.isString(currentOptions.config);
            assert.equal(currentOptions.config, "file");
        });
    });

    describe("when passed --rulesdir", function() {
        it("should return a string for .rulesdir", function() {
            var currentOptions = options.parse("--rulesdir /morerules");
            assert.isString(currentOptions.rulesdir);
            assert.equal(currentOptions.rulesdir, "/morerules");
        });
    });

    describe("when passed --format", function() {
        it("should return a string for .format", function() {
            var currentOptions = options.parse("--format compact");
            assert.isString(currentOptions.format);
            assert.equal(currentOptions.format, "compact");
        });
    });

    describe("when passed -f", function() {
        it("should return a string for .format", function() {
            var currentOptions = options.parse("-f compact");
            assert.isString(currentOptions.format);
            assert.equal(currentOptions.format, "compact");
        });
    });

    describe("when passed --version", function() {
        it("should return true for .version", function() {
            var currentOptions = options.parse("--version");
            assert.isTrue(currentOptions.version);
        });
    });

    describe("when passed -v", function() {
        it("should return true for .version", function() {
            var currentOptions = options.parse("-v");
            assert.isTrue(currentOptions.version);
        });
    });

    describe("when asking for help", function() {
        it("should return string of help text", function() {
            var helpText = options.generateHelp();
            assert.isString(helpText);
        });
    });
});
