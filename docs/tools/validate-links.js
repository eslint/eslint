"use strict";

const path = require("node:path");
const TapRender = require("@munter/tap-render");
const spot = require("tap-spot");
const hyperlink = require("hyperlink");

const tapRenderInstance = new TapRender();

tapRenderInstance.pipe(spot()).pipe(process.stdout);

const skipPatterns = [
    "https://",
    "fragment-redirect",
    "migrating-to",
    "/blog",
    "/play",
    "/team",
    "/donate",
    "/docs/latest",
    "/docs/next",
    "/docs/v8.x",
    'src="null"'
];

/**
 * Filter function to mark tests as skipped.
 * Tests for which this function returns `true' are not considered failed.
 * @param {Object} report hyperlink's test report for a link.
 * @returns {boolean} `true` if the report contains any of `skipPatterns`.
 */
function skipFilter(report) {
    return Object.values(report).some(value =>
        skipPatterns.some(pattern => String(value).includes(pattern)));
}

(async () => {
    try {
        await hyperlink(
            {
                inputUrls: ["../_site/index.html"],
                root: path.resolve(__dirname, "../_site"),
                canonicalRoot: "https://eslint.org/docs/head/",
                recursive: true,
                internalOnly: true,
                pretty: true,
                concurrency: 25,
                skipFilter
            },
            tapRenderInstance
        );
    } catch (err) {
        console.log(err.stack);
        process.exit(1);
    }
    const results = tapRenderInstance.close();

    process.exit(results.fail ? 1 : 0);
})();
