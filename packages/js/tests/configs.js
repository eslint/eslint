/**
 * @fileoverview tests for recommended/all configs.
 * @author aladdin-add<weiran.zsd@outlook.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const assert = require("node:assert").strict;
const js = require("../");

assert.ok(js, "@eslint/js package should be loaded");
assert.ok(js.configs, "@eslint/js package should have configs");

assert.ok(
	js.configs.recommended,
	"@eslint/js package should have recommended config",
);
assert.strictEqual(
	js.configs.recommended.name,
	"@eslint/js/recommended",
	"Recommended config should have the correct name",
);
assert.ok(
	js.configs.recommended.rules,
	"@eslint/js package should have rules in recommended config",
);
assert.ok(
	js.configs.recommended.rules["no-debugger"],
	"@eslint/js package should have no-debugger rule in recommended config",
);

assert.ok(js.configs.all, "@eslint/js package should have all config");
assert.strictEqual(
	js.configs.all.name,
	"@eslint/js/all",
	"All config should have the correct name",
);
assert.ok(
	js.configs.all.rules,
	"@eslint/js package should have rules in all config",
);
assert.ok(
	js.configs.all.rules["no-debugger"],
	"@eslint/js package should have no-debugger rule in all config",
);
