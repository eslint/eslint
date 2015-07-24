/**
 * @fileoverview Rule to flag non-quoted property names in object literals.
 * @author Mathias Bynens <http://mathiasbynens.be/>
 * @copyright 2014 Brandon Mills. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var espree = require("espree"),
    keywords = require("../util/keywords");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var MODE = context.options[0],
        KEYWORDS = context.options[1] && context.options[1].keywords,

        MESSAGE_UNNECESSARY = "Unnecessarily quoted property `{{property}}` found.",
        MESSAGE_UNQUOTED = "Unquoted property `{{property}}` found.",
        MESSAGE_RESERVED = "Unquoted reserved word `{{property}}` used as key.";


    /**
     * Checks whether a certain string constitutes an ES3 token
     * @param   {string} tokenStr - The string to be checked.
     * @returns {boolean} `true` if it is an ES3 token.
     */
    function isKeyword(tokenStr) {
        return keywords.indexOf(tokenStr) >= 0;
    }

    /**
     * Ensures that a property's key is quoted only when necessary
     * @param   {ASTNode} node Property AST node
     * @returns {void}
     */
    function asNeeded(node) {
        var key = node.key,
            isKeywordToken,
            tokens;

        if (key.type === "Literal" && typeof key.value === "string") {
            try {
                tokens = espree.tokenize(key.value);
            } catch (e) {
                return;
            }

            if (tokens.length !== 1) {
                return;
            }

            isKeywordToken = isKeyword(tokens[0].value);

            if (isKeywordToken && KEYWORDS) {
                return;
            }

            if (tokens[0].type === "Identifier" || isKeywordToken ||
                (tokens[0].type === "Numeric" && "" + +tokens[0].value === tokens[0].value)) {
                context.report(node, MESSAGE_UNNECESSARY, {property: key.value});
            }
        } else if (KEYWORDS && key.type === "Identifier" && isKeyword(key.name)) {
            context.report(node, MESSAGE_RESERVED, {property: key.name});
        }
    }

    /**
     * Ensures that a property's key is quoted
     * @param   {ASTNode} node Property AST node
     * @returns {void}
     */
    function always(node) {
        var key = node.key;

        if (!node.method && !(key.type === "Literal" && typeof key.value === "string")) {
            context.report(node, MESSAGE_UNQUOTED, {
                property: key.name || key.value
            });
        }
    }

    return {
        "Property": MODE === "as-needed" ? asNeeded : always
    };

};

module.exports.schema = {
    "anyOf": [
        {
            "type": "array",
            "items": [
                {
                    "enum": [0, 1, 2]
                },
                {
                    "enum": ["always"]
                }
            ],
            "minItems": 1,
            "maxItems": 2
        },
        {
            "type": "array",
            "items": [
                {
                    "enum": [0, 1, 2]
                },
                {
                    "enum": ["as-needed"]
                },
                {
                    "type": "object",
                    "properties": {
                        "keywords": {
                            "type": "boolean"
                        }
                    },
                    "additionalProperties": false
                }
            ],
            "minItems": 1,
            "maxItems": 3
        }
    ]
};
