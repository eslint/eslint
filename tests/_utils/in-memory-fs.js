/**
 * @fileoverview in-memory file system.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const path = require("path");
const { Volume, createFsFromVolume } = require("memfs");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Define in-memory file system.
 * @param {Object} options The options.
 * @param {() => string} [options.cwd] The current working directory.
 * @param {Object} [options.files] The initial files definition in the in-memory file system.
 * @returns {import("fs")} The stubbed `ConfigArrayFactory` class.
 */
function defineInMemoryFs({
    cwd = process.cwd,
    files = {}
} = {}) {

    /**
     * The in-memory file system for this mock.
     * @type {import("fs")}
     */
    const fs = createFsFromVolume(new Volume());

    fs.mkdirSync(cwd(), { recursive: true });

    /*
     * Write all files to the in-memory file system and compile all JavaScript
     * files then set to `stubs`.
     */
    (function initFiles(directoryPath, definition) {
        for (const [filename, content] of Object.entries(definition)) {
            const filePath = path.resolve(directoryPath, filename);
            const parentPath = path.dirname(filePath);

            if (typeof content === "object") {
                initFiles(filePath, content);
            } else if (typeof content === "string") {
                if (!fs.existsSync(parentPath)) {
                    fs.mkdirSync(parentPath, { recursive: true });
                }
                fs.writeFileSync(filePath, content);
            } else {
                throw new Error(`Invalid content: ${typeof content}`);
            }
        }
    }(cwd(), files));

    return fs;
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

module.exports = {
    defineInMemoryFs
};
