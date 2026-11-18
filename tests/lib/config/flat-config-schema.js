/**
 * @fileoverview Tests for flatConfigSchema
 * @author Francesco Trotta
 */

"use strict";

const {
	flatConfigSchema,
	runInMergeScope,
} = require("../../../lib/config/flat-config-schema");
const { assert } = require("chai");
const { ObjectSchema } = require("@eslint/config-array");
const {
	Legacy: { ConfigArray },
} = require("@eslint/eslintrc");

/**
 * This function checks the result of merging two values in eslintrc config.
 * It uses deep strict equality to compare the actual and the expected results.
 * This is useful to ensure that the flat config merge logic behaves similarly to the old logic.
 * When eslintrc is removed, this function and its invocations can be also removed.
 * @param {Object} [first] The base object.
 * @param {Object} [second] The overrides object.
 * @param {Object} [expectedResult] The expected results of merging first and second values.
 * @returns {void}
 */
function confirmLegacyMergeResult(first, second, expectedResult) {
	const configArray = new ConfigArray(
		{ settings: first },
		{ settings: second },
	);
	const config = configArray.extractConfig("/file");
	const actualResult = config.settings;

	assert.deepStrictEqual(actualResult, expectedResult);
}

const schema = new ObjectSchema(flatConfigSchema);

/**
 * Merges config objects one at a time, as `ConfigArray#getConfig()` does.
 * @param {Object[]} configs The config objects to merge.
 * @returns {Object} The merged config object.
 */
function mergeConfigs(configs) {
	return configs.reduce((result, config) => schema.merge(result, config), {});
}

