/**
 * @fileoverview Defining the hashing function in one place.
 * @author Michael Ficarra
 * @copyright 2016 Michael Ficarra. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var murmur = require("imurmurhash");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

/**
 * hash the given string
 * @param  {string} str the string to hash
 * @returns {string}    the hash
 */
function hash(str) {
    return murmur(str).result().toString(36);
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = hash;
