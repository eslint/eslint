/**
 * @fileoverview Define a custom parser to ignore recoverable syntax errors.
 * @author Toru Nagashima <https://github.com/mysticatea>
 *
 * no-redeclare rule uses this parser to check redeclarations.
 */
"use strict";

const acorn = require("acorn");
const espree = require("espree/lib/espree");

/**
 * Define the parser which ignores recoverable errors.
 * @returns {(parser:acorn.Parser) => acorn.Parser} The function that defines loose parser.
 */
function loose() {
    return Parser => class LooseParser extends Parser {
        raiseRecoverable() { // eslint-disable-line class-methods-use-this
            // ignore
        }
    };
}

const LooseEspree = acorn.Parser.extend(espree(), loose());

module.exports = {
    parse(code, options) {
        return new LooseEspree(options, code).parse();
    }
};
