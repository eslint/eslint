/**
 * @fileoverview An object that creates fix commands for rules.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/**
 * @import { SourceRange } from "@eslint/core";
 */

/* eslint class-methods-use-this: off -- Methods desired on instance */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// none!

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Creates a fix command that inserts text at the specified index in the source text.
 * @param {number} index The 0-based index at which to insert the new text.
 * @param {string} text The text to insert.
 * @returns {Object} The fix command.
 * @private
 */
function insertTextAt(index, text) {
	return {
		range: [index, index],
		text,
	};
}

/**
 * Asserts that the provided text is a string.
 * @param {unknown} text The text to validate.
 * @returns {void}
 * @throws {TypeError} If `text` is not a string.
 */
function assertIsString(text) {
	if (typeof text !== "string") {
		throw new TypeError("'text' must be a string");
	}
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Creates code fixing commands for rules.
 */
class RuleFixer {
	/**
	 * The source code object representing the text to be fixed.
	 * @type {SourceCode}
	 */
	#sourceCode;

	/**
	 * Creates a new instance.
	 * @param {Object} options The options for the fixer.
	 * @param {SourceCode} options.sourceCode The source code object representing the text to be fixed.
	 */
	constructor({ sourceCode }) {
		this.#sourceCode = sourceCode;
	}

	/**
	 * Creates a fix command that inserts text after the given node or token.
	 * The fix is not applied until applyFixes() is called.
	 * @param {ASTNode|Token} nodeOrToken The node or token to insert after.
	 * @param {string} text The text to insert.
	 * @returns {Object} The fix command.
	 * @throws {TypeError} If `text` is not a string.
	 */
	insertTextAfter(nodeOrToken, text) {
		assertIsString(text);

		const range = this.#sourceCode.getRange(nodeOrToken);

		return this.insertTextAfterRange(range, text);
	}

	/**
	 * Creates a fix command that inserts text after the specified range in the source text.
	 * The fix is not applied until applyFixes() is called.
	 * @param {SourceRange} range The range to replace, first item is start of range, second
	 *      is end of range.
	 * @param {string} text The text to insert.
	 * @returns {Object} The fix command.
	 * @throws {TypeError} If `text` is not a string.
	 */
	insertTextAfterRange(range, text) {
		assertIsString(text);

		return insertTextAt(range[1], text);
	}

	/**
	 * Creates a fix command that inserts text before the given node or token.
	 * The fix is not applied until applyFixes() is called.
	 * @param {ASTNode|Token} nodeOrToken The node or token to insert before.
	 * @param {string} text The text to insert.
	 * @returns {Object} The fix command.
	 * @throws {TypeError} If `text` is not a string.
	 */
	insertTextBefore(nodeOrToken, text) {
		assertIsString(text);

		const range = this.#sourceCode.getRange(nodeOrToken);

		return this.insertTextBeforeRange(range, text);
	}

	/**
	 * Creates a fix command that inserts text before the specified range in the source text.
	 * The fix is not applied until applyFixes() is called.
	 * @param {SourceRange} range The range to replace, first item is start of range, second
	 *      is end of range.
	 * @param {string} text The text to insert.
	 * @returns {Object} The fix command.
	 * @throws {TypeError} If `text` is not a string.
	 */
	insertTextBeforeRange(range, text) {
		assertIsString(text);

		return insertTextAt(range[0], text);
	}

	/**
	 * Creates a fix command that replaces text at the node or token.
	 * The fix is not applied until applyFixes() is called.
	 * @param {ASTNode|Token} nodeOrToken The node or token to remove.
	 * @param {string} text The text to insert.
	 * @returns {Object} The fix command.
	 * @throws {TypeError} If `text` is not a string.
	 */
	replaceText(nodeOrToken, text) {
		assertIsString(text);

		const range = this.#sourceCode.getRange(nodeOrToken);

		return this.replaceTextRange(range, text);
	}

	/**
	 * Creates a fix command that replaces text at the specified range in the source text.
	 * The fix is not applied until applyFixes() is called.
	 * @param {SourceRange} range The range to replace, first item is start of range, second
	 *      is end of range.
	 * @param {string} text The text to insert.
	 * @returns {Object} The fix command.
	 * @throws {TypeError} If `text` is not a string.
	 */
	replaceTextRange(range, text) {
		assertIsString(text);

		return {
			range,
			text,
		};
	}

	/**
	 * Creates a fix command that removes the node or token from the source.
	 * The fix is not applied until applyFixes() is called.
	 * @param {ASTNode|Token} nodeOrToken The node or token to remove.
	 * @returns {Object} The fix command.
	 */
	remove(nodeOrToken) {
		const range = this.#sourceCode.getRange(nodeOrToken);

		return this.removeRange(range);
	}

	/**
	 * Creates a fix command that removes the specified range of text from the source.
	 * The fix is not applied until applyFixes() is called.
	 * @param {SourceRange} range The range to remove, first item is start of range, second
	 *      is end of range.
	 * @returns {Object} The fix command.
	 */
	removeRange(range) {
		return {
			range,
			text: "",
		};
	}
}

module.exports = { RuleFixer };
