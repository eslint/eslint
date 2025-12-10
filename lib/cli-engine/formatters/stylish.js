/**
 * @fileoverview Stylish reporter
 * @author Sindre Sorhus
 */
"use strict";

const util = require("node:util"),
	table = require("../../shared/text-table");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Returns a styling function based on the color option.
 * @param {boolean|undefined} color Indicates whether to use colors.
 * @returns {Function} A function that styles text.
 */
function getStyleText(color) {
	if (typeof color === "undefined") {
		return (format, text) =>
			util.styleText(format, text, { validateStream: true });
	}
	if (color) {
		return (format, text) =>
			util.styleText(format, text, { validateStream: false });
	}
	return (_, text) => text;
}

/**
 * Given a word and a count, append an s if count is not one.
 * @param {string} word A word in its singular form.
 * @param {number} count A number controlling whether word should be pluralized.
 * @returns {string} The original word with an s on the end if count is not one.
 */
function pluralize(word, count) {
	return count === 1 ? word : `${word}s`;
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function (results, data) {
	const styleText = getStyleText(data?.color);

	let output = "\n",
		errorCount = 0,
		warningCount = 0,
		fixableErrorCount = 0,
		fixableWarningCount = 0,
		summaryColor = "yellow";

	results.forEach(result => {
		const messages = result.messages;

		if (messages.length === 0) {
			return;
		}

		errorCount += result.errorCount;
		warningCount += result.warningCount;
		fixableErrorCount += result.fixableErrorCount;
		fixableWarningCount += result.fixableWarningCount;

		output += `${styleText("underline", result.filePath)}\n`;

		output += `${table(
			messages.map(message => {
				let messageType;

				if (message.fatal || message.severity === 2) {
					messageType = styleText("red", "error");
					summaryColor = "red";
				} else {
					messageType = styleText("yellow", "warning");
				}

				return [
					"",
					String(message.line || 0),
					String(message.column || 0),
					messageType,
					message.message.replace(/([^ ])\.$/u, "$1"),
					message.ruleId ? styleText("dim", message.ruleId) : "",
				];
			}),
			{
				align: ["", "r", "l"],
				stringLength(str) {
					return util.stripVTControlCharacters(str).length;
				},
			},
		)
			.split("\n")
			.map(el =>
				el.replace(/(\d+)\s+(\d+)/u, (m, p1, p2) =>
					styleText("dim", `${p1}:${p2}`),
				),
			)
			.join("\n")}\n\n`;
	});

	const total = errorCount + warningCount;

	/*
	 * We can't use a single `styleText` call like `styleText([summaryColor, "bold"], text)` here.
	 * This is a bug in `util.styleText` in Node.js versions earlier than v22.15.0 (https://github.com/nodejs/node/issues/56717).
	 * As a workaround, we use nested `styleText` calls.
	 */
	if (total > 0) {
		output += `${styleText(
			summaryColor,
			styleText(
				"bold",
				[
					"\u2716 ",
					total,
					pluralize(" problem", total),
					" (",
					errorCount,
					pluralize(" error", errorCount),
					", ",
					warningCount,
					pluralize(" warning", warningCount),
					")",
				].join(""),
			),
		)}\n`;

		if (fixableErrorCount > 0 || fixableWarningCount > 0) {
			output += `${styleText(
				summaryColor,
				styleText(
					"bold",
					[
						"  ",
						fixableErrorCount,
						pluralize(" error", fixableErrorCount),
						" and ",
						fixableWarningCount,
						pluralize(" warning", fixableWarningCount),
						" potentially fixable with the `--fix` option.",
					].join(""),
				),
			)}\n`;
		}
	}

	// Resets output color, for prevent change on top level
	return total > 0 ? styleText("reset", output) : "";
};
