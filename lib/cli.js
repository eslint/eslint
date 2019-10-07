/**
 * @fileoverview Main CLI object.
 * @author Nicholas C. Zakas
 */

"use strict";

/*
 * The CLI object should *not* call process.exit() directly. It should only return
 * exit codes. This allows other programs to use the CLI object and still control
 * when the program exits.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs"),
    path = require("path"),
    mkdirp = require("mkdirp"),
    { ESLint } = require("./eslint"),
    options = require("./options"),
    log = require("./shared/logging"),
    RuntimeInfo = require("./shared/runtime-info");

const debug = require("debug")("eslint:cli");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Predicate function for whether or not to apply fixes in quiet mode.
 * If a message is a warning, do not apply a fix.
 * @param {LintResult} lintResult The lint result.
 * @returns {boolean} True if the lint message is an error (and thus should be
 * autofixed), false otherwise.
 */
function quietFixPredicate(lintResult) {
    return lintResult.severity === 2;
}

/**
 * Translates the CLI options into the options expected by the CLIEngine.
 * @param {Object} cliOptions The CLI options to translate.
 * @returns {CLIEngineOptions} The options object for the CLIEngine.
 * @private
 */
function translateOptions(cliOptions) {
    return {
        envs: cliOptions.env,
        extensions: cliOptions.ext,
        rules: cliOptions.rule,
        plugins: cliOptions.plugin,
        globals: cliOptions.global,
        ignore: cliOptions.ignore,
        ignorePath: cliOptions.ignorePath,
        ignorePattern: cliOptions.ignorePattern,
        configFile: cliOptions.config,
        rulePaths: cliOptions.rulesdir,
        useEslintrc: cliOptions.eslintrc,
        parser: cliOptions.parser,
        parserOptions: cliOptions.parserOptions,
        cache: cliOptions.cache,
        cacheFile: cliOptions.cacheFile,
        cacheLocation: cliOptions.cacheLocation,
        fix: (cliOptions.fix || cliOptions.fixDryRun) && (cliOptions.quiet ? quietFixPredicate : true),
        fixTypes: cliOptions.fixType,
        allowInlineConfig: cliOptions.inlineConfig,
        reportUnusedDisableDirectives: cliOptions.reportUnusedDisableDirectives,
        resolvePluginsRelativeTo: cliOptions.resolvePluginsRelativeTo,
        concurrency: cliOptions.concurrency === "auto" ? "auto" : parseInt(cliOptions.concurrency || "1", 10)
    };
}

/**
 * Outputs the results of the linting.
 * @param {CLIEngine} engine The CLIEngine to use.
 * @param {AsyncIterableIterator<LintResult>} results The results to print.
 * @param {string} format The name of the formatter to use or the path to the formatter.
 * @param {string} outputFile The path for the output file.
 * @returns {Promise<boolean>} True if the printing succeeds, false if not.
 * @private
 */
async function printResults(engine, results, format, outputFile) {
    let formatter;
    let output;

    try {
        formatter = await engine.getFormatter(format);
    } catch (e) {
        log.error(e.message);
        return false;
    }

    if (outputFile) {
        const filePath = path.resolve(process.cwd(), outputFile);

        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            log.error("Cannot write to output file path, it is a directory: %s", outputFile);
            return false;
        }

        try {
            await mkdirp(path.dirname(filePath));
            output = fs.createWriteStream(filePath);
        } catch (ex) {
            log.error("There was a problem writing the output file:\n%s", ex);
            return false;
        }
    } else {
        output = process.stdout;
    }

    try {
        for await (const textPiece of formatter(results)) {
            output.write(textPiece);
        }
        output.write("\n");
    } finally {
        output.end();
    }

    return true;

}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Encapsulates all CLI behavior for eslint. Makes it easier to test as well as
 * for other Node.js programs to effectively run the CLI.
 */
const cli = {

    /**
     * Executes the CLI based on an array of arguments that is passed in.
     * @param {string|Array|Object} args The arguments to process.
     * @param {string} [text] The text to lint (used for TTY).
     * @returns {Promise<number>} The exit code for the operation.
     */
    async execute(args, text) {
        if (Array.isArray(args)) {
            debug("CLI args: %o", args.slice(2));
        }

        let currentOptions;

        try {
            currentOptions = options.parse(args);
        } catch (error) {
            log.error(error.message);
            return 2;
        }

        const files = currentOptions._;
        const useStdin = typeof text === "string";

        if (
            currentOptions.concurrency !== void 0 &&
            currentOptions.concurrency !== "auto" &&
            !/^[1-9][0-9]*$/u.test(currentOptions.concurrency)
        ) {
            log.error("The --concurrency option must be used with a positive integer or \"auto\".");
            return 2;
        }

        if (currentOptions.version) {
            log.info(RuntimeInfo.version());
        } else if (currentOptions.envInfo) {
            try {
                log.info(RuntimeInfo.environment());
                return 0;
            } catch (err) {
                log.error(err.message);
                return 2;
            }
        } else if (currentOptions.printConfig) {
            if (files.length) {
                log.error("The --print-config option must be used with exactly one file name.");
                return 2;
            }
            if (useStdin) {
                log.error("The --print-config option is not available for piped-in code.");
                return 2;
            }

            const engine = new ESLint(translateOptions(currentOptions));
            const fileConfig = await engine.getConfigForFile(currentOptions.printConfig);

            log.info(JSON.stringify(fileConfig, null, "  "));
            return 0;
        } else if (currentOptions.help || (!files.length && !useStdin)) {
            log.info(options.generateHelp());
        } else {
            debug(`Running on ${useStdin ? "text" : "files"}`);

            if (currentOptions.fix && currentOptions.fixDryRun) {
                log.error("The --fix option and the --fix-dry-run option cannot be used together.");
                return 2;
            }

            if (useStdin && currentOptions.fix) {
                log.error("The --fix option is not available for piped-in code; use --fix-dry-run instead.");
                return 2;
            }

            if (currentOptions.fixType && !currentOptions.fix && !currentOptions.fixDryRun) {
                log.error("The --fix-type option requires either --fix or --fix-dry-run.");
                return 2;
            }

            const engine = new ESLint(translateOptions(currentOptions));
            let results = useStdin
                ? engine.executeOnText(text, currentOptions.stdinFilename, true)
                : engine.executeOnFiles(files);

            if (currentOptions.fix) {
                debug("Fix mode enabled - applying fixes");
                results = ESLint.outputFixes(results);
            }

            if (currentOptions.quiet) {
                debug("Quiet mode enabled - filtering out warnings");
                results = ESLint.getErrorResults(results);
            }

            const count = { errors: 0, warnings: 0 };

            results = (async function *(results0) {
                for await (const result of results0) {
                    count.errors += result.errorCount;
                    count.warnings += result.warningCount;
                    yield result;
                }
            }(results));

            if (await printResults(engine, results, currentOptions.format, currentOptions.outputFile)) {
                const tooManyWarnings = currentOptions.maxWarnings >= 0 && count.warnings > currentOptions.maxWarnings;

                if (!count.errors && tooManyWarnings) {
                    log.error("ESLint found too many warnings (maximum: %s).", currentOptions.maxWarnings);
                }

                return (count.errors || tooManyWarnings) ? 1 : 0;
            }

            return 2;
        }

        return 0;
    }
};

module.exports = cli;
