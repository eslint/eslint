/**
 * @fileoverview
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const eleventyFetch  = require("@11ty/eleventy-fetch");

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

module.exports = async function() {

    // if we're on the next branch, we can just read the package.json file
    if (process.env.BRANCH === "next") {
        return require("../../package.json").version;
    }

    // otherwise, we need to fetch the latest version from the GitHub API
    const url = "https://raw.githubusercontent.com/eslint/eslint/next/docs/package.json";

    const response = await eleventyFetch(url, {
        duration: "1d",
        type: "json"
    });

    return response.version;
}
