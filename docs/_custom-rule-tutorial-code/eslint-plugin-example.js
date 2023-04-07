"use strict";

const fooBarRule = require("./enforce-foo-bar");
const plugin = { rules: { "foo-bar": fooBarRule } };
module.exports = plugin;
