/**
 * @fileoverview Utility for caching lint results.
 * @author Kevin Partington
 */
"use strict";

const fileEntryCache = require("file-entry-cache");

class LintResultCache {
    constructor(cacheFile) {
        this.fileEntryCache = fileEntryCache.create(cacheFile);
    }

    getFileDescriptor(filePath) {
        return this.fileEntryCache.getFileDescriptor(filePath);
    }

    removeEntry(filePath) {
        return this.fileEntryCache.removeEntry(filePath);
    }

    reconcile() {
        return this.fileEntryCache.reconcile();
    }
}

module.exports = LintResultCache;
