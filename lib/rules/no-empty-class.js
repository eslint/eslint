/**
 * @fileoverview Rule to flag the use of empty character classes in regular expressions
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "Literal": function(node) {
            var tokens = context.getTokens(node);

            tokens.forEach(function (token) {
                if (token.type === "RegularExpression") {
                    var open = false,
                        tokenValue = token.value,
                        at,
                        character;

                    for (at = 0; at < tokenValue.length; at++) {
                        character = tokenValue.charAt(at);
                        switch (character) {
                        // Character is escaped, skip it.
                        case "\\":
                            at += 1;
                            break;
                        case "[":
                            // Check for a matching closing bracket indicating
                            // an empty class.
                            if (tokenValue.charAt(at + 1) === "]" && !open) {
                                context.report(node, "Empty class.");
                            }

                            // We are now inside a character class.
                            open = true;
                            break;
                        // We are no longer in a character class, continue
                        // checking for empty class.
                        case "]":
                            open = false;
                            break;
                        }
                    }
                }
            });
        }

    };

};
