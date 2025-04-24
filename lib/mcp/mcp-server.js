/**
 * @fileoverview MCP Server for handling requests and responses to ESLint.
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { z } = require("zod");
const { ESLint } = require("../eslint");
const pkg = require("../../package.json");

//-----------------------------------------------------------------------------
// Server
//-----------------------------------------------------------------------------

const mcpServer = new McpServer({
	name: "ESLint",
	version: pkg.version,
});

const filePathsSchema = {
	filePaths: z
		.array(
			z
				.string()
				.min(1)
				.describe("Full filesystem path of a file to be analyzed"),
		)
		.nonempty(),
};

//-----------------------------------------------------------------------------
// Tools
//-----------------------------------------------------------------------------

mcpServer.tool(
	"lint-files",
	"Lint files using ESLint. This will not modify the files and will report any issues found.",
	filePathsSchema,
	async ({ filePaths }) => {
		const eslint = new ESLint({
			// enable lookup from file rather than from cwd
			flags: ["unstable_config_lookup_from_file"],
		});

		const results = await eslint.lintFiles(filePaths);
		const content = results.map(result => ({
			type: "text",
			text: JSON.stringify(result),
		}));

		content.unshift({
			type: "text",
			text: "Here are the results of running ESLint on the provided files:",
		});
		content.push({
			type: "text",
			text: "Do not automatically fix these issues. You must ask the user for confirmation before attempting to fix the issues found.",
		});

		return {
			content,
		};
	},
);

module.exports = { mcpServer };
