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
 * A symbol used to tag listener functions with the ID of the rule that
 * registered them so that errors thrown from a listener can be attributed
 * to the correct rule without wrapping every listener in a closure.
 * @type {symbol}
 */
const RULE_ID = Symbol("ruleId");

/**
 * Attributes an error thrown from a listener function to the rule that
 * registered the listener, if known.
 *
 * The `ruleId` is assigned unconditionally to match the behavior of the
 * wrapper this replaces, which always overwrote any existing `ruleId` with
 * the rule whose listener threw.
 * @param {any} error The thrown value.
 * @param {Function} func The listener function that threw the error.
 * @returns {void}
 */
function attributeError(error, func) {
	const ruleId = func[RULE_ID];

	if (ruleId !== void 0) {
		error.ruleId = ruleId;
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

module.exports = { SourceCodeVisitor, RULE_ID };
