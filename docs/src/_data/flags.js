/**
 * @fileoverview Convenience helper for feature flags.
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

module.exports = function() {

    const { activeFlags, inactiveFlags } = require("../../../lib/shared/flags");

    return {
        active: Object.fromEntries([...activeFlags]),
        inactive: Object.fromEntries([...inactiveFlags])
    };
};
