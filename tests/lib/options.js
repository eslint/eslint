/**
 * @fileoverview Tests for options.
 * @author George Zahariev
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert"),
	createOptions = require("../../lib/options");

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const eslintrcOptions = createOptions(false);
const flatOptions = createOptions(true);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

/*
 * This is testing the interface of the options object.
 */

describe("options", () => {
	describe("Common options", () => {
		[eslintrcOptions, flatOptions].forEach(options => {
			describe("--help", () => {
				it("should return true for .help when passed", () => {
					const currentOptions = options.parse("--help");

					assert.strictEqual(currentOptions.help, true);
				});
			});

			describe("-h", () => {
				it("should return true for .help when passed", () => {
					const currentOptions = options.parse("-h");

					assert.strictEqual(currentOptions.help, true);
				});
			});

			describe("--config", () => {
				it("should return a string for .config when passed a string", () => {
					const currentOptions = options.parse("--config file");

					assert.strictEqual(typeof currentOptions.config, "string");
					assert.strictEqual(currentOptions.config, "file");
				});
			});

			describe("-c", () => {
				it("should return a string for .config when passed a string", () => {
					const currentOptions = options.parse("-c file");

					assert.strictEqual(typeof currentOptions.config, "string");
					assert.strictEqual(currentOptions.config, "file");
				});
			});

			describe("--format", () => {
				it("should return a string for .format when passed a string", () => {
					const currentOptions = options.parse("--format json");

					assert.strictEqual(typeof currentOptions.format, "string");
					assert.strictEqual(currentOptions.format, "json");
				});

				it("should return stylish for .format when not passed", () => {
					const currentOptions = options.parse("");

					assert.strictEqual(typeof currentOptions.format, "string");
					assert.strictEqual(currentOptions.format, "stylish");
				});
			});

			describe("-f", () => {
				it("should return a string for .format when passed a string", () => {
					const currentOptions = options.parse("-f json");

					assert.strictEqual(typeof currentOptions.format, "string");
					assert.strictEqual(currentOptions.format, "json");
				});
			});

			describe("--version", () => {
				it("should return true for .version when passed", () => {
					const currentOptions = options.parse("--version");

					assert.strictEqual(currentOptions.version, true);
				});
			});

			describe("-v", () => {
				it("should return true for .version when passed", () => {
					const currentOptions = options.parse("-v");

					assert.strictEqual(currentOptions.version, true);
				});
			});

			describe("when asking for help", () => {
				it("should return string of help text when called", () => {
					const helpText = options.generateHelp();

					assert.strictEqual(typeof helpText, "string");
				});
			});

			describe("--no-ignore", () => {
				it("should return false for .ignore when passed", () => {
					const currentOptions = options.parse("--no-ignore");

					assert.strictEqual(currentOptions.ignore, false);
				});
			});

			describe("--ignore-pattern", () => {
				it("should return a string array for .ignorePattern when passed", () => {
					const currentOptions = options.parse(
						"--ignore-pattern *.js",
					);

					assert.ok(currentOptions.ignorePattern);
					assert.strictEqual(currentOptions.ignorePattern.length, 1);
					assert.strictEqual(currentOptions.ignorePattern[0], "*.js");
				});

				it("should return a string array for multiple values", () => {
					const currentOptions = options.parse(
						"--ignore-pattern *.js --ignore-pattern *.ts",
					);

					assert.ok(currentOptions.ignorePattern);
					assert.strictEqual(currentOptions.ignorePattern.length, 2);
					assert.strictEqual(currentOptions.ignorePattern[0], "*.js");
					assert.strictEqual(currentOptions.ignorePattern[1], "*.ts");
				});

				it("should return a string array of properly parsed values, when those values include commas", () => {
					const currentOptions = options.parse(
						"--ignore-pattern *.js --ignore-pattern foo-{bar,baz}.js",
					);

					assert.ok(currentOptions.ignorePattern);
					assert.strictEqual(currentOptions.ignorePattern.length, 2);
					assert.strictEqual(currentOptions.ignorePattern[0], "*.js");
					assert.strictEqual(
						currentOptions.ignorePattern[1],
						"foo-{bar,baz}.js",
					);
				});
			});

			describe("--color", () => {
				it("should return true for .color when passed --color", () => {
					const currentOptions = options.parse("--color");

					assert.strictEqual(currentOptions.color, true);
				});

				it("should return false for .color when passed --no-color", () => {
					const currentOptions = options.parse("--no-color");

					assert.strictEqual(currentOptions.color, false);
				});
			});

			describe("--stdin", () => {
				it("should return true for .stdin when passed", () => {
					const currentOptions = options.parse("--stdin");

					assert.strictEqual(currentOptions.stdin, true);
				});
			});

			describe("--stdin-filename", () => {
				it("should return a string for .stdinFilename when passed", () => {
					const currentOptions = options.parse(
						"--stdin-filename test.js",
					);

					assert.strictEqual(currentOptions.stdinFilename, "test.js");
				});
			});

			describe("--global", () => {
				it("should return an array for a single occurrence", () => {
					const currentOptions = options.parse("--global foo");

					assert.ok(Array.isArray(currentOptions.global));
					assert.strictEqual(currentOptions.global.length, 1);
					assert.strictEqual(currentOptions.global[0], "foo");
				});

				it("should split variable names using commas", () => {
					const currentOptions = options.parse("--global foo,bar");

					assert.ok(Array.isArray(currentOptions.global));
					assert.strictEqual(currentOptions.global.length, 2);
					assert.strictEqual(currentOptions.global[0], "foo");
					assert.strictEqual(currentOptions.global[1], "bar");
				});

				it("should not split on colons", () => {
					const currentOptions = options.parse(
						"--global foo:false,bar:true",
					);

					assert.ok(Array.isArray(currentOptions.global));
					assert.strictEqual(currentOptions.global.length, 2);
					assert.strictEqual(currentOptions.global[0], "foo:false");
					assert.strictEqual(currentOptions.global[1], "bar:true");
				});

				it("should concatenate successive occurrences", () => {
					const currentOptions = options.parse(
						"--global foo:true --global bar:false",
					);

					assert.ok(Array.isArray(currentOptions.global));
					assert.strictEqual(currentOptions.global.length, 2);
					assert.strictEqual(currentOptions.global[0], "foo:true");
					assert.strictEqual(currentOptions.global[1], "bar:false");
				});
			});

			describe("--quiet", () => {
				it("should return true for .quiet when passed", () => {
					const currentOptions = options.parse("--quiet");

					assert.strictEqual(currentOptions.quiet, true);
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

					assert.strictEqual(currentOptions.init, true);
				});
			});

			describe("--fix", () => {
				it("should return true for --fix when passed", () => {
					const currentOptions = options.parse("--fix");

					assert.strictEqual(currentOptions.fix, true);
				});
			});

			describe("--fix-type", () => {
				it("should return one value with --fix-type is passed", () => {
					const currentOptions = options.parse("--fix-type problem");

					assert.strictEqual(currentOptions.fixType.length, 1);
					assert.strictEqual(currentOptions.fixType[0], "problem");
				});

				it("should return two values when --fix-type is passed twice", () => {
					const currentOptions = options.parse(
						"--fix-type problem --fix-type suggestion",
					);

					assert.strictEqual(currentOptions.fixType.length, 2);
					assert.strictEqual(currentOptions.fixType[0], "problem");
					assert.strictEqual(currentOptions.fixType[1], "suggestion");
				});

				it("should return two values when --fix-type is passed a comma-separated value", () => {
					const currentOptions = options.parse(
						"--fix-type problem,suggestion",
					);

					assert.strictEqual(currentOptions.fixType.length, 2);
					assert.strictEqual(currentOptions.fixType[0], "problem");
					assert.strictEqual(currentOptions.fixType[1], "suggestion");
				});
			});

			describe("--debug", () => {
				it("should return true for --debug when passed", () => {
					const currentOptions = options.parse("--debug");

					assert.strictEqual(currentOptions.debug, true);
				});
			});

			describe("--inline-config", () => {
				it("should return false when passed --no-inline-config", () => {
					const currentOptions = options.parse("--no-inline-config");

					assert.strictEqual(currentOptions.inlineConfig, false);
				});

				it("should return true for --inline-config when empty", () => {
					const currentOptions = options.parse("");

					assert.strictEqual(currentOptions.inlineConfig, true);
				});
			});

			describe("--print-config", () => {
				it("should return file path when passed --print-config", () => {
					const currentOptions = options.parse(
						"--print-config file.js",
					);

					assert.strictEqual(currentOptions.printConfig, "file.js");
				});
			});

			describe("--ext", () => {
				it("should return an array with one item when passed .jsx", () => {
					const currentOptions = options.parse("--ext .jsx");

					assert.ok(Array.isArray(currentOptions.ext));
					assert.strictEqual(currentOptions.ext[0], ".jsx");
				});

				it("should return an array with two items when passed .js and .jsx", () => {
					const currentOptions = options.parse(
						"--ext .jsx --ext .js",
					);

					assert.ok(Array.isArray(currentOptions.ext));
					assert.strictEqual(currentOptions.ext[0], ".jsx");
					assert.strictEqual(currentOptions.ext[1], ".js");
				});

				it("should return an array with two items when passed .jsx,.js", () => {
					const currentOptions = options.parse("--ext .jsx,.js");

					assert.ok(Array.isArray(currentOptions.ext));
					assert.strictEqual(currentOptions.ext[0], ".jsx");
					assert.strictEqual(currentOptions.ext[1], ".js");
				});

				it("should not exist when not passed", () => {
					const currentOptions = options.parse("");

					assert.ok(!("ext" in currentOptions));
				});
			});
		});
	});

	describe("--rulesdir", () => {
		it("should return a string for .rulesdir when passed a string", () => {
			const currentOptions = eslintrcOptions.parse(
				"--rulesdir /morerules",
			);

			assert.ok(Array.isArray(currentOptions.rulesdir));
			assert.deepStrictEqual(currentOptions.rulesdir, ["/morerules"]);
		});
	});

	describe("--ignore-path", () => {
		it("should return a string for .ignorePath when passed", () => {
			const currentOptions = eslintrcOptions.parse(
				"--ignore-path .gitignore",
			);

			assert.strictEqual(currentOptions.ignorePath, ".gitignore");
		});
	});

	describe("--parser", () => {
		it("should return a string for --parser when passed", () => {
			const currentOptions = eslintrcOptions.parse("--parser test");

			assert.strictEqual(currentOptions.parser, "test");
		});
	});

	describe("--plugin", () => {
		it("should return an array when passed a single occurrence", () => {
			const currentOptions = eslintrcOptions.parse("--plugin single");

			assert.ok(Array.isArray(currentOptions.plugin));
			assert.strictEqual(currentOptions.plugin.length, 1);
			assert.strictEqual(currentOptions.plugin[0], "single");
		});

		it("should return an array when passed a comma-delimited string", () => {
			const currentOptions = eslintrcOptions.parse("--plugin foo,bar");

			assert.ok(Array.isArray(currentOptions.plugin));
			assert.strictEqual(currentOptions.plugin.length, 2);
			assert.strictEqual(currentOptions.plugin[0], "foo");
			assert.strictEqual(currentOptions.plugin[1], "bar");
		});

		it("should return an array when passed multiple times", () => {
			const currentOptions = eslintrcOptions.parse(
				"--plugin foo --plugin bar",
			);

			assert.ok(Array.isArray(currentOptions.plugin));
			assert.strictEqual(currentOptions.plugin.length, 2);
			assert.strictEqual(currentOptions.plugin[0], "foo");
			assert.strictEqual(currentOptions.plugin[1], "bar");
		});
	});

	describe("--no-config-lookup", () => {
		it("should return a boolean for .configLookup when passed a string", () => {
			const currentOptions = flatOptions.parse(
				"--no-config-lookup foo.js",
			);

			assert.strictEqual(currentOptions.configLookup, false);
		});
	});

	describe("--pass-on-no-patterns", () => {
		it("should return a boolean for .passOnNoPatterns when passed a string", () => {
			const currentOptions = flatOptions.parse("--pass-on-no-patterns");

			assert.strictEqual(currentOptions.passOnNoPatterns, true);
		});
	});

	describe("--no-warn-ignored", () => {
		it("should return false when --no-warn-ignored is passed", () => {
			const currentOptions = flatOptions.parse("--no-warn-ignored");

			assert.strictEqual(currentOptions.warnIgnored, false);
		});

		it("should return true when --warn-ignored is passed", () => {
			const currentOptions = flatOptions.parse("--warn-ignored");

			assert.strictEqual(currentOptions.warnIgnored, true);
		});
	});

	describe("--stats", () => {
		it("should return true --stats is passed", () => {
			const currentOptions = flatOptions.parse("--stats");

			assert.strictEqual(currentOptions.stats, true);
		});
	});

	describe("--inspect-config", () => {
		it("should return true when --inspect-config is passed", () => {
			const currentOptions = flatOptions.parse("--inspect-config");

			assert.strictEqual(currentOptions.inspectConfig, true);
		});
	});

	describe("--flag", () => {
		it("should return single-item array when --flag is passed once", () => {
			const currentOptions = flatOptions.parse("--flag x_feature");

			assert.deepStrictEqual(currentOptions.flag, ["x_feature"]);
		});

		it("should return multi-item array when --flag is passed multiple times", () => {
			const currentOptions = flatOptions.parse(
				"--flag x_feature --flag y_feature",
			);

			assert.deepStrictEqual(currentOptions.flag, [
				"x_feature",
				"y_feature",
			]);
		});
	});
});
