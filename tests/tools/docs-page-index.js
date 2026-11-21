/**
 * @fileoverview Tests for the documentation page index.
 * @author Nitin Kumar
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
	docsPageExists,
	normalizeDocsRoute,
} = require("../../docs/src/assets/js/docs-page-index");
const {
	parseArgs,
	routeForContentFile,
	selectGitRef,
	versionBranchForCheckout,
} = require("../../docs/tools/update-docs-page-index");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const pages = {
	"/docs/v8.x/": ["", "rules/no-undef", "use"],
	"/docs/latest/": [
		"",
		"rules/no-undef",
		"rules/preserve-caught-error",
		"use",
	],
};

const directoryPermalinks = {
	"docs/src": "{{ page.filePathStem }}.html",
	"docs/src/library": "/component-library/{{ page.fileSlug }}.html",
};

/**
 * Loads the generated page index the way the browser script does.
 * @returns {Object<string, string[]>} Version path to routes.
 */
function loadGeneratedPages() {
	const source = fs.readFileSync(
		path.join(__dirname, "../../docs/src/assets/js/docs-pages.js"),
		"utf8",
	);
	const context = { window: {} };

	vm.runInNewContext(source, context);
	return context.window.ESLINT_DOCS_PAGES;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("docs page index", () => {
	describe("normalizeDocsRoute()", () => {
		it("strips slashes, index, html, queries, and hashes", () => {
			assert.strictEqual(
				normalizeDocsRoute("/rules/no-undef/"),
				"rules/no-undef",
			);
			assert.strictEqual(normalizeDocsRoute("use/index.html"), "use");
			assert.strictEqual(normalizeDocsRoute("/index.html"), "");
			assert.strictEqual(
				normalizeDocsRoute("rules/no-undef?x=1#rule-details"),
				"rules/no-undef",
			);
		});
	});

	describe("docsPageExists()", () => {
		it("matches equivalent spellings of a published route", () => {
			assert.strictEqual(
				docsPageExists(pages, "/docs/v8.x/", "rules/no-undef"),
				true,
			);
			assert.strictEqual(
				docsPageExists(pages, "/docs/v8.x", "/rules/no-undef/"),
				true,
			);
			assert.strictEqual(
				docsPageExists(
					pages,
					"/docs/v8.x/",
					"rules/no-undef.html#rule-details",
				),
				true,
			);
			assert.strictEqual(docsPageExists(pages, "/docs/v8.x/", ""), true);
			assert.strictEqual(
				docsPageExists(pages, "/docs/v8.x/", "use/index"),
				true,
			);
		});

		it("reports pages that are missing from an indexed version", () => {
			assert.strictEqual(
				docsPageExists(
					pages,
					"/docs/v8.x/",
					"rules/preserve-caught-error",
				),
				false,
			);
			assert.strictEqual(
				docsPageExists(
					pages,
					"/docs/latest/",
					"rules/preserve-caught-error#rule-details",
				),
				true,
			);
		});

		it("returns null when that version has no index", () => {
			assert.strictEqual(
				docsPageExists(pages, "/docs/next/", "rules/no-undef"),
				null,
			);
			assert.strictEqual(
				docsPageExists(null, "/docs/v8.x/", "rules/no-undef"),
				null,
			);
		});
	});

	describe("routeForContentFile()", () => {
		it("uses the file path when permalink is the default template", () => {
			assert.strictEqual(
				routeForContentFile({
					file: "docs/src/rules/no-undef.md",
					permalink: null,
					excluded: false,
					directoryPermalinks,
				}),
				"rules/no-undef",
			);
			assert.strictEqual(
				routeForContentFile({
					file: "docs/src/use/index.md",
					permalink: null,
					excluded: false,
					directoryPermalinks,
				}),
				"use",
			);
		});

		it("prefers a literal front matter permalink", () => {
			assert.strictEqual(
				routeForContentFile({
					file: "docs/src/pages/flags.md",
					permalink: "/flags/index.html",
					excluded: false,
					directoryPermalinks,
				}),
				"flags",
			);
			assert.strictEqual(
				routeForContentFile({
					file: "docs/src/pages/index.md",
					permalink: "/index.html",
					excluded: false,
					directoryPermalinks,
				}),
				"",
			);
		});

		it("applies the component library directory permalink", () => {
			assert.strictEqual(
				routeForContentFile({
					file: "docs/src/library/buttons.md",
					permalink: null,
					excluded: false,
					directoryPermalinks,
				}),
				"component-library/buttons",
			);
		});

		it("skips excluded files and non-pages", () => {
			assert.strictEqual(
				routeForContentFile({
					file: "docs/src/pages/404.html",
					permalink: "/404.html",
					excluded: true,
					directoryPermalinks,
				}),
				null,
			);
			assert.strictEqual(
				routeForContentFile({
					file: "docs/src/static/sitemap.njk",
					permalink: "/sitemap.xml",
					excluded: false,
					directoryPermalinks,
				}),
				null,
			);
		});
	});

	describe("versionBranchForCheckout()", () => {
		const branches = ["main", "latest", "v9.x"];

		it("uses the checkout when it is already a version branch", () => {
			assert.strictEqual(
				versionBranchForCheckout("v9.x", branches, {
					main: 500,
					latest: 400,
					"v9.x": 100,
				}),
				"v9.x",
			);
		});

		it("uses the version branch this checkout was cut from", () => {
			assert.strictEqual(
				versionBranchForCheckout("fix-docs", branches, {
					main: 300,
					latest: 200,
					"v9.x": 100,
				}),
				"main",
			);
			assert.strictEqual(
				versionBranchForCheckout("maint", branches, {
					main: 100,
					latest: 150,
					"v9.x": 400,
				}),
				"v9.x",
			);
		});

		it("keeps the earlier version branch when merge-bases tie", () => {
			assert.strictEqual(
				versionBranchForCheckout("fix-docs", branches, {
					main: 200,
					latest: 200,
					"v9.x": 50,
				}),
				"main",
			);
		});

		it("supplies main when history is unavailable", () => {
			assert.strictEqual(
				versionBranchForCheckout("", branches, {
					main: null,
					latest: null,
					"v9.x": null,
				}),
				"main",
			);
			assert.strictEqual(
				versionBranchForCheckout("topic", ["v9.x", "v8.x"], {
					"v9.x": null,
					"v8.x": null,
				}),
				null,
			);
		});
	});

	describe("selectGitRef()", () => {
		it("reads an owned version from the checkout before the remote", () => {
			assert.strictEqual(
				selectGitRef("main", {
					ownedBranches: ["main"],
					availableRefs: ["HEAD", "origin/main", "main"],
				}),
				"HEAD",
			);
		});

		it("reads other versions from the remote", () => {
			assert.strictEqual(
				selectGitRef("v9.x", {
					ownedBranches: ["main"],
					availableRefs: ["HEAD", "origin/v9.x", "v9.x"],
				}),
				"origin/v9.x",
			);
		});

		it("falls back to a local branch when the remote ref is absent", () => {
			assert.strictEqual(
				selectGitRef("next", {
					ownedBranches: [],
					availableRefs: ["HEAD", "next"],
				}),
				"next",
			);
		});

		it("throws when the branch cannot be resolved", () => {
			assert.throws(() => {
				selectGitRef("v8.x", {
					ownedBranches: [],
					availableRefs: ["HEAD"],
				});
			}, /Missing git ref for docs branch "v8\.x"/u);
		});
	});

	describe("parseArgs()", () => {
		it("reads the check, fetch, and branch flags", () => {
			assert.deepStrictEqual(parseArgs([]), {
				check: false,
				fetch: false,
				asBranch: null,
			});
			assert.deepStrictEqual(
				parseArgs(["--check", "--fetch", "--as-branch", "latest"]),
				{
					check: true,
					fetch: true,
					asBranch: "latest",
				},
			);
		});

		it("rejects incomplete and unknown arguments", () => {
			assert.throws(() => {
				parseArgs(["--as-branch"]);
			}, /Missing branch name after --as-branch/u);
			assert.throws(() => {
				parseArgs(["--nope"]);
			}, /Unknown argument "--nope"/u);
		});
	});

	describe("generated page index", () => {
		const generated = loadGeneratedPages();

		it("includes shared rules and omits pages that do not exist in older versions", () => {
			assert.strictEqual(
				docsPageExists(generated, "/docs/v8.x/", "rules/no-undef"),
				true,
			);
			assert.strictEqual(
				docsPageExists(
					generated,
					"/docs/v8.x/",
					"rules/preserve-caught-error",
				),
				false,
			);
			assert.strictEqual(
				docsPageExists(
					generated,
					"/docs/v8.x/",
					"use/migrate-to-9.0.0",
				),
				false,
			);
			assert.strictEqual(
				docsPageExists(
					generated,
					"/docs/head/",
					"rules/preserve-caught-error",
				),
				true,
			);
			assert.strictEqual(
				docsPageExists(
					generated,
					"/docs/v9.x/",
					"use/migrate-to-10.0.0",
				),
				false,
			);
			assert.strictEqual(
				docsPageExists(generated, "/docs/latest/", "flags"),
				true,
			);
		});
	});
});
