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
 * Computes the visible width of a string, avoiding the cost of stripping
 * VT control characters when the string doesn't contain any.
 *
 * VT sequences can be introduced either by the 7-bit `ESC` character or by
 * the 8-bit `CSI` character, both of which `util.stripVTControlCharacters()`
 * removes, so both must be checked before taking the fast path.
 * @param {string} str The string to measure.
 * @returns {number} The number of visible characters.
 */
function stringLength(str) {
	return str.includes("\u001b") || str.includes("\u009b")
		? util.stripVTControlCharacters(str).length
		: str.length;
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

				/*
				 * Strip a trailing period unless it's preceded by a space.
				 * This is equivalent to `.replace(/([^ ])\.$/u, "$1")` but
				 * avoids running a regex on every message.
				 */
				let messageText = message.message;

				if (
					messageText.length > 1 &&
					messageText.endsWith(".") &&
					messageText.at(-2) !== " "
				) {
					messageText = messageText.slice(0, -1);
				}

				return [
					"",
					String(message.line || 0),
					String(message.column || 0),
					messageType,
					messageText,
					message.ruleId ? styleText("dim", message.ruleId) : "",
				];
			}),
			{
				align: ["", "r", "l"],
				stringLength,
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
