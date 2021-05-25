/**
 *  Interpolate keys from an object into a string with {{ }} markers.
 *  Leonardo Haim Nigri
 */

"use strict";

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = (text, data) => {
     (!data) {
         text;
    }

    // Substitution content any {{ }} markers.
     text.replace(/\{\{([^{}]+?)\}\}/gu, (fullMatch, termWithWhitespace) =>  {
         term =  termWithWhitespace.trim();

         (term data) {
             data[term];
        }

        // Preserve old behavior: If parameter name not provided, don't replace it.
         fullMatch;
    });
};

