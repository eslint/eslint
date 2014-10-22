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
            assert.isArray(currentOptions.rulesdir);
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

    describe("when passed --no-ignore", function() {
        it("should return false for .ignore", function() {
            var currentOptions = options.parse("--no-ignore");
            assert.isFalse(currentOptions.ignore);
        });
    });

    describe("when passed --ignore-path", function() {
        it("should return a string for .ignorePath", function() {
            var currentOptions = options.parse("--ignore-path .gitignore");
            assert.equal(currentOptions.ignorePath, ".gitignore");
        });
    });

    describe("when passed --color", function() {
        it("should return true for .color", function() {
            var currentOptions = options.parse("--color");
            assert.isTrue(currentOptions.color);
        });
    });

    describe("when passed --global", function() {
        it("should return an array for a single occurrence", function () {
            var currentOptions = options.parse("--global foo");
            assert.isArray(currentOptions.global);
            assert.equal(currentOptions.global.length, 1);
            assert.equal(currentOptions.global[0], "foo");
        });

        it("should split variable names using commas", function() {
            var currentOptions = options.parse("--global foo,bar");
            assert.isArray(currentOptions.global);
            assert.equal(currentOptions.global.length, 2);
            assert.equal(currentOptions.global[0], "foo");
            assert.equal(currentOptions.global[1], "bar");
        });

        it("should not split on colons", function() {
            var currentOptions = options.parse("--global foo:false,bar:true");
            assert.isArray(currentOptions.global);
            assert.equal(currentOptions.global.length, 2);
            assert.equal(currentOptions.global[0], "foo:false");
            assert.equal(currentOptions.global[1], "bar:true");
        });

        it("should concatenate successive occurrences", function() {
            var currentOptions = options.parse("--global foo:true --global bar:false");
            assert.isArray(currentOptions.global);
            assert.equal(currentOptions.global.length, 2);
            assert.equal(currentOptions.global[0], "foo:true");
            assert.equal(currentOptions.global[1], "bar:false");
        });
    });

    describe("when passed --plugin", function() {
        it("should return an array for a single occurrence", function () {
            var currentOptions = options.parse("--plugin single");
            assert.isArray(currentOptions.plugin);
            assert.equal(currentOptions.plugin.length, 1);
            assert.equal(currentOptions.plugin[0], "single");
        });

        it("should split variable names using commas", function() {
            var currentOptions = options.parse("--plugin foo,bar");
            assert.isArray(currentOptions.plugin);
            assert.equal(currentOptions.plugin.length, 2);
            assert.equal(currentOptions.plugin[0], "foo");
            assert.equal(currentOptions.plugin[1], "bar");
        });

        it("should concatenate successive occurrences", function() {
            var currentOptions = options.parse("--plugin foo --plugin bar");
            assert.isArray(currentOptions.plugin);
            assert.equal(currentOptions.plugin.length, 2);
            assert.equal(currentOptions.plugin[0], "foo");
            assert.equal(currentOptions.plugin[1], "bar");
        });
    });

    describe("when passed --quiet", function () {
        it("should return true for .quiet", function() {
            var currentOptions = options.parse("--quiet");
            assert.isTrue(currentOptions.quiet);
        });
    });
});
