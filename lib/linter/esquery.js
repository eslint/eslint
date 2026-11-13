/**
 * @fileoverview ESQuery wrapper for ESLint.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const esquery = require("esquery");

//-----------------------------------------------------------------------------
// Typedefs
//-----------------------------------------------------------------------------

/**
 * @typedef {import("esquery").Selector} ESQuerySelector
 * @typedef {import("esquery").ESQueryOptions} ESQueryOptions
 */

//------------------------------------------------------------------------------
// Classes
//------------------------------------------------------------------------------

/**
 * The result of parsing and analyzing an ESQuery selector.
 */
class ESQueryParsedSelector {
	/**
	 * The raw selector string that was parsed
	 * @type {string}
	 */
	source;

	/**
	 * Whether this selector is an exit selector
	 * @type {boolean}
	 */
	isExit;

	/**
	 * An object (from esquery) describing the matching behavior of the selector
	 * @type {ESQuerySelector}
	 */
	root;

	/**
	 * The node types that could possibly trigger this selector, or `null` if all node types could trigger it
	 * @type {string[]|null}
	 */
	nodeTypes;

	/**
	 * The number of class, pseudo-class, and attribute queries in this selector
	 * @type {number}
	 */
	attributeCount;

	/**
	 * The number of identifier queries in this selector
	 * @type {number}
	 */
	identifierCount;

	/**
	 * Whether this selector is guaranteed to match any node it is tested
	 * against after node-type-based filtering, making an `esquery.matches()`
	 * call unnecessary. This is `true` only for selectors that consist solely
	 * of node type identifiers, wildcards, or unions thereof.
	 * @type {boolean}
	 */
	alwaysMatches;

	/**
	 * A compiled matcher function that is equivalent to calling
	 * `esquery.matches()` for this selector but faster.
	 * The ancestry is a stack with the root at index 0 and the parent last.
	 * @type {(node: Object, ancestry: Object[], options: ESQueryOptions) => boolean}
	 */
	fastMatch;

	/**
	 * Creates a new parsed selector.
	 * @param {string} source The raw selector string that was parsed
	 * @param {boolean} isExit Whether this selector is an exit selector
	 * @param {ESQuerySelector} root An object (from esquery) describing the matching behavior of the selector
	 * @param {string[]|null} nodeTypes The node types that could possibly trigger this selector, or `null` if all node types could trigger it
	 * @param {number} attributeCount The number of class, pseudo-class, and attribute queries in this selector
	 * @param {number} identifierCount The number of identifier queries in this selector
	 * @param {boolean} alwaysMatches Whether this selector always matches nodes it is tested against after node-type-based filtering
	 * @param {Function} fastMatch A compiled matcher function for this selector
	 */
	constructor(
		source,
		isExit,
		root,
		nodeTypes,
		attributeCount,
		identifierCount,
		alwaysMatches,
		fastMatch,
	) {
		this.source = source;
		this.isExit = isExit;
		this.root = root;
		this.nodeTypes = nodeTypes;
		this.attributeCount = attributeCount;
		this.identifierCount = identifierCount;
		this.alwaysMatches = alwaysMatches;
		this.fastMatch = fastMatch;
	}

	/**
	 * Compares this selector's specificity to another selector for sorting purposes.
	 * @param {ESQueryParsedSelector} otherSelector The selector to compare against
	 * @returns {number}
	 * a value less than 0 if this selector is less specific than otherSelector
	 * a value greater than 0 if this selector is more specific than otherSelector
	 * a value less than 0 if this selector and otherSelector have the same specificity, and this selector <= otherSelector alphabetically
	 * a value greater than 0 if this selector and otherSelector have the same specificity, and this selector > otherSelector alphabetically
	 */
	compare(otherSelector) {
		return (
			this.attributeCount - otherSelector.attributeCount ||
			this.identifierCount - otherSelector.identifierCount ||
			(this.source <= otherSelector.source ? -1 : 1)
		);
	}
}

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const selectorCache = new Map();

/**
 * Computes the union of one or more arrays
 * @param {...any[]} arrays One or more arrays to union
 * @returns {any[]} The union of the input arrays
 */
function union(...arrays) {
	return [...new Set(arrays.flat())];
}

/**
 * Computes the intersection of one or more arrays
 * @param {...any[]} arrays One or more arrays to intersect
 * @returns {any[]} The intersection of the input arrays
 */
