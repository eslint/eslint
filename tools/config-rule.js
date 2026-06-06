/**
 * @fileoverview Create configurations for a rule
 * @author Ian VanSchooten
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const builtInRules = require("../lib/rules");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

/**
 * Maximum number of configs to generate per rule to prevent
 * combinatorial explosion when processing all core rules.
 */
const MAX_CONFIGS_PER_RULE = 50;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Wrap all of the elements of an array into arrays.
 * @param {*[]} xs Any array.
 * @returns {Array[]} An array of arrays.
 */
function explodeArray(xs) {
	return xs.reduce((accumulator, x) => {
		accumulator.push([x]);
		return accumulator;
	}, []);
}

/**
 * Mix two arrays such that each element of the second array is concatenated
 * onto each element of the first array.
 *
 * For example:
 * combineArrays([a, [b, c]], [x, y]); // -> [[a, x], [a, y], [b, c, x], [b, c, y]]
 * @param {Array} arr1 The first array to combine.
 * @param {Array} arr2 The second array to combine.
 * @returns {Array} A mixture of the elements of the first and second arrays.
 */
function combineArrays(arr1, arr2) {
	const res = [];

	if (arr1.length === 0) {
		return explodeArray(arr2);
	}
	if (arr2.length === 0) {
		return explodeArray(arr1);
	}
	for (const x1 of arr1) {
		for (const x2 of arr2) {
			res.push([].concat(x1, x2));
			if (res.length >= MAX_CONFIGS_PER_RULE) {
				return res;
			}
		}
	}
	return res;
}

/**
 * Group together valid rule configurations based on object properties
 *
 * e.g.:
 * groupByProperty([
 *     {before: true},
 *     {before: false},
 *     {after: true},
 *     {after: false}
 * ]);
 *
 * will return:
 * [
 *     [{before: true}, {before: false}],
 *     [{after: true}, {after: false}]
 * ]
 * @param {Object[]} objects Array of objects, each with one property/value pair
 * @returns {Array[]} Array of arrays of objects grouped by property
 */
function groupByProperty(objects) {
	const groupedObj = objects.reduce((accumulator, obj) => {
		const prop = Object.keys(obj)[0];

		accumulator[prop] = accumulator[prop]
			? accumulator[prop].concat(obj)
			: [obj];
		return accumulator;
	}, {});

	return Object.keys(groupedObj).map(prop => groupedObj[prop]);
}

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

/** @typedef {0 | 1 | 2} SeverityLevel */

/**
 * Configuration settings for a rule.
 *
 * A configuration can be a single number (severity), or an array where the first
 * element in the array is the severity, and is the only required element.
 * Configs may also have one or more additional elements to specify rule
 * configuration or options.
 * @typedef {SeverityLevel|[SeverityLevel, ...any[]]} ruleConfig
 */

/**
 * Object whose keys are rule names and values are arrays of valid ruleConfig items
 * which should be linted against the target source code to determine error counts.
 * (a ruleConfigSet.ruleConfigs).
 *
 * e.g. rulesConfig = {
 *     "comma-dangle": [2, [2, "always"], [2, "always-multiline"], [2, "never"]],
 *     "no-console": [2]
 * }
 * @typedef rulesConfig
 */

/**
 * Create valid rule configurations by combining two arrays,
 * with each array containing multiple objects each with a
 * single property/value pair and matching properties.
 *
 * e.g.:
 * combinePropertyObjects(
 *     [{before: true}, {before: false}],
 *     [{after: true}, {after: false}]
 * );
 *
 * will return:
 * [
 *     {before: true, after: true},
 *     {before: true, after: false},
 *     {before: false, after: true},
 *     {before: false, after: false}
 * ]
 * @param {Object[]} objArr1 Single key/value objects, all with the same key
 * @param {Object[]} objArr2 Single key/value objects, all with another key
 * @returns {Object[]} Combined objects for each combination of input properties and values
 */
function combinePropertyObjects(objArr1, objArr2) {
	const res = [];

	if (objArr1.length === 0) {
		return objArr2;
	}
	if (objArr2.length === 0) {
		return objArr1;
	}
	for (const obj1 of objArr1) {
		for (const obj2 of objArr2) {
			const combinedObj = {};

			for (const prop1 of Object.keys(obj1)) {
				combinedObj[prop1] = obj1[prop1];
			}
			for (const prop2 of Object.keys(obj2)) {
				combinedObj[prop2] = obj2[prop2];
			}
			res.push(combinedObj);
			if (res.length >= MAX_CONFIGS_PER_RULE) {
				return res;
			}
		}
	}
	return res;
}

