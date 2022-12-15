/* eslint-disable indent */
"use strict";

const markdownLinkCheck = require("markdown-link-check");
const path = require("path");
const fs = require("fs");
const process = require("process");

/**
 * Recurse through file tree getting file names
 * @param {string} startPath path to file
 * @param {string} filter only check file names that end with this extension
 * @param {string[]} matchingFiles used to recursively add file names
 * @returns {string[]} all the matching files in directories and subdirectories
 */
function fromDir(startPath, filter, matchingFiles = []) {


    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    const files = fs.readdirSync(startPath);

    for (let i = 0; i < files.length; i++) {
        const filename = path.join(startPath, files[i]);
        const stat = fs.lstatSync(filename);

        if (stat.isDirectory()) {
            fromDir(filename, filter, matchingFiles); // recurse
        } else if (filename.endsWith(filter)) {
            matchingFiles.push(filename);
        }
    }

    return matchingFiles;
}

const files = fromDir("src", ".md");

const fileResults = {};

files.forEach(fileName => {
  const fileContents = fs.readFileSync(fileName, { encoding: "utf-8" });
  console.log(fileName);

  const lintResults = markdownLinkCheck(fileContents,
    { ignorePatterns: [{ pattern: /\.svg/u }], baseUrl: path.join(process.cwd(), "src") },
    (err, results) => {
    if (err) {
        console.error('Error', err);

    }
    fileResults[fileName] = results;
  });
});

console.log(fileResults);


