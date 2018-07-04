/**
 * @fileoverview Utility for caching lint results.
 * @author Kevin Partington
 */
"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const assert = require("assert"),
    fileEntryCache = require("file-entry-cache"),
    hash = require("./hash"),
    pkg = require("../../package.json"),
    stringify = require("json-stable-stringify-without-jsonify");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const configHashCache = new WeakMap();

/**
 * Calculates the hash of the config file used to validate a given file
 * @param {Object} configHelper The config helper for retrieving configuration information
 * @param {string} filename The path of the file to retrieve a config object for to calculate the hash
 * @returns {string} The hash of the config
 */
function hashOfConfigFor(configHelper, filename) {
    const config = configHelper.getConfig(filename);

    if (!configHashCache.has(config)) {
        configHashCache.set(config, hash(`${pkg.version}_${stringify(config)}`));
    }

    return configHashCache.get(config);
}

//-----------------------------------------------------------------------------
// Public Interface
//-----------------------------------------------------------------------------

/**
 * Lint result cache. This wraps around the file-entry-cache module,
 * transparently removing properties that are difficult or expensive to
 * serialize and adding them back in on retrieval.
 */
class LintResultCache {

    /**
     * Creates a new LintResultCache instance.
     * @constructor
     * @param {string} cacheFileLocation The cache file location.
     * @param {Object} configHelper The configuration helper (used for
     *   configuration lookup by file path).
     */
    constructor(cacheFileLocation, configHelper) {
        assert(cacheFileLocation, "Cache file location is required");
        assert(configHelper, "Config helper is required");

        this.fileEntryCache = fileEntryCache.create(cacheFileLocation);
        this.configHelper = configHelper;
    }

    /**
     * Retrieve cached lint results for a given file path, if present in the
     * cache. If the file is present and has not been changed, rebuild any
     * missing result information.
     * @param {string} filePath The file for which to retrieve lint results.
     * @returns {Object|null} The rebuilt lint results, or null if the file is
     *   changed or not in the filesystem.
     */
    getCachedLintResults(filePath) {

        /*
         * Cached lint results are valid if and only if:
         * 1. The file is present in the filesystem
         * 2. The file has not changed since the time it was previously linted
         * 3. The ESLint configuration has not changed since the time the file
         *    was previously linted
         * If any of these are not true, we will not reuse the lint results.
         */

        const fileDescriptor = this.fileEntryCache.getFileDescriptor(filePath);
        const hashOfConfig = hashOfConfigFor(this.configHelper, filePath);
        const changed = fileDescriptor.changed || fileDescriptor.meta.hashOfConfig !== hashOfConfig;

        if (fileDescriptor.notFound || changed) {
            return null;
        }

        // TODO: Hydrate any missing elements from results

        return fileDescriptor.meta.results;
    }

    /**
     * Set the cached lint results for a given file path, after removing any
     * information that will be both unnecessary and difficult to serialize.
     * @param {string} filePath The file for which to set lint results.
     * @param {Object} result The lint result to be set for the file.
     * @returns {void}
     */
    setCachedLintResults(filePath, result) {
        const fileDescriptor = this.fileEntryCache.getFileDescriptor(filePath);

        if (!fileDescriptor.notFound) {

            // TODO: Remove any information that is difficult to serialize

            fileDescriptor.meta.results = result;
            fileDescriptor.meta.hashOfConfig = hashOfConfigFor(this.configHelper, result.filePath);
        }
    }

    /**
     * Persists the in-memory cache to disk.
     * @returns {void}
     */
    reconcile() {
        this.fileEntryCache.reconcile();
    }

    /**
     * Remove a file entry from this lint result cache.
     * @param {string} filePath The file path to be removed from the cache.
     * @returns {void}
     * @todo Remove this method once the CLIEngine logic changes.
     */
    removeEntry(filePath) {
        this.fileEntryCache.removeEntry(filePath);
    }
}

module.exports = LintResultCache;
