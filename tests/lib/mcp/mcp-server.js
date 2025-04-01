/**
 * @fileoverview Tests for MCP server
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { mcpServer } = require("../../../lib/mcp/mcp-server.js");
const assert = require("chai").assert;
const path = require("node:path");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { InMemoryTransport } = require("@modelcontextprotocol/sdk/inMemory.js");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const filePathsJsonSchema = {
	"$schema": "http://json-schema.org/draft-07/schema#",
	additionalProperties: false,
	properties: {
		"filePaths": {
			"items": {
				"type": "string"
			},
			"minItems": 1,
			"type": "array"
		}
	},
	required: [
		"filePaths"
	],
	type: "object"
};

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("MCP Server", () => {

	let client, clientTransport, serverTransport;

	beforeEach(async () => {
		client = new Client({
			name: "test client",
			version: "1.0",
		});

		[clientTransport, serverTransport] =
			InMemoryTransport.createLinkedPair();

		// Note: must connect server first or else client hangs
		await mcpServer.connect(serverTransport);
		await client.connect(clientTransport);

	});

	describe("Prompts", () => {

		it("should list prompts for each tool", async () => {

			const prompts = await client.listPrompts();

			assert.deepStrictEqual(prompts, {
				prompts: [
					{
						name: "lint-files",
						description: void 0,
						arguments: [{
							name: "filePaths",
							description: void 0,
							required: true
						}]
					},
					{
						name: "lint-and-fix-files",
						description: void 0,
						arguments: [{
							name: "filePaths",
							description: void 0,
							required: true
						}]
					}
				]
			});
		});

		// likely SDK bug: https://github.com/modelcontextprotocol/typescript-sdk/issues/250
		it.skip("should return lint-files prompt", async () => {

			const prompt = await client.getPrompt({
				name: "lint-files",
				arguments: {
					filePaths: ["file1.js", "file2.js"]
				}
			});

			assert.deepStrictEqual(prompt, {
				name: "lint-files",
				description: "Lint files",
				arguments: [{
					name: "filePaths",
					description: void 0,
					required: true
				}]
			});
		});

	});

	describe("Tools", () => {

		it("should list tools", async () => {

			const tools = await client.listTools();

			assert.deepStrictEqual(tools, {
				tools: [
					{
						name: "lint-files",
						description: "Lint files",
						inputSchema: filePathsJsonSchema
					},
					{
						name: "lint-and-fix-files",
						description: "Lint and fix files",
						inputSchema: filePathsJsonSchema
					}
				]
			});
		});

		describe("lint-files", () => {

			it("should return zero lint messages for a valid file", async () => {

				const { content: rawResults } = await client.callTool({
					name: "lint-files",
					arguments: {
						filePaths: ["tests/fixtures/passing.js"]
					}
				});

				const expectedFilePath = path.join(process.cwd(), "tests/fixtures/passing.js");
				const results = rawResults.map(({ type, text }) => ({ type, text: JSON.parse(text) }));

				assert.deepStrictEqual(results, [
					{
						type: "text",
						text: {
							filePath: expectedFilePath,
							messages: [],
							suppressedMessages: [],
							errorCount: 0,
							fatalErrorCount: 0,
							warningCount: 0,
							fixableErrorCount: 0,
							fixableWarningCount: 0,
							usedDeprecatedRules: []
						}
					}
				]);
			});

			it("should return zero lint messages for a valid file and a syntax error for an invalid file", async () => {

				const { content: rawResults } = await client.callTool({
					name: "lint-files",
					arguments: {
						filePaths: ["tests/fixtures/passing.js", "tests/fixtures/syntax-error.js"]
					}
				});

				const expectedPassingFilePath = path.join(process.cwd(), "tests/fixtures/passing.js");
				const expectedFailingFilePath = path.join(process.cwd(), "tests/fixtures/syntax-error.js");

				const results = rawResults.map(({ type, text }) => ({ type, text: JSON.parse(text) }));
				assert.deepStrictEqual(results, [
					{
						type: "text",
						text: {
							filePath: expectedPassingFilePath,
							messages: [],
							suppressedMessages: [],
							errorCount: 0,
							fatalErrorCount: 0,
							warningCount: 0,
							fixableErrorCount: 0,
							fixableWarningCount: 0,
							usedDeprecatedRules: []
						}
					},
					{
						type: "text",
						text: {
							filePath: expectedFailingFilePath,
							messages: [
								{
									ruleId: null,
									severity: 2,
									fatal: true,
									message: "Parsing error: Unexpected token }",
									line: 1,
									column: 3,
									nodeType: null
								}
							],
							suppressedMessages: [],
							errorCount: 1,
							fatalErrorCount: 1,
							warningCount: 0,
							fixableErrorCount: 0,
							fixableWarningCount: 0,
							usedDeprecatedRules: [],
							source: "{}}\n"
						}
					}
				]);
			});
		});
	});
});
