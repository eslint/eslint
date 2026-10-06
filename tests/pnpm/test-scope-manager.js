/** @import { Scope } from "eslint" */

/** @satisfies {Scope.ScopeManager} */
const scopeManager = {
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

export default scopeManager;
