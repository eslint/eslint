/**
 * @fileoverview A utility to test that ESLint doesn't crash with EMFILE/ENFILE errors.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("node:fs");
const { readFile } = require("node:fs/promises");
const { execSync } = require("node:child_process");
const os = require("node:os");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const OUTPUT_DIRECTORY = "tmp/emfile-check";
const CONFIG_DIRECTORY = "tests/fixtures/emfile";

/*
 * Every operating system has a different limit for the number of files that can
 * be opened at once. This number is meant to be larger than the default limit
 * on most systems.
 *
 * Linux systems typically start at a count of 1024 and may be increased to 4096.
 * MacOS Sonoma v14.4 has a limit of 10496.
 * Windows has no hard limit but may be limited by available memory.
 */
const DEFAULT_FILE_COUNT = 15000;
let FILE_COUNT = DEFAULT_FILE_COUNT;

// if the platform isn't windows, get the ulimit to see what the actual limit is
if (os.platform() !== "win32") {
    try {
        FILE_COUNT = parseInt(execSync("ulimit -n").toString().trim(), 10) + 1;

        console.log(`Detected Linux file limit of ${FILE_COUNT}.`);

        // if we're on a Mac, make sure the limit isn't high enough to cause a call stack error
        if (os.platform() === "darwin") {
            FILE_COUNT = Math.min(FILE_COUNT, 100000);
        }
    } catch {

        // ignore error and use default
    }
}

/**
 * Generates files in a directory.
 * @returns {void}
 */
function generateFiles() {

    fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

    for (let i = 0; i < FILE_COUNT; i++) {
        const fileName = `file_${i}.js`;
        const fileContent = `// This is file ${i}`;

        fs.writeFileSync(`${OUTPUT_DIRECTORY}/${fileName}`, fileContent);
    }

}

/**
 * Generates an EMFILE error by reading all files in the output directory.
 * @returns {Promise<Buffer[]>} A promise that resolves with the contents of all files.
 */
function generateEmFileError() {
    return Promise.all(
        Array.from({ length: FILE_COUNT }, (_, i) => {
            const fileName = `file_${i}.js`;

            return readFile(`${OUTPUT_DIRECTORY}/${fileName}`);
        })
    );
}

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

console.log(`Generating ${FILE_COUNT} files in ${OUTPUT_DIRECTORY}...`);
generateFiles();

console.log("Running ESLint...");
execSync(`node bin/eslint.js ${OUTPUT_DIRECTORY} -c ${CONFIG_DIRECTORY}/eslint.config.js`, { stdio: "inherit" });
console.log("✅ No errors encountered running ESLint.");

console.log("Checking that this number of files would cause an EMFILE error...");
generateEmFileError()
    .then(() => {
        throw new Error("EMFILE error not encountered.");
    })
    .catch(error => {
        if (error.code === "EMFILE") {
            console.log("✅ EMFILE error encountered:", error.message);
        } else if (error.code === "ENFILE") {
            console.log("✅ ENFILE error encountered:", error.message);
        } else {
            console.error("❌ Unexpected error encountered:", error.message);
            throw error;
        }
    });
