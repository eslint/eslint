/**
 * @fileoverview Rule that warns when identifier names that are
 * specified in the configuration are used.
 * @author Keith Cirkel (http://keithcirkel.co.uk)
 */

"use strict";

const idDenylist = require("./id-denylist");

// `id-blacklist` has been renamed to `id-denylist`
module.exports = {

    // eslint-disable-next-line internal-rules/consistent-docs-url, internal-rules/no-invalid-meta
    meta: Object.assign({}, {
        deprecated: true,
        docs: Object.assign({}, {
            url: "https://eslint.org/docs/rules/id-blacklist"
        }, idDenylist.meta.docs)
    }, idDenylist.meta),
    create: idDenylist.create
};
