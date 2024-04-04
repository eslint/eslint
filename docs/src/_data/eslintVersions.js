/**
 * @fileoverview Data for version selectors
 * @author Milos Djermanovic
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const eleventyFetch  = require("@11ty/eleventy-fetch");

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

module.exports = async function() {

    const thisBranch = process.env.BRANCH;
    const thisVersion = require("../../package.json").version;

    // Fetch the current list of ESLint versions from the `main` branch on GitHub
    const url = "https://raw.githubusercontent.com/eslint/eslint/main/docs/src/_data/versions.json";

    const data = await eleventyFetch(url, {
        duration: "1d", // Cache for local development. Netlify does not keep this cache and will therefore always fetch from GitHub.
        type: "json"
    });

    const { items } = data;

    // For initial commit purpose only
    if (items.length === 0) {
        const localData = require("./versions.json");
        items.push(...localData.items);
    }

    let foundItemForThisBranch = false;

    for (const item of items) {
        const isItemForThisBranch = item.branch === thisBranch;

        foundItemForThisBranch ||= isItemForThisBranch;

        const isNumberVersion = /^\d/.test(item.version); // `false` for HEAD

        if (isNumberVersion) {

            // Make sure the version is correct
            if (isItemForThisBranch) {
                item.version = thisVersion;
            }

            item.display = `v${item.version}`;
        } else {
            item.display = item.version;
        }

        if (isItemForThisBranch) {
            item.selected = true;
        }
    }

    // Add an empty item if this is not a production branch
    if (!foundItemForThisBranch) {
        items.unshift({
            version: "",
            branch: "",
            display: "",
            path: "",
            selected: true
        })
    }

    return data;
}
