/**
 * @fileoverview Parses ecosystem test results and generates a failure summary for GitHub Actions outputs.
 * @author crimsonjay0
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("node:fs");
const path = require("node:path");

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

module.exports = async ({ core }) => {
	const rawResultsPath = path.join(process.cwd(), "raw-results");
	let summary, failedList;

	if (fs.existsSync(rawResultsPath)) {
		const failedPlugins = [];
		let passedCount = 0;
		let totalCount = 0;

		const files = fs
			.readdirSync(rawResultsPath)
			.filter(f => f.endsWith(".json"));

		for (const file of files) {
			const data = JSON.parse(
				fs.readFileSync(path.join(rawResultsPath, file), "utf8"),
			);
			totalCount++;

			if (data.passed) {
				passedCount++;
			} else {
				failedPlugins.push(data);
			}
		}

		failedList = failedPlugins.map(p => p.pluginKey).join(", ");

		const lines = [
			`**Failed (${failedPlugins.length}):** ${failedList}`,
			`**Passed:** ${passedCount}/${totalCount}`,
			"",
			"### Error Details",
			...failedPlugins.map(
				p =>
					`#### ${p.pluginKey}\n\`\`\`\n${p.errorMessage.slice(0, 1000)}\n\`\`\``,
			),
		];
		summary = lines.join("\n");
	} else {
		failedList = "unknown (results files missing)";
		summary = "Ecosystem tests failed but no results files were generated.";
	}

	core.setOutput("summary_text", summary);
	core.setOutput("failed_list", failedList);
};