function intersection(...arrays) {
	if (arrays.length === 0) {
		return [];
	}

	let result = [...new Set(arrays[0])];

	for (const array of arrays.slice(1)) {
		result = result.filter(x => array.includes(x));
	}
	return result;
}

/**
 * Analyzes a parsed selector and returns combined data about it
 * @param {ESQuerySelector} parsedSelector An object (from esquery) describing the matching behavior of the selector
 * @returns {{nodeTypes:string[]|null, attributeCount:number, identifierCount:number}} Object containing selector data.
 */
function analyzeParsedSelector(parsedSelector) {
	let attributeCount = 0;
	let identifierCount = 0;

	/**
	 * Analyzes a selector and returns the node types that could possibly trigger it.
	 * @param {ESQuerySelector} selector The selector to analyze.
	 * @returns {string[]|null} The node types that could possibly trigger this selector, or `null` if all node types could trigger it
	 */
	function analyzeSelector(selector) {
		switch (selector.type) {
			case "identifier":
				identifierCount++;
				return [selector.value];

			case "not":
				selector.selectors.map(analyzeSelector);
				return null;

			case "matches": {
				const typesForComponents =
					selector.selectors.map(analyzeSelector);

				if (typesForComponents.every(Boolean)) {
					return union(...typesForComponents);
				}
				return null;
			}

			case "compound": {
				const typesForComponents = selector.selectors
					.map(analyzeSelector)
					.filter(typesForComponent => typesForComponent);

				// If all of the components could match any type, then the compound could also match any type.
				if (!typesForComponents.length) {
					return null;
				}

				/*
				 * If at least one of the components could only match a particular type, the compound could only match
				 * the intersection of those types.
				 */
				return intersection(...typesForComponents);
			}

			case "attribute":
			case "field":
			case "nth-child":
			case "nth-last-child":
				attributeCount++;
				return null;

			case "child":
			case "descendant":
			case "sibling":
			case "adjacent":
				analyzeSelector(selector.left);
				return analyzeSelector(selector.right);

			case "class":
				// TODO: abstract into JSLanguage somehow
				if (selector.name === "function") {
					return [
						"FunctionDeclaration",
						"FunctionExpression",
						"ArrowFunctionExpression",
					];
				}
				return null;

			default:
				return null;
		}
	}

	const nodeTypes = analyzeSelector(parsedSelector);

	return {
		nodeTypes,
		attributeCount,
		identifierCount,
	};
}

/**
 * Determines whether a parsed selector consists solely of node type
 * identifiers, wildcards, or unions thereof. Such selectors are guaranteed to
 * match any node they are tested against after node-type-based filtering, so
 * calling `esquery.matches()` for them is unnecessary.
 * @param {ESQuerySelector} selector The parsed selector to check.
 * @returns {boolean} `true` if the selector always matches nodes it is tested against after node-type-based filtering.
 */
function isAlwaysMatchingSelector(selector) {
	switch (selector.type) {
		case "identifier":
		case "wildcard":
			return true;

		case "matches":
			return selector.selectors.every(isAlwaysMatchingSelector);

		default:
			return false;
	}
}

/**
 * A compiled matcher. Unlike the matchers that `esquery` generates, it reads
 * the ancestors of a node from a stack that has the root at index 0, so that
 * the traversal can push and pop nodes, and matching a parent or an ancestor
 * doesn't need a copy of the array.
 * @callback CompiledMatcher
 * @param {Object} node The node to check.
 * @param {Object[]} ancestry The stack of ancestors of the node that was passed to the top-level matcher, from the root down to its parent.
 * @param {number} offset The index in `ancestry` of the parent of `node`, or `-1` if it has no parent.
 * @param {ESQueryOptions} options The options to use for matching.
 * @returns {boolean} `true` if the node matches.
 */

/**
 * Gets the ancestors of a node in the order that `esquery` expects.
 * @param {Object[]} ancestry The stack of ancestors, from the root down.
 * @param {number} offset The index in `ancestry` of the parent of the node.
 * @returns {Object[]} The ancestors of the node, from its parent up to the root.
 */
function sliceAncestry(ancestry, offset) {
	const result = [];

	for (let i = offset; i >= 0; --i) {
		result.push(ancestry[i]);
	}

	return result;
}

/**
 * Gets the value of a property which may be multiple levels down in an object.
 * @param {Object} object The object to read from.
 * @param {string[]} keys The property names to follow.
 * @returns {any} The value.
 */