/**
 * Generate rule configurations from a schema object
 * @param {Object} obj Schema item with type === "object"
 * @param {Object} [rootSchema] The root schema object for resolving $ref
 * @param {Function} [valueExtractor] Function to extract values from a property schema
 * @returns {Object[]} Array of rule configurations
 */
function generateObjectConfigs(obj, rootSchema, valueExtractor) {
	const objectConfigSet = {
		objectConfigs: [],
		add(property, values) {
			for (let idx = 0; idx < values.length; idx++) {
				const optionObj = {};

				optionObj[property] = values[idx];
				this.objectConfigs.push(optionObj);
			}
		},

		combine() {
			this.objectConfigs = groupByProperty(this.objectConfigs).reduce(
				(accumulator, objArr) =>
					combinePropertyObjects(accumulator, objArr),
				[],
			);
		},
	};

	/*
	 * The object schema could have multiple independent properties.
	 * If any contain enums or booleans, they can be added and then combined
	 */
	if (obj.properties && valueExtractor) {
		Object.keys(obj.properties).forEach(prop => {
			const values = valueExtractor(obj.properties[prop], rootSchema);

			if (values.length > 0) {
				objectConfigSet.add(prop, values);
			}
		});
	}
	objectConfigSet.combine();

	/*
	 * If the schema has a `not: { required: [...] }` constraint,
	 * filter out configs that contain all of the forbidden properties.
	 */
	if (obj.not && obj.not.required && Array.isArray(obj.not.required)) {
		const forbidden = obj.not.required;

		return objectConfigSet.objectConfigs.filter(
			config => !forbidden.every(prop => Object.hasOwn(config, prop)),
		);
	}

	return objectConfigSet.objectConfigs;
}

/**
 * Extract possible values from a schema object
 * @param {Object} schema A rule's schema object
 * @param {Object} [rootSchema] The root schema object for resolving $ref
 * @returns {any[]} Possible values for the option
 */
function getPossibleValuesFromSchema(schema, rootSchema) {
	if (!schema) {
		return [];
	}

	if (schema.$ref && rootSchema && rootSchema.definitions) {
		const ref = schema.$ref.replace("#/definitions/", "");

		if (rootSchema.definitions[ref]) {
			return getPossibleValuesFromSchema(
				rootSchema.definitions[ref],
				rootSchema,
			);
		}
	}

	if ("const" in schema) {
		return [schema.const];
	}

	if (schema.enum) {
		return schema.enum;
	}

	if (schema.oneOf) {
		return schema.oneOf.flatMap(s =>
			getPossibleValuesFromSchema(s, rootSchema),
		);
	}

	if (schema.anyOf) {
		return schema.anyOf.flatMap(s =>
			getPossibleValuesFromSchema(s, rootSchema),
		);
	}

	switch (schema.type) {
		case "string":
			if (
				schema.pattern ||
				schema.not ||
				schema.minLength ||
				schema.format
			) {
				return [];
			}
			return ["example"];
		case "number": {
			const min = typeof schema.minimum === "number" ? schema.minimum : 0;
			const max =
				typeof schema.maximum === "number" ? schema.maximum : 10;

			return [Math.random() * (max - min) + min];
		}
		case "integer": {
			const min = typeof schema.minimum === "number" ? schema.minimum : 0;
			const max =
				typeof schema.maximum === "number" ? schema.maximum : 10;

			return [Math.floor(Math.random() * (max - min + 1)) + min];
		}
		case "boolean":
			return [true, false];
		case "array": {
			if (schema.items) {
				if (Array.isArray(schema.items)) {
					const itemsValues = schema.items.map(item => {
						const itemValues = getPossibleValuesFromSchema(
							item,
							rootSchema,
						);

						return itemValues.length > 0 ? itemValues[0] : null;
					});

					return [itemsValues];
				}
				const itemValues = getPossibleValuesFromSchema(
					schema.items,
					rootSchema,
				);
				const minItems =
					typeof schema.minItems === "number" ? schema.minItems : 0;

				if (itemValues.length > 0 && itemValues.length >= minItems) {
					return [itemValues.slice(0, Math.max(minItems, 1))];
				}

				// Can't satisfy minItems with available values
				if (minItems > 0 && itemValues.length === 0) {
					return [];
				}
			}
			return [[]];
		}
		case "object":
			return generateObjectConfigs(
				schema,
				rootSchema,
				getPossibleValuesFromSchema,
			);
		case "null":
			return [null];
		default:
			return [];
	}
}

