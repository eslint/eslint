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
 * @param {string|undefined} ruleId The ID of the rule that registered the listener that threw, if known.
 * @returns {void}
 */
function attributeError(error, ruleId) {
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
	 * The IDs of the rules that registered the functions, in the same
	 * layout as `#functions`. An entry is `undefined` when the function
	 * wasn't registered with a rule ID.
	 * @type {Map<string, Array<string|undefined>>}
	 */
	#ruleIds = new Map();

	/**
	 * Adds a function to the list of functions to call for a given name.
	 * @param {string} name The name of the function to call.
	 * @param {Function} func The function to call.
	 * @param {string} [ruleId] The ID of the rule that registered the function, used to attribute errors.
	 * @returns {void}
	 */
	add(name, func, ruleId) {
		const funcs = this.#functions.get(name);

		if (funcs) {
			funcs.push(func);
			this.#ruleIds.get(name).push(ruleId);
		} else {
			this.#functions.set(name, [func]);
			this.#ruleIds.set(name, [ruleId]);
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
					attributeError(err, this.#ruleIds.get(name)[i]);
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
				attributeError(err, this.#ruleIds.get(name)[i]);
				throw err;
			}
		}
	}
}

module.exports = {
	SourceCodeVisitor,
	attachRuleId,
};
