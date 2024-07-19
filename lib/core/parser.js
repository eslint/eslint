/**
 * @fileoverview ESLint Parser
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------

/** @typedef {import("./session.js").Session} Session */
/** @typedef {import("../linter/vfile.js").VFile} VFile */

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * The parser for ESLint.
 */
class Parser {

    /**
     * The current working directory.
     * @type {Session}
     */
    #session;

    /**
     * Creates a new instance of Session.
     * @param {Object} options The options for the session.
     * @param {Session} options.session The session to use.
     */
    constructor({ session } = {}) {
        this.#session = session;
    }

    /**
     * Parses the given file synchronously.
     * @param {VFile} file The file to parse.
     * @param {Object} config The configuration to use.
     * @returns {Object} An object with the parsed source code or errors.
     * @throws {Error} If the parser returns a promise.
     */
    parseSync(file, config) {

        const { language, languageOptions } = config;
        const { timing } = this.#session;

        const start = timing.startTime();
        const result = language.parse(file, { languageOptions });
        const elapsed = timing.endTime(start);

        if (result.then) {
            throw new Error("Unsupported: Language parser returned a promise.");
        }

        if (result.ok) {
            return {
                ok: true,
                sourceCode: language.createSourceCode(file, result, { languageOptions }),
                time: elapsed
            };
        }

        // if we made it to here there was an error
        return {
            ok: false,
            errors: result.errors.map(error => ({
                ruleId: null,
                nodeType: null,
                fatal: true,
                severity: 2,
                message: `Parsing error: ${error.message}`,
                line: error.line,
                column: error.column
            }))
        };


    }

    /**
     * Parses the given file asynchronously.
     * @param {VFile} file The file to parse.
     * @param {Object} config The configuration to use.
     * @returns {Promise<Object>} An object with the parsed source code or errors.
     * @throws {Error} If the parser returns a promise.
     */
    async parse(file, config) {

        const { language, languageOptions } = config;
        const { timing } = this.#session;
        const start = timing.startTime();
        let result = language.parse(file, { languageOptions });

        if (result.then) {
            result = await result;
        }

        const elapsed = timing.endTime(start);

        if (result.ok) {
            return {
                ok: true,
                sourceCode: language.createSourceCode(file, result, { languageOptions }),
                time: elapsed
            };
        }

        // if we made it to here there was an error
        return {
            ok: false,
            errors: result.errors.map(error => ({
                ruleId: null,
                nodeType: null,
                fatal: true,
                severity: 2,
                message: `Parsing error: ${error.message}`,
                line: error.line,
                column: error.column
            }))
        };


    }

}

module.exports = { Parser };