/**
 * Creates a new instance of a rule configuration set
 *
 * A rule configuration set is an array of configurations that are valid for a
 * given rule.  For example, the configuration set for the "semi" rule could be:
 *
 * ruleConfigSet.ruleConfigs // -> [[2], [2, "always"], [2, "never"]]
 *
 * Rule configuration set class
 */
class RuleConfigSet {
	/**
	 * @param {ruleConfig[]} configs Valid rule configurations
	 */
	constructor(configs) {
		/**
		 * Stored valid rule configurations for this instance
		 * @type {Array}
		 */
		this.ruleConfigs = configs || [];
	}

	/**
	 * Add a severity level to the front of all configs in the instance.
	 * This should only be called after all configs have been added to the instance.
	 * @returns {void}
	 */
	addErrorSeverity() {
		const severity = 2;

		this.ruleConfigs = this.ruleConfigs.map(config => {
			config.unshift(severity);
			return config;
		});

		// Add a single config at the beginning consisting of only the severity
		this.ruleConfigs.unshift(severity);
	}

	/**
	 * Add rule configs from an array of possible values for the next option
	 * @param {any[]} options Array of valid rule options
	 * @returns {void}
	 */
	addOptions(options) {
		this.ruleConfigs = this.ruleConfigs.concat(
			combineArrays(this.ruleConfigs, options),
		);
	}
}

/**
 * Generate valid rule configurations based on a schema object
 * @param {Object} schema A rule's schema object
 * @returns {Array[]} Valid rule configurations
 */
function generateConfigsFromSchema(schema) {
	/*
	 * Rules like eqeqeq, curly, func-name-matching, init-declarations,
	 * logical-assignment-operators, and object-shorthand describe alternative
	 * option-array forms via a top-level oneOf/anyOf.
	 * We intentionally treat both oneOf and anyOf as a union, generating
	 * configs that are valid under at least one branch.
	 * Note: MAX_CONFIGS_PER_RULE limits combinations per-branch, so the
	 * total unioned config count across all branches can exceed this limit.
	 */
	if (schema && !Array.isArray(schema)) {
		const alternatives = schema.oneOf || schema.anyOf;

		if (Array.isArray(alternatives)) {
			const configs = alternatives.flatMap(alternative =>
				generateConfigsFromSchema(alternative),
			);

			// De-duplicate: branches commonly overlap on the severity-only config.
			const seen = new Set();

			return configs.filter(config => {
				const key = JSON.stringify(config);

				if (seen.has(key)) {
					return false;
				}
				seen.add(key);
				return true;
			});
		}
	}

	const configSet = new RuleConfigSet();
	let schemas = schema;

	/*
	 * Accept `{ type: "array", items: [...] }` as well as oneOf/anyOf branches
	 * that only carry `items` without `type` (e.g. logical-assignment-operators).
	 */
	if (schema && !Array.isArray(schema) && Array.isArray(schema.items)) {
		schemas = schema.items;
	}

	if (Array.isArray(schemas)) {
		for (const opt of schemas) {
			const values = getPossibleValuesFromSchema(opt, schema);

			if (values.length > 0) {
				configSet.addOptions(values);
			} else {
				// If we don't know how to fill in this option, don't fill in any of the following options.
				break;
			}
		}
	}
	configSet.addErrorSeverity();
	return configSet.ruleConfigs;
}

/**
 * Generate possible rule configurations for all of the core rules
 * @param {boolean} noDeprecated Indicates whether ignores deprecated rules or not.
 * @returns {rulesConfig} Hash of rule names and arrays of possible configurations
 */
function createCoreRuleConfigs(noDeprecated = false) {
	return Array.from(builtInRules).reduce((accumulator, [id, rule]) => {
		const schema = rule.meta.schema;
		const isDeprecated = rule.meta.deprecated;

		if (noDeprecated && isDeprecated) {
			return accumulator;
		}

		accumulator[id] = generateConfigsFromSchema(schema);
		return accumulator;
	}, {});
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
	generateConfigsFromSchema,
	createCoreRuleConfigs,
};
