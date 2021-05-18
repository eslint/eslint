/**
 * @fileoverview Tests for options.
 * @author George Zahariev
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    options = require("../../lib/options");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

/*
 * This is testing the interface of the options object.
 */

describe("options", () => {
    describe("--help", () => {
        it("should return true for .help when passed", () => {
            const currentOptions = options.parse("--help");

            assert.isTrue(currentOptions.help);
        });
    });

    describe("-h", () => {
        it("should return true for .help when passed", () => {
            const currentOptions = options.parse("-h");

            assert.isTrue(currentOptions.help);
        });
    });

    describe("--config", () => {
        it("should return a string for .config when passed a string", () => {
            const currentOptions = options.parse("--config file");

            assert.isString(currentOptions.config);
            assert.strictEqual(currentOptions.config, "file");
        });
    });

    describe("-c", () => {
        it("should return a string for .config when passed a string", () => {
            const currentOptions = options.parse("-c file");

            assert.isString(currentOptions.config);
            assert.strictEqual(currentOptions.config, "file");
        });
    });

    describe("--ext", () => {
        it("should return an array with one item when passed .jsx", () => {
            const currentOptions = options.parse("--ext .jsx");

            assert.isArray(currentOptions.ext);
            assert.strictEqual(currentOptions.ext[0], ".jsx");
        });

        it("should return an array with two items when passed .js and .jsx", () => {
            const currentOptions = options.parse("--ext .jsx --ext .js");

            assert.isArray(currentOptions.ext);
            assert.strictEqual(currentOptions.ext[0], ".jsx");
            assert.strictEqual(currentOptions.ext[1], ".js");
        });

        it("should return an array with two items when passed .jsx,.js", () => {
            const currentOptions = options.parse("--ext .jsx,.js");

            assert.isArray(currentOptions.ext);
            assert.strictEqual(currentOptions.ext[0], ".jsx");
            assert.strictEqual(currentOptions.ext[1], ".js");
        });

        it("should return an array one item when not passed", () => {
            const currentOptions = options.parse("");

            assert.isArray(currentOptions.ext);
            assert.strictEqual(currentOptions.ext[0], ".js");
        });
    });

    describe("--rulesdir", () => {
        it("should return a string for .rulesdir when passed a string", () => {
            const currentOptions = options.parse("--rulesdir /morerules");

            assert.isArray(currentOptions.rulesdir);
            assert.deepStrictEqual(currentOptions.rulesdir, ["/morerules"]);
        });
    });

    describe("--format", () => {
        it("should return a string for .format when passed a string", () => {
            const currentOptions = options.parse("--format compact");

            assert.isString(currentOptions.format);
            assert.strictEqual(currentOptions.format, "compact");
        });

        it("should return stylish for .format when not passed", () => {
            const currentOptions = options.parse("");

            assert.isString(currentOptions.format);
            assert.strictEqual(currentOptions.format, "stylish");
        });
    });

    describe("-f", () => {
        it("should return a string for .format when passed a string", () => {
            const currentOptions = options.parse("-f compact");

            assert.isString(currentOptions.format);
            assert.strictEqual(currentOptions.format, "compact");
        });
    });

    describe("--version", () => {
        it("should return true for .version when passed", () => {
            const currentOptions = options.parse("--version");

            assert.isTrue(currentOptions.version);
        });
    });

    describe("-v", () => {
        it("should return true for .version when passed", () => {
            const currentOptions = options.parse("-v");

            assert.isTrue(currentOptions.version);
        });
    });

    describe("when asking for help", () => {
        it("should return string of help text when called", () => {
            const helpText = options.generateHelp();

            assert.isString(helpText);
        });
    });

    describe("--no-ignore", () => {
        it("should return false for .ignore when passed", () => {
            const currentOptions = options.parse("--no-ignore");

            assert.isFalse(currentOptions.ignore);
        });
    });

    describe("--ignore-path", () => {
        it("should return a string for .ignorePath when passed", () => {
            const currentOptions = options.parse("--ignore-path .gitignore");

            assert.strictEqual(currentOptions.ignorePath, ".gitignore");
        });
    });

    describe("--ignore-pattern", () => {
        it("should return a string array for .ignorePattern when passed", () => {
            const currentOptions = options.parse("--ignore-pattern *.js");

            assert.ok(currentOptions.ignorePattern);
            assert.strictEqual(currentOptions.ignorePattern.length, 1);
            assert.strictEqual(currentOptions.ignorePattern[0], "*.js");
        });

        it("should return a string array for multiple values", () => {
            const currentOptions = options.parse("--ignore-pattern *.js --ignore-pattern *.ts");

            assert.ok(currentOptions.ignorePattern);
            assert.strictEqual(currentOptions.ignorePattern.length, 2);
            assert.strictEqual(currentOptions.ignorePattern[0], "*.js");
            assert.strictEqual(currentOptions.ignorePattern[1], "*.ts");
        });

        it("should return a string array of properly parsed values, when those values include commas", () => {
            const currentOptions = options.parse("--ignore-pattern *.js --ignore-pattern foo-{bar,baz}.js");

            assert.ok(currentOptions.ignorePattern);
            assert.strictEqual(currentOptions.ignorePattern.length, 2);
            assert.strictEqual(currentOptions.ignorePattern[0], "*.js");
            assert.strictEqual(currentOptions.ignorePattern[1], "foo-{bar,baz}.js");
        });
    });

    describe("--color", () => {
        it("should return true for .color when passed --color", () => {
            const currentOptions = options.parse("--color");

            assert.isTrue(currentOptions.color);
        });

        it("should return false for .color when passed --no-color", () => {
            const currentOptions = options.parse("--no-color");

            assert.isFalse(currentOptions.color);
        });
    });

    describe("--stdin", () => {
        it("should return true for .stdin when passed", () => {
            const currentOptions = options.parse("--stdin");

            assert.isTrue(currentOptions.stdin);
        });
    });

    describe("--stdin-filename", () => {
        it("should return a string for .stdinFilename when passed", () => {
            const currentOptions = options.parse("--stdin-filename test.js");

            assert.strictEqual(currentOptions.stdinFilename, "test.js");
        });
    });

    describe("--global", () => {
        it("should return an array for a single occurrence", () => {
            const currentOptions = options.parse("--global foo");

            assert.isArray(currentOptions.global);
            assert.strictEqual(currentOptions.global.length, 1);
            assert.strictEqual(currentOptions.global[0], "foo");
        });

        it("should split variable names using commas", () => {
            const currentOptions = options.parse("--global foo,bar");

            assert.isArray(currentOptions.global);
            assert.strictEqual(currentOptions.global.length, 2);
            assert.strictEqual(currentOptions.global[0], "foo");
            assert.strictEqual(currentOptions.global[1], "bar");
        });

        it("should not split on colons", () => {
            const currentOptions = options.parse("--global foo:false,bar:true");

            assert.isArray(currentOptions.global);
            assert.strictEqual(currentOptions.global.length, 2);
            assert.strictEqual(currentOptions.global[0], "foo:false");
            assert.strictEqual(currentOptions.global[1], "bar:true");
        });

        it("should concatenate successive occurrences", () => {
            const currentOptions = options.parse("--global foo:true --global bar:false");

            assert.isArray(currentOptions.global);
            assert.strictEqual(currentOptions.global.length, 2);
            assert.strictEqual(currentOptions.global[0], "foo:true");
            assert.strictEqual(currentOptions.global[1], "bar:false");
        });
    });

    describe("--plugin", () => {
        it("should return an array when passed a single occurrence", () => {
            const currentOptions = options.parse("--plugin single");

            assert.isArray(currentOptions.plugin);
            assert.strictEqual(currentOptions.plugin.length, 1);
            assert.strictEqual(currentOptions.plugin[0], "single");
        });

        it("should return an array when passed a comma-delimiated string", () => {
            const currentOptions = options.parse("--plugin foo,bar");

            assert.isArray(currentOptions.plugin);
            assert.strictEqual(currentOptions.plugin.length, 2);
            assert.strictEqual(currentOptions.plugin[0], "foo");
            assert.strictEqual(currentOptions.plugin[1], "bar");
        });

        it("should return an array when passed multiple times", () => {
            const currentOptions = options.parse("--plugin foo --plugin bar");

            assert.isArray(currentOptions.plugin);
            assert.strictEqual(currentOptions.plugin.length, 2);
            assert.strictEqual(currentOptions.plugin[0], "foo");
            assert.strictEqual(currentOptions.plugin[1], "bar");
        });
    });

    describe("--quiet", () => {
        it("should return true for .quiet when passed", () => {
            const currentOptions = options.parse("--quiet");

            assert.isTrue(currentOptions.quiet);
        });
    });

    describe("--max-warnings", () => {
        it("should return correct value for .maxWarnings when passed", () => {
            const currentOptions = options.parse("--max-warnings 10");

            assert.strictEqual(currentOptions.maxWarnings, 10);
        });

        it("should return -1 for .maxWarnings when not passed", () => {
            const currentOptions = options.parse("");

            assert.strictEqual(currentOptions.maxWarnings, -1);
        });

        it("should throw an error when supplied with a non-integer", () => {
            assert.throws(() => {
                options.parse("--max-warnings 10.2");
            }, /Invalid value for option 'max-warnings' - expected type Int/u);
        });
    });

    describe("--init", () => {
        it("should return true for --init when passed", () => {
            const currentOptions = options.parse("--init");

            assert.isTrue(currentOptions.init);
        });
    });

    describe("--fix", () => {
        it("should return true for --fix when passed", () => {
            const currentOptions = options.parse("--fix");

            assert.isTrue(currentOptions.fix);
        });
    });

    describe("--fix-type", () => {
        it("should return one value with --fix-type is passed", () => {
            const currentOptions = options.parse("--fix-type problem");

            assert.strictEqual(currentOptions.fixType.length, 1);
            assert.strictEqual(currentOptions.fixType[0], "problem");
        });

        it("should return two values when --fix-type is passed twice", () => {
            const currentOptions = options.parse("--fix-type problem --fix-type suggestion");

            assert.strictEqual(currentOptions.fixType.length, 2);
            assert.strictEqual(currentOptions.fixType[0], "problem");
            assert.strictEqual(currentOptions.fixType[1], "suggestion");
        });

        it("should return two values when --fix-type is passed a comma-separated value", () => {
            const currentOptions = options.parse("--fix-type problem,suggestion");

            assert.strictEqual(currentOptions.fixType.length, 2);
            assert.strictEqual(currentOptions.fixType[0], "problem");
            assert.strictEqual(currentOptions.fixType[1], "suggestion");
        });
    });

    describe("--debug", () => {
        it("should return true for --debug when passed", () => {
            const currentOptions = options.parse("--debug");

            assert.isTrue(currentOptions.debug);
        });
    });

    describe("--inline-config", () => {
        it("should return false when passed --no-inline-config", () => {
            const currentOptions = options.parse("--no-inline-config");

            assert.isFalse(currentOptions.inlineConfig);
        });

        it("should return true for --inline-config when empty", () => {
            const currentOptions = options.parse("");

            assert.isTrue(currentOptions.inlineConfig);
        });
    });

    describe("--parser", () => {
        it("should return a string for --parser when passed", () => {
            const currentOptions = options.parse("--parser test");

            assert.strictEqual(currentOptions.parser, "test");
        });
    });

    describe("--print-config", () => {
        it("should return file path when passed --print-config", () => {
            const currentOptions = options.parse("--print-config file.js");

            assert.strictEqual(currentOptions.printConfig, "file.js");
        });
    });
});
