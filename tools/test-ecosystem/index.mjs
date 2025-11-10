/**
 * @fileoverview A utility to test ecosystem plugin(s) against the built ESLint.
 * @author Josh Goldberg
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

import spawn from "nano-spawn";
import fs from "node:fs/promises";
import path from "node:path";
import { getPlugins } from "./data.mjs";

/**
 * @typedef {import("./data").PluginSettings} PluginSettings
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

	/**
	 * Attempts to run a command in the plugin sandbox directory.
	 * If it fails, any error stdout will be logged in red before a re-throw.
	 * @param {string} command
	 * @param {string[]} args
	 */
	const runCommand = async (command, ...args) => {
		console.log(chalk.gray(`[${pluginKey}]`, [command, ...args].join(" ")));
		try {
			return await spawn(command, args, {
				cwd: directory,
			});
		} catch (error) {
			console.error(
				chalk.red(`[${pluginKey}]`),
				error.stdout || error,
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

const { pluginsSelected } = await getPlugins("test");

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
for (const [pluginKey, pluginSettings] of pluginsSelected) {
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
