const path = require("path");
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
    `src="null"`,
];

const skipFilter = (report) =>
    Object.values(report).some((value) =>
        skipPatterns.some((pattern) => String(value).includes(pattern))
    );

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
                skipFilter,
            },
            tapRenderInstance
        );
    } catch (err) {
        console.log(err.stack);
        process.exit(1);
    }
    const results = t.close();

    process.exit(results.fail ? 1 : 0);
})();
