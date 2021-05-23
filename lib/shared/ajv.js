/**
 * @fileoverview The instance of Ajv validator.
 * @author Evgeny Poberezkin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const Ajv = require("ajv-draft-04");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = (additionalOptions = {}) => {
    const ajv = new Ajv({
        useDefaults: true,
        validateSchema: false,
        verbose: true,
        strict: "log",
        strictTuples: false,
        ...additionalOptions
    });

    return ajv;
};
