"use strict";

const markdown = require("@eslint/markdown").default;
const md = require("eslint-markdown").default;

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
	name: "eslint-config-eslint/markdown",
	files: ["**/*.md"],
	plugins: { markdown, md },
	language: "markdown/gfm",
	languageOptions: {
		frontmatter: "yaml",
	},
	rules: {
		"markdown/heading-increment": "error", // MD001: heading-increment
		"md/consistent-heading-style": "error", // MD003: heading-style
		"md/consistent-unordered-list-style": "error", // MD004: ul-style
		"markdown/no-reversed-media-syntax": "error", // MD011: no-reversed-links
		"md/no-shell-dollar": "error", // MD014: commands-show-output
		"markdown/no-missing-atx-heading-space": [
			"error",
			{ checkClosedHeadings: true },
		], // MD018: no-missing-space-atx, MD020: no-missing-space-closed-atx
	},
};
