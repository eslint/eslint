/*
 * Regression test for https://github.com/eslint/eslint/issues/19418
 * Scope.ScopeManager was unusable in pnpm projects because TypeScript couldn't
 * form a portable reference to @types/estree when generating declaration files.
 */

/** @import { Scope } from "eslint" */

/**
 * @satisfies {Scope.ScopeManager}
 */
export default {
	scopes: [],
	globalScope: null,
	acquire(node) {
		void node;
		return null;
	},
	getDeclaredVariables() {
		return [];
	},
	addGlobals() {},
};