describe("merge", () => {
	const { merge } = flatConfigSchema.settings;

	it("merges two objects", () => {
		const first = { foo: 42 };
		const second = { bar: "baz" };
		const result = merge(first, second);

		assert.deepStrictEqual(result, { ...first, ...second });
		confirmLegacyMergeResult(first, second, result);
	});

	it("returns an empty object if both values are undefined", () => {
		const result = merge(void 0, void 0);

		assert.deepStrictEqual(result, {});
		confirmLegacyMergeResult(void 0, void 0, result);
	});

	it("returns an object equal to the first one if the second one is undefined", () => {
		const first = { foo: 42, bar: "baz" };
		const result = merge(first, void 0);

		assert.deepStrictEqual(result, first);
		assert.notStrictEqual(result, first);
		confirmLegacyMergeResult(first, void 0, result);
	});

	it("returns an object equal to the second one if the first one is undefined", () => {
		const second = { foo: 42, bar: "baz" };
		const result = merge(void 0, second);

		assert.deepStrictEqual(result, second);
		assert.notStrictEqual(result, second);
		confirmLegacyMergeResult(void 0, second, result);
	});

	it("does not preserve the type of merged objects", () => {
		const first = new Set(["foo", "bar"]);
		const second = new Set(["baz"]);
		const result = merge(first, second);

		assert.deepStrictEqual(result, {});
		confirmLegacyMergeResult(first, second, result);
	});

	it("merges two objects in a property", () => {
		const first = { foo: { bar: "baz" } };
		const second = { foo: { qux: 42 } };
		const result = merge(first, second);

		assert.deepStrictEqual(result, { foo: { bar: "baz", qux: 42 } });
		confirmLegacyMergeResult(first, second, result);
	});

	it("overwrites an object in a property with an array", () => {
		const first = { someProperty: { 1: "foo", bar: "baz" } };
		const second = { someProperty: ["qux"] };
		const result = merge(first, second);

		assert.deepStrictEqual(result, second);
		assert.strictEqual(result.someProperty, second.someProperty);
	});

	it("overwrites an array in a property with another array", () => {
		const first = { someProperty: ["foo", "bar", void 0, "baz"] };
		const second = { someProperty: ["qux", void 0, 42] };
		const result = merge(first, second);

		assert.deepStrictEqual(result, second);
		assert.strictEqual(result.someProperty, second.someProperty);
	});

	it("overwrites an array in a property with an object", () => {
		const first = { foo: ["foobar"] };
		const second = { foo: { 1: "qux", bar: "baz" } };
		const result = merge(first, second);

		assert.deepStrictEqual(result, second);
		assert.strictEqual(result.foo, second.foo);
	});

	it("does not override a value in a property with undefined", () => {
		const first = { foo: { bar: "baz" } };
		const second = { foo: void 0 };
		const result = merge(first, second);

		assert.deepStrictEqual(result, first);
		assert.notStrictEqual(result, first);
		confirmLegacyMergeResult(first, second, result);
	});

	it("does not change the prototype of a merged object", () => {
		const first = { foo: 42 };
		const second = { bar: "baz", ["__proto__"]: { qux: true } };
		const result = merge(first, second);

		assert.strictEqual(Object.getPrototypeOf(result), Object.prototype);
		confirmLegacyMergeResult(first, second, result);
	});

	it("does not merge the '__proto__' property", () => {
		const first = { ["__proto__"]: { foo: 42 } };
		const second = { ["__proto__"]: { bar: "baz" } };
		const result = merge(first, second);

		assert.deepStrictEqual(result, {});
		confirmLegacyMergeResult(first, second, result);
	});

	it("overrides a value in a property with null", () => {
		const first = { foo: { bar: "baz" } };
		const second = { foo: null };
		const result = merge(first, second);

		assert.deepStrictEqual(result, second);
		assert.notStrictEqual(result, second);
		confirmLegacyMergeResult(first, second, result);
	});

	it("overrides a value in a property with a non-nullish primitive", () => {
		const first = { foo: { bar: "baz" } };
		const second = { foo: 42 };
		const result = merge(first, second);

		assert.deepStrictEqual(result, second);
		assert.notStrictEqual(result, second);
		confirmLegacyMergeResult(first, second, result);
	});

	it("overrides an object in a property with a string", () => {
		const first = { foo: { bar: "baz" } };
		const second = { foo: "qux" };
		const result = merge(first, second);

		assert.deepStrictEqual(result, second);
		assert.notStrictEqual(result, first);
		confirmLegacyMergeResult(first, second, result);
	});

	it("overrides a value in a property with a function", () => {
		const first = { someProperty: { foo: 42 } };
		const second = { someProperty() {} };
		const result = merge(first, second);

		assert.deepStrictEqual(result, second);
		assert.notProperty(result.someProperty, "foo");
		confirmLegacyMergeResult(first, second, result);
	});

	it("overrides a function in a property with an object", () => {
		const first = { someProperty: Object.assign(() => {}, { foo: "bar" }) };
		const second = { someProperty: { baz: "qux" } };
		const result = merge(first, second);

		assert.deepStrictEqual(result, second);
		assert.notProperty(result.someProperty, "foo");
		confirmLegacyMergeResult(first, second, result);
	});

	it("sets properties to undefined", () => {
		const first = { foo: void 0, bar: void 0 };
		const second = { foo: void 0, baz: void 0 };
		const result = merge(first, second);

		assert.deepStrictEqual(result, {
			foo: void 0,
			bar: void 0,
			baz: void 0,
		});
	});

	it("considers only own enumerable properties", () => {
		const first = {
			__proto__: { inherited1: "A" }, // non-own properties are not considered
			included1: "B",
			notMerged1: { first: true },
		};
		const second = {
			__proto__: { inherited2: "C" }, // non-own properties are not considered
			included2: "D",
			notMerged2: { second: true },
		};

		// non-enumerable properties are not considered
		Object.defineProperty(first, "notMerged2", {
			enumerable: false,
			value: { first: true },
		});
		Object.defineProperty(second, "notMerged1", {
			enumerable: false,
			value: { second: true },
		});

		const result = merge(first, second);

		assert.deepStrictEqual(result, {
			included1: "B",
			included2: "D",
			notMerged1: { first: true },
			notMerged2: { second: true },
		});
		confirmLegacyMergeResult(first, second, result);
	});

	it("merges objects with self-references", () => {
		const first = { foo: 42 };

		first.first = first;
		const second = { bar: "baz" };

		second.second = second;
		const result = merge(first, second);

		assert.strictEqual(result.first, first);
		assert.deepStrictEqual(result.second, second);

		const expected = { foo: 42, bar: "baz" };

		expected.first = first;
		expected.second = second;
		assert.deepStrictEqual(result, expected);
	});

	it("merges objects with overlapping self-references", () => {
		const first = { foo: 42 };

		first.reference = first;
		const second = { bar: "baz" };

		second.reference = second;

		const result = merge(first, second);

		assert.strictEqual(result.reference, result);

		const expected = { foo: 42, bar: "baz" };

		expected.reference = expected;
		assert.deepStrictEqual(result, expected);
	});

	it("merges objects with cross-references", () => {
		const first = { foo: 42 };
		const second = { bar: "baz" };

		first.second = second;
		second.first = first;

		const result = merge(first, second);

		assert.deepStrictEqual(result.first, first);
		assert.strictEqual(result.second, second);

		const expected = { foo: 42, bar: "baz" };

		expected.first = first;
		expected.second = second;
		assert.deepStrictEqual(result, expected);
	});

	it("merges objects with overlapping cross-references", () => {
		const first = { foo: 42 };
		const second = { bar: "baz" };

		first.reference = second;
		second.reference = first;

		const result = merge(first, second);

		assert.strictEqual(result, result.reference.reference);

		const expected = {
			foo: 42,
			bar: "baz",
			reference: { foo: 42, bar: "baz" },
		};

		expected.reference.reference = expected;
		assert.deepStrictEqual(result, expected);
	});

	it("produces the same results for the same combinations of property values", () => {
		const firstCommon = { foo: 42 };
		const secondCommon = { bar: "baz" };
		const first = {
			a: firstCommon,
			b: firstCommon,
			c: { foo: "different" },
			d: firstCommon,
		};
		const second = {
			a: secondCommon,
			b: { bar: "something else" },
			c: secondCommon,
			d: secondCommon,
		};
		const result = merge(first, second);

		assert.deepStrictEqual(result.a, result.d);

		const expected = {
			a: { foo: 42, bar: "baz" },
			b: { foo: 42, bar: "something else" },
			c: { foo: "different", bar: "baz" },
			d: { foo: 42, bar: "baz" },
		};

		assert.deepStrictEqual(result, expected);
	});
});

