import type { ESLint } from "eslint";

import test from "./rules/test.js";

export default {
	meta: {
		name: "test",
		version: "1.0.0",
	},
	rules: {
		test,
	},
} satisfies ESLint.Plugin;
