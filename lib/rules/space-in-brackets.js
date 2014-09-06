/**
 * @fileoverview Disallows or enforces spaces inside of brackets.
 * @author Ian Christian Myers
 * @copyright 2014 Brandyn Bennett. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var shouldSpace       = context.options[0] || "never",
        ALWAYS            = "always",
        ARRAY_EXPRESSION  = "ArrayExpression",
        MEMBER_EXPRESSION = "MemberExpression",
        NEVER             = "never",
        OBJECT_EXPRESSION = "ObjectExpression";

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

        // See if the left token's ending location is less than the right
        // token's starting location
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
    * Reports that there shouldn't be a space after the first token
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function reportNoBeginningSpace(node, tokens) {
        context.report(node, tokens[0].loc.start,
                    "There should be no space after '" + tokens[0].value + "'");
    }

    /**
    * Reports that there shouldn't be a space before the last token
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function reportNoEndingSpace(node, tokens) {
        context.report(node, tokens[tokens.length - 1].loc.start,
                    "There should be no space before '" + tokens[tokens.length - 1].value + "'");
    }

    /**
    * Reports that there should be a space after the first token
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function reportRequiredBeginningSpace(node, tokens) {
        context.report(node, tokens[0].loc.start,
                    "A space is required after '" + tokens[0].value + "'");
    }

    /**
    * Reports that there should be a space before the last token
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function reportRequiredEndingSpace(node, tokens) {
        context.report(node, tokens[tokens.length - 1].loc.start,
                    "A space is required before '" + tokens[tokens.length - 1].value + "'");
    }

    /**
    * Checks to make sure there is space at the beginning.
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function checkBeginningSpace(node, tokens) {

        // Make sure there is a space at the beginning
        if (!isSpaced(tokens[0], tokens[1])) {

            // Make an error message
            reportRequiredBeginningSpace(node, tokens);
        }
    }


    /**
    * Checks to make sure there is space at the end.
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function checkEndingSpace(node, tokens) {

        // Make sure there is a space at the end
        if (!isSpaced(tokens[tokens.length - 2], tokens[tokens.length - 1])) {

            // Make an error message
            reportRequiredEndingSpace(node, tokens);
        }
    }

    /**
    * Checks to make sure there is no spacing and reports if there is
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function checkSpacing(node, tokens) {

        // Make sure there is space at the beginning
        checkBeginningSpace(node, tokens);

        // Make sure there is space at the end
        checkEndingSpace(node, tokens);
    }

    /**
    * Checks to make sure there is no
    * spacing at the beginning.
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function checkNoBeginningSpace(node, tokens) {

        // Check if the there is a space after the first bracket
        if (isSpaced(tokens[0], tokens[1])) {

            // Make an error message
            reportNoBeginningSpace(node, tokens);
        }
    }

    /**
    * Checks to make sure there is no
    * spacing at the beginning.
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function checkNoEndingSpace(node, tokens) {

        // check if there is a space before the last bracket
        if (isSpaced(tokens[tokens.length - 2], tokens[tokens.length - 1])) {

            // Make an error message
            reportNoEndingSpace(node, tokens);
        }
    }

    /**
    * Checks to make sure there is spacing and reports if there isn't.
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function checkNoSpacing(node, tokens) {

        // make sure there is no beginning space
        checkNoBeginningSpace(node, tokens);

        // make sure there is no ending space;
        checkNoEndingSpace(node, tokens);
    }

    /**
    * There should be space around everything
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function spaceEverything(node, tokens) {

        // Set a flag to see if arrays and objects have any characters in them.  If they don't
        // then it is ok for them to empty and spaceless
        var hasElements = (node.type === OBJECT_EXPRESSION && node.properties.length > 0) ||
            (node.type === ARRAY_EXPRESSION && node.elements.length > 0);

        // If there are elements in the array/object or the node
        // is a member expression then we need to make sure the
        // spacing exists
        if ( hasElements  || node.type === MEMBER_EXPRESSION ) {
            checkSpacing(node, tokens);
        }
    }

    /**
    * Determines if the first thing in the array is a nested
    * expression of the given type
    * @param {ASTNode} node - The node to check.
    * @param {string[]} expressionTypes - The expression types to check for nesting
    * @returns {boolean} Whether or not the last element is a nested
    * expression of the given type
    */
    function isFirstNested(node, expressionTypes) {
        var isNested = false;

        if (node.type === ARRAY_EXPRESSION && node.elements.length > 0) {

            // loop through each expression type and see if the
            // first element in the node matches it
            expressionTypes.forEach(function(value) {
                if (node.elements[0].type === value) {
                    isNested = true;
                }
            });
        }

        return isNested;
    }

    /**
    * Determines if the last thing in the array is a nested
    * expression of the given type
    * @param {ASTNode} node - The node to check.
    * @param {string[]} expressionTypes - The expression types to check for nesting
    * @returns {boolean} Whether or not the last element is a nested
    * expression of the given type
    */
    function isLastNested(node, expressionTypes) {
        var isNested = false,
            length;

        if (node.type === ARRAY_EXPRESSION && node.elements.length > 0) {
            length = node.elements.length;

            // loop through each expression type and see if the
            // last element in the node matches it
            expressionTypes.forEach(function(value) {
                if (node.elements[length - 1].type === value) {
                    isNested = true;
                }
            });
        }

        return isNested;
    }

    /**
    * Determines if an array or member expression has a single value in it
    * @param {ASTNode} node - The node to check for a single literal.
    * @returns {boolean} Whether not the array has a single value in it
    */
    function isSingleValue(node) {
        var onlyOne = false;

        // See if it's an array or a member expression
        // An array will have elements, while a member
        // expression will have a property
        if (node.type === ARRAY_EXPRESSION || node.type === MEMBER_EXPRESSION ) {

            // If it's an array expression check the element length
            if ( node.type === ARRAY_EXPRESSION ) {
                if (node.elements.length === 1) {
                    onlyOne = true;
                }
            } else {

                // Because a MemberExpression only has one
                // property we can assume there is only
                // one thing we need to validate
                onlyOne = true;
            }
        }

        return onlyOne;
    }

    /**
    * See if the node has a nested expression of the provided type
    * as either its first or last element
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @param {string[]} expressionTypes - The expression types to check for nesting
    * @param {Object} isExempt - The flag that maintains state of whether or not there is an exemption
    * @returns {void}
    */
    function nestedException(node, tokens, expressionTypes, isExempt) {
        var firstMatches = isFirstNested(node, expressionTypes),
            lastMatches  = isLastNested(node, expressionTypes);

        // If the first or last is an object we know
        // that the spacing for the exemption will be handled here
        // so we can set isExempt to true
        if (firstMatches || lastMatches) {
            isExempt.state = true;
        }

        // If the first and last matches
        if (firstMatches && lastMatches) {

            // If both the first and last match
            // there shouldn't be spacing at either
            // end
            checkNoSpacing(node, tokens);

            // There's nothing else to check so
            // we can ignore the rest
            return;

        } else if (firstMatches && !lastMatches) {

            // If the first thing matches then there should
            // be no beginning space
            checkNoBeginningSpace(node, tokens);

            // If the last thing doesn't match then
            // there should be ending space
            checkEndingSpace(node, tokens);

            // No point checking the last thing
            return;

        } else if (!firstMatches && lastMatches) {

            // If the first thing doesn't match then
            // there should be space at the beginning
            checkBeginningSpace(node, tokens);

            // If the last thing matches, then there
            // should be no space at the end
            checkNoEndingSpace(node, tokens);
        }
    }

    /**
    * Performs the exemption for single values
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @param {Object} isExempt - The flag that maintains state of whether or not there is an exemption.
    * @returns {void}
    */
    function singleValueException(node, tokens, isExempt) {

        // Check if the node is a single literal of the
        // given type
        if (isSingleValue(node, tokens)) {

            // Make sure there is no spacing
            isExempt.state = true;
            checkNoSpacing( node, tokens );
        }
    }

    /**
    * Runs a node through some tests to see if it deserves an exemption
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {boolean} Whether or not the node is exempt
    */
    function isExempt(node, tokens) {

        // Need to run the node through each
        // applicable exemption so that we
        // only check all spacing if the node
        // doesn't meet any of the exemptions
        var exceptions = context.options[1],

            // This object will hold the state of whether or not
            // a node is exempt from always being spaced.  The
            // object will be passed into exemption tests and changed
            // to true if the node matches the exemption
            exempt = { state: false },
            expressionTypes = [];    // Make an array store the acceptable expression types

        // If there are no exceptions or the exceptions
        // object is empty, then we will space everything
        if (!exceptions || exceptions.length === 0) {

            // Return early. There's no point in checking the rest
            // of the exemptions
            return exempt.state;
        }

        // if the 'singleValue' exception is passed in
        if (exceptions.singleValue === true) {

            // We need to make sure that nodes with single
            // values inside of them don't have spacing
            singleValueException(node, tokens, exempt);
        }

        // If the 'objectsInArrays' or 'arraysInArrays' exception is passed in
        if (exceptions.objectsInArrays === true || exceptions.arraysInArrays === true ) {

            // We'll add the respective expression type to
            // the array so that the exception test can
            // see if either type is nested
            if ( exceptions.objectsInArrays === true ) {
                expressionTypes.push(OBJECT_EXPRESSION);
            }

            if ( exceptions.arraysInArrays === true ) {
                expressionTypes.push(ARRAY_EXPRESSION);
            }

            // See if the node is an array with the chosen
            // expressionType in either the first or last position
            nestedException(node, tokens, expressionTypes, exempt);
        }

        return exempt.state;
    }

    /**
     * Checks whether the given set of tokens are spaced according to the user
     * given preferences. Reports the node, if the tokens are improperly spaced.
     * @param {ASTNode} node - The node to report in the event of an error.
     * @param {Object[]} tokens - The tokens to be checked for spacing.
     * @returns {void}
     */
    function verifySpacing(node, tokens) {

        // If the setting is "always"
        if (shouldSpace === ALWAYS) {

            // If there are no exceptions or the exceptions
            // object is empty, then we will space everything
            if (!isExempt(node, tokens)) {

                // This means we should space everything, all the time,
                // no matter what
                spaceEverything(node, tokens);
            }

            // We can exit the function, because there is nothing
            // more to do
            return;

        } else if (shouldSpace === NEVER) {

            // If Array or Object literals don't have values that are on the
            // same line as the brackets then it is ok for them to have space
            // so we can just exit the function
            // This is an exception for Array and Object literals that do not
            // have any values on the same lines as brackets.
            if ((node.type === ARRAY_EXPRESSION || node.type === OBJECT_EXPRESSION) &&
                    !isSameLine(tokens[0], tokens[1]) &&
                    !isSameLine(tokens[tokens.length - 2], tokens[tokens.length - 1])) {
                return;
            }

            // Make sure there is no spacing
            checkNoSpacing(node, tokens);
        }
    }

    /**
     * Checks whether the brackets of an Object or Array literal are spaced
     * according to the given preferences.
     * @param {ASTNode} node - The ArrayExpression or ObjectExpression node.
     * @returns {void}
     */
    function checkLiteral(node) {
        var tokens = context.getTokens(node);
        verifySpacing(node, tokens);
    }

    /**
     * Checks whether the brackets of an Object's member are spaced according to
     * the given preferences, if the member is being accessed with bracket
     * notation
     * @param {ASTNode} node - The MemberExpression node.
     * @returns {void}
     */
    function checkMember(node) {
        var tokens;

        // Ensure the property is not enclosed in brackets.
        if (node.computed) {
            tokens = context.getTokens(node.property, 1, 1);
            verifySpacing(node, tokens);
        }
    }


    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        "MemberExpression": checkMember,
        "ArrayExpression": checkLiteral,
        "ObjectExpression": checkLiteral
    };

};
