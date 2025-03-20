/**
 * @fileoverview Script to update the eslint:all configuration.
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const fs = require("node:fs");
const builtInRules = require("../lib/rules");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const allRules = {};

for (const [ruleId, rule] of builtInRules) {
	if (!rule.meta.deprecated) {
		allRules[ruleId] = "error";
	}
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

const code = `/*
 * WARNING: This file is autogenerated using the tools/update-eslint-all.js
 * script. Do not edit manually.
 */
"use strict";

/*
 * IMPORTANT!
 *
 * We cannot add a "name" property to this object because it's still used in eslintrc
 * which doesn't support the "name" property. If we add a "name" property, it will
 * cause an error.
 */

module.exports = Object.freeze(${JSON.stringify({ rules: allRules }, null, 4)});
`;

fs.writeFileSync("./packages/js/src/configs/eslint-all.js", code, "utf8");
