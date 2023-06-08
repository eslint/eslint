/** 
 * @fileoverview Example an ESLint plugin with a custom rule.
 * @author Ben Perlmutter
*/
"use strict";

const fooBarRule = require("./enforce-foo-bar");
const plugin = { rules: { "enforce-foo-bar": fooBarRule } };
module.exports = plugin;
