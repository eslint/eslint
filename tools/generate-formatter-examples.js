/**
 * @fileoverview Generates documentation files for formatters:
 *    - docs/src/use/formatters/index.md
 *    - docs/src/use/formatters/html-formatter-example.html
 * @author Milos Djermanovic
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const fs = require("node:fs/promises");
const path = require("node:path");
const util = require("node:util");

const ejs = require("ejs");

const { ESLint } = require("../lib/api");
const { defineConfig } = require("../lib/config-api");
const js = require("../packages/js");

const formattersMetadata = require("../lib/cli-engine/formatters/formatters-meta.json");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const FORMATTERS_DOCS_DIR = path.join(__dirname, "../docs/src/use/formatters");
const INDEX_FILENAME = path.resolve(FORMATTERS_DOCS_DIR, "index.md");
const HTML_FORMATTER_FILENAME = path.resolve(
	FORMATTERS_DOCS_DIR,
	"html-formatter-example.html",
);

const TEMPLATE_FILENAME = path.resolve(
	__dirname,
	"../templates/formatter-examples.md.ejs",
);

const exampleCode = [
	"function addOne(i) {",
	"    if (i != NaN) {",
	"        return i ++",
	"    } else {",
	"      return",
	"    }",
	"};",
].join("\n");

const exampleConfig = defineConfig([
	js.configs.recommended,
	{
		rules: {
			"consistent-return": 2,
			indent: [1, 4],
			"no-else-return": 1,
			semi: [1, "always"],
			"space-unary-ops": 2,
		},
	},
]);

/**
 * Gets linting results from every formatter, based on a hard-coded snippet and config
 * @returns {Promise<Object>} Output from each formatter
 */
async function getFormatterResults() {
	const eslint = new ESLint({
		ignore: false,
		overrideConfigFile: true,
		baseConfig: exampleConfig,
	});

	const lintResults = await eslint.lintText(exampleCode, {
		filePath: "fullOfProblems.js",
	});

	return Object.fromEntries(
		await Promise.all(
			formattersMetadata.map(async ({ name, description }) => {
				const formatter = await eslint.loadFormatter(name);

				return [
					name,
					{
						result: util.stripVTControlCharacters(
							formatter.format(lintResults),
						),
						description,
					},
				];
			}),
		),
	);
}

//-----------------------------------------------------------------------------
// CLI
//-----------------------------------------------------------------------------

(async () => {
	const formatterResults = await getFormatterResults();
	const indexFileContent = ejs.render(
		await fs.readFile(TEMPLATE_FILENAME, "utf8"),
		{ formatterResults },
	);

	await Promise.all([
		fs.writeFile(INDEX_FILENAME, indexFileContent),
		fs.writeFile(HTML_FORMATTER_FILENAME, formatterResults.html.result),
	]);
})();
