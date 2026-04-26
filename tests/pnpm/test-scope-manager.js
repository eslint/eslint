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
	/**
	 * Acquires a scope for the given node.
	 * @param {import("eslint").ESTree.Node} node The node to acquire scope for.
	 * @returns {import("eslint").Scope.Scope | null} The acquired scope.
	 */
	acquire(node) {
		void node;
		return null;
	},
	getDeclaredVariables() {
		return [];
	},
	addGlobals() {},
};
