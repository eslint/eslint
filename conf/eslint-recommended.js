/**
 * @fileoverview Configuration applied when a user configuration extends from
 * eslint:recommended.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const createFilteredConfig = require("./create-filtered-config");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = createFilteredConfig(rule => rule.meta.docs.recommended);
