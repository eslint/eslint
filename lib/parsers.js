/**
 * @fileoverview Defines a storage for parsers.
 * @author Ives van Hoorne
 */

"use strict";

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

class Parsers {
    constructor() {
        this._parsers = Object.create(null);
    }

    /**
     * Registers a custom parser in storage
     * @param {string} parserId Parser id.
     * @param {Function} parserModule Parser handler.
     * @returns {void}
     */
    define(parserId, parserModule) {
        this._parsers[parserId] = parserModule;
    }

    /**
     * Access parser handler by id.
     * @param {string} parserId Parser id.
     * @returns {void}
     */
    get(parserId) {
        const parser = this._parsers[parserId];

        if (!parser) {
            return require(parserId);
        }

        return parser;
    }
}

module.exports = Parsers;
