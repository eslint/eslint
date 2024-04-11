/**
 * @fileoverview A utility to test that ESLint doesn't crash with EMFILE/ENFILE errors.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs");
const { readFile } = require("fs/promises");
const { execSync } = require("child_process");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const OUTPUT_DIRECTORY = "tests/fixtures/emfile";

/*
 * Every operating system has a different limit for the number of files that can
 * be opened at once. This number is meant to be larger than the default limit
 * on most systems.
 *
 * Linux systems typically start at a count of 1024 and may be increased to 4096.
 * MacOS Sonoma v14.4 has a limit of 10496.
 * Windows has no hard limit but may be limited by available memory.
 */
const FILE_COUNT = 15000;

/**
 * Generates files in a directory.
 * @returns {void}
 */
function generateFiles() {

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
execSync(`node bin/eslint.js ${OUTPUT_DIRECTORY} -c ${OUTPUT_DIRECTORY}/eslint.config.js`, { stdio: "inherit" });
console.log("✅ No errors encountered.");

console.log("Checking that this number of files would cause an EMFILE error...");
generateEmFileError()
    .then(() => {
        console.error("❌ No EMFILE error encountered.");
        throw new Error("EMFILE error not encountered.");
    })
    .catch(error => {
        if (error.code === "EMFILE") {
            console.log("✅ EMFILE error encountered:", error.message);
        } else {
            console.error("❌ Unexpected error encountered:", error.message);
            throw error;
        }
    });
