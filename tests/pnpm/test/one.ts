import type { Scope } from "eslint";

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
} satisfies Scope.ScopeManager;
