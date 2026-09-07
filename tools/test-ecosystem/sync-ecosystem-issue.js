/**
 * @fileoverview Creates or updates a GitHub issue to track the latest ecosystem test failure.
 * @author crimsonjay0
 */

"use strict";

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

module.exports = async ({ github, context, core }) => {
	const runUrl = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;
	const title = "Ecosystem tests failure";
	const label = "build";

	// Read the summary from the environment variable passed from the workflow
	const summary = process.env.SUMMARY_TEXT;

	const body = [
		"## Ecosystem Tests Failure",
		"",
		`**CI Run:** ${runUrl}`,
		`**Date:** ${new Date().toISOString()}`,
		"",
		summary,
	].join("\n");

	const { data: issues } = await github.rest.issues.listForRepo({
		owner: context.repo.owner,
		repo: context.repo.repo,
		labels: label,
		state: "open",
	});

	const existing = issues.find(i => i.title.startsWith(title));

	if (existing) {
		await github.rest.issues.update({
			owner: context.repo.owner,
			repo: context.repo.repo,
			// eslint-disable-next-line camelcase -- GitHub REST API requires snake_case for issue_number
			issue_number: existing.number,
			body,
		});
		core.info(`Updated issue #${existing.number}`);
	} else {
		const { data: newIssue } = await github.rest.issues.create({
			owner: context.repo.owner,
			repo: context.repo.repo,
			title,
			body,
			labels: [label],
		});
		core.info(`Created issue #${newIssue.number}`);
	}
};
