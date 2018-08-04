/**
 * @fileoverview The instance of Ajv validator.
 * @author Evgeny Poberezkin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const Ajv = require("ajv"),
    metaSchema = require("ajv/lib/refs/json-schema-draft-04.json");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * @param {Object|undefined} opts the options passed to ajv
 * @returns {Ajv} the ajv instance
 */
function eslintAjv(opts = {}) {
    const defaultOpts = {
        meta: false,
        validateSchema: false,
        missingRefs: "ignore",
        verbose: true,
        schemaId: "auto"
    };
    const ajv = new Ajv(Object.assign(defaultOpts, opts));

    ajv.addMetaSchema(metaSchema);
    // eslint-disable-next-line no-underscore-dangle
    ajv._opts.defaultMeta = metaSchema.id;
    return ajv;
}

module.exports.ajv = eslintAjv();
module.exports.ajvValidateSchema = eslintAjv({ validateSchema: true });
