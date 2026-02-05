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
			const pluginName = "foo";
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
			const key = "toJSON";
			const objectKey = "languageOptions";
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
			const pluginName = "foo";
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

	describe("extend-config-missing (@eslint/eslintrc)", () => {
		it("should return a message", () => {
			const configName = "./missing-config.json";
			const importerName = "/path/to/project/.eslintrc";
			const message = getMessage("extend-config-missing", {
				configName,
				importerName,
			});

			assert.include(
				message,
				`ESLint couldn't find the config "${configName}" to extend from.`,
			);
			assert.include(
				message,
				`The config "${configName}" was referenced from the config file in "${importerName}".`,
			);
		});
	});

	describe("failed-to-read-json (@eslint/eslintrc)", () => {
		it("should return a message", () => {
			const path = "/path/to/project/file.json";
			const errorMessage = "Unexpected token } in JSON at position 10";
			const message = getMessage("failed-to-read-json", {
				path,
				message: errorMessage,
			});

			assert.include(message, `Failed to read JSON file at ${path}`);
			assert.include(message, errorMessage);
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

	describe("no-config-found (@eslint/eslintrc)", () => {
		it("should return a message", () => {
			const directoryPath = "/path/to/project";
			const message = getMessage("no-config-found", { directoryPath });

			assert.include(
				message,
				"ESLint couldn't find a configuration file.",
			);
			assert.include(
				message,
				`ESLint looked for configuration files in ${directoryPath} and its ancestors.`,
			);
		});
	});

	describe("plugin-conflict (@eslint/eslintrc)", () => {
		it("should return a message", () => {
			const pluginId = "eslint-plugin-foo";
			const plugins = [
				{
					filePath: "/foo/bar/baz/some-plugin.js",
					importerName: "/foo/bar/baz/.eslintrc",
				},
				{
					filePath: "/foo/bar/another-plugin.js",
					importerName: "/foo/bar/.eslintrc",
				},
			];
			const message = getMessage("plugin-conflict", {
				pluginId,
				plugins,
			});

			assert.include(
				message,
				`ESLint couldn't determine the plugin "${pluginId}" uniquely.`,
			);
			assert.include(
				message,
				`- ${plugins[0].filePath} (loaded in "${plugins[0].importerName}")`,
			);
			assert.include(
				message,
				`- ${plugins[1].filePath} (loaded in "${plugins[1].importerName}")`,
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/troubleshooting",
			);
		});
	});

	describe("plugin-invalid (@eslint/eslintrc)", () => {
		it("should return a message", () => {
			const configName = "plugin:invalid";
			const importerName = "/path/to/project/.eslintrc";
			const message = getMessage("plugin-invalid", {
				configName,
				importerName,
			});

			assert.include(
				message,
				`"${configName}" is invalid syntax for a config specifier.`,
			);
			assert.include(
				message,
				`"${configName}" was referenced from the config file in "${importerName}".`,
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/troubleshooting",
			);
		});
	});

	describe("plugin-missing (@eslint/eslintrc)", () => {
		it("should return a message", () => {
			const pluginName = "plugin:missing";
			const resolvePluginsRelativeTo = "/path/to/project";
			const importerName = "/path/to/project/.eslintrc";
			const message = getMessage("plugin-missing", {
				pluginName,
				resolvePluginsRelativeTo,
				importerName,
			});

			assert.include(
				message,
				`ESLint couldn't find the plugin "${pluginName}".`,
			);
			assert.include(
				message,
				`The package "${pluginName}" was not found when loaded as a Node module from the directory "${resolvePluginsRelativeTo}".`,
			);
			assert.include(
				message,
				`The plugin "${pluginName}" was referenced from the config file in "${importerName}".`,
			);
			assert.include(
				message,
				"https://eslint.org/docs/latest/use/troubleshooting",
			);
		});
	});

	describe("whitespace-found (@eslint/eslintrc)", () => {
		it("should return a message", () => {
			const pluginName = "eslint-plugin-foo bar";
			const message = getMessage("whitespace-found", {
				pluginName,
			});

			assert.include(
				message,
				`ESLint couldn't find the plugin "${pluginName}". because there is whitespace in the name.`,
			);
		});
	});
});
