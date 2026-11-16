/**
 * @fileoverview SourceCodeVisitor class
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const emptyArray = Object.freeze([]);

/**
 * Maps listener functions to the ID of the rule that registered them, so that
 * errors thrown from a listener can be attributed to the correct rule without
 * wrapping every listener in a closure. A `WeakMap` is used rather than a
 * property on the function itself because the function is owned by the rule,
 * and adding properties to it could surprise the rule's author.
 * @type {WeakMap<Function, string>}
 */
const listenerRuleIds = new WeakMap();

/**
 * Gets the ID of the rule that registered a listener function, if known.
 * @param {Function} func The listener function to look up.
 * @returns {string|undefined} The rule ID, or `undefined` if the function isn't associated with a rule.
 */
function getListenerRuleId(func) {
	return listenerRuleIds.get(func);
}

/**
 * Associates a listener function with the rule that registered it.
 * @param {Function} func The listener function.
 * @param {string} ruleId The ID of the rule that registered the listener.
 * @returns {void}
 */
function setListenerRuleId(func, ruleId) {
	listenerRuleIds.set(func, ruleId);
}

/**
 * Attaches a rule ID to a thrown value so that the rule responsible for an
 * error can be reported.
 *
 * The `ruleId` is assigned unconditionally for object values, matching the
 * behavior of the wrapper this replaces, which always overwrote any existing
 * `ruleId` with the rule whose listener threw.
 * @param {any} error The thrown value.
 * @param {string} ruleId The ID of the rule that threw.
 * @returns {void}
 */
function attachRuleId(error, ruleId) {
	/*
	 * Rules can throw primitives, which can't carry a `ruleId`. Assigning to
	 * one throws a `TypeError` in strict mode, which would replace the value
	 * the rule actually threw, so such values are left as-is.
	 */
	if (
		error !== null &&
		(typeof error === "object" || typeof error === "function")
	) {
		error.ruleId = ruleId;
	}
}

/**
 * Attributes an error thrown from a listener function to the rule that
 * registered the listener, if known.
 * @param {any} error The thrown value.
 * @param {Function} func The listener function that threw the error.
 * @returns {void}
 */
function attributeError(error, func) {
	const ruleId = listenerRuleIds.get(func);

	if (ruleId !== void 0) {
		attachRuleId(error, ruleId);
	}
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

/**
 * A structure to hold a list of functions to call for a given name.
 * This is used to allow multiple rules to register functions for a given name
 * without having to know about each other.
 */
class SourceCodeVisitor {
	/**
	 * The functions to call for a given name.
	 * @type {Map<string, Function[]>}
	 */
	#functions = new Map();

	/**
	 * Adds a function to the list of functions to call for a given name.
	 * @param {string} name The name of the function to call.
	 * @param {Function} func The function to call.
	 * @returns {void}
	 */
	add(name, func) {
		const funcs = this.#functions.get(name);

		if (funcs) {
			funcs.push(func);
		} else {
			this.#functions.set(name, [func]);
		}
	}

	/**
	 * Gets the list of functions to call for a given name.
	 * @param {string} name The name of the function to call.
	 * @returns {Function[]} The list of functions to call.
	 */
	get(name) {
		return this.#functions.get(name) ?? emptyArray;
	}

	/**
	 * Iterates over all names and calls the callback with the name.
	 * @param {(name:string) => void} callback The callback to call for each name.
	 * @returns {void}
	 */
	forEachName(callback) {
		this.#functions.forEach((funcs, name) => {
			callback(name);
		});
	}

	/**
	 * Calls the functions for a given name with the given arguments.
	 * @param {string} name The name of the function to call.
	 * @param {any[]} args The arguments to pass to the function.
	 * @returns {void}
	 * @throws {any} Any error thrown by a called function, annotated with
	 * the ID of the rule that registered the function when known.
	 */
	callSync(name, ...args) {
		const funcs = this.#functions.get(name);

		if (!funcs) {
			return;
		}

		// Fast path for the overwhelmingly common one-argument call.
		if (args.length === 1) {
			const arg = args[0];

			for (let i = 0; i < funcs.length; i++) {
				const func = funcs[i];

				try {
					func(arg);
				} catch (err) {
					attributeError(err, func);
					throw err;
				}
			}
			return;
		}

		for (let i = 0; i < funcs.length; i++) {
			const func = funcs[i];

			try {
				func(...args);
			} catch (err) {
				attributeError(err, func);
				throw err;
			}
		}
	}
}

module.exports = {
	SourceCodeVisitor,
	getListenerRuleId,
	setListenerRuleId,
	attachRuleId,
};
