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

// Important: Cursor throws an error when `describe()` is used in the schema.
const filePathsSchema = {
	filePaths: z.array(z.string().min(1)).nonempty(),
};

//-----------------------------------------------------------------------------
// Tools
//-----------------------------------------------------------------------------

mcpServer.tool(
	"lint-files",
	"Lint files using ESLint. You must provide a list of absolute file paths to the files you want to lint. The absolute file paths should be in the correct format for your operating system (e.g., forward slashes on Unix-like systems, backslashes on Windows).",
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
