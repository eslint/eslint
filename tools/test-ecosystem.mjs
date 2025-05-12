/**
 * @fileoverview A utility to test ecosystem plugin(s) against the built ESLint.
 * @author Josh Goldberg
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

import chalk from "chalk";
import { $ } from "execa";
import fs from "node:fs/promises";
import path from "node:path";
import util from "node:util";

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

/**
 * Settings for how to clone, set up, and test an ecosystem plugin.
 * @typedef {Object} PluginSettings
 * @property {string} repository Repository URL to clone the plugin from.
 */

/**
 * Plugins to test against the built ESLint.
 * Keys CLI plugin names to objects with plugin settings.
 * @type {Map<string, PluginSettings>}
 */
const plugins = new Map([
	["@eslint/css", { repository: "https://github.com/eslint/css" }],
	["@eslint/json", { repository: "https://github.com/eslint/json" }],
	["@eslint/markdown", { repository: "https://github.com/eslint/markdown" }],
	[
		"@eslint-community/eslint-plugin-eslint-comments",
		{
			repository:
				"https://github.com/eslint-community/eslint-plugin-eslint-comments",
		},
	],
	[
		"eslint-plugin-unicorn",
		{ repository: "https://github.com/sindresorhus/eslint-plugin-unicorn" },
	],
	[
		"eslint-plugin-vue",
		{ repository: "https://github.com/vuejs/eslint-plugin-vue" },
	],
]);

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Runs ecosystem tests for a single plugin. It will:
 * 1. Clone the plugin repository into a sandbox directory
 * 2. Install the plugin's dependencies
 * 3. Link the built ESLint into the plugin
 * 4. Build, if the plugin defines a build script
 * 5. Run tests, using test:eslint-compat over test if available
 * This intentionally does not try/catch: any errors will be thrown.
 *
 * @param {string} pluginKey
 * @param {PluginSettings} pluginSettings
 */
async function runTests(pluginKey, pluginSettings) {
	const directory = path.join(
		SANDBOX_DIRECTORY,
		pluginKey
			.replaceAll(/[^a-z-]/g, " ")
			.trim()
			.replaceAll(" ", "-"),
	);
	console.log(chalk.bold(`Testing ${pluginKey} in ${directory}`));

	// 1. Clone the plugin repository into a sandbox directory
	await fs.mkdir(directory, { force: true });
	await $`git clone ${pluginSettings.repository} ${directory} --depth 1`;

	const shell = $({
		cwd: directory,
		shell: true,
		stdio: "inherit",
	});

	/** @param {string} command */
	const runCommand = async command => {
		console.log(chalk.gray(`Running command: ${command}`));
		return await shell(command);
	};

	// 2. Install the plugin's dependencies
	await runCommand(`pwd`);
	await runCommand(`ni`);

	// 3. Link the built ESLint into the plugin
	await runCommand(`npm link eslint`);

	const packageJsonPath = path.resolve(
		process.cwd(),
		path.join(directory, "package.json"),
	);
	const packageJson = await import(packageJsonPath, {
		with: { type: "json" },
	});

	// 4. Build, if the plugin defines a build script
	if (packageJson.default.scripts.build) {
		await runCommand(`nr build`);
	}

	// 5. Run tests, using test:eslint-compat over test if available
	if (packageJson.default.scripts["test:eslint-compat"]) {
		await runCommand(`nr test:eslint-compat`);
	} else {
		await runCommand(`nr test`);
	}
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

const { values } = util.parseArgs({
	options: {
		plugin: {
			type: "string",
			help: "The name of the plugin to test, or 'all' for all plugins",
		},
	},
});

const { plugin: pluginRequested } = values;
if (!values.plugin) {
	console.error("Please provide a plugin name or 'all' with --plugin");
	process.exit(1);
}

const pluginsToTest =
	pluginRequested === "all"
		? Array.from(plugins)
		: [[pluginRequested, plugins.get(pluginRequested)]];

if (!pluginsToTest) {
	console.error(`The plugin "${values.plugin}" is not supported.`);
	console.error(
		`Supported plugins are: ${Array.from(plugins.keys()).join(", ")}`,
	);
	console.error(`Alternately, run with --plugin all to test all plugins.`);
	process.exit(1);
}

console.log(
	"Plugins to test:",
	chalk.bold(pluginsToTest.map(([key]) => key).join(", ")),
);

const SANDBOX_DIRECTORY = path.join(process.cwd(), "ecosystem");

console.log(`Clearing existing sandbox directory: ${SANDBOX_DIRECTORY}`);
await $`rm -rf ${SANDBOX_DIRECTORY}`;
await $`mkdir -p ${SANDBOX_DIRECTORY}`;
console.log("");

const errors = [];

// For each plugin to test, we try to runTests, recording thrown exceptions in errors
for (const [pluginKey, pluginSettings] of pluginsToTest) {
	try {
		await runTests(pluginKey, pluginSettings);
	} catch (error) {
		errors.push({ error, pluginKey });
	}

	console.log("");
}

// If we had any errors, report them and exit as failed
if (errors.length) {
	console.error(chalk.red("Errors occurred while testing plugins:"));
	for (const { error, pluginKey } of errors) {
		console.error(`${chalk.bold.red(pluginKey)}: ${chalk.red(error)}`);
	}
	process.exitCode = 1;
}

// Otherwise, we had no errors, so report a success
console.log(chalk.green("All tests completed successfully."));
