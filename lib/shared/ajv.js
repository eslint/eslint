/**
 * @fileoverview The instance of Ajv validator.
 * @author Evgeny Poberezkin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const Ajv = require("ajv").default;

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = (additionalOptions = {}) => {
    const ajv = new Ajv({
        useDefaults: true,
        validateSchema: false,
        verbose: true,
        strictTuples: false,
        ...additionalOptions
    });

    return ajv;
};
