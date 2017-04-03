/**
 * @fileoverview Config to enable all rules.
 * @author Robert Fletcher
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const createFilteredConfig = require("./create-filtered-config");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = createFilteredConfig(rule => !rule.meta.deprecated);
