/**
 * @fileoverview Worker thread for multithread linting.
 * @author Francesco Trotta
 */

"use strict";

const hrtimeBigint = process.hrtime.bigint;

const startTime = hrtimeBigint();

// eslint-disable-next-line n/no-unsupported-features/node-builtins -- enable V8's code cache if supported
require("node:module").enableCompileCache?.();

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { parentPort, threadId, workerData } = require("node:worker_threads");
const createDebug = require("debug");
const {
	createConfigLoader,
	createDefaultConfigs,
	createLinter,
	createLintResultCache,
	getCacheFile,
	lintFile,
	loadOptionsFromModule,
	processOptions,
} = require("./eslint-helpers");
const { WarningService } = require("../services/warning-service");

const depsLoadedTime = hrtimeBigint();

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
// Helpers
//------------------------------------------------------------------------------

const debug = createDebug(`eslint:worker:thread-${threadId}`);
createDebug.formatters.t = timeDiff =>
	`${(timeDiff + 500_000n) / 1_000_000n} ms`;

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

debug("Dependencies loaded in %t", depsLoadedTime - startTime);

(async () => {
	/** @type {WorkerData} */
	const { eslintOptionsOrURL, filePathIndexArray, filePaths } = workerData;
	const eslintOptions =
		typeof eslintOptionsOrURL === "object"
			? eslintOptionsOrURL
			: await loadOptionsFromModule(eslintOptionsOrURL);
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

	const indexedResults = [];

	const startLintingTime = hrtimeBigint();
	debug(
		"Linting started %t after dependencies loaded",
		startLintingTime - depsLoadedTime,
	);

	for (;;) {
		const fileLintingStartTime = hrtimeBigint();

		// It seems hard to produce an arithmetic overflow under realistic conditions here.
		const index = Atomics.add(filePathIndexArray, 0, 1);

		const filePath = filePaths[index];
		if (!filePath) {
			break;
		}

		const beforeLoadConfigTime = hrtimeBigint();
		const configs = await configLoader.loadConfigArrayForFile(filePath);
		const afterLoadConfigTime = hrtimeBigint();
		debug(
			'Config array for file "%s" loaded in %t',
			filePath,
			afterLoadConfigTime - beforeLoadConfigTime,
		);

		/** @type {IndexedLintResult} */
		const result = await lintFile(
			filePath,
			configs,
			processedESLintOptions,
			linter,
			lintResultCache,
		);
		if (result) {
			result.index = index;
			indexedResults.push(result);
		}

		const fileLintingEndTime = hrtimeBigint();
		debug(
			'File "%s" processed in %t',
			filePath,
			fileLintingEndTime - fileLintingStartTime,
		);
	}

	parentPort.postMessage(indexedResults);
})();
