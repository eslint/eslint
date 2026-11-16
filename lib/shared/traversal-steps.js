/**
 * @fileoverview A compact list of traversal steps.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { VisitNodeStep, CallMethodStep } = require("@eslint/plugin-kit");

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/** @typedef {import("@eslint/core").TraversalStep} TraversalStep */

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

/**
 * The steps of a traversal, in the order in which they are taken.
 *
 * A traversal has at least two steps per node, so instead of an object per
 * step, each step is stored as one element in each of two parallel arrays.
 * Iterating the list yields a `VisitNodeStep` or `CallMethodStep` object for
 * each step, created on demand. Because all steps are known before the first
 * one is applied, a consumer may pause between any two steps.
 * @implements {Iterable<TraversalStep>}
 */
class TraversalSteps {
	/**
	 * The target of each step: the node to visit for a visit step, or the
	 * name of the method to call for a call step.
	 * @type {Array<Object|string>}
	 */
	targets = [];

	/**
	 * The detail of each step: the phase (`1` for enter, `2` for exit) for a
	 * visit step, or the array of arguments for a call step.
	 * @type {Array<1|2|Array<any>>}
	 */
	details = [];

	/**
	 * The number of steps.
	 * @type {number}
	 */
	get length() {
		return this.targets.length;
	}

	/**
	 * Adds a step that visits a node.
	 * @param {Object} node The node to visit.
	 * @param {1|2} phase `1` if the node is entered, `2` if it is exited.
	 * @returns {void}
	 */
	addVisit(node, phase) {
		this.targets.push(node);
		this.details.push(phase);
	}

	/**
	 * Adds a step that calls a method.
	 * @param {string} name The name of the method to call.
	 * @param {Array<any>} args The arguments to call the method with.
	 * @returns {void}
	 */
	addCall(name, args) {
		this.targets.push(name);
		this.details.push(args);
	}

	/**
	 * Iterates the steps as step objects.
	 * @returns {IterableIterator<TraversalStep>} An iterator of the steps.
	 */
	*[Symbol.iterator]() {
		const { targets, details } = this;

		for (let i = 0; i < targets.length; i++) {
			const target = targets[i];
			const detail = details[i];

			if (typeof detail === "number") {
				yield new VisitNodeStep({
					target,
					phase: detail,
					args: [target],
				});
			} else {
				yield new CallMethodStep({ target, args: detail });
			}
		}
	}
}

module.exports = { TraversalSteps };
