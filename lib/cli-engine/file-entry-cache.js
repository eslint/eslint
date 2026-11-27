/**
 * @fileoverview Persistent cache of file metadata used to detect changed files.
 * @author James Garbutt
 */
"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { parse, stringify } = require("flatted");

const debug = require("debug")("eslint:file-entry-cache");

//-----------------------------------------------------------------------------
// Typedefs
//-----------------------------------------------------------------------------

/**
 * @typedef {Object} FileMeta
 * @property {number} [size] File size (bytes).
 * @property {number} [mtime] File modification time (ms).
 * @property {string} [hash] MD5 hash of contents.
 * @property {unknown} [data] Data of the file.
 */

/**
 * @typedef {Object} FileDescriptor
 * @property {string} key Cache key of the file.
 * @property {boolean} changed Whether the file changed since the cache was last reconciled.
 * @property {FileMeta} meta Current metadata of the file.
 * @property {boolean} [notFound] True if the file was not found on disk.
 * @property {Error} [err] Error encountered while reading the file.
 */

/**
 * @typedef {Object} FileEntryCacheOptions
 * @property {boolean} [useChecksum=false] If `true`, detect changes using size
 *   and content hash. Otherwise, use size and modification time.
 */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Reads cache entries from a cache file.
 * @param {string} cacheFilePath Path to the cache file.
 * @returns {Map<string, FileMeta>} Cache entries
 * @throws {Error} If the cache file exists but cannot be read.
 */
function loadEntries(cacheFilePath) {
	const entries = new Map();
	let data;

	try {
		data = parse(fs.readFileSync(cacheFilePath, "utf8"));
	} catch (error) {
		if (
			error.code === "ENOENT" ||
			error.code === "ENOTDIR" ||
			error instanceof SyntaxError ||
			error instanceof TypeError
		) {
			return entries;
		}

		throw error;
	}

	if (Array.isArray(data)) {
		for (const item of data) {
			if (item && typeof item === "object" && "key" in item) {
				entries.set(item.key, item.value);
			}
		}
	} else if (data && typeof data === "object") {
		// Legacy format of old file-entry-cache files
		for (const [key, item] of Object.entries(data)) {
			entries.set(
				key,
				item && typeof item === "object" && "key" in item
					? item.value
					: item,
			);
		}
	}

	return entries;
}

//-----------------------------------------------------------------------------
// Public Interface
//-----------------------------------------------------------------------------

/**
 * Tracks file size, modification time and optionally content hash across
 * runs, persisted to disk.
 */
class FileEntryCache {
	/**
	 * Current cache entries.
	 * @type {Map<string, FileMeta>}
	 */
	#entries;

	/**
	 * Snapshot of each visited entry's meta data as of the last load or
	 * reconcile.
	 * @type {Map<string, FileMeta|null>}
	 */
	#baseline = new Map();

	/**
	 * Path to the cache file.
	 * @type {string}
	 */
	#cacheFilePath;

	/**
	 * Whether to compare content hashes instead of modification times.
	 * @type {boolean}
	 */
	#useChecksum;

	/**
	 * Whether entries changed since the cache file was last written.
	 * @type {boolean}
	 */
	#dirty = false;

	/**
	 * Creates a new FileEntryCache instance.
	 * @param {string} cacheFilePath Path to the cache file.
	 * @param {FileEntryCacheOptions} [options] Options.
	 */
	constructor(cacheFilePath, { useChecksum = false } = {}) {
		this.#cacheFilePath = cacheFilePath;
		this.#useChecksum = useChecksum;
		this.#entries = loadEntries(cacheFilePath);
	}

	/**
	 * Gets the descriptor for a file, updating its cached metadata.
	 * @param {string} filePath Path of the file.
	 * @returns {FileDescriptor} File descriptor.
	 */
	getFileDescriptor(filePath) {
		const key = filePath;
		const cached = this.#entries.get(key);
		const meta = cached ? { ...cached } : {};

		this.#dirty = true;

		try {
			const stats = fs.statSync(filePath);

			meta.size = stats.size;
			meta.mtime = stats.mtime.getTime();

			if (this.#useChecksum) {
				meta.hash = crypto.hash("md5", fs.readFileSync(filePath));
			}
		} catch (error) {
			this.#entries.delete(key);
			this.#baseline.delete(key);

			return {
				key,
				changed: false,
				err: error,
				notFound: error.code === "ENOENT",
				meta: {},
			};
		}

		if (!this.#baseline.has(key)) {
			this.#baseline.set(key, cached ? { ...cached } : null);
		}

		const baseline = this.#baseline.get(key);
		const changed =
			baseline === null ||
			baseline.size !== meta.size ||
			(this.#useChecksum
				? baseline.hash !== meta.hash
				: baseline.mtime !== meta.mtime);

		this.#entries.set(key, meta);

		return { key, changed, meta };
	}

	/**
	 * Removes entries for files that no longer exist and, if anything changed,
	 * writes the cache to disk.
	 * @returns {void}
	 */
	reconcile() {
		for (const key of this.#entries.keys()) {
			try {
				fs.statSync(key);
			} catch (error) {
				if (error.code === "ENOENT") {
					this.#entries.delete(key);
					this.#baseline.delete(key);
					this.#dirty = true;
				}
			}
		}

		if (!this.#dirty) {
			return;
		}

		for (const key of this.#baseline.keys()) {
			this.#baseline.set(key, { ...this.#entries.get(key) });
		}

		const items = Array.from(this.#entries, ([key, value]) => ({
			key,
			value,
		}));

		try {
			fs.mkdirSync(path.dirname(this.#cacheFilePath), {
				recursive: true,
			});
			fs.writeFileSync(this.#cacheFilePath, stringify(items));
			this.#dirty = false;
		} catch (error) {
			debug(
				"Unable to write cache file %s: %o",
				this.#cacheFilePath,
				error,
			);
		}
	}
}

module.exports = { FileEntryCache };
