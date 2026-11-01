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
const { EventEmitter } = require("node:events");
const { PassThrough } = require("node:stream");
const { createFileSource } = require("../../../lib/eslint/file-source");
const { GitBatchClient } = require("../../../lib/eslint/file-providers/git");

describe("file sources", () => {
	let cwd;

	/**
	 * Stages fixture contents.
	 * @param {string} filename The fixture path.
	 * @param {string} source The source text.
	 * @returns {void}
	 */
	function stage(filename, source) {
		const destination = path.join(cwd, filename);

		fs.mkdirSync(path.dirname(destination), { recursive: true });
		fs.writeFileSync(destination, source);
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

	it("reads multiple staged blobs concurrently without mixing responses", async () => {
		stage("a.js", "const a = 1;\n");
		stage("b.js", "const b = 2;\n");
		stage("c.js", "const c = 3;\n");
		const source = createFileSource("git");
		const inputs = await select(source, ["."]);

		assert.strictEqual(inputs.length, 3);
		const contents = await Promise.all(
			inputs.map(input => source.provider.readFile(input)),
		);

		const expected = {
			[path.join(cwd, "a.js")]: "const a = 1;\n",
			[path.join(cwd, "b.js")]: "const b = 2;\n",
			[path.join(cwd, "c.js")]: "const c = 3;\n",
		};

		inputs.forEach((input, index) => {
			assert.strictEqual(contents[index], expected[input.filePath]);
		});
	});

	it("reads empty staged blob contents", async () => {
		stage("empty.js", "");
		const source = createFileSource("git");
		const inputs = await select(source, ["empty.js"]);

		assert.strictEqual(await source.provider.readFile(inputs[0]), "");
	});

	it("rejects when requesting a missing Git object", async () => {
		const source = createFileSource("git");

		await nodeAssert.rejects(
			source.provider.readFile({
				filePath: path.join(cwd, "missing.js"),
				blobId: "0123456789012345678901234567890123456789",
				repository: cwd,
			}),
			/Git object missing/u,
		);
	});

	it("handles stream responses split across single-byte chunks", async () => {
		const client = new GitBatchClient(cwd, {
			spawn() {
				const child = new EventEmitter();

				child.stdin = new PassThrough();
				child.stdout = new PassThrough();
				child.stderr = new PassThrough();
				child.kill = () => child.emit("close", 0, null);

				child.stdin.on("data", chunk => {
					const sha = chunk.toString("utf8").trim();
					const body = "function split() { return true; }\n";
					const raw = `${sha} blob ${Buffer.byteLength(body)}\n${body}\n`;
					const buffer = Buffer.from(raw);

					for (let i = 0; i < buffer.length; i++) {
						child.stdout.write(buffer.subarray(i, i + 1));
					}
				});
				return child;
			},
		});

		const result = await client.readFile("a".repeat(40));

		assert.strictEqual(result, "function split() { return true; }\n");
	});

	it("rejects when Git batch response header is invalid", async () => {
		const client = new GitBatchClient(cwd, {
			spawn() {
				const child = new EventEmitter();

				child.stdin = new PassThrough();
				child.stdout = new PassThrough();
				child.stderr = new PassThrough();
				child.kill = () => child.emit("close", 0, null);

				child.stdin.on("data", () => {
					child.stdout.write("corrupt header\n");
				});
				return child;
			},
		});

		await nodeAssert.rejects(
			client.readFile("b".repeat(40)),
			/Invalid Git batch response/u,
		);
	});

	it("handles Git process failure gracefully", async () => {
		const client = new GitBatchClient(cwd, {
			spawn() {
				const child = new EventEmitter();

				child.stdin = new PassThrough();
				child.stdout = new PassThrough();
				child.stderr = new PassThrough();
				child.kill = () => child.emit("close", 0, null);

				child.stdin.on("data", () => {
					child.emit("error", new Error("spawn ENOENT simulated"));
				});
				return child;
			},
		});

		await nodeAssert.rejects(
			client.readFile("c".repeat(40)),
			/spawn ENOENT simulated/u,
		);
	});

	it("cleans up child process when disposed and rejects subsequent reads", async () => {
		stage("sample.js", "original;\n");
		const source = createFileSource("git");
		const inputs = await select(source, ["sample.js"]);

		assert.strictEqual(
			await source.provider.readFile(inputs[0]),
			"original;\n",
		);
		await source.provider.dispose();

		await nodeAssert.rejects(
			source.provider.readFile(inputs[0]),
			/Git batch provider is closed/u,
		);
	});

	it("supports multiple independent Git batch providers concurrently (worker isolation)", async () => {
		stage("w1.js", "worker1;\n");
		stage("w2.js", "worker2;\n");
		const source1 = createFileSource("git");
		const source2 = createFileSource("git");
		const [inputs1, inputs2] = await Promise.all([
			select(source1, ["w1.js"]),
			select(source2, ["w2.js"]),
		]);

		const [res1, res2] = await Promise.all([
			source1.provider.readFile(inputs1[0]),
			source2.provider.readFile(inputs2[0]),
		]);

		assert.strictEqual(res1, "worker1;\n");
		assert.strictEqual(res2, "worker2;\n");

		await source1.provider.dispose();
		assert.strictEqual(
			await source2.provider.readFile(inputs2[0]),
			"worker2;\n",
		);
		await source2.provider.dispose();
	});

	it("maintains FIFO synchronization when an intermediate request is aborted in-flight", async () => {
		stage("f1.js", "content1;\n");
		stage("f2.js", "content2;\n");
		stage("f3.js", "content3;\n");
		const source = createFileSource("git");
		const inputs = await select(source, ["."]);
		const controller = new AbortController();

		const p1 = source.provider.readFile(inputs[0]);
		const p2 = source.provider.readFile(inputs[1], {
			signal: controller.signal,
		});
		const p3 = source.provider.readFile(inputs[2]);

		controller.abort();

		await nodeAssert.rejects(p2, { name: "AbortError" });
		const [r1, r3] = await Promise.all([p1, p3]);

		assert.strictEqual(r1, "content1;\n");
		assert.strictEqual(r3, "content3;\n");
	});

	it("supports idempotent dispose and rejects queued requests immediately", async () => {
		stage("sample.js", "content;\n");
		const source = createFileSource("git");
		const inputs = await select(source, ["sample.js"]);

		await source.provider.readFile(inputs[0]);

		const d1 = source.provider.dispose();
		const d2 = source.provider.dispose();

		assert.strictEqual(d1, d2);
		await d1;

		await nodeAssert.rejects(
			source.provider.readFile(inputs[0]),
			/Git batch provider is closed/u,
		);
	});

	it("omits unconfigured files during directory selection", async () => {
		stage("sample.js", "original;\n");
		stage("logo.png", "fake image bytes");
		stage("README.md", "# Readme");

		const source = createFileSource("git");
		const inputs = await source.selector.selectFiles({
			patterns: ["."],
			cwd,
			globInputPaths: true,
			configLoader: {
				async loadConfigArrayForFile() {
					return {
						getConfig(fp) {
							return fp.endsWith(".js") ? { rules: {} } : void 0;
						},
					};
				},
			},
		});

		assert.deepStrictEqual(
			inputs.map(input => input.filePath),
			[path.join(cwd, "sample.js")],
		);
	});

	it("omits ignored files during directory selection", async () => {
		stage("sample.js", "original;\n");
		stage("ignored.js", "ignored;\n");

		const source = createFileSource("git");
		const inputs = await source.selector.selectFiles({
			patterns: ["."],
			cwd,
			globInputPaths: true,
			configLoader: {
				async loadConfigArrayForFile() {
					return {
						getConfig(fp) {
							return fp.endsWith("ignored.js")
								? void 0
								: { rules: {} };
						},
					};
				},
			},
		});

		assert.deepStrictEqual(
			inputs.map(input => input.filePath),
			[path.join(cwd, "sample.js")],
		);
	});

	it("includes unconfigured files when explicitly specified as file patterns", async () => {
		stage("sample.js", "original;\n");
		stage("logo.png", "fake image bytes");

		const source = createFileSource("git");
		const inputs = await source.selector.selectFiles({
			patterns: ["logo.png"],
			cwd,
			globInputPaths: true,
			configLoader: {
				async loadConfigArrayForFile() {
					return {
						getConfig() {
							return void 0;
						},
					};
				},
			},
		});

		assert.deepStrictEqual(
			inputs.map(input => input.filePath),
			[path.join(cwd, "logo.png")],
		);
	});

	it("includes ignored files when explicitly specified as file patterns", async () => {
		stage("sample.js", "original;\n");
		stage("ignored.js", "ignored;\n");

		const source = createFileSource("git");
		const inputs = await source.selector.selectFiles({
			patterns: ["ignored.js"],
			cwd,
			globInputPaths: true,
			configLoader: {
				async loadConfigArrayForFile() {
					return {
						getConfig() {
							return void 0;
						},
					};
				},
			},
		});

		assert.deepStrictEqual(
			inputs.map(input => input.filePath),
			[path.join(cwd, "ignored.js")],
		);
	});

	it("selects custom configured file extensions during directory selection", async () => {
		stage("custom.ext", "custom code;\n");

		const source = createFileSource("git");
		const inputs = await source.selector.selectFiles({
			patterns: ["."],
			cwd,
			globInputPaths: true,
			configLoader: {
				async loadConfigArrayForFile() {
					return {
						getConfig(fp) {
							return fp.endsWith(".ext") ? { rules: {} } : void 0;
						},
					};
				},
			},
		});

		assert.deepStrictEqual(
			inputs.map(input => input.filePath),
			[path.join(cwd, "custom.ext")],
		);
	});

	it("expands directory globs such as packages/*", async () => {
		stage("packages/pkg-a/index.js", "module.exports = 'a';\n");
		stage("packages/pkg-b/index.js", "module.exports = 'b';\n");

		const source = createFileSource("git");
		const inputs = await source.selector.selectFiles({
			patterns: ["packages/*"],
			cwd,
			globInputPaths: true,
			configLoader: {
				async loadConfigArrayForFile() {
					return {
						getConfig() {
							return { rules: {} };
						},
					};
				},
			},
		});

		assert.deepStrictEqual(
			inputs.map(input => input.filePath).sort(),
			[
				path.join(cwd, "packages/pkg-a/index.js"),
				path.join(cwd, "packages/pkg-b/index.js"),
			].sort(),
		);
	});

	it("returns an empty array when no files are staged", async () => {
		const source = createFileSource("git");
		const inputs = await source.selector.selectFiles({
			patterns: ["."],
			cwd,
			globInputPaths: true,
			configLoader: {
				async loadConfigArrayForFile() {
					return {
						getConfig() {
							return { rules: {} };
						},
					};
				},
			},
		});

		assert.deepStrictEqual(inputs, []);
	});
});
