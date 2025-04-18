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
	filePaths: z.array(z.string()).nonempty(),
};

//-----------------------------------------------------------------------------
// Tools
//-----------------------------------------------------------------------------

mcpServer.tool(
	"lint-files",
	"Lint files",
	filePathsSchema,
	async ({ filePaths }) => {
		const eslint = new ESLint({
			// enable lookup from file rather than from cwd
			flags: ["unstable_config_lookup_from_file"],
		});

		const results = await eslint.lintFiles(filePaths);

		return {
			content: results.map(result => ({
				type: "text",
				text: JSON.stringify(result),
			})),
		};
	},
);

mcpServer.tool(
	"lint-and-fix-files",
	"Lint and fix files",
	filePathsSchema,
	async ({ filePaths }) => {
		const eslint = new ESLint({
			// enable lookup from file rather than from cwd
			flags: ["unstable_config_lookup_from_file"],
			// allow fixing
			fix: true,
		});

		// Lint the file and apply fixes
		const results = await eslint.lintFiles(filePaths);

		// Format the results to apply fixes
		await ESLint.outputFixes(results);

		return {
			content: results.map(result => ({
				type: "text",
				text: JSON.stringify(result),
			})),
		};
	},
);

//-----------------------------------------------------------------------------
// Prompts
//-----------------------------------------------------------------------------

mcpServer.prompt("lint-files", filePathsSchema, ({ filePaths }) => ({
	messages: [
		{
			role: "user",
			content: {
				type: "text",
				text: `Please lint the files located at: ${filePaths}`,
			},
		},
	],
}));

mcpServer.prompt("lint-and-fix-files", filePathsSchema, ({ filePaths }) => ({
	messages: [
		{
			role: "user",
			content: {
				type: "text",
				text: `Please lint and fix the files located at: ${filePaths}`,
			},
		},
	],
}));

module.exports = { mcpServer };
