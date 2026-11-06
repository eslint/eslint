/**
 * @fileoverview Builds the documentation page index used by version switching and search.
 * @author Nitin Kumar
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { normalizeDocsRoute } = require("../src/assets/js/docs-page-index");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const repoRoot = path.resolve(__dirname, "../..");
const versions = require("../src/_data/versions.json");
const outputPath = path.join(repoRoot, "docs/src/assets/js/docs-pages.js");
const CONTENT_FILE = /\.(?:md|html|njk)$/u;
const IGNORED_CONTENT_DIR =
	/^docs\/src\/(?:_includes|_data|_plugins|assets|static)\//u;
const FRONT_MATTER_LINE_LIMIT = 40;

/**
 * Runs git and returns stdout lines.
 * `git grep` exits with 1 when it finds no matches.
 * @param {string[]} args Git arguments.
 * @param {{ allowNoMatch?: boolean }} [options] Command options.
 * @returns {string[]} Stdout split into non-empty lines.
 * @throws {Error} When git fails or cannot be started.
 */
function gitLines(args, options) {
	const result = spawnSync("git", args, {
		cwd: repoRoot,
		encoding: "utf8",
	});

	if (result.error) {
		throw result.error;
	}

	if (result.status === 1 && options && options.allowNoMatch) {
		return [];
	}

	if (result.status !== 0) {
		throw new Error(
			(result.stderr || "").trim() || `git ${args.join(" ")} failed.`,
		);
	}

	return result.stdout.split("\n").filter(Boolean);
}

/**
 * Resolves a branch name to a local or origin ref.
 * @param {string} branch Branch name from `versions.json`.
 * @returns {string} Git ref.
 * @throws {Error} When neither the branch nor its origin ref exists.
 */
function gitRefForBranch(branch) {
	const candidates = [`origin/${branch}`, branch];

	for (const candidate of candidates) {
		const result = spawnSync(
			"git",
			["rev-parse", "--verify", "--quiet", `${candidate}^{commit}`],
			{
				cwd: repoRoot,
				encoding: "utf8",
			},
		);

		if (result.status === 0) {
			return candidate;
		}
	}

	throw new Error(
		`Missing git ref for docs branch "${branch}". Fetch it and rerun this script.`,
	);
}

/**
 * Removes one matching pair of quotes.
 * @param {string} value Raw permalink value.
 * @returns {string} Value without wrapping quotes.
 */
function stripQuotes(value) {
	const trimmed = value.trim();

	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1);
	}

	return trimmed;
}

/**
 * Reads a permalink from a front-matter or directory-data line.
 * @param {string} text Source line.
 * @returns {string|null} Permalink value, or `null` when the line is not a permalink.
 */
function permalinkValue(text) {
	const trimmed = text.trim();

	if (trimmed.startsWith("permalink:")) {
		return stripQuotes(trimmed.slice("permalink:".length));
	}

	if (!trimmed.startsWith('"permalink"')) {
		return null;
	}

	const colonIndex = trimmed.indexOf(":");

	if (colonIndex === -1) {
		return null;
	}

	let value = trimmed.slice(colonIndex + 1).trim();

	if (value.endsWith(",")) {
		value = value.slice(0, -1).trim();
	}

	return stripQuotes(value);
}

/**
 * Converts a literal permalink into a normalized route.
 * @param {string} permalink Permalink from front matter or directory data.
 * @returns {string|null} Normalized route, or `null` for templates.
 */
function routeFromPermalink(permalink) {
	if (permalink.includes("{{")) {
		return null;
	}

	return normalizeDocsRoute(permalink);
}

/**
 * Converts a content file path into the route Eleventy would emit by default.
 * @param {string} file Repo-relative path.
 * @returns {string} Normalized route.
 */
function routeFromRepoPath(file) {
	const relativePath = file
		.slice("docs/src/".length)
		.replace(CONTENT_FILE, "");

	return normalizeDocsRoute(relativePath);
}

/**
 * Applies the nearest directory permalink template.
 * @param {string} file Repo-relative path.
 * @param {Object<string, string>} directoryPermalinks Directory path to permalink template.
 * @returns {string|null} Route from the template, or `null` to keep the file path.
 */
