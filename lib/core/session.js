/**
 * @fileoverview Session management
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const stats = require("../shared/stats");

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------

/** @typedef {"error"|"warn"|"info"|"debug"} LogLevel */
/**
 * @typedef {Object} Timing
 * @property {Function} startTime Start time measurement
 * @property {Function} endTime End time measurement
 */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const stubTiming = {
    startTime: () => [0, 0],
    endTime: () => void 0
};

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * A session represents a single run of ESLint.
 */
class Session {

    /**
     * The current working directory.
     * @type {string}
     */
    cwd;

    /**
     * Indicates if the session is persistent.
     * @type {boolean}
     */
    persistent;

    /**
     * The feature flags to enable.
     * @type {Set<string>}
     */
    #flags;

    /**
     * Timing utility for the session.
     * @type {Timing}
     */
    timing;

    /**
     * Creates a new instance of Session.
     * @param {Object} options The options for the session.
     * @param {string} options.cwd The current working directory.
     * @param {boolean} options.persistent Indicates if the session is persistent.
     * @param {string[]} options.flags The feature flags to enable.
     * @param {boolean} options.statsEnabled Indicates if stats collection is enabled.
     */
    constructor({ cwd = "", persistent, flags = [], statsEnabled = false }) {

        if (typeof persistent !== "boolean") {
            throw new Error("persistent must be a boolean.");
        }

        this.cwd = cwd;
        this.persistent = persistent;
        this.#flags = new Set(flags);

        this.timing = statsEnabled
            ? stats
            : stubTiming;
    }

    /**
     * Determines if the given flag is enabled for the session.
     * @param {string} flag The flag to check
     * @returns {boolean} `true` if the flag is enabled, `false` if not.
     */
    hasFlag(flag) {
        return this.#flags.has(flag);
    }

}

module.exports = { Session };
