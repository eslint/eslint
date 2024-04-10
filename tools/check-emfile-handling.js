/**
 * @fileoverview A utility to test that ESLint doesn't crash with EMFILE/ENFILE errors.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs");
const { execSync } = require("child_process");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const OUTPUT_DIRECTORY = "tests/fixtures/emfile";
const FILE_COUNT = 10000;

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

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

console.log(`Generating ${FILE_COUNT} files in ${OUTPUT_DIRECTORY}...`);
generateFiles();

console.log("Running ESLint...");
execSync(`node bin/eslint.js ${OUTPUT_DIRECTORY} -c ${OUTPUT_DIRECTORY}/eslint.config.js`, { stdio: "inherit" });
console.log("No errors encountered.");
