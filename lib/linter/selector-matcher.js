/**
 * @fileoverview Compiles parsed ESQuery selectors into matcher functions.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const vk = require("eslint-visitor-keys");

//-----------------------------------------------------------------------------
// Typedefs
//-----------------------------------------------------------------------------

/**
 * @import { Selector as ESQuerySelector, ESQueryOptions } from "esquery";
 */

/**
 * A matcher for one part of a selector.
 *
 * The ancestors of the node that is being matched are never copied. Instead,
 * every matcher receives the same array together with the index at which the
 * ancestors of the node that it is checking start. Checking the parent of a
 * node is then a matter of calling a matcher with `offset + 1`.
 * @callback PartialMatcher
 * @param {Object} node The node to check.
 * @param {Object[]} ancestry The ancestors of the node that was passed to the top-level matcher, starting with its parent and ending with the root.
 * @param {number} offset The index in `ancestry` of the parent of `node`. It is equal to `ancestry.length` if `node` has no parent.
 * @param {ESQueryOptions} options The options to use for matching.
 * @returns {boolean} `true` if the node matches.
 */

/**
 * A matcher for a whole selector.
 * @callback SelectorMatcher
 * @param {Object} node The node to check.
 * @param {Object[]} [ancestry] The ancestors of the node, starting with its parent and ending with the root.
 * @param {ESQueryOptions} [options] The options to use for matching.
 * @returns {boolean} `true` if the node matches the selector.
 */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const emptyArray = Object.freeze([]);
const emptyOptions = Object.freeze({});

/**
 * Creates a function that reads a property which may be multiple levels down
 * in an object. The function returns `null` or `undefined` if one of the
 * objects on the way to the property is `null` or `undefined`.
 * @param {string} name The names of the properties to follow, separated by dots.
 * @returns {(object: Object) => any} A function that returns the value.
 */
function createGetter(name) {
	const path = name.split(".");

	if (path.length === 1) {
		return object => object[name];
	}

	if (path.length === 2) {
		const [first, second] = path;

		return object => {
			const value = object[first];

			return value === null || value === void 0 ? value : value[second];
		};
	}

	return object => {
		let value = object;

		for (let i = 0; i < path.length; ++i) {
			if (value === null || value === void 0) {
				return value;
			}
			value = value[path[i]];
		}
		return value;
	};
}

/**
 * Determines whether a node can be reached by following a path of property
 * names, starting at an ancestor. Where a property is an array, the node can
 * be reached through any of its elements.
 * @param {Object} node The node to look for.
 * @param {Object} ancestor The node to start at.
 * @param {string[]} path The property names to follow.
 * @param {number} fromPathIndex The index in `path` to start at.
 * @returns {boolean} `true` if the node can be reached.
 */
function inPath(node, ancestor, path, fromPathIndex) {
	let current = ancestor;

	for (let i = fromPathIndex; i < path.length; ++i) {
		if (current === null || current === void 0) {
			return false;
		}

		const field = current[path[i]];

		if (Array.isArray(field)) {
			for (let k = 0; k < field.length; ++k) {
				if (inPath(node, field[k], path, i + 1)) {
					return true;
				}
			}
			return false;
		}
		current = field;
	}
	return node === current;
}

/**
 * Checks whether a value is an AST node.
 * @param {any} value The value to check.
 * @param {ESQueryOptions} options The options to use for matching.
 * @returns {boolean} `true` if the value is an AST node.
 */
function isNode(value, options) {
	return (
		value !== null &&
		typeof value === "object" &&
		typeof value[options.nodeTypeKey || "type"] === "string"
	);
}

/**
 * Gets the names of the properties of a node that can contain child nodes.
 * @param {Object} node The node.
 * @param {ESQueryOptions} options The options to use for matching.
 * @returns {readonly string[]} The property names.
 */
function getVisitorKeys(node, options) {
	const keys = options.visitorKeys?.[node[options.nodeTypeKey || "type"]];

	if (keys) {
		return keys;
	}

	return typeof options.fallback === "function"
		? options.fallback(node)
		: vk.getKeys(node);
}

