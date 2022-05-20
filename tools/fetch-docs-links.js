/**
 * @fileoverview Script to fetch link data.
 *
 * To fetch info about all files:
 *
 *      node tools/fetch-docs-links.js
 *
 * To fetch info for just selected files (for use with lint-staged):
 *
 *      node tools/fetch-docs-links.js docs/src/user-guide/index.md
 *
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const matter = require("gray-matter");
const metascraper = require("metascraper")([
    require("metascraper-image")(),
    require("metascraper-logo")(),
    require("metascraper-logo-favicon")(),
    require("metascraper-title")(),
    require("metascraper-description")()
]);
const got = require("got");
const path = require("path");
const fs = require("fs/promises");
const glob = require("fast-glob");

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const BASE_DIR = path.resolve(__dirname, "../");
const SRC_DIR = path.resolve(BASE_DIR, "docs/src");
const DATA_DIR = path.resolve(SRC_DIR, "_data");
const DATA_FILE_PATH = path.resolve(DATA_DIR, "further_reading_links.json");

// determine which files to check
let filenames = process.argv.slice(2);

if (filenames.length === 0) {
    filenames = glob.sync("docs/src/rules/*.md", { cwd: BASE_DIR });
}

filenames = filenames.map(filename => path.resolve(BASE_DIR, filename));

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Fetches metadata information for a given URL.
 * @param {string} url The URL to fetch data for.
 * @returns {Promise<object>} An object with metadata info.
 */
async function fetchLinkMeta(url) {
    const { body: html, url: returnedURL } = await got(url);
    const metadata = await metascraper({ html, url: returnedURL });
    const domain = (new URL(returnedURL)).hostname;

    return {
        domain,
        url,
        logo: metadata.logo,
        title: metadata.title,
        description: metadata.description
    };
}


//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

(async () => {

    // First read in the current data file
    const links = JSON.parse(await fs.readFile(DATA_FILE_PATH, "utf8"));

    // check each file
    for (const filename of filenames) {

        const text = await fs.readFile(filename, "utf8");
        const frontmatter = matter(text).data;

        if (frontmatter.further_reading) {

            for (const url of frontmatter.further_reading) {
                if (!links[url]) {
                    try {
                        links[url] = await fetchLinkMeta(url);
                    } catch (ex) {
                        console.error("Error in ", filename);
                        console.error("Could not fetch data for", url);
                        console.error(ex.message);
                        console.error(ex.stack);
                        process.exit(1);
                    }
                }
            }

        }
    }

    // Last write new data into the current data file
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(links, null, 4), "utf8");
})();
