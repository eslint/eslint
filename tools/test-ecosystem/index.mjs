/**
 * @fileoverview A utility to test ecosystem plugin(s) against the built ESLint.
 * @author Josh Goldberg
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

import chalk from "chalk";
import spawn from "nano-spawn";
import fs from "node:fs/promises";
import path from "node:path";
import util from "node:util";
import plugins from "./plugins.json" with { type: "json" };

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

/**
 * Settings for how to clone, set up, and test an ecosystem plugin.
 * @typedef {Object} PluginSettings
 * @property {string} commit Hash to check out after cloning the plugin.
 * @property {string} repository Repository URL to clone the plugin from.
 * @see {@link plugins}
 */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Runs ecosystem tests for a single plugin. It will:
 * 1. Clone the plugin repository into a sandbox directory
 * 2. Check out the plugin's commit to test on
 * 3. Install the plugin's dependencies
 * 4. Link the built ESLint into the plugin
 * 5. Build, if the plugin defines a build script
 * 6. Run tests
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

	/** @param {string} command */
	/** @param {string[]} args */
	const runCommand = async (command, ...args) => {
		console.log(chalk.gray(`[${pluginKey}]`, [command, ...args].join(" ")));
		try {
			return await spawn(command, args, {
				cwd: directory,
			});
		} catch (error) {
			console.error(
				chalk.red(`[${pluginKey}]`),
				"stdout" in error ? error.stdout : error,
			);
			throw error;
		}
	};

	// 1. Clone the plugin repository into a sandbox directory
	await fs.mkdir(directory, { force: true });
	await runCommand(
		"git",
		"clone",
		pluginSettings.repository,
		directory,
		"--depth",
		"1",
	);

	// 2. Check out the plugin's commit to test on
	await runCommand("git", "fetch", "origin", pluginSettings.commit);
	await runCommand("git", "checkout", pluginSettings.commit);

	// 3. Install the plugin's dependencies
	await runCommand("pwd");
	await runCommand("ni");

	// 4. Link the built ESLint into the plugin
	await runCommand("npm", "link", "eslint");

	const packageJsonPath = path.resolve(
		process.cwd(),
		path.join(directory, "package.json"),
	);
	const packageJson = await import(packageJsonPath, {
		with: { type: "json" },
	});

	// 5. Build, if the plugin defines a build script
	if (packageJson.default.scripts.build) {
		await runCommand("nr", "build");
	}

	// 6. Run test
	await runCommand("nr", "test");
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

if (pluginRequested !== "all" && !(pluginRequested in plugins)) {
	console.error(`The plugin "${values.plugin}" is not supported.`);
	console.error(
		`Supported plugins are: ${Array.from(plugins.keys()).join(", ")}`,
	);
	console.error(`Alternately, run with --plugin all to test all plugins.`);
	process.exit(1);
}

const pluginsToTest =
	pluginRequested === "all"
		? Object.entries(plugins)
		: [[pluginRequested, plugins[pluginRequested]]];

console.log(
	"Plugins to test:",
	chalk.bold(pluginsToTest.map(([key]) => key).join(", ")),
);

const SANDBOX_DIRECTORY = path.join(process.cwd(), "ecosystem");

console.log(`Clearing existing sandbox directory: ${SANDBOX_DIRECTORY}`);
await fs.rm(SANDBOX_DIRECTORY, {
	force: true,
	maxRetries: 8,
	recursive: true,
});
await fs.mkdir(SANDBOX_DIRECTORY, { recursive: true });
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
} else {
	console.log(chalk.green("All tests completed successfully."));
}
