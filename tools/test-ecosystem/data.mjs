/**
 * @fileoverview Data utilities for ecosystem tests and updates to data.
 * @author Josh Goldberg
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

import util from "node:util";
import path from "node:path";

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------

/**
 * Settings for how to clone, set up, and test an ecosystem plugin.
 * @typedef {Object} PluginData
 * @property {string} commit Hash to check out after cloning the plugin.
 * @property {string} repository Repository URL to clone the plugin from.
 */

//-----------------------------------------------------------------------------
// Constants
//-----------------------------------------------------------------------------

export const pluginDataFilePath = path.join(
	import.meta.dirname,
	"plugins-data.json",
);

//-----------------------------------------------------------------------------
// Functions
//-----------------------------------------------------------------------------

/**
 *
 * @param {"test" | "update"} action
 * @returns {[string, PluginData][]}
 */
export async function getPlugins(action) {
	const { values } = util.parseArgs({
		options: {
			plugin: {
				type: "string",
				help: `The name of the plugin to ${action}, or 'all' for all plugins (default: 'all')`,
			},
		},
	});

	const { plugin: pluginRequested = "all" } = values;
	const { default: pluginsData } = await import(pluginDataFilePath, {
		with: { type: "json" },
	});

	if (pluginRequested !== "all" && !(pluginRequested in pluginsData)) {
		console.error(`The plugin "${values.plugin}" is not supported.`);
		console.error(
			`Supported plugins are: ${["", ...Object.keys(pluginsData)].join(
				"\n  ",
			)}`,
		);
		console.error(
			`Alternately, run without --plugin to ${action} all plugins.`,
		);
		process.exit(1);
	}

	const pluginsSelected =
		pluginRequested === "all"
			? Object.entries(pluginsData)
			: [[pluginRequested, pluginsData[pluginRequested]]];

	console.log(
		`Plugins to ${action}:`,
		chalk.bold(pluginsSelected.map(([key]) => key).join(", ")),
	);

	return { pluginsData, pluginsSelected };
}
