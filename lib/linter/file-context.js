/**
 * @fileoverview The FileContext class.
 * @author Nicholas C. Zakas
 */

"use strict";

/**
 * Represents a file context that the linter can use to lint a file.
 */
class FileContext {
	/**
	 * The current working directory.
	 * @type {string}
	 */
	cwd;

	/**
	 * The filename of the file being linted.
	 * @type {string}
	 */
	filename;

	/**
	 * The physical filename of the file being linted.
	 * @type {string}
	 */
	physicalFilename;

	/**
	 * The source code of the file being linted.
	 * @type {SourceCode}
	 */
	sourceCode;

	/**
	 * The language options used when parsing this file.
	 * @type {Record<string, unknown>}
	 */
	languageOptions;

	/**
	 * The settings for the file being linted.
	 * @type {Record<string, unknown>}
	 */
	settings;

	/**
	 * Creates a new instance.
	 * @param {Object} config The configuration object for the file context.
	 * @param {string} config.cwd The current working directory.
	 * @param {string} config.filename The filename of the file being linted.
	 * @param {string} config.physicalFilename The physical filename of the file being linted.
	 * @param {SourceCode} config.sourceCode The source code of the file being linted.
	 * @param {Record<string, unknown>} config.languageOptions The language options used when parsing this file.
	 * @param {Record<string, unknown>} config.settings The settings for the file being linted.
	 */
	constructor({
		cwd,
		filename,
		physicalFilename,
		sourceCode,
		languageOptions,
		settings,
	}) {
		this.cwd = cwd;
		this.filename = filename;
		this.physicalFilename = physicalFilename;
		this.sourceCode = sourceCode;
		this.languageOptions = languageOptions;
		this.settings = settings;

		Object.freeze(this);
	}

	/**
	 * Creates a new object with the current object as the prototype and
	 * the specified properties as its own properties.
	 * @param {Object} extension The properties to add to the new object.
	 * @returns {FileContext} A new object with the current object as the prototype
	 * and the specified properties as its own properties.
	 */
	extend(extension) {
		return Object.freeze(Object.assign(Object.create(this), extension));
	}
}

exports.FileContext = FileContext;
