/**
 * @fileoverview Rule to flag non-quoted property names in object literals.
 * @author Mathias Bynens <http://mathiasbynens.be/>
 * @copyright 2014 Brandon Mills. All rights reserved.
 * @copyright 2015 Tomasz Olędzki. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var espree = require("espree");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var MODE = context.options[0];

    /**
     * Checks if an espree-tokenized key has redundant quotes (i.e. whether quotes are unnecessary)
     * @param   {espreeTokens} tokens The espree-tokenized node key
     * @returns {boolean} Whether or not a key has redundant quotes.
     * @private
     */
    function areQuotesRedundant(tokens) {
        return tokens.length === 1 &&
            (["Identifier", "Null", "Boolean"].indexOf(tokens[0].type) >= 0 ||
            (tokens[0].type === "Numeric" && "" + +tokens[0].value === tokens[0].value));
    }

    /**
     * Ensures that a property's key is quoted only when necessary
     * @param   {ASTNode} node Property AST node
     * @returns {void}
     */
    function checkUnnecessaryQuotes(node) {
        var key = node.key,
            tokens;

        if (key.type === "Literal" && typeof key.value === "string") {
            try {
                tokens = espree.tokenize(key.value);
            } catch (e) {
                return;
            }

            if (areQuotesRedundant(tokens)) {
                context.report(node, "Unnecessarily quoted property `{{value}}` found.", key);
            }
        }
    }

    /**
     * Ensures that a property's key is quoted
     * @param   {ASTNode} node Property AST node
     * @returns {void}
     */
    function checkOmittedQuotes(node) {
        var key = node.key;

        if (!node.method && !(key.type === "Literal" && typeof key.value === "string")) {
            context.report(node, "Unquoted property `{{key}}` found.", {
                key: key.name || key.value
            });
        }
    }

    /**
     * Ensures that an object's keys are consistenly quoted, optionally checks for redundancy of quotes
     * @param   {ASTNode} node Property AST node
     * @param   {boolean} checkQuotesRedundancy Whether to check quotes' redundancy
     * @returns {void}
     */
    function checkConsistency(node, checkQuotesRedundancy) {
        var quotes = false,
            lackOfQuotes = false,
            necessaryQuotes = false;

        node.properties.forEach(function(property) {
            var key = property.key,
                tokens;

            if (key.type === "Literal" && typeof key.value === "string") {
                quotes = true;
                if (checkQuotesRedundancy) {
                    try {
                        tokens = espree.tokenize(key.value);
                    } catch (e) {
                        necessaryQuotes = true;
                        return;
                    }
                    necessaryQuotes = necessaryQuotes || !areQuotesRedundant(tokens);
                }
            } else {
                lackOfQuotes = true;
            }

            if (quotes && lackOfQuotes) {
                context.report(node, "Inconsistently quoted property `{{key}}` found.", {
                    key: key.name || key.value
                });
            }
        });

        if (checkQuotesRedundancy && quotes && !necessaryQuotes) {
            context.report(node, "Properties shouldn't be quoted as all quotes are redundant.");
        }
    }

    return {
        "Property": function(node) {
            if (MODE === "always" || !MODE) {
                checkOmittedQuotes(node);
            }
            if (MODE === "as-needed") {
                checkUnnecessaryQuotes(node);
            }
        },
        "ObjectExpression": function(node) {
            if (MODE === "consistent") {
                checkConsistency(node, false);
            }
            if (MODE === "consistent-as-needed") {
                checkConsistency(node, true);
            }
        }
    };

};

module.exports.schema = [
    {
        "enum": ["always", "as-needed", "consistent", "consistent-as-needed"]
    }
];
