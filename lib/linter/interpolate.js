/**
 * @fileoverview Interpolate keys from an object into a string with {{ }} markers.
 * @author Jed Fox
 */

"use strict";

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    getPlaceholderMatcher() {
        return /\{\{([^{}]+?)\}\}/gu;
    },
    interpolate(text, data) {
        if (!data) {
            return text;
        }

        const matcher = module.exports.getPlaceholderMatcher();

        // Substitution content for any {{ }} markers.
        return text.replace(matcher, (fullMatch, termWithWhitespace) => {
            const term = termWithWhitespace.trim();

            if (term in data) {
                return data[term];
            }

            // Preserve old behavior: If parameter name not provided, don't replace it.
            return fullMatch;
        });
    }
};