/**
 * Determines whether a node has a sibling, before or after it, that matches.
 * @param {Object} node The node.
 * @param {PartialMatcher} matcher The matcher for the sibling.
 * @param {Object[]} ancestry The ancestors of the node.
 * @param {number} offset The index in `ancestry` of the parent of `node`.
 * @param {boolean} before `true` to check the siblings before the node, `false` to check the siblings after it.
 * @param {ESQueryOptions} options The options to use for matching.
 * @returns {boolean} `true` if there is a matching sibling.
 */
function hasMatchingSibling(node, matcher, ancestry, offset, before, options) {
	if (offset >= ancestry.length) {
		return false;
	}

	const parent = ancestry[offset];
	const keys = getVisitorKeys(parent, options);

	for (let i = 0; i < keys.length; ++i) {
		const list = parent[keys[i]];

		if (!Array.isArray(list)) {
			continue;
		}

		const index = list.indexOf(node);

		if (index < 0) {
			continue;
		}

		const start = before ? 0 : index + 1;
		const end = before ? index : list.length;

		for (let k = start; k < end; ++k) {
			if (
				isNode(list[k], options) &&
				matcher(list[k], ancestry, offset, options)
			) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Determines whether the sibling directly before or after a node matches.
 * @param {Object} node The node.
 * @param {PartialMatcher} matcher The matcher for the sibling.
 * @param {Object[]} ancestry The ancestors of the node.
 * @param {number} offset The index in `ancestry` of the parent of `node`.
 * @param {boolean} before `true` to check the sibling before the node, `false` to check the sibling after it.
 * @param {ESQueryOptions} options The options to use for matching.
 * @returns {boolean} `true` if the adjacent sibling matches.
 */
function hasMatchingAdjacentSibling(
	node,
	matcher,
	ancestry,
	offset,
	before,
	options,
) {
	if (offset >= ancestry.length) {
		return false;
	}

	const parent = ancestry[offset];
	const keys = getVisitorKeys(parent, options);

	for (let i = 0; i < keys.length; ++i) {
		const list = parent[keys[i]];

		if (!Array.isArray(list)) {
			continue;
		}

		const index = list.indexOf(node);

		if (index < 0) {
			continue;
		}

		const sibling = list[before ? index - 1 : index + 1];

		if (
			isNode(sibling, options) &&
			matcher(sibling, ancestry, offset, options)
		) {
			return true;
		}
	}

	return false;
}

/**
 * Determines whether a node is the nth element of an array of child nodes.
 * @param {Object} node The node.
 * @param {Object[]} ancestry The ancestors of the node.
 * @param {number} offset The index in `ancestry` of the parent of `node`.
 * @param {number} nth The one-based position. A negative number counts from the end of the array.
 * @param {ESQueryOptions} options The options to use for matching.
 * @returns {boolean} `true` if the node is at the given position.
 */
function isNthChild(node, ancestry, offset, nth, options) {
	if (nth === 0 || offset >= ancestry.length) {
		return false;
	}

	const parent = ancestry[offset];
	const keys = getVisitorKeys(parent, options);

	for (let i = 0; i < keys.length; ++i) {
		const list = parent[keys[i]];

		if (
			Array.isArray(list) &&
			list[nth < 0 ? list.length + nth : nth - 1] === node
		) {
			return true;
		}
	}

	return false;
}

/**
 * Determines whether a node or one of its descendants matches at least one of
 * the given matchers. Ancestors are relative to the node that the search
 * started at, which is how `:has()` works.
 * @param {Object} node The node to check, along with its descendants.
 * @param {PartialMatcher[]} matchers The matchers.
 * @param {Object[]} ancestry The ancestors of the node, up to the node that the search started at.
 * @param {ESQueryOptions} options The options to use for matching.
 * @returns {boolean} `true` if a match was found.
 */
function hasMatchingNode(node, matchers, ancestry, options) {
	for (let i = 0; i < matchers.length; ++i) {
		if (matchers[i](node, ancestry, 0, options)) {
			return true;
		}
	}

	const keys = getVisitorKeys(node, options);

	ancestry.unshift(node);

	for (let i = 0; i < keys.length; ++i) {
		const child = node[keys[i]];

		if (Array.isArray(child)) {
			for (let k = 0; k < child.length; ++k) {
				if (
					isNode(child[k], options) &&
					!ancestry.includes(child[k]) &&
					hasMatchingNode(child[k], matchers, ancestry, options)
				) {
					return true;
				}
			}
		} else if (
			isNode(child, options) &&
			!ancestry.includes(child) &&
			hasMatchingNode(child, matchers, ancestry, options)
		) {
			return true;
		}
	}

	ancestry.shift();

	return false;
}

/**
 * Compiles an attribute selector, such as `[name="foo"]`.
 * @param {ESQuerySelector} selector The attribute selector.
 * @returns {PartialMatcher} The matcher.
 * @throws {Error} If the operator or the type of the value is unknown.
 */
function compileAttribute(selector) {
	const get = createGetter(selector.name);
	const { operator, value } = selector;

	switch (operator) {
		case void 0:
			return node => {
				const actual = get(node);

				return actual !== null && actual !== void 0;
			};

		case "=":
			switch (value.type) {
				case "regexp": {
					const regexp = value.value;

					return node => {
						const actual = get(node);

						return (
							typeof actual === "string" && regexp.test(actual)
						);
					};
				}

				case "literal": {
					const literal = `${value.value}`;

					return node => {
						const actual = get(node);

						return (
							literal ===
							(typeof actual === "string" ? actual : `${actual}`)
						);
					};
				}

				case "type": {
					const type = value.value;

					return node => type === typeof get(node);
				}

				default:
					throw new Error(
						`Unknown selector value type: ${value.type}`,
					);
			}

		case "!=":
			switch (value.type) {
				case "regexp": {
					const regexp = value.value;

					return node => !regexp.test(get(node));
				}

				case "literal": {
					const literal = `${value.value}`;

					return node => {
						const actual = get(node);

						return (
							literal !==
							(typeof actual === "string" ? actual : `${actual}`)
						);
					};
				}

				case "type": {
					const type = value.value;

					return node => type !== typeof get(node);
				}

				default:
					throw new Error(
						`Unknown selector value type: ${value.type}`,
					);
			}

		case "<=": {
			const limit = value.value;

			return node => get(node) <= limit;
		}

		case "<": {
			const limit = value.value;

			return node => get(node) < limit;
		}

		case ">": {
			const limit = value.value;

			return node => get(node) > limit;
		}

		case ">=": {
			const limit = value.value;

			return node => get(node) >= limit;
		}

		default:
			throw new Error(`Unknown operator: ${operator}`);
	}
}

/**
 * Compiles one part of a selector.
 * @param {ESQuerySelector} selector The part of the selector to compile.
 * @returns {PartialMatcher} The matcher.
 * @throws {Error} If the selector has an unknown type, operator, or value type.
 */
function compile(selector) {
	switch (selector.type) {
		case "wildcard":
			return () => true;

		case "identifier": {
			const exact = selector.value;
			const lowercase = exact.toLowerCase();

			/*
			 * Node types are compared case-insensitively. A type that is
			 * spelled like the selector is the common case. For the others,
			 * there are only a few distinct node types, so the result is
			 * remembered for each one instead of lowercasing the type again
			 * for every node.
			 */
			const results = new Map();

			return (node, ancestry, offset, options) => {
				const nodeType = node[options.nodeTypeKey || "type"];

				if (nodeType === exact) {
					return true;
				}

				let result = results.get(nodeType);

				if (result === void 0) {
					result = nodeType.toLowerCase() === lowercase;
					results.set(nodeType, result);
				}

				return result;
			};
		}

		// `:root`
		case "exactNode":
			return (node, ancestry, offset) => offset >= ancestry.length;

		case "field": {
			const name = selector.name;
			const path = name.split(".");
			const depth = path.length - 1;

			if (depth === 0) {
				return (node, ancestry, offset) => {
					if (offset >= ancestry.length) {
						return false;
					}

					const value = ancestry[offset][name];

					return (
						value === node ||
						(Array.isArray(value) && value.includes(node))
					);
				};
			}

			return (node, ancestry, offset) =>
				offset + depth < ancestry.length &&
				inPath(node, ancestry[offset + depth], path, 0);
		}

		case "matches": {
			const matchers = selector.selectors.map(compile);

			return (node, ancestry, offset, options) => {
				for (let i = 0; i < matchers.length; ++i) {
					if (matchers[i](node, ancestry, offset, options)) {
						return true;
					}
				}
				return false;
			};
		}

		case "compound": {
			const matchers = selector.selectors.map(compile);

			if (matchers.length === 2) {
				const [first, second] = matchers;

				return (node, ancestry, offset, options) =>
					first(node, ancestry, offset, options) &&
					second(node, ancestry, offset, options);
			}

			return (node, ancestry, offset, options) => {
				for (let i = 0; i < matchers.length; ++i) {
					if (!matchers[i](node, ancestry, offset, options)) {
						return false;
					}
				}
				return true;
			};
		}

		case "not": {
			const matchers = selector.selectors.map(compile);

			return (node, ancestry, offset, options) => {
				for (let i = 0; i < matchers.length; ++i) {
					if (matchers[i](node, ancestry, offset, options)) {
						return false;
					}
				}
				return true;
			};
		}

		case "has": {
			const matchers = selector.selectors.map(compile);

			return (node, ancestry, offset, options) =>
				hasMatchingNode(node, matchers, [], options);
		}

		case "child": {
			const left = compile(selector.left);
			const right = compile(selector.right);

			return (node, ancestry, offset, options) =>
				offset < ancestry.length &&
				right(node, ancestry, offset, options) &&
				left(ancestry[offset], ancestry, offset + 1, options);
		}

		case "descendant": {
			const left = compile(selector.left);
			const right = compile(selector.right);

			return (node, ancestry, offset, options) => {
				if (right(node, ancestry, offset, options)) {
					for (let i = offset; i < ancestry.length; ++i) {
						if (left(ancestry[i], ancestry, i + 1, options)) {
							return true;
						}
					}
				}
				return false;
			};
		}

		case "attribute":
			return compileAttribute(selector);

		case "sibling": {
			const left = compile(selector.left);
			const right = compile(selector.right);
			const leftIsSubject = Boolean(selector.left.subject);

			return (node, ancestry, offset, options) =>
				(right(node, ancestry, offset, options) &&
					hasMatchingSibling(
						node,
						left,
						ancestry,
						offset,
						true,
						options,
					)) ||
				(leftIsSubject &&
					left(node, ancestry, offset, options) &&
					hasMatchingSibling(
						node,
						right,
						ancestry,
						offset,
						false,
						options,
					));
		}

		case "adjacent": {
			const left = compile(selector.left);
			const right = compile(selector.right);

			/*
			 * `esquery` reads the subject indicator from the right side of an
			 * adjacent sibling combinator, and from the left side of a general
			 * sibling combinator.
			 */
			const rightIsSubject = Boolean(selector.right.subject);

			return (node, ancestry, offset, options) =>
				(right(node, ancestry, offset, options) &&
					hasMatchingAdjacentSibling(
						node,
						left,
						ancestry,
						offset,
						true,
						options,
					)) ||
				(rightIsSubject &&
					left(node, ancestry, offset, options) &&
					hasMatchingAdjacentSibling(
						node,
						right,
						ancestry,
						offset,
						false,
						options,
					));
		}

		case "nth-child":
		case "nth-last-child": {
			const nth =
				selector.type === "nth-child"
					? selector.index.value
					: -selector.index.value;

			return (node, ancestry, offset, options) =>
				isNthChild(node, ancestry, offset, nth, options);
		}

		case "class": {
			const name = selector.name;

			/*
			 * What a class such as `:statement` means depends on the language,
			 * so without a `matchClass` option no node is in any class.
			 */
			return (node, ancestry, offset, options) =>
				typeof options.matchClass === "function" &&
				options.matchClass(
					name,
					node,
					offset === 0 ? ancestry : ancestry.slice(offset),
				);
		}

		default:
			throw new Error(`Unknown selector type: ${selector.type}`);
	}
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Compiles a parsed selector into a function that determines whether a node
 * matches the selector. The function gives the same answers as
 * `esquery.matches()`, without copying the array of ancestors for every
 * combinator and without lowercasing the type of every node.
 * @param {ESQuerySelector} selector The parsed selector to compile.
 * @returns {SelectorMatcher} The matcher.
 * @throws {Error} If the selector has an unknown type, operator, or value type.
 */
function compileSelector(selector) {
	const matcher = compile(selector);

	return (node, ancestry = emptyArray, options = emptyOptions) =>
		matcher(node, ancestry, 0, options);
}

module.exports = { compileSelector };
