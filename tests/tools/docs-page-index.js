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
	routeForContentFile,
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
