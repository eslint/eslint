/**
 * @fileoverview A utility to test an ecosystem plugin against the built ESLint.
 * @author Josh Goldberg
 */


import chalk from "chalk";
import { $ } from "execa";
import fs from "node:fs/promises";
import path from "node:path";
import util from "node:util";

const plugins = new Map([
	[
		"eslint-plugin-unicorn",
		{ repository: "https://github.com/sindresorhus/eslint-plugin-unicorn" },
	],
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
		"eslint-plugin-vue",
		{ repository: "https://github.com/vuejs/eslint-plugin-vue" },
	],
	[
		"typescript-eslint",
		{
			linker: `na link ${process.cwd()}`,
			repository:
				"https://github.com/typescript-eslint/typescript-eslint",
		},
	],
]);

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
	console.error(
		`The plugin "${
			values.plugin
		}" is not supported. Supported plugins are: ${Array.from(
			plugins.keys(),
		).join(", ")}`,
	);
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

for (const [pluginKey, pluginSettings] of pluginsToTest) {
	try {
		await runTests(pluginKey, pluginSettings);
	} catch (error) {
		errors.push({ error, pluginKey });
	}

	console.log("");
}

if (errors.length) {
	console.error(chalk.red("Errors occurred while testing plugins:"));
	for (const { error, pluginKey } of errors) {
		console.error(`${chalk.bold.red(pluginKey)}: ${chalk.red(error)}`);
	}
	process.exitCode = 1;
}

console.log(chalk.green("All tests completed successfully."));

async function runTests(pluginKey, pluginSettings) {
	const directory = path.join(
		SANDBOX_DIRECTORY,
		pluginKey
			.replaceAll(/[^a-z-]/g, " ")
			.trim()
			.replaceAll(" ", "-"),
	);
	console.log(chalk.bold(`Testing ${pluginKey} in ${directory}`));

	await fs.mkdir(directory, { force: true });

	await $`git clone ${pluginSettings.repository} ${directory} --depth 1`;

	const shell = $({
		cwd: directory,
		shell: true,
		stdio: "inherit",
	});

	async function runCommand(command) {
		console.log(chalk.gray(`Running command: ${command}`));
		return await shell(command);
	}

	await runCommand(`pwd`);
	await runCommand(`ni`);
	await runCommand(pluginSettings.linker ?? "npm link eslint");

	const packageJsonPath = path.resolve(
		process.cwd(),
		path.join(directory, "package.json"),
	);
	const packageJson = await import(packageJsonPath, {
		with: { type: "json" },
	});

	if (packageJson.default.scripts.build) {
		await runCommand(`nr build`);
	}

	if (packageJson.default.scripts["test:eslint-compat"]) {
		await runCommand(`nr test:eslint-compat`);
	} else {
		await runCommand(`nr test`);
	}
}
