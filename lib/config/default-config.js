/**
 * @fileoverview Default configuration
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const Rules = require("../rules");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const sharedDefaultConfig = [
	// intentionally empty config to ensure these files are globbed by default
	{
		files: ["**/*.js", "**/*.mjs"],
	},
	{
		files: ["**/*.cjs"],
		languageOptions: {
			sourceType: "commonjs",
			ecmaVersion: "latest",
		},
	},
];

exports.defaultConfig = Object.freeze([
	{
		plugins: {
			"@": {
				languages: {
					js: require("../languages/js"),
				},

				/*
				 * Because we try to delay loading rules until absolutely
				 * necessary, a proxy allows us to hook into the lazy-loading
				 * aspect of the rules map while still keeping all of the
				 * relevant configuration inside of the config array.
				 */
				rules: new Proxy(
					{},
					{
						get(target, property) {
							return Rules.get(property);
						},

						has(target, property) {
							return Rules.has(property);
						},
					},
				),
			},
		},
		language: "@/js",
		linterOptions: {
			reportUnusedDisableDirectives: 1,
		},
	},

	// default ignores are listed here
	{
		ignores: ["**/node_modules/", ".git/"],
	},

	...sharedDefaultConfig,
]);

exports.defaultRuleTesterConfig = Object.freeze([
	{ files: ["**"] }, // Make sure the default config matches for all files

	...sharedDefaultConfig,
]);

// Symbol key to mark ESLint native config objects.
const IS_NATIVE_CONFIG_KEY = Symbol.for("isNativeConfig");

for (const config of new Set([
	...exports.defaultConfig,
	...exports.defaultRuleTesterConfig,
])) {
	Reflect.defineProperty(config, IS_NATIVE_CONFIG_KEY, {
		value: true,
		configurable: true,
	});
}
