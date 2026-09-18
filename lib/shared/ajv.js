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
 * Normalizes a JSON schema for compatibility with Ajv v8.
 * Converts draft-04 schema features to their draft-07+ equivalents so that
 * schemas written for older JSON Schema drafts can be compiled by Ajv v8.
 * @param {Object|Array|*} schema The schema to normalize.
 * @param {WeakSet} [seen] Set of already-seen objects (prevents infinite loops on circular refs).
 * @returns {Object|Array|*} The normalized schema.
 */
function normalizeSchema(schema, seen = new WeakSet()) {
	if (schema === null || typeof schema !== "object") {
		return schema;
	}
	if (seen.has(schema)) {
		return schema;
	}
	seen.add(schema);

	if (Array.isArray(schema)) {
		return schema.map(item => normalizeSchema(item, seen));
	}

	const result = {};
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
		} else if (
			key === "additionalItems" &&
			schema.items &&
			!Array.isArray(schema.items)
		) {

			/*
			 * Remove `additionalItems` when `items` is a single schema (not a
			 * tuple array). In that context `additionalItems` has no effect
			 * (JSON Schema draft-07 §6.4.4), and Ajv v8 strict mode rejects it.
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
 * @param {*} schema The schema to normalize.
 * @returns {*} The normalized schema.
 */
function getCachedNormalized(schema) {
	if (schema === null || typeof schema !== "object") {
		return schema;
	}
	let cached = normalizedSchemaCache.get(schema);

	if (cached === undefined) {
		cached = normalizeSchema(schema);
		normalizedSchemaCache.set(schema, cached);
	}
	return cached;
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
