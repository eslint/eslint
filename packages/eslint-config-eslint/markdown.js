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
		"md/consistent-heading-style": "off", // MD003: heading-style
		"md/consistent-unordered-list-style": "error", // MD004: ul-style
		"markdown/no-reversed-media-syntax": "error", // MD011: no-reversed-links
	},
};
