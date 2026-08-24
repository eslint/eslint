/**
 * @fileoverview Small script to print the sequence of code path events that
 * ESLint's code path analysis emits for a given piece of source code.
 *
 * Usage:
 *   node tools/internal/log-code-path-events.js "if (a) { b(); }"
 *   node tools/internal/log-code-path-events.js path/to/file.js
 *
 * This is meant as a scratch tool for exploring/validating code path event
 * sequences while writing docs or rules that use the code path analysis API.
 */

"use strict";

const fs = require("node:fs");
const { Linter } = require("../../lib/linter");

const arg = process.argv[2];

if (!arg) {
	console.error("Usage: node log-code-path-events.js <code | file path>");
	process.exit(1);
}

const code = fs.existsSync(arg) ? fs.readFileSync(arg, "utf8") : arg;

const linter = new Linter();

// eslint-disable-next-line jsdoc/require-jsdoc
function logEvent(depth, event, id) {
	const firstPart = `${" ".repeat(2 * depth)}${event}`;
	const pos = 50 - firstPart.length;
	// eslint-disable-next-line no-console
	console.log(`${firstPart}${" ".repeat(pos)}${id}`);
}

linter.verify(code, {
	languageOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: {
		"log-code-path": {
			rules: {
				log: {
					create() {
						let depth = 0;
						return {
							onCodePathStart(codePath) {
								logEvent(depth, "onCodePathStart", codePath.id);
								depth++;
							},
							onCodePathEnd(codePath) {
								depth--;
								logEvent(
									depth,
									"onCodePathEnd",
									codePath.id,
								);
							},
							onCodePathSegmentStart(segment) {
								logEvent(
									depth,
									"onCodePathSegmentStart",
									segment.id,
								);
								depth++;
							},
							onCodePathSegmentEnd(segment) {
								depth--;
								logEvent(
									depth,
									"onCodePathSegmentEnd",
									segment.id,
								);
							},
							onUnreachableCodePathSegmentStart(segment) {
								logEvent(
									depth,
									"onUnreachableCodePathSegmentStart",
									segment.id,
								);
								depth++;
							},
							onUnreachableCodePathSegmentEnd(segment) {
								depth--;
								logEvent(
									depth,
									"onUnreachableCodePathSegmentEnd",
									segment.id,
								);
							},
							onCodePathSegmentLoop(fromSegment, toSegment) {
								logEvent(
									depth,
									"onCodePathSegmentLoop",
									`${fromSegment.id} -> ${toSegment.id}`,
								);
							},
						};
					},
				},
			},
		},
	},
	rules: {
		"log-code-path/log": "error",
	},
});