function routeFromDirectoryPermalink(file, directoryPermalinks) {
	let directory = path.posix.dirname(file);

	while (directory.startsWith("docs/src")) {
		const template = directoryPermalinks[directory];

		if (template) {
			if (template.includes("{{ page.fileSlug }}")) {
				const slug = path.posix
					.basename(file)
					.replace(CONTENT_FILE, "");

				return routeFromPermalink(
					template.replaceAll("{{ page.fileSlug }}", slug),
				);
			}

			if (!template.includes("{{")) {
				return routeFromPermalink(template);
			}

			return null;
		}

		if (directory === "docs/src") {
			break;
		}

		directory = path.posix.dirname(directory);
	}

	return null;
}

/**
 * Splits one `git grep` line into its file, line number, and text.
 * @param {string} ref Git ref passed to `git grep`.
 * @param {string} line Grep output line.
 * @returns {{file: string, lineNumber: number, text: string}|null} Parsed line.
 */
function parseGrepLine(ref, line) {
	const prefix = `${ref}:`;

	if (!line.startsWith(prefix)) {
		return null;
	}

	const match = /^(.*?):(\d+):(.*)$/u.exec(line.slice(prefix.length));

	if (!match) {
		return null;
	}

	return {
		file: match[1],
		lineNumber: Number(match[2]),
		text: match[3],
	};
}

/**
 * Checks whether a JSON file is Eleventy directory data.
 * @param {string} file Repo-relative path.
 * @returns {boolean} `true` when the JSON file is Eleventy directory data.
 */
function isDirectoryDataFile(file) {
	if (!file.endsWith(".json")) {
		return false;
	}

	const directory = path.posix.dirname(file);
	const expectedName = `${path.posix.basename(directory)}.json`;

	return path.posix.basename(file) === expectedName;
}

/**
 * Reads permalinks and collection exclusions from one docs branch.
 * @param {string} ref Git ref.
 * @returns {{permalinks: Map<string, string>, excluded: Set<string>, directoryPermalinks: Object<string, string>}} Front matter metadata.
 */
