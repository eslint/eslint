"use strict";

const { assert } = require("chai");

/**
 * Retrieves the generated message for the given template name and data.
 * @param {string} templateName The name of the message template.
 * @param {Record<PropertyKey, unknown>} messageData The data to pass to the message template.
 * @returns {string} The generated message.
 */
function getMessage(templateName, messageData = {}) {
	const template = require(`../../messages/${templateName}.js`);
	return template(messageData);
}

describe("messages", () => {
	describe("all-matched-files-ignored", () => {
		it("should return a message", () => {
			const pattern = "foo/bar";
			const message = getMessage("all-matched-files-ignored", {
				pattern,
			});

			assert.include(
				message,
				`You are linting "${pattern}", but all of the files matching the glob pattern "${pattern}" are ignored.`,
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/ignore",
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/configuration-files#specify-files-with-arbitrary-extensions",
			);
		});
	});

	describe("config-file-missing", () => {
		it("should return a message", () => {
			const message = getMessage("config-file-missing");

			assert.include(
				message,
				"ESLint couldn't find an eslint.config.(js|mjs|cjs) file.",
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide",
			);
		});
	});

	describe("config-plugin-missing", () => {
		it("should return a message", () => {
			const pluginName = "eslint-plugin-foo";
			const ruleId = "foo/bar";
			const message = getMessage("config-plugin-missing", {
				pluginName,
				ruleId,
			});

			assert.include(
				message,
				`A configuration object specifies rule "${ruleId}", but could not find plugin "${pluginName}".`,
			);
		});
	});

	describe("config-serialize-function", () => {
		it("should return a generic message", () => {
			const key = "foo";
			const objectKey = "bar";
			const message = getMessage("config-serialize-function", {
				key,
				objectKey,
			});

			assert.include(
				message,
				`the configuration key "${objectKey}.${key}" contains a function value`,
			);
		});

		it("should return a message for a parser", () => {
			const key = "parse";
			const objectKey = "parser";
			const message = getMessage("config-serialize-function", {
				key,
				objectKey,
			});

			assert.include(
				message,
				`the configuration key "${objectKey}.${key}" contains a function value`,
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/extend/custom-parsers#meta-data-in-custom-parsers",
			);
		});
	});

	describe("eslintrc-incompat", () => {
		it("should return a message for key `env`", () => {
			const message = getMessage("eslintrc-incompat", { key: "env" });

			assert.include(message, 'A config object is using the "env" key');
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#configure-language-options",
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#use-eslintrc-configs-in-flat-config",
			);
		});

		it("should return a message for key `extends`", () => {
			const message = getMessage("eslintrc-incompat", { key: "extends" });

			assert.include(
				message,
				'A config object is using the "extends" key',
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#predefined-and-shareable-configs",
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#use-eslintrc-configs-in-flat-config",
			);
		});

		it("should return a message for key `globals`", () => {
			const message = getMessage("eslintrc-incompat", { key: "globals" });

			assert.include(
				message,
				'A config object is using the "globals" key',
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#configure-language-options",
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#use-eslintrc-configs-in-flat-config",
			);
		});

		it("should return a message for key `ignorePatterns`", () => {
			const message = getMessage("eslintrc-incompat", {
				key: "ignorePatterns",
			});

			assert.include(
				message,
				'A config object is using the "ignorePatterns" key',
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#ignore-files",
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#use-eslintrc-configs-in-flat-config",
			);
		});

		it("should return a message for key `noInlineConfig`", () => {
			const message = getMessage("eslintrc-incompat", {
				key: "noInlineConfig",
			});

			assert.include(
				message,
				'A config object is using the "noInlineConfig" key',
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#linter-options",
			);
		});

		it("should return a message for key `overrides`", () => {
			const message = getMessage("eslintrc-incompat", {
				key: "overrides",
			});

			assert.include(
				message,
				'A config object is using the "overrides" key',
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#glob-based-configs",
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#use-eslintrc-configs-in-flat-config",
			);
		});

		it("should return a message for key `parser`", () => {
			const message = getMessage("eslintrc-incompat", { key: "parser" });

			assert.include(
				message,
				'A config object is using the "parser" key',
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#custom-parsers",
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#use-eslintrc-configs-in-flat-config",
			);
		});

		it("should return a message for key `parserOptions`", () => {
			const message = getMessage("eslintrc-incompat", {
				key: "parserOptions",
			});

			assert.include(
				message,
				'A config object is using the "parserOptions" key',
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#configure-language-options",
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#use-eslintrc-configs-in-flat-config",
			);
		});

		it("should return a message for key `reportUnusedDisableDirectives`", () => {
			const message = getMessage("eslintrc-incompat", {
				key: "reportUnusedDisableDirectives",
			});

			assert.include(
				message,
				'A config object is using the "reportUnusedDisableDirectives" key',
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#linter-options",
			);
		});

		it("should return a message for key `root`", () => {
			const message = getMessage("eslintrc-incompat", { key: "root" });

			assert.include(message, 'A config object is using the "root" key');
		});
	});

	describe("eslintrc-plugins", () => {
		it("should return a message with an array of strings", () => {
			const pluginName = "eslint-plugin-foo";
			const message = getMessage("eslintrc-plugins", {
				plugins: [pluginName],
			});

			assert.include(
				message,
				`A config object has a "plugins" key defined as an array of strings. It looks something like this:

    {
        "plugins": ["${pluginName}"]
    }

Flat config requires "plugins" to be an object, like this:

    {
        plugins: {
            ${pluginName}: pluginObject
        }
    }`,
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#import-plugins-and-custom-parsers",
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#use-eslintrc-configs-in-flat-config",
			);
		});

		it("should return a message with an empty array", () => {
			const message = getMessage("eslintrc-plugins", { plugins: [] });

			assert.include(
				message,
				`A config object has a "plugins" key defined as an array. It looks something like this:

    {
        "plugins": []
    }

Flat config requires "plugins" to be an object, like this:

    {
        plugins: {
            namespace: pluginObject
        }
    }`,
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#import-plugins-and-custom-parsers",
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/migration-guide#use-eslintrc-configs-in-flat-config",
			);
		});
	});

	describe("file-not-found", () => {
		it("should return a message with globDisabled false", () => {
			const pattern = "foo/**";
			const message = getMessage("file-not-found", {
				pattern,
				globDisabled: false,
			});

			assert.include(
				message,
				`No files matching the pattern "${pattern}" were found.`,
			);
		});

		it("should return a message with globDisabled true", () => {
			const pattern = "bar/**";
			const message = getMessage("file-not-found", {
				pattern,
				globDisabled: true,
			});

			assert.include(
				message,
				`No files matching the pattern "${pattern}" (with disabling globs) were found.`,
			);
		});
	});

	describe("invalid-rule-options", () => {
		it("should return a message", () => {
			const ruleId = "no-undef";
			const value = { some: "option" };
			const message = getMessage("invalid-rule-options", {
				ruleId,
				value,
			});

			assert.include(
				message,
				`Configuration for rule "${ruleId}" is invalid.`,
			);
			assert.include(
				message,
				`You passed '{
        "some": "option"
    }', which doesn't contain a valid severity.`,
			);
			assert.include(
				message,
				`perhaps you meant:

    "${ruleId}": ["error", {
            "some": "option"
        }]`,
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/rules#use-configuration-files",
			);
		});
	});

	describe("invalid-rule-severity", () => {
		it("should return a message", () => {
			const ruleId = "no-undef";
			const value = "foo";
			const message = getMessage("invalid-rule-severity", {
				ruleId,
				value,
			});

			assert.include(
				message,
				`Configuration for rule "${ruleId}" is invalid. Expected severity of "off", 0, "warn", 1, "error", or 2.`,
			);
			assert.include(message, `You passed '"foo"'.`);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/configure/rules#use-configuration-files",
			);
		});
	});
});
