/**
 * @fileoverview The instance of Ajv validator.
 * @author Evgeny Poberezkin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const Ajv = require("ajv");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Module-level cache mapping original schema objects to their normalized
 * counterparts. Using a WeakMap prevents retaining schemas beyond their
 * natural lifetime, and ensures the same schema object always produces the
 * same (identity-equal) normalized object. This is critical for Ajv v8's
 * internal compile cache, which keys compiled validators by object identity.
 * @type {WeakMap<object, object>}
 */
const normalizedSchemaCache = new WeakMap();

/**
 * Keywords whose values are maps from arbitrary names to subschemas. The keys
 * of these maps are user-defined names and must not be treated as keywords.
 * @type {Set<string>}
 */
const subschemaMapKeywords = new Set([
	"properties",
	"patternProperties",
	"definitions",
	"$defs",
	"dependencies",
]);

/**
 * Keywords whose values are plain data rather than schemas. These are
 * copied as-is.
 * @type {Set<string>}
 */
const dataKeywords = new Set(["enum", "const", "default", "examples"]);

/**
 * Normalizes a JSON schema for compatibility with Ajv v8.
 * Converts draft-04 schema features to their draft-07+ equivalents so that
 * schemas written for older JSON Schema drafts can be compiled by Ajv v8.
 * @param {Object|Array|*} schema The schema to normalize.
 * @param {WeakMap<object, object>} [seen] Already-normalized objects (prevents infinite loops on circular refs and keeps shared subschemas normalized).
 * @returns {Object|Array|*} The normalized schema.
 */
function normalizeSchema(schema, seen = new WeakMap()) {
	if (schema === null || typeof schema !== "object") {
		return schema;
	}
	if (seen.has(schema)) {
		return seen.get(schema);
	}

	if (Array.isArray(schema)) {
		const normalizedArray = [];

		seen.set(schema, normalizedArray);
		for (const item of schema) {
			normalizedArray.push(normalizeSchema(item, seen));
		}
		return normalizedArray;
	}

	const result = {};

	seen.set(schema, result);
	const hasBooleanExclusiveMin = typeof schema.exclusiveMinimum === "boolean";
	const hasBooleanExclusiveMax = typeof schema.exclusiveMaximum === "boolean";

	for (const [key, value] of Object.entries(schema)) {
		if (key === "id" && typeof value === "string" && !("$id" in schema)) {

			// Convert draft-04 `id` to `$id` (required by Ajv v8)
			result.$id = value;
		} else if (key === "$schema") {

			/*
			 * Strip $schema to avoid "no meta-schema" errors: Ajv v8 does not
			 * bundle the draft-04 meta-schema, and looking it up by URI fails.
			 */
		} else if (key === "additionalItems" && !Array.isArray(schema.items)) {

			/*
			 * Remove `additionalItems` unless `items` is a tuple array. In
			 * that context `additionalItems` has no effect (JSON Schema
			 * draft-07 §6.4.4), and Ajv v8 strict mode rejects it.
			 */
		} else if (key === "required" && !Array.isArray(value)) {

			/*
			 * The `required` keyword must be an array per JSON Schema spec.
			 * Ajv v8 unconditionally throws when it encounters a non-array value
			 * (unlike v6, which ignored it when validateSchema was false).
			 * Silently drop it to preserve the lenient v6 behavior.
			 */
		} else if (key === "exclusiveMinimum" && hasBooleanExclusiveMin) {

			// Convert draft-04 boolean exclusiveMinimum to draft-07+ number form
			if (value === true && typeof schema.minimum === "number") {
				result.exclusiveMinimum = schema.minimum;
			}
		} else if (key === "exclusiveMaximum" && hasBooleanExclusiveMax) {

			// Convert draft-04 boolean exclusiveMaximum to draft-07+ number form
			if (value === true && typeof schema.maximum === "number") {
				result.exclusiveMaximum = schema.maximum;
			}
		} else if (
			key === "minimum" &&
			hasBooleanExclusiveMin &&
			schema.exclusiveMinimum === true
		) {

			// minimum is absorbed into exclusiveMinimum above; omit it here
		} else if (
			key === "maximum" &&
			hasBooleanExclusiveMax &&
			schema.exclusiveMaximum === true
		) {

			// maximum is absorbed into exclusiveMaximum above; omit it here
		} else if (dataKeywords.has(key)) {
			result[key] = value;
		} else if (
			subschemaMapKeywords.has(key) &&
			value !== null &&
			typeof value === "object" &&
			!Array.isArray(value)
		) {
			result[key] = {};
			for (const [name, subschema] of Object.entries(value)) {
				result[key][name] = normalizeSchema(subschema, seen);
			}
		} else {
			result[key] = normalizeSchema(value, seen);
		}
	}

	return result;
}

/**
 * Returns the normalized version of a schema. The result is cached by the
 * identity of the input object so that repeated calls with the same schema
 * return the same (identity-equal) normalized object, allowing Ajv's own
 * internal cache to work correctly across multiple compile/validate calls.
 * @param {any} schema The schema to normalize.
 * @returns {any} The normalized schema.
 */
function getCachedNormalized(schema) {
	if (schema === null || typeof schema !== "object") {
		return schema;
	}
	if (!normalizedSchemaCache.has(schema)) {
		normalizedSchemaCache.set(schema, normalizeSchema(schema));
	}
	return normalizedSchemaCache.get(schema);
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = (additionalOptions = {}) => {
	const ajv = new Ajv({
		useDefaults: true,
		validateSchema: false,
		verbose: true,
		strictTuples: false,
		validateFormats: false,
		strictTypes: false,
		...additionalOptions,
	});

	/*
	 * Wrap compile and validateSchema to normalize schemas for Ajv v8
	 * compatibility before passing them to the underlying Ajv instance.
	 */
	const originalCompile = ajv.compile.bind(ajv);
	const originalValidateSchema = ajv.validateSchema.bind(ajv);

	ajv.compile = schema => originalCompile(getCachedNormalized(schema));
	ajv.validateSchema = schema =>
		originalValidateSchema(getCachedNormalized(schema));

	return ajv;
};