function getPath(object, keys) {
	let value = object;

	for (let i = 0; i < keys.length; ++i) {
		if (value === null || value === void 0) {
			return value;
		}
		value = value[keys[i]];
	}
	return value;
}

/**
 * Determines whether a node can be reached by following a path of property
 * names, starting at an ancestor.
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
 * Compiles an attribute selector, such as `[name="foo"]`.
 * The comparisons replicate those of `esquery`.
 * @param {ESQuerySelector} selector The attribute selector.
 * @returns {CompiledMatcher} The matcher.
 * @throws {Error} If the operator or the type of the value is unknown.
 */
function compileAttribute(selector) {
	const path = selector.name.split(".");
	const value = selector.value;

	switch (selector.operator) {
		case void 0:
			return node => {
				const actual = getPath(node, path);

				return actual !== null && actual !== void 0;
			};

		case "=":
			switch (value.type) {
				case "regexp":
					return node => {
						const actual = getPath(node, path);

						return (
							typeof actual === "string" &&
							value.value.test(actual)
						);
					};

				case "literal": {
					const literal = "".concat(value.value);

					return node => {
						const actual = getPath(node, path);

						return typeof actual === "string"
							? literal === actual
							: literal === "".concat(actual);
					};
				}

				case "type":
					return node => value.value === typeof getPath(node, path);

				/* c8 ignore start -- the selector parser doesn't produce other value types */
				default:
					throw new Error(
						`Unknown selector value type: ${value.type}`,
					);
				/* c8 ignore stop */
			}

		case "!=":
			switch (value.type) {
				case "regexp":
					return node => !value.value.test(getPath(node, path));

				case "literal": {
					const literal = "".concat(value.value);

					return node => {
						const actual = getPath(node, path);

						return typeof actual === "string"
							? literal !== actual
							: literal !== "".concat(actual);
					};
				}

				case "type":
					return node => value.value !== typeof getPath(node, path);

				/* c8 ignore start -- the selector parser doesn't produce other value types */
				default:
					throw new Error(
						`Unknown selector value type: ${value.type}`,
					);
				/* c8 ignore stop */
			}

		case "<=":
			return node => getPath(node, path) <= value.value;

		case "<":
			return node => getPath(node, path) < value.value;

		case ">":
			return node => getPath(node, path) > value.value;

		case ">=":
			return node => getPath(node, path) >= value.value;

		/* c8 ignore start -- the selector parser doesn't produce other operators */
		default:
			throw new Error(`Unknown operator: ${selector.operator}`);
		/* c8 ignore stop */
	}
}

/**
 * Compiles a parsed selector into a matcher function that is equivalent to
 * calling `esquery.matches()` with the selector but faster. The matchers
 * that `esquery` generates copy the ancestry array for every child and
 * descendant combinator and lowercase the node type for every identifier.
 * Selector types that aren't compiled here are delegated to `esquery`.
 * @param {ESQuerySelector} selector The parsed selector to compile.
 * @returns {CompiledMatcher} The matcher.
 */
function compileSelector(selector) {
	switch (selector.type) {
		case "wildcard":
			return () => true;

		case "identifier": {
			const value = selector.value.toLowerCase();

			/*
			 * `esquery` compares node types case-insensitively. There are
			 * only a few distinct node types, so remember the result for
			 * each one instead of lowercasing the type for every node.
			 */
			const results = new Map();

			return (node, ancestry, offset, options) => {
				const nodeType = node[options?.nodeTypeKey || "type"];
				let result = results.get(nodeType);

				if (result === void 0) {
					result = value === nodeType.toLowerCase();
					results.set(nodeType, result);
				}

				return result;
			};
		}

		case "exactNode":
			return (node, ancestry, offset) => offset < 0;

		case "field": {
			const path = selector.name.split(".");
			const depth = path.length - 1;

			return (node, ancestry, offset) =>
				inPath(
					node,
					offset >= depth ? ancestry[offset - depth] : void 0,
					path,
					0,
				);
		}

		case "matches": {
			const matchers = selector.selectors.map(compileSelector);

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
			const matchers = selector.selectors.map(compileSelector);

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
			const matchers = selector.selectors.map(compileSelector);

			return (node, ancestry, offset, options) => {
				for (let i = 0; i < matchers.length; ++i) {
					if (matchers[i](node, ancestry, offset, options)) {
						return false;
					}
				}
				return true;
			};
		}

		case "child": {
			const left = compileSelector(selector.left);
			const right = compileSelector(selector.right);

			return (node, ancestry, offset, options) =>
				offset >= 0 &&
				right(node, ancestry, offset, options) &&
				left(ancestry[offset], ancestry, offset - 1, options);
		}

		case "descendant": {
			const left = compileSelector(selector.left);
			const right = compileSelector(selector.right);

			return (node, ancestry, offset, options) => {
				if (right(node, ancestry, offset, options)) {
					for (let i = offset; i >= 0; --i) {
						if (left(ancestry[i], ancestry, i - 1, options)) {
							return true;
						}
					}
				}
				return false;
			};
		}

		case "attribute":
			return compileAttribute(selector);

		case "class":
			return (node, ancestry, offset, options) => {
				if (options?.matchClass) {
					return options.matchClass(
						selector.name,
						node,
						sliceAncestry(ancestry, offset),
					);
				}

				return esquery.matches(
					node,
					selector,
					sliceAncestry(ancestry, offset),
					options,
				);
			};

		// `:has()`, sibling and adjacent combinators, `:nth-child()`, and anything unknown.
		default:
			return (node, ancestry, offset, options) =>
				esquery.matches(
					node,
					selector,
					sliceAncestry(ancestry, offset),
					options,
				);
	}
}

