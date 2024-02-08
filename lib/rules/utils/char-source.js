/**
 * @fileoverview Utility functions to locate the source text of each code unit in the value of a string literal or template token.
 * @author Francesco Trotta
 */

"use strict";

/**
 * Represents a code unit produced by the evaluation of a JavaScript common token like a string
 * literal or template token.
 */
class CodeUnit {
    constructor(start, source) {
        this.start = start;
        this.source = source;
    }

    get end() {
        return this.start + this.length;
    }

    get length() {
        return this.source.length;
    }
}

/**
 * An object used to keep track of the position in a source text where the next characters will be read.
 */
class SourceReader {
    constructor(source) {
        this.source = source;
        this.pos = 0;
    }
}

const SIMPLE_ESCAPE_SEQUENCES =
{ __proto__: null, b: "\b", f: "\f", n: "\n", r: "\r", t: "\t", v: "\v" };

/**
 * Reads a hex escape sequence.
 * @param {SourceReader} reader The reader should be positioned on the first hexadecimal digit.
 * @param {number} length The number of hexadecimal digits.
 * @returns {string} A code unit.
 */
function readHexSequence(reader, length) {
    const { source, pos } = reader;
    const str = source.slice(pos, pos + length);
    const charCode = parseInt(str, 16);

    reader.pos = pos + length;
    return String.fromCharCode(charCode);
}

/**
 * Reads a Unicode escape sequence.
 * @param {SourceReader} reader The reader should be positioned after the "u".
 * @returns {string} A code unit.
 */
function readUnicodeSequence(reader) {
    const { source, pos } = reader;
    const regExp = /\{(?<hexDigits>[\dA-Fa-f]+)\}/uy;

    regExp.lastIndex = pos;
    const match = regExp.exec(source);

    if (match) {
        const codePoint = parseInt(match.groups.hexDigits, 16);

        reader.pos = regExp.lastIndex;
        return String.fromCodePoint(codePoint);
    }
    return readHexSequence(reader, 4);
}

/**
 * Reads an octal escape sequence.
 * @param {SourceReader} reader The reader should be positioned after the first octal digit.
 * @param {number} maxLength The maximum number of octal digits.
 * @returns {string} A code unit.
 */
function readOctalSequence(reader, maxLength) {
    const posAfterBackslash = reader.pos - 1;
    const [octalStr] = reader.source.slice(posAfterBackslash, posAfterBackslash + maxLength).match(/^[0-7]+/u);

    reader.pos = posAfterBackslash + octalStr.length;
    const octal = parseInt(octalStr, 8);

    return String.fromCharCode(octal);
}

/**
 * Reads an escape sequence or line continuation.
 * @param {SourceReader} reader The reader should be positioned after the backslash.
 * @returns {string} A string of zero, one or two code units.
 */
function readEscapeSequenceOrLineContinuation(reader) {
    const { source, pos } = reader;
    const char = source[pos];

    reader.pos = pos + 1;
    const unitChar = SIMPLE_ESCAPE_SEQUENCES[char];

    if (unitChar) {
        return unitChar;
    }
    switch (char) {
        case "x":
            return readHexSequence(reader, 2);
        case "u":
            return readUnicodeSequence(reader);
        case "\r":
            if (source[pos + 1] === "\n") {
                reader.pos = pos + 2;
            }

            // fallthrough
        case "\n":
        case "\u2028":
        case "\u2029":
            return "";
        case "0":
        case "1":
        case "2":
        case "3":
            return readOctalSequence(reader, 3);
        case "4":
        case "5":
        case "6":
        case "7":
            return readOctalSequence(reader, 2);
        default:
            return char;
    }
}

/**
 * Reads an escape sequence or line continuation and generates the respective `CodeUnit` elements.
 * @param {SourceReader} reader The reader should be positioned on the backslash.
 * @returns {Generator<CodeUnit>} Zero, one or two `CodeUnit` elements.
 */
function *mapEscapeSequenceOrLineContinuation(reader) {
    const start = reader.pos++;
    const str = readEscapeSequenceOrLineContinuation(reader);
    const end = reader.pos;
    const source = reader.source.slice(start, end);

    switch (str.length) {
        case 0:
            break;
        case 1:
            yield new CodeUnit(start, source);
            break;
        default:
            yield new CodeUnit(start, source);
            yield new CodeUnit(start, source);
            break;
    }
}

/**
 * Parses a string literal.
 * @param {string} source The string literal to parse, including the delimiting quotes.
 * @returns {CodeUnit[]} A list of code units produced by the string literal.
 */
function parseStringLiteral(source) {
    const reader = new SourceReader(source);
    const quote = source[0];

    reader.pos = 1;
    const codeUnits = [];

    for (;;) {
        const { pos } = reader;
        const char = source[pos];

        if (char === quote) {
            break;
        }
        if (char === "\\") {
            codeUnits.push(...mapEscapeSequenceOrLineContinuation(reader));
        } else {
            reader.pos = pos + 1;
            codeUnits.push(new CodeUnit(pos, char));
        }
    }
    return codeUnits;
}

/**
 * Parses a template token.
 * @param {string} source The template token to parse, including the delimiting sequences `` ` ``, `${` and `}`.
 * @returns {CodeUnit[]} A list of code units produced by the template token.
 */
function parseTemplateToken(source) {
    const reader = new SourceReader(source);

    reader.pos = 1;
    const codeUnits = [];

    for (;;) {
        const { pos } = reader;
        const char = source[pos];

        if (char === "`" || char === "$" && source[pos + 1] === "{") {
            break;
        }
        if (char === "\\") {
            codeUnits.push(...mapEscapeSequenceOrLineContinuation(reader));
        } else {
            let unitSource;

            if (char === "\r" && source[pos + 1] === "\n") {
                unitSource = "\r\n";
                reader.pos = pos + 2;
            } else {
                unitSource = char;
                reader.pos = pos + 1;
            }
            codeUnits.push(new CodeUnit(pos, unitSource));
        }
    }
    return codeUnits;
}

module.exports = { parseStringLiteral, parseTemplateToken };
