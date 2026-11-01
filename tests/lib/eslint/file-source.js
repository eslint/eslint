/**
 * @fileoverview Tests for selectors and content providers in file sources.
 * @author GitHub Copilot
 */

"use strict";

const assert = require("chai").assert;
const nodeAssert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { createFileSource } = require("../../../lib/eslint/file-source");

describe("file sources", () => {
	let cwd;

	/**
	 * Stages fixture contents.
	 * @param {string} filename The fixture path.
	 * @param {string} source The source text.
	 * @returns {void}
	 */
	function stage(filename, source) {
		fs.writeFileSync(path.join(cwd, filename), source);
		execFileSync(
			"git",
			["-c", "core.autocrlf=false", "add", "--", filename],
			{ cwd },
		);
	}

	/**
	 * Selects inputs without loading actual configurations.
	 * @param {ReturnType<createFileSource>} source The file source.
	 * @param {string[]} patterns Selection filters.
	 * @returns {Promise<import("../../../lib/eslint/file-source").FileInput[]>} Selected inputs.
	 */
	function select(source, patterns) {
		return source.selector.selectFiles({
			patterns,
			cwd,
			globInputPaths: true,
			errorOnUnmatchedPattern: true,
			configLoader: { async loadConfigArrayForFile() {} },
		});
	}

	beforeEach(() => {
		cwd = fs.realpathSync(
			fs.mkdtempSync(path.join(os.tmpdir(), "eslint-source-test-")),
		);
		execFileSync("git", ["init", "--quiet"], { cwd });
	});

	afterEach(() => {
		fs.rmSync(cwd, { recursive: true, force: true });
	});

	it("preserves filesystem selection and UTF-8 reading", async () => {
		stage("sample.js", "original;\n");
		fs.writeFileSync(path.join(cwd, "sample.js"), "working;\n");
		const source = createFileSource("filesystem");
		const inputs = await select(source, ["sample.js"]);

		assert.deepStrictEqual(inputs, [
			{ filePath: path.join(cwd, "sample.js") },
		]);
		assert.strictEqual(
			await source.provider.readFile(inputs[0]),
			"working;\n",
		);
	});

	it("keeps captured blob IDs in inputs even if the index changes, including after worker serialization", async () => {
		stage("sample.js", "original;\r\n");
		const source = createFileSource("git");
		const inputs = await select(source, ["."]);
		const workerInputs = structuredClone(inputs);

		stage("sample.js", "replacement;\n");
		assert.strictEqual(
			await source.provider.readFile(inputs[0]),
			"original;\r\n",
		);
		assert.strictEqual(
			await createFileSource("git").provider.readFile(workerInputs[0]),
			"original;\r\n",
		);
	});

	it("allows a selector and content provider to be composed independently", async () => {
		stage("sample.js", "original;\n");
		fs.writeFileSync(path.join(cwd, "sample.js"), "working;\n");
		const gitSource = createFileSource("git");
		const filesystemSource = createFileSource("filesystem");
		const inputs = await select(gitSource, ["."]);

		assert.strictEqual(
			await filesystemSource.provider.readFile(inputs[0]),
			"working;\n",
		);
		assert.strictEqual(
			await gitSource.provider.readFile(inputs[0]),
			"original;\n",
		);
	});

	it("reads large captured source text without truncation or checkout conversion", async () => {
		const text = "text\r\n\0".repeat(32 * 1024);

		stage("large.txt", text);
		const source = createFileSource("git");
		const inputs = await select(source, ["."]);

		assert.strictEqual(await source.provider.readFile(inputs[0]), text);
	});

	it("selects literal Git paths containing whitespace, Unicode, and glob metacharacters", async () => {
		const filename = "strange \t\n[é].js";

		stage(filename, "original;\n");
		fs.unlinkSync(path.join(cwd, filename));
		const source = createFileSource("git");
		const inputs = await select(source, [filename]);

		assert.deepStrictEqual(
			inputs.map(input => input.filePath),
			[path.join(cwd, filename)],
		);
		assert.strictEqual(
			await source.provider.readFile(inputs[0]),
			"original;\n",
		);
	});

	it("does not fall back to the working tree for inputs without captured Git metadata", async () => {
		fs.writeFileSync(path.join(cwd, "untracked.js"), "working;\n");
		const source = createFileSource("git");

		assert.deepStrictEqual(await select(source, ["."]), []);
		await nodeAssert.rejects(
			source.provider.readFile({
				filePath: path.join(cwd, "untracked.js"),
			}),
			/Git input has no captured blob ID/u,
		);
	});

	it("honors cancellation when reading an index blob", async () => {
		stage("sample.js", "original;\n");
		const source = createFileSource("git");
		const inputs = await select(source, ["."]);
		const controller = new AbortController();

		controller.abort();
		await nodeAssert.rejects(
			source.provider.readFile(inputs[0], { signal: controller.signal }),
			{ name: "AbortError" },
		);
	});
});
