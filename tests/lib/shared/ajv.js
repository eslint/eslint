/**
 * @fileoverview Tests for the shared Ajv factory and its schema normalization.
 * @author ESLint contributors
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const createAjv = require("../../../lib/shared/ajv");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Compiles a schema and validates data against it.
 * @param {Object|boolean} schema The schema.
 * @param {any} data The data.
 * @param {Object} [options] Ajv options.
 * @returns {boolean} Whether the data is valid.
 */
function isValid(schema, data, options) {
	return createAjv(options).compile(schema)(data);
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ajv", () => {
	describe("basic validation", () => {
		it("validates types", () => {
			const schema = { type: "array", items: { type: "string" } };

			assert.isTrue(isValid(schema, ["a"]));
			assert.isFalse(isValid(schema, [1]));
		});

		it("supports boolean schemas", () => {
			assert.isTrue(isValid(true, 1));
			assert.isFalse(isValid(false, 1));
		});

		it("supports tuple schemas with additionalItems", () => {
			const schema = {
				type: "array",
				items: [{ type: "string" }, { type: "number" }],
				additionalItems: false,
			};

			assert.isTrue(isValid(schema, ["a", 1]));
			assert.isFalse(isValid(schema, ["a", 1, 2]));
		});

		it("supports tuple schemas without minItems/maxItems", () => {
			const schema = { type: "array", items: [{ type: "string" }] };

			assert.isTrue(isValid(schema, []));
			assert.isTrue(isValid(schema, ["a", 1]));
		});

		it("supports enum, pattern, and anyOf/oneOf", () => {
			assert.isTrue(isValid({ enum: ["a", "b"] }, "a"));
			assert.isFalse(isValid({ enum: ["a", "b"] }, "c"));
			assert.isTrue(isValid({ type: "string", pattern: "^a" }, "ab"));
			assert.isFalse(isValid({ type: "string", pattern: "^a" }, "ba"));
			assert.isTrue(
				isValid({ anyOf: [{ type: "string" }, { type: "number" }] }, 1),
			);
			assert.isFalse(
				isValid({ oneOf: [{ type: "string" }, { type: "number" }] }, []),
			);
		});

		it("supports patternProperties and additionalProperties", () => {
			const schema = {
				type: "object",
				patternProperties: { "^x": { type: "number" } },
				additionalProperties: false,
			};

			assert.isTrue(isValid(schema, { x1: 1 }));
			assert.isFalse(isValid(schema, { x1: "a" }));
			assert.isFalse(isValid(schema, { y: 1 }));
		});

		it("supports local $ref via definitions", () => {
			const schema = {
				definitions: { str: { type: "string" } },
				type: "array",
				items: { $ref: "#/definitions/str" },
			};

			assert.isTrue(isValid(schema, ["a"]));
			assert.isFalse(isValid(schema, [1]));
		});

		it("supports `dependencies`", () => {
			const schema = {
				type: "object",
				dependencies: { a: ["b"] },
			};

			assert.isTrue(isValid(schema, { a: 1, b: 2 }));
			assert.isFalse(isValid(schema, { a: 1 }));
		});

		it("supports minItems/maxItems/uniqueItems and min/max", () => {
			const schema = {
				type: "array",
				items: { type: "integer", minimum: 0, maximum: 5 },
				minItems: 1,
				maxItems: 2,
				uniqueItems: true,
			};

			assert.isTrue(isValid(schema, [1, 2]));
			assert.isFalse(isValid(schema, []));
			assert.isFalse(isValid(schema, [1, 2, 3]));
			assert.isFalse(isValid(schema, [1, 1]));
			assert.isFalse(isValid(schema, [6]));
		});
	});

	describe("defaults", () => {
		it("applies `default` values to missing properties", () => {
			const validate = createAjv().compile({
				type: "object",
				properties: { a: { type: "number", default: 5 } },
			});
			const data = {};

			assert.isTrue(validate(data));
			assert.deepStrictEqual(data, { a: 5 });
		});

		it("applies defaults to nested objects", () => {
			const validate = createAjv().compile({
				type: "array",
				items: [
					{
						type: "object",
						properties: { a: { type: "boolean", default: true } },
					},
				],
			});
			const data = [{}];

			assert.isTrue(validate(data));
			assert.deepStrictEqual(data, [{ a: true }]);
		});
	});

	describe("draft-04 compatibility", () => {
		it("accepts `id` instead of `$id`", () => {
			assert.isTrue(isValid({ id: "foo", type: "string" }, "a"));
			assert.isFalse(isValid({ id: "foo", type: "string" }, 1));
		});

		it("accepts a draft-04 `$schema`", () => {
			const schema = {
				$schema: "http://json-schema.org/draft-04/schema#",
				type: "string",
			};

			assert.isTrue(isValid(schema, "a"));
			assert.isFalse(isValid(schema, 1));
		});

		it("accepts a draft-04 `$schema` and `id` together", () => {
			const schema = {
				$schema: "http://json-schema.org/draft-04/schema#",
				id: "http://example.com/schema.json",
				type: "object",
				properties: { a: { type: "string" } },
			};

			assert.isTrue(isValid(schema, { a: "x" }));
			assert.isFalse(isValid(schema, { a: 1 }));
		});

		it("does not treat a property named `id` as an identifier", () => {
			const schema = {
				type: "object",
				properties: { id: { type: "number" } },
			};

			assert.isTrue(isValid(schema, { id: 1 }));
			assert.isFalse(isValid(schema, { id: "a" }));
		});

		it("accepts `additionalItems` when `items` is a single schema", () => {
			const schema = {
				type: "array",
				items: { type: "string" },
				additionalItems: false,
			};

			assert.isTrue(isValid(schema, ["a", "b"]));
			assert.isFalse(isValid(schema, ["a", 1]));
		});

		it("accepts `additionalItems` without `items`", () => {
			assert.isTrue(
				isValid({ type: "array", additionalItems: false }, [1]),
			);
		});

		it("supports boolean `exclusiveMinimum`", () => {
			const exclusive = {
				type: "number",
				minimum: 5,
				exclusiveMinimum: true,
			};
			const inclusive = {
				type: "number",
				minimum: 5,
				exclusiveMinimum: false,
			};

			assert.isFalse(isValid(exclusive, 5));
			assert.isTrue(isValid(exclusive, 6));
			assert.isFalse(isValid(exclusive, 4));
			assert.isTrue(isValid(inclusive, 5));
			assert.isFalse(isValid(inclusive, 4));
		});

		it("supports boolean `exclusiveMaximum`", () => {
			const exclusive = {
				type: "number",
				maximum: 5,
				exclusiveMaximum: true,
			};
			const inclusive = {
				type: "number",
				maximum: 5,
				exclusiveMaximum: false,
			};

			assert.isFalse(isValid(exclusive, 5));
			assert.isTrue(isValid(exclusive, 4));
			assert.isFalse(isValid(exclusive, 6));
			assert.isTrue(isValid(inclusive, 5));
			assert.isFalse(isValid(inclusive, 6));
		});

		it("supports boolean exclusive bounds in nested schemas", () => {
			const schema = {
				type: "array",
				items: { type: "number", minimum: 0, exclusiveMinimum: true },
			};

			assert.isFalse(isValid(schema, [0]));
			assert.isTrue(isValid(schema, [1]));
		});

		it("supports numeric `exclusiveMinimum`/`exclusiveMaximum`", () => {
			const schema = {
				type: "number",
				exclusiveMinimum: 0,
				exclusiveMaximum: 10,
			};

			assert.isFalse(isValid(schema, 0));
			assert.isTrue(isValid(schema, 5));
			assert.isFalse(isValid(schema, 10));
		});

		it("ignores a non-array `required`", () => {
			const schema = {
				type: "object",
				properties: { a: { type: "string" } },
				required: true,
			};

			assert.isTrue(isValid(schema, {}));
			assert.isTrue(isValid(schema, { a: "x" }));
			assert.isFalse(isValid(schema, { a: 1 }));
		});

		it("ignores a non-array `required` in nested schemas", () => {
			const schema = {
				type: "array",
				items: { type: "object", required: "a" },
			};

			assert.isTrue(isValid(schema, [{}]));
		});

		it("still enforces an array `required`", () => {
			const schema = { type: "object", required: ["a"] };

			assert.isTrue(isValid(schema, { a: 1 }));
			assert.isFalse(isValid(schema, {}));
		});

		it("does not treat a property named `required` as the keyword", () => {
			const schema = {
				type: "object",
				properties: { required: { type: "boolean" } },
			};

			assert.isTrue(isValid(schema, { required: true }));
			assert.isFalse(isValid(schema, { required: "x" }));
		});
	});

	describe("leniency", () => {
		it("ignores unknown formats", () => {
			assert.isTrue(isValid({ type: "string", format: "custom" }, "a"));
		});

		it("ignores unknown keywords with `strictSchema: false`", () => {
			const schema = { type: "array", prefixItems: [{ type: "string" }] };

			assert.isTrue(isValid(schema, [1], { strictSchema: false }));
		});

		it("ignores unknown `$ref`-free custom keywords with `strictSchema: false`", () => {
			const schema = { type: "array", elements: { type: "string" } };

			assert.isTrue(isValid(schema, [1], { strictSchema: false }));
		});

		it("rejects unknown keywords by default", () => {
			assert.throws(
				() => isValid({ type: "array", elements: {} }, []),
				/unknown keyword/u,
			);
		});

		it("does not throw for `type` unions with keywords of other types", () => {
			const schema = { type: ["string", "number"], minLength: 2 };

			assert.isTrue(isValid(schema, "ab"));
			assert.isTrue(isValid(schema, 1));
			assert.isFalse(isValid(schema, "a"));
		});
	});

	describe("normalization", () => {
		it("does not mutate the original schema", () => {
			const schema = {
				$schema: "http://json-schema.org/draft-04/schema#",
				id: "x",
				type: "object",
				required: true,
				properties: {
					n: { type: "number", minimum: 1, exclusiveMinimum: true },
				},
			};
			const copy = JSON.parse(JSON.stringify(schema));

			createAjv().compile(schema);
			assert.deepStrictEqual(schema, copy);
		});

		it("compiles the same schema object repeatedly with the same instance", () => {
			const ajv = createAjv();
			const schema = {
				type: "object",
				properties: { a: { type: "string" } },
			};

			assert.strictEqual(ajv.compile(schema), ajv.compile(schema));
		});

		it("can compile the same draft-04 schema with the same instance repeatedly", () => {
			const ajv = createAjv();
			const schema = { id: "same-id", type: "string" };

			// Compiling twice must not throw an "id already exists" error.
			ajv.compile(schema);
			ajv.compile(schema);
		});

		it("normalizes a subschema object that is referenced more than once", () => {
			const shared = { type: "number", minimum: 1, exclusiveMinimum: true };
			const schema = {
				type: "object",
				properties: { a: shared, b: shared },
			};

			assert.isFalse(isValid(schema, { a: 1 }));
			assert.isFalse(isValid(schema, { b: 1 }));
			assert.isTrue(isValid(schema, { a: 2, b: 2 }));
		});

		it("validateSchema returns normalized results and sets errors", () => {
			const ajv = createAjv();

			assert.isTrue(ajv.validateSchema({ id: "x", type: "string" }));
			assert.isFalse(ajv.validateSchema({ type: "foo" }));
			assert.isArray(ajv.errors);
		});

		it("validateSchema accepts boolean exclusive bounds", () => {
			assert.isTrue(
				createAjv().validateSchema({
					type: "number",
					minimum: 1,
					exclusiveMinimum: true,
				}),
			);
		});
	});

	describe("error reporting", () => {
		it("reports `instancePath`, `keyword`, and `message`", () => {
			const validate = createAjv().compile({
				type: "array",
				items: { type: "string" },
			});

			assert.isFalse(validate([1]));
			assert.strictEqual(validate.errors[0].keyword, "type");
			assert.strictEqual(validate.errors[0].instancePath, "/0");
			assert.strictEqual(validate.errors[0].message, "must be string");
		});

		it("includes `schema` and `data` with `verbose: true`", () => {
			const validate = createAjv().compile({ type: "string" });

			assert.isFalse(validate(1));
			assert.strictEqual(validate.errors[0].data, 1);
			assert.strictEqual(validate.errors[0].schema, "string");
		});

		it("reports all errors for `additionalProperties: false`", () => {
			const validate = createAjv().compile({
				type: "object",
				additionalProperties: false,
			});

			assert.isFalse(validate({ foo: 1 }));
			assert.strictEqual(
				validate.errors[0].params.additionalProperty,
				"foo",
			);
		});
	});
});