function readFrontMatter(ref) {
	const permalinks = new Map();
	const excluded = new Set();
	const directoryPermalinks = {};
	const lines = gitLines(
		[
			"grep",
			"-n",
			"-E",
			'^(permalink:|eleventyExcludeFromCollections:|[[:space:]]*"permalink":|[[:space:]]*"eleventyExcludeFromCollections":)',
			ref,
			"--",
			"docs/src",
		],
		{ allowNoMatch: true },
	);

	for (const line of lines) {
		const parsed = parseGrepLine(ref, line);

		if (!parsed || parsed.lineNumber > FRONT_MATTER_LINE_LIMIT) {
			continue;
		}

		if (
			/eleventyExcludeFromCollections["']?\s*:\s*true/u.test(parsed.text)
		) {
			excluded.add(parsed.file);
		}

		const permalink = permalinkValue(parsed.text);

		if (!permalink) {
			continue;
		}

		if (isDirectoryDataFile(parsed.file)) {
			directoryPermalinks[path.posix.dirname(parsed.file)] = permalink;
		} else if (CONTENT_FILE.test(parsed.file)) {
			permalinks.set(parsed.file, permalink);
		}
	}

	return { permalinks, excluded, directoryPermalinks };
}

/**
 * Resolves the published route for one content file.
 * @param {Object} fileInfo File metadata.
 * @param {string} fileInfo.file Repo-relative path.
 * @param {string|null} fileInfo.permalink Front matter permalink, if any.
 * @param {boolean} fileInfo.excluded Whether Eleventy excludes the file from collections.
 * @param {Object<string, string>} fileInfo.directoryPermalinks Directory path to permalink template.
 * @returns {string|null} Normalized route, or `null` when the file is not a page.
 */
function routeForContentFile(fileInfo) {
	const file = fileInfo.file;

	if (
		fileInfo.excluded ||
		!CONTENT_FILE.test(file) ||
		IGNORED_CONTENT_DIR.test(file)
	) {
		return null;
	}

	let route = routeFromRepoPath(file);
	const directoryRoute = routeFromDirectoryPermalink(
		file,
		fileInfo.directoryPermalinks,
	);

	if (typeof directoryRoute === "string") {
		route = directoryRoute;
	}

	if (fileInfo.permalink) {
		const frontMatterRoute = routeFromPermalink(fileInfo.permalink);

		if (typeof frontMatterRoute === "string") {
			route = frontMatterRoute;
		}
	}

	return route;
}

/**
 * Lists published routes for one git ref.
 * @param {string} ref Git ref.
 * @returns {string[]} Sorted routes relative to the version root.
 * @throws {Error} When the ref does not contain any documentation pages.
 */
function pagesForRef(ref) {
	const files = gitLines([
		"ls-tree",
		"-r",
		"--name-only",
		ref,
		"--",
		"docs/src",
	]);
	const frontMatter = readFrontMatter(ref);
	const routes = new Set();

	for (const file of files) {
		const route = routeForContentFile({
			file,
			permalink: frontMatter.permalinks.get(file) || null,
			excluded: frontMatter.excluded.has(file),
			directoryPermalinks: frontMatter.directoryPermalinks,
		});

		if (route !== null) {
			routes.add(route);
		}
	}

	if (routes.size === 0) {
		throw new Error(`No documentation pages found for ${ref}.`);
	}

	return [...routes].sort((left, right) => left.localeCompare(right));
}

/**
 * Checks that permalink handling still matches known version differences.
 * @param {Object<string, string[]>} index Version path to routes.
 * @returns {void}
 */
function assertIndex(index) {
	/**
	 * Throws when a required route is absent.
	 * @param {string} versionPath Version base path.
	 * @param {string} route Route that must be present.
	 * @returns {void}
	 * @throws {Error} When the route is not in the index.
	 */
	function assertHas(versionPath, route) {
		if (!index[versionPath].includes(route)) {
			throw new Error(`Expected ${versionPath} to include "${route}".`);
		}
	}

	/**
	 * Throws when a route is present but should not be.
	 * @param {string} versionPath Version base path.
	 * @param {string} route Route that must be absent.
	 * @returns {void}
	 * @throws {Error} When the route is in the index.
	 */
	function assertLacks(versionPath, route) {
		if (index[versionPath].includes(route)) {
			throw new Error(`Expected ${versionPath} to omit "${route}".`);
		}
	}

	for (const versionPath of Object.keys(index)) {
		assertHas(versionPath, "");
		assertHas(versionPath, "rules/no-undef");
		assertLacks(versionPath, "pages/flags");
		assertLacks(versionPath, "pages/index");
	}

	if (index["/docs/head/"]) {
		assertHas("/docs/head/", "flags");
		assertHas("/docs/head/", "rules/preserve-caught-error");
		assertHas("/docs/head/", "component-library/buttons");
	}

	if (index["/docs/v8.x/"]) {
		assertLacks("/docs/v8.x/", "rules/preserve-caught-error");
		assertLacks("/docs/v8.x/", "use/migrate-to-9.0.0");
	}

	if (index["/docs/v9.x/"]) {
		assertHas("/docs/v9.x/", "rules/preserve-caught-error");
		assertLacks("/docs/v9.x/", "use/migrate-to-10.0.0");
	}
}

/**
 * Builds the page index for every version in `versions.json`.
 * @returns {Object<string, string[]>} Version path to sorted routes.
 */
function buildPageIndex() {
	/** @type {Object<string, string[]>} */
	const index = {};

	for (const item of versions.items) {
		if (!item.branch || !item.path) {
			continue;
		}

		index[item.path] = pagesForRef(gitRefForBranch(item.branch));
	}

	assertIndex(index);
	return index;
}

/**
 * Renders the browser global that stores the page index.
 * @param {Object<string, string[]>} index Version path to sorted routes.
 * @returns {string} JavaScript source.
 */
function renderPageIndex(index) {
	const lines = [
		"/**",
		" * @fileoverview Pages published for each documentation version.",
		" * Generated by `node docs/tools/update-docs-page-index.js`.",
		" */",
		"",
		"window.ESLINT_DOCS_PAGES = {",
	];

	for (const [versionPath, routes] of Object.entries(index)) {
		lines.push(`\t${JSON.stringify(versionPath)}: [`);

		for (const route of routes) {
			lines.push(`\t\t${JSON.stringify(route)},`);
		}

		lines.push("\t],");
	}

	lines.push("};", "");
	return lines.join("\n");
}

/**
 * Writes `docs/src/assets/js/docs-pages.js`.
 * @returns {void}
 */
function main() {
	const index = buildPageIndex();

	fs.writeFileSync(outputPath, renderPageIndex(index));

	for (const [versionPath, routes] of Object.entries(index)) {
		console.log(`${versionPath} ${routes.length} pages`);
	}
}

if (require.main === module) {
	main();
}

module.exports = {
	routeForContentFile,
};
