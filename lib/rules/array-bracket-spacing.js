/**
 * @fileoverview Disallows or enforces spaces inside of array brackets.
 * @author Jamund Ferguson
 * @copyright 2015 Jamund Ferguson. All rights reserved.
 * @copyright 2014 Brandyn Bennett. All rights reserved.
 * @copyright 2014 Michael Ficarra. No rights reserved.
 * @copyright 2014 Vignesh Anand. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var spaced = context.options.always;
    var options = {
        spaced: spaced,
        singleElementException: context.options.singleValue !== spaced,
        objectsInArraysException: context.options.objectsInArrays !== spaced,
        arraysInArraysException: context.options.arraysInArrays !== spaced
    };

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Determines whether two adjacent tokens are have whitespace between them.
     * @param {Object} left - The left token object.
     * @param {Object} right - The right token object.
     * @returns {boolean} Whether or not there is space between the tokens.
     */
    function isSpaced(left, right) {
        return left.range[1] < right.range[0];
    }

    /**
     * Determines whether two adjacent tokens are on the same line.
     * @param {Object} left - The left token object.
     * @param {Object} right - The right token object.
     * @returns {boolean} Whether or not the tokens are on the same line.
     */
    function isSameLine(left, right) {
        return left.loc.start.line === right.loc.start.line;
    }

    /**
    * Reports a given error message
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {string} message - Message to be reported.
    * @param {Token} token - The token to use for the report.
    * @returns {void}
    */
    function reportError(node, message, token) {
        context.report(node, token.loc.start, message, { token: token.value });
    }

    /**
     * Validates the spacing around array brackets
     * @param {ASTNode} node - The node we're checking for spacing
     * @returns {void}
     */
    function validateArraySpacing(node) {
        if (node.elements.length === 0) {
            return;
        }

        var first = context.getFirstToken(node),
            second = context.getFirstToken(node, 1),
            penultimate = context.getLastToken(node, 1),
            last = context.getLastToken(node);

        var openingBracketMustBeSpaced =
            options.objectsInArraysException && second.value === "{" ||
            options.arraysInArraysException && second.value === "[" ||
            options.singleElementException && node.elements.length === 1
                ? !options.spaced : options.spaced;

        var closingBracketMustBeSpaced =
            options.objectsInArraysException && penultimate.value === "}" ||
            options.arraysInArraysException && penultimate.value === "]" ||
            options.singleElementException && node.elements.length === 1
                ? !options.spaced : options.spaced;

        if (isSameLine(first, second)) {
            if (openingBracketMustBeSpaced && !isSpaced(first, second)) {
                reportError(node, context.errors.spaceBefore, first);
            }
            if (!openingBracketMustBeSpaced && isSpaced(first, second)) {
                reportError(node, context.errors.extraSpaceBefore, first);
            }
        }

        if (isSameLine(penultimate, last)) {
            if (closingBracketMustBeSpaced && !isSpaced(penultimate, last)) {
                reportError(node, context.errors.spaceAfter, last);
            }
            if (!closingBracketMustBeSpaced && isSpaced(penultimate, last)) {
                reportError(node, context.errors.extraSpaceAfter, last);
            }
        }
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        ArrayPattern: validateArraySpacing,
        ArrayExpression: validateArraySpacing
    };

};

module.exports.schema = [
    {
        "enum": ["always", "never"],
        "default": "never"
    },
    {
        "type": "object",
        "properties": {
            "singleValue": {
                "type": "boolean",
                "default": false
            },
            "objectsInArrays": {
                "type": "boolean",
                "default": false
            },
            "arraysInArrays": {
                "type": "boolean",
                "default": false
            }
        },
        "additionalProperties": false
    }
];

module.exports.meta = {
    errors: {
        extraSpaceAfter: "There should be no space after '{{token}}'",
        extraSpaceBefore: "There should be no space before '{{token}}'",
        spaceAfter: "A space is required after '{{token}}'",
        spaceBefore: "A space is required before '{{token}}'"
    },
    description: "enforce spacing inside array brackets",
    ruleType: "Stylistic Issues",
    recommended: false
};
