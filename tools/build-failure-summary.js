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
	const resultsPath = path.join(
		process.env.GITHUB_WORKSPACE,
		"ecosystem",
		".ecosystem-results.json",
	);
	let summary, failedList;

	if (fs.existsSync(resultsPath)) {
		const results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
		const failed = results.failedPlugins.map(p => p.pluginKey);
		failedList = failed.join(", ");
		const lines = [
			`**Failed (${failed.length}):** ${failedList}`,
			`**Passed:** ${results.passedPlugins.length}/${results.totalPlugins}`,
			"",
			"### Error Details",
			...results.failedPlugins.map(
				p =>
					`#### ${p.pluginKey}\n\`\`\`\n${p.errorMessage.slice(0, 1000)}\n\`\`\``,
			),
		];
		summary = lines.join("\n");
	} else {
		failedList = "unknown (results file missing)";
		summary = "Ecosystem tests failed but no results file was generated.";
	}

	core.setOutput("summary_text", summary);
	core.setOutput("failed_list", failedList);
};