/**
 * Creates a matcher function for a parsed selector that is equivalent to
 * calling `esquery.matches()` with it, except that it takes the ancestors
 * of the node as a stack with the root at index 0.
 * @param {ESQuerySelector} root The parsed selector to create a matcher for.
 * @returns {Function} A matcher function.
 */
function createFastMatcher(root) {
	const matcher = compileSelector(root);

	return (node, ancestry, options) =>
		matcher(node, ancestry, ancestry.length - 1, options);
}

/**
 * Tries to parse a simple selector string, such as a single identifier or wildcard.
 * This saves time by avoiding the overhead of esquery parsing for simple cases.
 * @param {string} selector The selector string to parse.
 * @returns {Object|null} An object describing the selector if it is simple, or `null` if it is not.
 */
function trySimpleParseSelector(selector) {
	if (selector === "*") {
		return {
			type: "wildcard",
			value: "*",
		};
	}

	if (/^[a-z]+$/iu.test(selector)) {
		return {
			type: "identifier",
			value: selector,
		};
	}

	return null;
}

/**
 * Parses a raw selector string, and throws a useful error if parsing fails.
 * @param {string} selector The selector string to parse.
 * @returns {Object} An object (from esquery) describing the matching behavior of this selector
 * @throws {Error} An error if the selector is invalid
 */
function tryParseSelector(selector) {
	try {
		return esquery.parse(selector);
	} catch (err) {
		if (
			err.location &&
			err.location.start &&
			typeof err.location.start.offset === "number"
		) {
			throw new SyntaxError(
				`Syntax error in selector "${selector}" at position ${err.location.start.offset}: ${err.message}`,
				{
					cause: err,
				},
			);
		}
		throw err;
	}
}

/**
 * Parses a raw selector string, and returns the parsed selector along with specificity and type information.
 * @param {string} source A raw AST selector
 * @returns {ESQueryParsedSelector} A selector descriptor
 */
function parse(source) {
	if (selectorCache.has(source)) {
		return selectorCache.get(source);
	}

	const cleanSource = source.replace(/:exit$/u, "");
	const parsedSelector =
		trySimpleParseSelector(cleanSource) ?? tryParseSelector(cleanSource);
	const { nodeTypes, attributeCount, identifierCount } =
		analyzeParsedSelector(parsedSelector);

	const result = new ESQueryParsedSelector(
		source,
		source.endsWith(":exit"),
		parsedSelector,
		nodeTypes,
		attributeCount,
		identifierCount,
		isAlwaysMatchingSelector(parsedSelector),
		createFastMatcher(parsedSelector),
	);

	selectorCache.set(source, result);
	return result;
}

/**
 * Checks if a node matches a given selector.
 * @param {Object} node The node to check against the selector.
 * @param {ESQuerySelector} root The root of the selector to match against.
 * @param {Object[]} ancestry The ancestry of the node being checked, which is an array of nodes from the current node to the root.
 * @param {ESQueryOptions} options The options to use for matching.
 * @returns {boolean} `true` if the node matches the selector, `false` otherwise.
 */
function matches(node, root, ancestry, options) {
	return esquery.matches(node, root, ancestry, options);
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

module.exports = {
	parse,
	matches,
	ESQueryParsedSelector,
};
