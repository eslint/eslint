/**
 * @fileoverview Worker thread for multithread linting.
 * @author Francesco Trotta
 */

"use strict";

// eslint-disable-next-line n/no-unsupported-features/node-builtins -- enable V8's code cache if supported
require("node:module").enableCompileCache?.();

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { parentPort, workerData } = require("node:worker_threads");
const {
	createConfigLoader,
	createDefaultConfigs,
	createLinter,
	createLintFileRetrier,
	createLintResultCache,
	getCacheFile,
	lintFile,
	processOptions,
} = require("./eslint-helpers");
const { WarningService } = require("../services/warning-service");

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/** @typedef {import("../types").ESLint.LintResult} LintResult */
/** @typedef {import("../types").ESLint.Options} ESLintOptions */
/** @typedef {LintResult & { index?: number }} IndexedLintResult */
/**
 * @typedef {Object} WorkerData - Data passed to the worker thread.
 * @property {ESLintOptions | string} eslintOptionsOrURL - The unprocessed ESLint options or the URL of the option module.
 * @property {Uint32Array<SharedArrayBuffer>} filePathIndexArray - Shared counter used to track the next file to lint.
 * @property {string[]} filePaths - File paths to lint.
 */

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

(async () => {
	/** @type {WorkerData} */
	const { eslintOptionsOrURL, filePathIndexArray, filePaths } = workerData;
	const eslintOptions =
		typeof eslintOptionsOrURL === "object"
			? eslintOptionsOrURL
			: (await import(eslintOptionsOrURL)).default;
	const processedESLintOptions = processOptions(eslintOptions);

	const warningService = new WarningService();

	// These warnings are always emitted by the controlling thread.
	warningService.emitEmptyConfigWarning =
		warningService.emitInactiveFlagWarning = () => {};

	const linter = createLinter(processedESLintOptions, warningService);

	const cacheFilePath = getCacheFile(
		processedESLintOptions.cacheLocation,
		processedESLintOptions.cwd,
	);

	const lintResultCache = createLintResultCache(
		processedESLintOptions,
		cacheFilePath,
	);
	const defaultConfigs = createDefaultConfigs(eslintOptions.plugins);

	const configLoader = createConfigLoader(
		processedESLintOptions,
		defaultConfigs,
		linter,
		warningService,
	);

	const retrier = createLintFileRetrier();

	const indexedResults = [];
	for (;;) {
		// It seems hard to produce an arithmetic overflow under realistic conditions here.
		const index = Atomics.add(filePathIndexArray, 0, 1);

		const filePath = filePaths[index];
		if (!filePath) {
			break;
		}
		const configs = await configLoader.loadConfigArrayForFile(filePath);
		/** @type {IndexedLintResult} */
		const result = await lintFile(
			filePath,
			configs,
			processedESLintOptions,
			linter,
			lintResultCache,
			retrier,
		);
		if (result) {
			result.index = index;
			indexedResults.push(result);
		}
	}

	parentPort.postMessage(indexedResults);
})();
