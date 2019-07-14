"use strict";

class SnapshotBuilder {
    constructor(originCode) {
        this.originCode = originCode.split("\n");
        this.lineAdded = 0;
    }

    annotateError(position, message) {
        const startLine = position.line + this.lineAdded;
        const { column: startColumn, endColumn } = position;
        const waveString = SnapshotBuilder.getWaveString(startColumn, endColumn);
        const newLine = `${waveString}    [${message}]`;

        this.originCode.splice(startLine, 0, newLine);
        this.lineAdded++;
    }

    toString() {
        return this.originCode.join("\n");
    }

    static getWaveString(column, columnEnd) {
        const leadingSpaces = " ".repeat(column - 1);
        const waves = "~".repeat(columnEnd - column);

        return leadingSpaces + waves;
    }
}

module.exports = SnapshotBuilder;