describe("runInMergeScope", () => {
	it("merges rules the same as without a merge scope", () => {
		const configs = [
			{ rules: { foo: ["error", { bar: 1 }], baz: "warn" } },
			{ rules: { foo: "warn", baz: ["error", "always"] } },
			{ rules: { foo: [1], qux: "error" } },
			{ rules: { [Symbol.for("foo")]: "error" } },
			{ rules: { ["__proto__"]: "error", baz: 0 } },
		];

		assert.deepStrictEqual(
			runInMergeScope(() => mergeConfigs(configs)),
			mergeConfigs(configs),
		);
	});

	it("merges languageOptions the same as without a merge scope", () => {
		const parser = { parse() {} };
		const stubParser = { parseForESLint() {} };
		const configs = [
			{
				languageOptions: {
					globals: { foo: "readonly" },
					parserOptions: { ecmaFeatures: { jsx: true } },
					sourceType: "module",
					parser,
					foo: { bar() {}, baz: 1 },
				},
			},
			{
				languageOptions: {
					globals: { bar: "off" },
					parserOptions: { ecmaFeatures: { globalReturn: true } },
					parser: stubParser,
					qux: [1, 2],
				},
			},
			{
				languageOptions: {
					sourceType: void 0,
					toString: void 0,
					qux: [3],
					parserOptions: null,
					foo: { baz: 2 },
				},
			},
			{ languageOptions: { [Symbol.for("foo")]: 1 } },
			{
				languageOptions: {
					parserOptions: { foo: true },
					ecmaVersion: 2020,
				},
			},
		];
		const result = runInMergeScope(() => mergeConfigs(configs));

		assert.deepStrictEqual(result, mergeConfigs(configs));
		assert.strictEqual(result.languageOptions.parser, stubParser);
	});

	it("does not reuse rule options or nested languageOptions objects from the merged configs", () => {
		const ruleOptions = { bar: true };
		const globals = { foo: "readonly" };
		const configs = [
			{ rules: { foo: "error" }, languageOptions: { ecmaVersion: 2020 } },
			{
				rules: { bar: ["warn", ruleOptions] },
				languageOptions: { globals },
			},
			{
				rules: { baz: "error" },
				languageOptions: { sourceType: "module" },
			},
		];
		const result = runInMergeScope(() => mergeConfigs(configs));

		assert.notStrictEqual(result.rules.bar, configs[1].rules.bar);
		assert.notStrictEqual(result.rules.bar[1], ruleOptions);
		assert.notStrictEqual(result.languageOptions.globals, globals);
	});

	it("keeps symbol keys of the first rules object if the second one is a merge result", () => {
		const { merge } = flatConfigSchema.rules;
		const key = Symbol.for("foo");
		const result = runInMergeScope(() =>
			merge({ [key]: "error" }, merge(void 0, { foo: "warn" })),
		);

		assert.strictEqual(result[key], "error");
	});

	it("keeps symbol keys of the first languageOptions object if the second one is a merge result", () => {
		const { merge } = flatConfigSchema.languageOptions;
		const key = Symbol.for("foo");
		const result = runInMergeScope(() =>
			merge({ [key]: 1 }, merge(void 0, { sourceType: "module" })),
		);

		assert.strictEqual(result[key], 1);
	});

	it("normalizes merge results again after the merge scope ends", () => {
		const { merge } = flatConfigSchema.rules;
		const rules = runInMergeScope(() =>
			merge({ foo: ["error", { bar: 1 }] }, { baz: "warn" }),
		);

		rules.foo = "warn";

		assert.deepStrictEqual(merge(rules, { qux: 1 }), {
			foo: [1],
			baz: [1],
			qux: [1],
		});
	});

	it("does not merge the properties of a replaced parser", () => {
		const parser = {
			parse() {},
			meta: {
				get name() {
					return assert.fail(
						"Expected the replaced parser not to be merged",
					);
				},
			},
		};
		const stubParser = { parse() {}, meta: { name: "stub" } };
		const result = runInMergeScope(() =>
			mergeConfigs([
				{ languageOptions: { ecmaVersion: 2020 } },
				{ languageOptions: { parser } },
				{ languageOptions: { parser: stubParser } },
			]),
		);

		assert.strictEqual(result.languageOptions.parser, stubParser);
	});
});
