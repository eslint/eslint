/**
 * @fileoverview Tests for flatConfigSchema
 * @author Francesco Trotta
 */

"use strict";

const {
	flatConfigSchema,
	withMergeScope,
} = require("../../../lib/config/flat-config-schema");
const { assert } = require("chai");
const { ObjectSchema } = require("@eslint/config-array");
const sinon = require("sinon");
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

describe("withMergeScope", () => {
	const schema = new ObjectSchema(flatConfigSchema);

	/**
	 * Recursively freezes an object.
	 * @param {any} value The value to freeze.
	 * @returns {any} The frozen value.
	 */
	function deepFreeze(value) {
		if (value && typeof value === "object" && !Object.isFrozen(value)) {
			Object.freeze(value);
			Object.values(value).forEach(deepFreeze);
		}
		return value;
	}

	/**
	 * Merges configs the way the installed config array does: pairwise.
	 * @param {Object[]} configs The configs.
	 * @returns {Object} The merged config.
	 */
	function pairwise(configs) {
		return configs.reduce(
			(result, config) => schema.merge(result, config),
			{},
		);
	}

	/**
	 * Merges configs in a single pass.
	 * @param {Object[]} configs The configs.
	 * @returns {Object} The merged config.
	 */
	function singlePass(configs) {
		return schema.merge({}, ...configs);
	}

	const parserA = { parse() {}, meta: { name: "a" } };
	const parserB = { parseForESLint() {}, meta: { name: "b" } };

	/**
	 * Creates fresh, deep-frozen config chains.
	 * @returns {Object[][]} The chains.
	 */
	function createChains() {
		return [
			[
				{ rules: { a: ["error", { x: 1 }], b: "warn", c: 2 } },
				{ rules: { a: "warn", b: ["error", "always"] } },
				{ rules: { a: 0, c: ["off", { y: [1, 2] }] } },
				{ rules: { a: [1], d: "error" } },
			],
			[
				{ rules: { a: ["error", { x: 1 }, "z"] } },
				{ rules: { a: ["warn", { x: 2 }] } },
				{ rules: JSON.parse('{"__proto__": "error", "b": 1}') },
				{ rules: { b: 2 } },
			],
			[
				{
					languageOptions: {
						globals: { foo: "readonly", bar: "writable" },
						parserOptions: { ecmaFeatures: { jsx: true }, x: 1 },
						sourceType: "module",
						parser: parserA,
					},
				},
				{
					languageOptions: {
						globals: { baz: "off" },
						parserOptions: { ecmaFeatures: { globalReturn: true } },
						parser: parserB,
						list: [1, 2],
					},
				},
				{
					languageOptions: {
						sourceType: void 0,
						extra: void 0,
						list: [3],
						parserOptions: null,
					},
				},
				{
					languageOptions: {
						parserOptions: { y: 2 },
						ecmaVersion: 2020,
					},
				},
			],
		].map(chain => chain.map(deepFreeze));
	}

	for (const [name, run] of [
		["pairwise", pairwise],
		["single pass", singlePass],
	]) {
		describe(`${name} merge`, () => {
			it("matches the result outside a scope", () => {
				const expected = createChains().map(run);
				const actual = withMergeScope(() => createChains().map(run));

				assert.deepStrictEqual(actual, expected);
				assert.strictEqual(actual[2].languageOptions.parser, parserB);
			});

			it("does not share rule options or nested languageOptions objects with inputs", () => {
				const chains = createChains();
				const results = withMergeScope(() => chains.map(run));
				const inputs = new Set();

				for (const config of chains.flat()) {
					for (const value of Object.values(config.rules ?? {})) {
						inputs.add(value);
					}
					for (const value of Object.values(
						config.languageOptions ?? {},
					)) {
						inputs.add(value);
					}
					inputs.add(config.rules);
					inputs.add(config.languageOptions);
				}

				for (const result of results) {
					for (const value of Object.values(result.rules ?? {})) {
						assert.isFalse(inputs.has(value));
					}
					for (const [key, value] of Object.entries(
						result.languageOptions ?? {},
					)) {
						if (
							key !== "parser" &&
							value &&
							typeof value === "object" &&
							!Array.isArray(value)
						) {
							assert.isFalse(inputs.has(value), key);
						}
					}
				}
			});

			it("wraps rule errors the same way", () => {
				const chain = [
					{ rules: { a: "error" } },
					{ rules: { b: ["error", Math.max] } },
				];
				let expected;
				let actual;

				try {
					run(chain);
				} catch (error) {
					expected = error;
				}
				try {
					withMergeScope(() => run(chain));
				} catch (error) {
					actual = error;
				}

				assert.strictEqual(actual.message, expected.message);
				assert.match(actual.message, /Key "rules": Key "b": /u);
				assert.strictEqual(
					actual.cause.message,
					expected.cause.message,
				);
				assert.strictEqual(
					actual.cause.cause.constructor,
					expected.cause.cause.constructor,
				);
			});
		});
	}

	it("does not read the nested properties of a replaced parser", () => {
		let reads = 0;
		const options = new Proxy(
			{ nested: true },
			{
				get(target, key) {
					reads++;
					return target[key];
				},
				ownKeys(target) {
					reads++;
					return Reflect.ownKeys(target);
				},
			},
		);
		const chain = [
			{ languageOptions: { parser: { parse() {}, options } } },
			{ languageOptions: { parser: parserB } },
			{ languageOptions: { ecmaVersion: 2020 } },
		];

		const result = withMergeScope(() => pairwise(chain));

		assert.strictEqual(result.languageOptions.parser, parserB);
		assert.strictEqual(reads, 0);
	});

	it("does not trust earlier results outside a scope", () => {
		const { merge } = flatConfigSchema.rules;
		const owned = withMergeScope(() =>
			merge({ a: ["error", { x: 1 }] }, { b: "warn" }),
		);

		owned.a = "warn";
		const result = merge(owned, { c: 1 });

		assert.notStrictEqual(result, owned);
		assert.deepStrictEqual(result, {
			a: [1],
			b: [1],
			c: [1],
		});

		const languageOptions = withMergeScope(() =>
			flatConfigSchema.languageOptions.merge(
				{ globals: { a: "off" } },
				{ ecmaVersion: 6 },
			),
		);
		const copy = flatConfigSchema.languageOptions.merge(languageOptions, {
			sourceType: "module",
		});

		assert.notStrictEqual(copy.globals, languageOptions.globals);
	});

	it("keeps an explicit undefined for an inherited name", () => {
		const result = withMergeScope(() =>
			pairwise([
				{ languageOptions: { ecmaVersion: 6 } },
				{ languageOptions: { toString: void 0 } },
			]),
		);

		assert.isTrue(Object.hasOwn(result.languageOptions, "toString"));
		assert.isUndefined(result.languageOptions.toString);
	});

	it("clones each rule once when every config adds a rule", () => {
		const count = 40;
		const chain = Array.from({ length: count }, (_, index) => ({
			rules: { [`rule-${index}`]: ["error", { index }] },
		}));

		const clone = sinon.spy(globalThis, "structuredClone");

		try {
			withMergeScope(() => pairwise(chain));
		} finally {
			clone.restore();
		}

		assert.strictEqual(clone.callCount, count);
	});

	it("restores the previous scope after a nested scope", () => {
		const { merge } = flatConfigSchema.rules;

		withMergeScope(() => {
			const owned = merge(void 0, { a: "error" });

			withMergeScope(() => {});
			assert.strictEqual(merge(void 0, owned), owned);
		});
	});
});
