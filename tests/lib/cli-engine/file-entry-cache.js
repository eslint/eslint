/**
 * @fileoverview Unit tests for file entry cache.
 * @author James Garbutt
 */
"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const assert = require("chai").assert;
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { parse, stringify } = require("flatted");
const { FileEntryCache } = require("../../../lib/cli-engine/file-entry-cache");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Sets a file's modification time.
 * @param {string} filePath The file path.
 * @param {number} mtime The modification time in milliseconds.
 * @returns {void}
 */
function setMtime(filePath, mtime) {
	const time = new Date(mtime);

	fs.utimesSync(filePath, time, time);
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("FileEntryCache", () => {
	let testDir;
	let cacheFilePath;
	let filePath;

	beforeEach(() => {
		testDir = fs.mkdtempSync(path.join(os.tmpdir(), "eslint-cache-"));
		cacheFilePath = path.join(testDir, ".eslintcache");
		filePath = path.join(testDir, "a.js");
		fs.writeFileSync(filePath, "let a;");
	});

	afterEach(() => {
		fs.rmSync(testDir, { recursive: true, force: true });
	});

	describe("constructor", () => {
		it("should start empty if the cache file does not exist", () => {
			const cache = new FileEntryCache(cacheFilePath);

			assert.isTrue(cache.getFileDescriptor(filePath).changed);
		});

		it("should start empty if the cache file has invalid syntax", () => {
			fs.writeFileSync(cacheFilePath, "not json");

			const cache = new FileEntryCache(cacheFilePath);

			assert.isTrue(cache.getFileDescriptor(filePath).changed);
		});

		it("should start empty if the cache file has an invalid structure", () => {
			fs.writeFileSync(cacheFilePath, "{}");

			const cache = new FileEntryCache(cacheFilePath);

			assert.isTrue(cache.getFileDescriptor(filePath).changed);
		});

		it("should start empty if the cache file contains a primitive", () => {
			fs.writeFileSync(cacheFilePath, "[1]");

			const cache = new FileEntryCache(cacheFilePath);

			assert.isTrue(cache.getFileDescriptor(filePath).changed);
		});

		it("should throw if the cache file cannot be read", () => {
			fs.mkdirSync(cacheFilePath);

			assert.throws(() => new FileEntryCache(cacheFilePath), /EISDIR/u);
		});

		it("should load entries stored as an array of items", () => {
			const { size, mtime } = fs.statSync(filePath);

			fs.writeFileSync(
				cacheFilePath,
				stringify([
					{ key: filePath, value: { size, mtime: mtime.getTime() } },
					null,
					{ value: "no key" },
				]),
			);

			const cache = new FileEntryCache(cacheFilePath);

			assert.isFalse(cache.getFileDescriptor(filePath).changed);
		});

		it("should load entries stored as legacy object map", () => {
			const { size, mtime } = fs.statSync(filePath);
			const otherPath = path.join(testDir, "b.js");

			fs.writeFileSync(otherPath, "let b;");

			const other = fs.statSync(otherPath);

			fs.writeFileSync(
				cacheFilePath,
				stringify({
					[filePath]: { size, mtime: mtime.getTime() },
					[otherPath]: {
						key: otherPath,
						value: {
							size: other.size,
							mtime: other.mtime.getTime(),
						},
					},
				}),
			);

			const cache = new FileEntryCache(cacheFilePath);

			assert.isFalse(cache.getFileDescriptor(filePath).changed);
			assert.isFalse(cache.getFileDescriptor(otherPath).changed);
		});
	});

	describe("getFileDescriptor", () => {
		it("should report a file not in the cache as changed", () => {
			const cache = new FileEntryCache(cacheFilePath);
			const descriptor = cache.getFileDescriptor(filePath);
			const { size, mtime } = fs.statSync(filePath);

			assert.deepStrictEqual(descriptor, {
				key: filePath,
				changed: true,
				meta: { size, mtime: mtime.getTime() },
			});
		});

		it("should keep reporting a file as changed until reconciled", () => {
			const cache = new FileEntryCache(cacheFilePath);

			assert.isTrue(cache.getFileDescriptor(filePath).changed);
			assert.isTrue(cache.getFileDescriptor(filePath).changed);

			cache.reconcile();

			assert.isFalse(cache.getFileDescriptor(filePath).changed);
		});

		it("should persist changes to meta", () => {
			let cache = new FileEntryCache(cacheFilePath);

			cache.getFileDescriptor(filePath).meta.data = { foo: 1 };
			cache.reconcile();

			cache = new FileEntryCache(cacheFilePath);

			const descriptor = cache.getFileDescriptor(filePath);

			assert.isFalse(descriptor.changed);
			assert.deepStrictEqual(descriptor.meta.data, { foo: 1 });
		});

		it("should not compute a hash without useChecksum", () => {
			const cache = new FileEntryCache(cacheFilePath);

			assert.notProperty(cache.getFileDescriptor(filePath).meta, "hash");
		});

		it("should compute an MD5 hash with useChecksum", () => {
			const cache = new FileEntryCache(cacheFilePath, {
				useChecksum: true,
			});

			assert.strictEqual(
				cache.getFileDescriptor(filePath).meta.hash,
				crypto.createHash("md5").update("let a;").digest("hex"),
			);
		});

		describe("without useChecksum", () => {
			let cache;

			beforeEach(() => {
				const initial = new FileEntryCache(cacheFilePath);

				initial.getFileDescriptor(filePath);
				initial.reconcile();
				cache = new FileEntryCache(cacheFilePath);
			});

			it("should report a file as changed if its size changed", () => {
				const { mtime } = fs.statSync(filePath);

				fs.writeFileSync(filePath, "let abc;");
				setMtime(filePath, mtime.getTime());

				assert.isTrue(cache.getFileDescriptor(filePath).changed);
			});

			it("should report a file as changed if its mtime changed", () => {
				setMtime(filePath, fs.statSync(filePath).mtimeMs + 10000);

				assert.isTrue(cache.getFileDescriptor(filePath).changed);
			});

			it("should not report a file as changed if only its contents changed", () => {
				const { mtime } = fs.statSync(filePath);

				fs.writeFileSync(filePath, "let b;");
				setMtime(filePath, mtime.getTime());

				assert.isFalse(cache.getFileDescriptor(filePath).changed);
			});
		});

		describe("with useChecksum", () => {
			let cache;

			beforeEach(() => {
				const initial = new FileEntryCache(cacheFilePath, {
					useChecksum: true,
				});

				initial.getFileDescriptor(filePath);
				initial.reconcile();
				cache = new FileEntryCache(cacheFilePath, {
					useChecksum: true,
				});
			});

			it("should report a file as changed if its size changed", () => {
				fs.writeFileSync(filePath, "let abc;");

				assert.isTrue(cache.getFileDescriptor(filePath).changed);
			});

			it("should report a file as changed if its contents changed", () => {
				const { mtime } = fs.statSync(filePath);

				fs.writeFileSync(filePath, "let b;");
				setMtime(filePath, mtime.getTime());

				assert.isTrue(cache.getFileDescriptor(filePath).changed);
			});

			it("should not report a file as changed if only its mtime changed", () => {
				setMtime(filePath, fs.statSync(filePath).mtimeMs + 10000);

				assert.isFalse(cache.getFileDescriptor(filePath).changed);
			});
		});

		it("should report a missing file as not found and remove its entry", () => {
			let cache = new FileEntryCache(cacheFilePath);

			cache.getFileDescriptor(filePath);
			cache.reconcile();
			fs.unlinkSync(filePath);

			cache = new FileEntryCache(cacheFilePath);

			const descriptor = cache.getFileDescriptor(filePath);

			assert.isTrue(descriptor.notFound);
			assert.isFalse(descriptor.changed);
			assert.deepStrictEqual(descriptor.meta, {});
			assert.strictEqual(descriptor.err.code, "ENOENT");

			fs.writeFileSync(filePath, "let a;");

			assert.isTrue(cache.getFileDescriptor(filePath).changed);
		});

		it("should report other read errors as found", () => {
			const cache = new FileEntryCache(cacheFilePath);
			// null byte on the end of a path is invalid on all platforms
			const descriptor = cache.getFileDescriptor(`${filePath}\0`);

			assert.isFalse(descriptor.notFound);
			assert.strictEqual(descriptor.err.code, "ERR_INVALID_ARG_VALUE");
		});
	});

	describe("reconcile", () => {
		it("should not write the cache file if nothing changed", () => {
			new FileEntryCache(cacheFilePath).reconcile();

			assert.isFalse(fs.existsSync(cacheFilePath));
		});

		it("should create the cache directory if needed", () => {
			cacheFilePath = path.join(testDir, "nested", "dir", ".eslintcache");

			const cache = new FileEntryCache(cacheFilePath);

			cache.getFileDescriptor(filePath);
			cache.reconcile();

			assert.isTrue(fs.existsSync(cacheFilePath));
		});

		it("should write entries as an array of items", () => {
			const cache = new FileEntryCache(cacheFilePath);
			const { meta } = cache.getFileDescriptor(filePath);

			cache.reconcile();

			assert.deepStrictEqual(
				parse(fs.readFileSync(cacheFilePath, "utf8")),
				[{ key: filePath, value: meta }],
			);
		});

		it("should remove entries for files that no longer exist", () => {
			const otherPath = path.join(testDir, "b.js");

			fs.writeFileSync(otherPath, "let b;");

			const cache = new FileEntryCache(cacheFilePath);

			cache.getFileDescriptor(filePath);
			cache.getFileDescriptor(otherPath);
			fs.unlinkSync(otherPath);
			cache.reconcile();

			assert.deepStrictEqual(
				parse(fs.readFileSync(cacheFilePath, "utf8")).map(
					item => item.key,
				),
				[filePath],
			);
		});

		it("should keep entries for files that cannot be checked", () => {
			// null byte on the end of a path is invalid on all platforms
			const unreadablePath = `${filePath}\0`;

			fs.writeFileSync(
				cacheFilePath,
				stringify([{ key: unreadablePath, value: { size: 1 } }]),
			);

			const cache = new FileEntryCache(cacheFilePath);

			cache.getFileDescriptor(filePath);
			cache.reconcile();

			assert.deepStrictEqual(
				parse(fs.readFileSync(cacheFilePath, "utf8")).map(
					item => item.key,
				),
				[unreadablePath, filePath],
			);
		});

		it("should not throw if the cache file cannot be written", () => {
			cacheFilePath = path.join(filePath, ".eslintcache");

			const cache = new FileEntryCache(cacheFilePath);

			cache.getFileDescriptor(filePath);

			// does not throw
			cache.reconcile();

			assert.isFalse(fs.existsSync(cacheFilePath));
		});
	});
});
