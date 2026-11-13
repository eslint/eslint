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
 * Runs git.
 * @param {string[]} args Git arguments.
 * @returns {import("node:child_process").SpawnSyncReturns<string>} Git result.
 * @throws {Error} When git cannot be started.
 */
function gitResult(args) {
	const result = spawnSync("git", args, {
		cwd: repoRoot,
		encoding: "utf8",
	});

	if (result.error) {
		throw result.error;
	}

	return result;
}

/**
 * Runs git and returns stdout lines.
 * `git grep` exits with 1 when it finds no matches.
 * @param {string[]} args Git arguments.
 * @param {{ allowNoMatch?: boolean }} [options] Command options.
 * @returns {string[]} Stdout split into non-empty lines.
 * @throws {Error} When git fails.
 */
function gitLines(args, options) {
	const result = gitResult(args);

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
 * Branch names published in `versions.json`.
 * @returns {string[]} Documentation branches.
 */
function versionBranches() {
	return versions.items
		.map(item => item.branch)
		.filter(branch => typeof branch === "string" && branch !== "");
}

/**
 * Reports whether a ref points at a commit.
 * @param {string} ref Git ref.
 * @returns {boolean} `true` when the ref exists.
 */
function refExists(ref) {
	return (
		gitResult(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`])
			.status === 0
	);
}

/**
 * Name of the checked-out branch.
 * @returns {string} Branch name, or `""` when HEAD is detached.
 */
function currentBranchName() {
	const result = gitResult(["branch", "--show-current"]);

	if (result.status !== 0) {
		return "";
	}

	return result.stdout.trim();
}

/**
 * Prefers the remote ref for a documentation branch.
 * @param {string} branch Branch name from `versions.json`.
 * @returns {string|null} Existing ref, or `null` when neither exists.
 */
function availableRef(branch) {
	if (refExists(`origin/${branch}`)) {
		return `origin/${branch}`;
	}

	if (refExists(branch)) {
		return branch;
	}

	return null;
}

/**
 * Commit time of the merge-base between HEAD and a ref.
 * @param {string} ref Git ref.
 * @returns {number|null} Unix time, or `null` when the history is unavailable.
 */
function mergeBaseTime(ref) {
	const base = gitResult(["merge-base", "HEAD", ref]);

	if (base.status !== 0) {
		return null;
	}

	const time = gitResult(["show", "-s", "--format=%ct", base.stdout.trim()]);

	if (time.status !== 0) {
		return null;
	}

	const value = Number(time.stdout.trim());

	return Number.isFinite(value) ? value : null;
}

/**
 * Picks the version branch whose pages come from this checkout.
 * A checkout of a version branch supplies that branch. Otherwise the version
 * branch with the newest merge-base is the one this checkout was cut from.
 * When that history is unavailable, a non-version branch supplies `main`.
 * @param {string} currentBranch Current branch name, or `""` when detached.
 * @param {string[]} branches Branch names from `versions.json`.
 * @param {Object<string, number|null>} mergeBaseTimes Unix time of each merge-base, or `null`.
 * @returns {string|null} Branch supplied by the checkout.
 */
function versionBranchForCheckout(currentBranch, branches, mergeBaseTimes) {
	if (branches.includes(currentBranch)) {
		return currentBranch;
	}

	let bestBranch = null;
	let bestTime = -1;

	for (const branch of branches) {
		const time = mergeBaseTimes[branch];

		if (typeof time === "number" && time > bestTime) {
			bestBranch = branch;
			bestTime = time;
		}
	}

	if (bestBranch) {
		return bestBranch;
	}

	return branches.includes("main") ? "main" : null;
}

/**
 * Version branches whose pages should be read from the checkout.
 * @param {string|null} asBranch Branch the caller is about to publish from HEAD.
 * @returns {string[]} Branch names.
 */
function branchesSuppliedByCheckout(asBranch) {
	const branches = versionBranches();
	const currentBranch = currentBranchName();

	/** @type {Object<string, number|null>} */
	const mergeBaseTimes = {};

	if (!branches.includes(currentBranch)) {
		for (const branch of branches) {
			const ref = availableRef(branch);

			mergeBaseTimes[branch] = ref ? mergeBaseTime(ref) : null;
		}
	}

	const owned = versionBranchForCheckout(
		currentBranch,
		branches,
		mergeBaseTimes,
	);

	return [...new Set([owned, asBranch].filter(Boolean))];
}

/**
 * Chooses the git ref that supplies one version's pages.
 * The checkout is used for a version it supplies, before any remote ref, so
 * pages added on that branch are indexed before they exist on the remote.
 * Other versions use their remote ref, then a local branch of the same name.
 * @param {string} branch Branch name from `versions.json`.
 * @param {{ ownedBranches: string[], availableRefs: string[] }} options Ref selection input.
 * @returns {string} Git ref.
 * @throws {Error} When no candidate ref exists.
 */
function selectGitRef(branch, { ownedBranches, availableRefs }) {
	const available = new Set(availableRefs);
	const candidates = [];

	if (ownedBranches.includes(branch)) {
		candidates.push("HEAD");
	}

	candidates.push(`origin/${branch}`, branch);

	for (const candidate of candidates) {
		if (available.has(candidate)) {
			return candidate;
		}
	}

	throw new Error(
		`Missing git ref for docs branch "${branch}". Fetch it and rerun this script.`,
	);
}

/**
 * Resolves a branch name to the checkout or a remote ref.
 * @param {string} branch Branch name from `versions.json`.
 * @param {string[]} ownedBranches Branches whose pages come from HEAD.
 * @returns {string} Git ref.
 * @throws {Error} When no candidate ref exists.
 */
function gitRefForBranch(branch, ownedBranches) {
	const availableRefs = [];

	if (refExists("HEAD")) {
		availableRefs.push("HEAD");
	}

	if (refExists(`origin/${branch}`)) {
		availableRefs.push(`origin/${branch}`);
	}

	if (refExists(branch)) {
		availableRefs.push(branch);
	}

	return selectGitRef(branch, { ownedBranches, availableRefs });
}

/**
 * Fetches documentation branches listed in `versions.json`.
 * A branch that origin does not have yet is skipped. Any other fetch
 * failure aborts the run so the index is not built from stale refs.
 * @returns {void}
 * @throws {Error} When a fetch fails for a reason other than a missing branch.
 */
function fetchVersionBranches() {
	const missing = [];

	for (const branch of versionBranches()) {
		const result = gitResult(["fetch", "--no-tags", "origin", branch]);

		if (result.status === 0) {
			continue;
		}

		const stderr = (result.stderr || "").trim();

		if (/couldn't find remote ref/u.test(stderr)) {
			missing.push(branch);
			continue;
		}

		throw new Error(stderr || `git fetch origin ${branch} failed.`);
	}

	if (missing.length > 0) {
		console.error(
			`Documentation branches not on origin yet: ${missing.join(", ")}.`,
		);
	}
}

/**
 * Reads CLI flags.
 * @param {string[]} argv Arguments after the node executable and script path.
 * @returns {{check: boolean, fetch: boolean, asBranch: string|null}} Parsed options.
 * @throws {Error} When a flag is unknown or incomplete.
 */
function parseArgs(argv) {
	/** @type {{check: boolean, fetch: boolean, asBranch: string|null}} */
	const options = { check: false, fetch: false, asBranch: null };

	for (let index = 0; index < argv.length; index++) {
		const arg = argv[index];

		if (arg === "--check") {
			options.check = true;
		} else if (arg === "--fetch") {
			options.fetch = true;
		} else if (arg === "--as-branch") {
			const branch = argv[index + 1];

			if (!branch || branch.startsWith("-")) {
				throw new Error("Missing branch name after --as-branch.");
			}

			options.asBranch = branch;
			index += 1;
		} else {
			throw new Error(`Unknown argument "${arg}".`);
		}
	}

	return options;
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
 * @param {{ asBranch?: string|null }} [options] Build options.
 * @returns {Object<string, string[]>} Version path to sorted routes.
 */
function buildPageIndex(options) {
	const ownedBranches = branchesSuppliedByCheckout(
		(options && options.asBranch) || null,
	);

	/** @type {Object<string, string[]>} */
	const index = {};

	for (const item of versions.items) {
		if (!item.branch || !item.path) {
			continue;
		}

		index[item.path] = pagesForRef(
			gitRefForBranch(item.branch, ownedBranches),
		);
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
 * Command that rewrites the page index with the same inputs as `options`.
 * @param {{fetch: boolean, asBranch: string|null}} options Parsed CLI options.
 * @returns {string} Shell command without `--check`.
 */
function updateCommand(options) {
	let command = "node docs/tools/update-docs-page-index.js";

	if (options.fetch) {
		command += " --fetch";
	}

	if (options.asBranch) {
		command += ` --as-branch ${options.asBranch}`;
	}

	return command;
}

/**
 * Writes `docs/src/assets/js/docs-pages.js`, or checks that it is current.
 * @param {{check: boolean, fetch: boolean, asBranch: string|null}} options Parsed CLI options.
 * @returns {void}
 * @throws {Error} When `--check` finds a stale page index.
 */
function run(options) {
	if (options.fetch) {
		fetchVersionBranches();
	}

	const index = buildPageIndex(options);
	const rendered = renderPageIndex(index);

	for (const [versionPath, routes] of Object.entries(index)) {
		console.log(`${versionPath} ${routes.length} pages`);
	}

	if (options.check) {
		const current = fs.readFileSync(outputPath, "utf8");

		if (current !== rendered) {
			throw new Error(
				`docs/src/assets/js/docs-pages.js is out of date. Run \`${updateCommand(options)}\`.`,
			);
		}

		console.log("docs/src/assets/js/docs-pages.js is up to date.");
		return;
	}

	fs.writeFileSync(outputPath, rendered);
}

/**
 * Writes `docs/src/assets/js/docs-pages.js`, or checks that it is current.
 * @returns {void}
 */
function main() {
	try {
		run(parseArgs(process.argv.slice(2)));
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	}
}

if (require.main === module) {
	main();
}

module.exports = {
	parseArgs,
	routeForContentFile,
	selectGitRef,
	versionBranchForCheckout,
};
