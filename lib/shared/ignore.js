/**
 * @fileoverview Create instance of Ignore validator.
 * @author gfyoung
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const ignoreFactory = require("ignore");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = (additionalOptions = {}) => {
    const ignore = ignoreFactory({
        allowRelativePaths: true,
        ...additionalOptions
    });

    return ignore;
};
