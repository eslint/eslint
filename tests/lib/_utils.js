/**
 * @fileoverview uitls for rule tests.
 * @author 唯然<weiran.zsd@outlook.com>
 */

"use strict";

const path = require("path");
const MemoryFs = require("metro-memory-fs");

/**
 * Prevents leading spaces in a multiline template literal from appearing in the resulting string
 * @param {string[]} strings The strings in the template literal
 * @param {any[]} values The interpolation values in the template literal.
 * @returns {string} The template literal, with spaces removed from all lines
 */
function unIndent(strings, ...values) {
    const text = strings
        .map((s, i) => (i === 0 ? s : values[i - 1] + s))
        .join("");
    const lines = text.replace(/^\n/u, "").replace(/\n\s*$/u, "").split("\n");
    const lineIndents = lines.filter(line => line.trim()).map(line => line.match(/ */u)[0].length);
    const minLineIndent = Math.min(...lineIndents);

    return lines.map(line => line.slice(minLineIndent)).join("\n");
}

/**
 * Add support of `recursive` option.
 * @param {import("fs")} fs The in-memory file system.
 * @param {() => string} cwd The current working directory.
 * @returns {void}
 */
function supportMkdirRecursiveOption(fs, cwd) {
    const { mkdirSync } = fs;

    fs.mkdirSync = (filePath, options) => {
        if (typeof options === "object" && options !== null) {
            if (options.recursive) {
                const absolutePath = path.resolve(cwd(), filePath);
                const parentPath = path.dirname(absolutePath);

                if (
                    parentPath &&
                    parentPath !== absolutePath &&
                    !fs.existsSync(parentPath)
                ) {
                    fs.mkdirSync(parentPath, options);
                }
            }
            mkdirSync(filePath, options.mode);
        } else {
            mkdirSync(filePath, options);
        }
    };
}

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
    const fs = new MemoryFs({
        cwd,
        platform: process.platform === "win32" ? "win32" : "posix"
    });

    // Support D: drive.
    if (process.platform === "win32") {
        fs._roots.set("D:", fs._makeDir(0o777)); // eslint-disable-line no-underscore-dangle
    }

    supportMkdirRecursiveOption(fs, cwd);
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

module.exports = {
    defineInMemoryFs,
    unIndent
};
