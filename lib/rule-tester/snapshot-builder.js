"use strict";

class SnapshotBuilder {

    /**
     * Creates a new instance of SnapshotBuilder.
     * @param {string} originCode The code of the testing case
     * @constructor
     */
    constructor(originCode) {

        /**
         * Result in array.
         * @type {string[]}
         */
        this.originCode = originCode.split("\n");

        /**
         * How many lines have been added to the codes
         * @type {number}
         */
        this.lineAdded = 0;
    }

    /**
     * Annotate the linting error on the code
     * @param {Object} position The position of the error
     * @param {string} message the error message
     * @returns {void}
     */
    annotateError(position, message) {
        const startLine = position.line + this.lineAdded;
        const { column: startColumn, endColumn } = position;
        const waveString = SnapshotBuilder.getWaveString(startColumn, endColumn);
        const newLine = `${waveString}    [${message}]`;

        this.originCode.splice(startLine, 0, newLine);
        this.lineAdded++;
    }

    /**
     * Join the codes with line-break
     * @returns {string} the code with line-break
     */
    toString() {
        return this.originCode.join("\n");
    }

    /**
     * Generate annotation with wave and space
     * @param {number} column number of the starting column
     * @param {number} columnEnd number of the ending column
     * @returns {string} space and waves
     */
    static getWaveString(column, columnEnd) {
        const leadingSpaces = " ".repeat(column - 1);
        const waves = "~".repeat(columnEnd - column);

        return leadingSpaces + waves;
    }
}

module.exports = SnapshotBuilder;
