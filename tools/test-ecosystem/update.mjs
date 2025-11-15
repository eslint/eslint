/**
 * @fileoverview Updates commit hashes in the ecosystem test plugins-data.json.
 * @author Josh Goldberg
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

import fs from "node:fs/promises";
import { styleText } from "node:util";
import prettier from "prettier";

import { getPlugins, pluginDataFilePath } from "./data.mjs";

//-----------------------------------------------------------------------------
// Functions
//-----------------------------------------------------------------------------

/**
 * @param {string} pluginKey
 * @param {PluginSettings} pluginSettings
 */
async function getLatestRepositoryCommit(pluginKey, pluginSettings) {
	const response = await fetch(
		pluginSettings.repository.replace(
			"github.com",
			"api.github.com/repos",
		) + "/commits?per_page=1",
	);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch latest commit for ${pluginKey}: ${response.statusText}`,
		);
	}

	const [{ sha }] = await response.json();

	if (sha === pluginSettings.commit) {
		console.log(
			styleText(
				"gray",
				`[${pluginKey}] Already at latest commit: ${sha}`,
			),
		);
	} else {
		console.log(
			styleText(
				["bold", "gray"],
				`[${pluginKey}] Found new commit hash: ${sha}`,
			),
		);
	}

	return sha;
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

const { pluginsData, pluginsSelected } = await getPlugins("update");

// For each requested plugin, fetch the latest commit from its repository API URL
const pluginsUpdated = Object.fromEntries(
	await Promise.all(
		pluginsSelected.map(async ([pluginKey, pluginSettings]) => [
			pluginKey,
			{
				...pluginSettings,
				commit: await getLatestRepositoryCommit(
					pluginKey,
					pluginSettings,
				),
			},
		]),
	),
);

// Write the updated plugins data to the plugins-data.json file
await fs.writeFile(
	pluginDataFilePath,
	await prettier.format(
		JSON.stringify({
			...pluginsData,
			...pluginsUpdated,
		}),
		{
			...(await prettier.resolveConfig(pluginDataFilePath.toString())),
			filepath: pluginDataFilePath.toString(),
		},
	),
);
