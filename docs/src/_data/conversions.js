/**
 * @fileoverview Helper for command conversions
 * @author Jay-Karia
 */

"use strict";

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

module.exports = async function() {

    const conversions = require("../_data/conversion_map.json");

    return conversions;
};
