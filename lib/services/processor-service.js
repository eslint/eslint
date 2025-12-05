/**
 * @fileoverview ESLint Processor Service
 * @author Nicholas C. Zakas
 */
/* eslint class-methods-use-this: off -- Anticipate future constructor arguments. */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const path = require("node:path");
const { VFile } = require("../linter/vfile.js");

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------

/** @typedef {import("../types").Linter.LintMessage} LintMessage */
/** @typedef {import("../linter/vfile.js").VFile} VFile */
/** @typedef {import("@eslint/core").Language} Language */
/** @typedef {import("eslint").Linter.Processor} Processor */

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * The service that applies processors to files.
 */
class ProcessorService {
	/**
	 * Preprocesses the given file synchronously.
	 * @param {VFile} file The file to preprocess.
	 * @param {{processor:Processor}} config The configuration to use.
	 * @returns {{ok:boolean, files?: Array<VFile>, errors?: Array<LintMessage>}} An array of preprocessed files or errors.
	 * @throws {Error} If the preprocessor returns a promise.
	 */
	preprocessSync(file, config) {
		const { processor } = config;
		let blocks;

		try {
			blocks = processor.preprocess(file.rawBody, file.path);
		} catch (ex) {
			// If the message includes a leading line number, strip it:
			const message = `Preprocessing error: ${ex.message.replace(/^line \d+:/iu, "").trim()}`;

			return {
				ok: false,
				errors: [
					{
						ruleId: null,
						fatal: true,
						severity: 2,
						message,
						line: ex.lineNumber,
						column: ex.column,
					},
				],
			};
		}

		if (typeof blocks.then === "function") {
			throw new Error("Unsupported: Preprocessor returned a promise.");
		}

		return {
			ok: true,
			files: blocks.map((block, i) => {
				/*
				 * Legacy behavior: if the preprocessor returns a string, just
				 * pass that directly through to the linter.
				 */
				if (typeof block === "string") {
					return block;
				}

				/*
				 * New behavior: allow processors to optionally specify a
				 * physical filename for child files. When present, this value
				 * represents the real path on disk that should be used by
				 * parsers and other tooling that operate on the filesystem
				 * (such as TypeScript project services).
				 *
				 * For backwards compatibility, we continue to:
				 * - Derive the virtual path from the parent file path plus
				 *   the index-prefixed block filename.
				 * - Default the physical path to the parent's physicalPath
				 *   when no explicit physicalFilename is provided.
				 */
				const virtualPath = path.join(
					file.path,
					`${i}_${block.filename}`,
				);
				const physicalPath =
					block.physicalFilename || file.physicalPath;

				return new VFile(virtualPath, block.text, {
					physicalPath,
				});
			}),
		};
	}

	/**
	 * Postprocesses the given messages synchronously.
	 * @param {VFile} file The file to postprocess.
	 * @param {LintMessage[][]} messages The messages to postprocess.
	 * @param {{processor:Processor}} config The configuration to use.
	 * @returns {LintMessage[]} The postprocessed messages.
	 */
	postprocessSync(file, messages, config) {
		const { processor } = config;

		return processor.postprocess(messages, file.path);
	}
}

module.exports = { ProcessorService };
