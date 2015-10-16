/**
 * @fileoverview Tests for options.
 * @author George Zahariev
 * See LICENSE in root directory for full license.
 */

"use strict";

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
    describe("--help", function() {
        it("should return true for .help when passed", function() {
            var currentOptions = options.parse("--help");
            assert.isTrue(currentOptions.help);
        });
    });

    describe("-h", function() {
        it("should return true for .help when passed", function() {
            var currentOptions = options.parse("-h");
            assert.isTrue(currentOptions.help);
        });
    });

    describe("--config", function() {
        it("should return a string for .config when passed a string", function() {
            var currentOptions = options.parse("--config file");
            assert.isString(currentOptions.config);
            assert.equal(currentOptions.config, "file");
        });
    });

    describe("-c", function() {
        it("should return a string for .config when passed a string", function() {
            var currentOptions = options.parse("-c file");
            assert.isString(currentOptions.config);
            assert.equal(currentOptions.config, "file");
        });
    });

    describe("--ext", function() {
        it("should return an array with one item when passed .jsx", function() {
            var currentOptions = options.parse("--ext .jsx");
            assert.isArray(currentOptions.ext);
            assert.equal(currentOptions.ext[0], ".jsx");
        });

        it("should return an array with two items when passed .js and .jsx", function() {
            var currentOptions = options.parse("--ext .jsx --ext .js");
            assert.isArray(currentOptions.ext);
            assert.equal(currentOptions.ext[0], ".jsx");
            assert.equal(currentOptions.ext[1], ".js");
        });

        it("should return an array with two items when passed .jsx,.js", function() {
            var currentOptions = options.parse("--ext .jsx,.js");
            assert.isArray(currentOptions.ext);
            assert.equal(currentOptions.ext[0], ".jsx");
            assert.equal(currentOptions.ext[1], ".js");
        });

        it("should return an array one item when not passed", function() {
            var currentOptions = options.parse("");
            assert.isArray(currentOptions.ext);
            assert.equal(currentOptions.ext[0], ".js");
        });
    });

    describe("--rulesdir", function() {
        it("should return a string for .rulesdir when passed a string", function() {
            var currentOptions = options.parse("--rulesdir /morerules");
            assert.isArray(currentOptions.rulesdir);
            assert.equal(currentOptions.rulesdir, "/morerules");
        });
    });

    describe("--format", function() {
        it("should return a string for .format when passed a string", function() {
            var currentOptions = options.parse("--format compact");
            assert.isString(currentOptions.format);
            assert.equal(currentOptions.format, "compact");
        });

        it("should return stylish for .format when not passed", function() {
            var currentOptions = options.parse("");
            assert.isString(currentOptions.format);
            assert.equal(currentOptions.format, "stylish");
        });
    });

    describe("-f", function() {
        it("should return a string for .format when passed a string", function() {
            var currentOptions = options.parse("-f compact");
            assert.isString(currentOptions.format);
            assert.equal(currentOptions.format, "compact");
        });
    });

    describe("--version", function() {
        it("should return true for .version when passed", function() {
            var currentOptions = options.parse("--version");
            assert.isTrue(currentOptions.version);
        });
    });

    describe("-v", function() {
        it("should return true for .version when passed", function() {
            var currentOptions = options.parse("-v");
            assert.isTrue(currentOptions.version);
        });
    });

    describe("when asking for help", function() {
        it("should return string of help text when called", function() {
            var helpText = options.generateHelp();
            assert.isString(helpText);
        });
    });

    describe("--no-ignore", function() {
        it("should return false for .ignore when passed", function() {
            var currentOptions = options.parse("--no-ignore");
            assert.isFalse(currentOptions.ignore);
        });
    });

    describe("--ignore-path", function() {
        it("should return a string for .ignorePath when passed", function() {
            var currentOptions = options.parse("--ignore-path .gitignore");
            assert.equal(currentOptions.ignorePath, ".gitignore");
        });
    });

    describe("--color", function() {
        it("should return true for .color when passed", function() {
            var currentOptions = options.parse("--color");
            assert.isTrue(currentOptions.color);
        });
    });

    describe("--stdin", function() {
        it("should return true for .stdin when passed", function() {
            var currentOptions = options.parse("--stdin");
            assert.isTrue(currentOptions.stdin);
        });
    });

    describe("--stdin-filename", function() {
        it("should return a string for .stdinFilename when passed", function() {
            var currentOptions = options.parse("--stdin-filename test.js");
            assert.equal(currentOptions.stdinFilename, "test.js");
        });
    });

    describe("--global", function() {
        it("should return an array for a single occurrence", function() {
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

    describe("--plugin", function() {
        it("should return an array when passed a single occurrence", function() {
            var currentOptions = options.parse("--plugin single");
            assert.isArray(currentOptions.plugin);
            assert.equal(currentOptions.plugin.length, 1);
            assert.equal(currentOptions.plugin[0], "single");
        });

        it("should return an array when passed a comma-delimiated string", function() {
            var currentOptions = options.parse("--plugin foo,bar");
            assert.isArray(currentOptions.plugin);
            assert.equal(currentOptions.plugin.length, 2);
            assert.equal(currentOptions.plugin[0], "foo");
            assert.equal(currentOptions.plugin[1], "bar");
        });

        it("should return an array when passed multiple times", function() {
            var currentOptions = options.parse("--plugin foo --plugin bar");
            assert.isArray(currentOptions.plugin);
            assert.equal(currentOptions.plugin.length, 2);
            assert.equal(currentOptions.plugin[0], "foo");
            assert.equal(currentOptions.plugin[1], "bar");
        });
    });

    describe("--quiet", function() {
        it("should return true for .quiet when passed", function() {
            var currentOptions = options.parse("--quiet");
            assert.isTrue(currentOptions.quiet);
        });
    });

    describe("--max-warnings", function() {
        it("should return correct value for .maxWarnings when passed", function() {
            var currentOptions = options.parse("--max-warnings 10");
            assert.equal(currentOptions.maxWarnings, 10);
        });

        it("should return -1 for .maxWarnings when not passed", function() {
            var currentOptions = options.parse("");
            assert.equal(currentOptions.maxWarnings, -1);
        });
    });

    describe("--init", function() {
        it("should return true for --init when passed", function() {
            var currentOptions = options.parse("--init");
            assert.isTrue(currentOptions.init);
        });
    });

    describe("--fix", function() {
        it("should return true for --fix when passed", function() {
            var currentOptions = options.parse("--fix");
            assert.isTrue(currentOptions.fix);
        });
    });

    describe("--debug", function() {
        it("should return true for --debug when passed", function() {
            var currentOptions = options.parse("--debug");
            assert.isTrue(currentOptions.debug);
        });
    });

    describe("--inline-config", function() {
        it("should return false when passed --no-inline-config", function() {
            var currentOptions = options.parse("--no-inline-config");
            assert.isFalse(currentOptions.inlineConfig);
        });

        it("should return true for --inline-config when empty", function() {
            var currentOptions = options.parse("");
            assert.isTrue(currentOptions.inlineConfig);
        });
    });

    describe("--parser", function() {
        it("should return a string for --parser when passed", function() {
            var currentOptions = options.parse("--parser test");
            assert.equal(currentOptions.parser, "test");
        });

        it("should return a espree if --parser is not passed", function() {
            var currentOptions = options.parse("");
            assert.equal(currentOptions.parser, "espree");
        });
    });
});
