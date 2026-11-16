/**
 * @fileoverview Tests for the selector matcher
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const esquery = require("esquery");
const espree = require("espree");
const vk = require("eslint-visitor-keys");
const jsLanguage = require("../../../lib/languages/js");
const { compileSelector } = require("../../../lib/linter/selector-matcher");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const code = `
import first, { second as third } from "module";

const one = 1, two = "two", nothing = null, pattern = /x/u, big = 10n;
let counter = 0;

function add(a, b = 2, ...rest) {
	if (a) {
		counter++;
		return a + b;
	}
	throw new Error("no");
}

class Child extends Parent {
	static #count = 1;
	method() {
		return new.target;
	}
}

const object = { one, [two]: nothing, method() {}, ...first };
const [head, , tail] = [1, 2, 3];

console.log(object.one.two, add(1)(2), \`template \${one}\`);
first;
third;
for (const key of [1, 2, 3]) {
	key;
}

export default async () => {
	await add();
};
`;

/**
 * The options that the linter passes for JavaScript.
 */
const jsOptions = {
	visitorKeys: vk.KEYS,
	fallback: vk.getKeys,
	matchClass: jsLanguage.matchesSelectorClass,
	nodeTypeKey: "type",
};

/**
 * Collects every node of an AST along with its ancestors.
 * @param {Object} ast The root node.
 * @returns {Array<[Object, Object[]]>} Pairs of a node and its ancestors, starting with its parent.
 */
function collectNodes(ast) {
	const result = [];

	(function visit(node, ancestry) {
		result.push([node, ancestry]);

		const childAncestry = [node, ...ancestry];

		for (const key of vk.KEYS[node.type]) {
			const child = node[key];

			if (Array.isArray(child)) {
				child.filter(Boolean).forEach(element => {
					visit(element, childAncestry);
				});
			} else if (child && typeof child.type === "string") {
				visit(child, childAncestry);
			}
		}
	})(ast, []);

	return result;
}

/**
 * Creates a matcher from the source of a selector.
 * @param {string} source The selector.
 * @returns {Function} The matcher.
 */
function compile(source) {
	return compileSelector(esquery.parse(source));
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("selector-matcher", () => {
	describe("compileSelector()", () => {
		describe("compared with esquery.matches()", () => {
			const ast = espree.parse(code, {
				ecmaVersion: "latest",
				sourceType: "module",
				range: true,
				loc: true,
				tokens: true,
				comment: true,
			});
			const nodes = collectNodes(ast);

			[
				// wildcards and node types
				"*",
				"Identifier",
				"identifier",
				"IDENTIFIER",
				"Program",
				"Unknown",

				// fields
				".body",
				".params",
				".body.body",
				".callee.object",
				".declarations.init",
				".a.b.c.d",
				"*.property",
				"Identifier.params",

				// child and descendant combinators
				"FunctionDeclaration > .params",
				"FunctionDeclaration > *.params",
				"functiondeclaration > .params",
				"FunctionDeclaration > !.params",
				"!FunctionDeclaration > .params",
				"* > .params",
				"CallExpression > .arguments",
				"Program > .body > .body",
				"FunctionDeclaration > Identifier",
				"FunctionDeclaration > .body.body",
				"FunctionDeclaration > [name] .params",
				"FunctionDeclaration > *.params[name]",
				"FunctionDeclaration .params",
				"FunctionDeclaration Identifier",
				"Program BlockStatement > ReturnStatement Identifier",
				"CallExpression CallExpression",
				"* * * *",
				"Program > *",
				"Property > .key",
				"ObjectExpression > Property[computed=false] > .value",
				"MemberExpression[computed=false] > Identifier.property",
				"TemplateLiteral > .quasis",

				// :matches() and :not()
				":matches(Identifier, Literal)",
				":is(FunctionDeclaration, ArrowFunctionExpression) > BlockStatement",
				":not(Identifier)",
				":not(Identifier, Literal)",
				":not([name])",
				"Identifier:not([name='a']):not([name='b'])",

				// attributes
				"Identifier[name]",
				"Identifier[name='a']",
				"Identifier[name=/^[a-c]/]",
				"Identifier[name!=/^[a-c]/i]",
				"Literal[value=1]",
				"Literal[value!=1]",
				"Literal[value=type(number)]",
				"Literal[value!=type(string)]",
				"Literal[value>1]",
				"Literal[value>=1]",
				"Literal[value<2]",
				"Literal[value<=2]",
				"[callee.name='add']",
				"[callee.object.name='console']",
				"[callee.callee.name]",
				"[loc.start.line=4]",
				"[a.b.c.d]",
				"[regex]",
				"[computed=true]",
				"[kind!='const']",
				"[name!='a']",
				"[type='Identifier']",
				"[range.0=1]",
				"[body.length>1]",
				"[value=null]",
				"[value='null']",
				"[value=undefined]",
				"[superClass]",
				"[value=/x/]",
				"[raw!=/1/]",

				// :has()
				":has(Identifier)",
				":has(> Identifier)",
				":has(ReturnStatement, ThrowStatement)",
				"FunctionDeclaration:has(> Identifier.id)",
				":has(+ ExpressionStatement)",
				":has(~ ReturnStatement)",
				"BlockStatement:has(> :first-child)",
				":not(:has(*))",
				":has(CallExpression > .arguments)",
				":has(:has(Literal) > Identifier)",
				"IfStatement:has(ReturnStatement Identifier)",

				// sibling combinators
				"VariableDeclaration ~ VariableDeclaration",
				"VariableDeclaration + VariableDeclaration",
				"!VariableDeclaration ~ ExpressionStatement",
				"VariableDeclaration ~ !ExpressionStatement",
				"!VariableDeclaration + ExpressionStatement",
				"VariableDeclaration + !ExpressionStatement",
				"!VariableDeclaration + !ExpressionStatement",
				"!ExpressionStatement ~ ExpressionStatement",
				"ExpressionStatement + !ExpressionStatement",
				"Identifier + Identifier",
				"Identifier ~ Literal",
				"Literal + Literal",
				"* + *",
				"* ~ *",
				"Program ~ *",
				"Program + *",

				// :nth-child() and friends
				":first-child",
				":last-child",
				":nth-child(2)",
				":nth-last-child(2)",
				":nth-child(0)",
				":nth-child(100)",
				"Identifier:nth-child(3)",
				":nth-child(1):nth-last-child(1)",
				":matches(:first-child, :last-child) Identifier",
				":not(:first-child):not(:last-child)",
				"Program:first-child",

				// classes
				":statement",
				":expression",
				":declaration",
				":function",
				":pattern",
				":function > .params",
				"MetaProperty > :expression",
				"CallExpression > :expression",
				":function :expression",
				":has(:function)",
			].forEach(source => {
				it(`should give the same results for "${source}"`, () => {
					const parsedSelector = esquery.parse(source);
					const matcher = compileSelector(parsedSelector);

					for (const [node, ancestry] of nodes) {
						assert.strictEqual(
							Boolean(matcher(node, ancestry, jsOptions)),
							Boolean(
								esquery.matches(
									node,
									parsedSelector,
									ancestry,
									jsOptions,
								),
							),
							`Mismatch for ${node.type} at ${node.range[0]}`,
						);
					}
				});
			});

			it("should not modify the array of ancestors", () => {
				const matcher = compile(
					"Program :function > BlockStatement :has(Identifier) ~ *",
				);

				for (const [node, ancestry] of nodes) {
					const copy = [...ancestry];

					matcher(node, ancestry, jsOptions);
					assert.deepStrictEqual(ancestry, copy);
				}
			});
		});

		describe("arguments", () => {
			const parent = { type: "Parent", children: [] };
			const node = { type: "Child" };

			parent.children.push(node);

			it("should treat a node as the root when no ancestors are given", () => {
				assert.isTrue(compile("Child")(node));
				assert.isFalse(compile("Parent > Child")(node));
				assert.isFalse(compile("Parent Child")(node));
				assert.isFalse(compile(".children")(node));
				assert.isFalse(compile(":first-child")(node));
				assert.isFalse(compile("* ~ Child")(node));
				assert.isFalse(compile("* + Child")(node));
			});

			it("should work without options", () => {
				assert.isTrue(compile("Parent > Child")(node, [parent]));
				assert.isTrue(compile("Parent > .children")(node, [parent]));
				assert.isTrue(compile(":first-child")(node, [parent]));
				assert.isTrue(compile(":has(Child)")(parent));
			});
		});

		describe("node types", () => {
			it("should compare node types case-insensitively", () => {
				const matcher = compile("fooBar");

				assert.isTrue(matcher({ type: "fooBar" }));
				assert.isTrue(matcher({ type: "FooBar" }));
				assert.isTrue(matcher({ type: "FooBar" }));
				assert.isTrue(matcher({ type: "FOOBAR" }));
				assert.isFalse(matcher({ type: "FooBaz" }));
				assert.isFalse(matcher({ type: "FooBaz" }));
			});

			it("should read the node type from the `nodeTypeKey` option", () => {
				const options = { nodeTypeKey: "kind" };
				const node = { kind: "Foo", type: "Bar" };

				assert.isTrue(compile("Foo")(node, [], options));
				assert.isFalse(compile("Bar")(node, [], options));
			});
		});

		describe("classes", () => {
			it("should not match a class when there is no `matchClass` option", () => {
				const node = { type: "ExpressionStatement" };

				assert.isFalse(Boolean(compile(":statement")(node)));
				assert.isFalse(Boolean(compile(":statement")(node, [], {})));
			});

			it("should pass the class name, the node, and its ancestors to `matchClass`", () => {
				const root = { type: "Root" };
				const parent = { type: "Parent" };
				const node = { type: "Child" };
				const calls = [];
				const options = {
					matchClass(...args) {
						calls.push(args);
						return true;
					},
				};

				assert.isTrue(
					compile(":root > :middle > :leaf")(
						node,
						[parent, root],
						options,
					),
				);

				assert.deepStrictEqual(calls, [
					["leaf", node, [parent, root]],
					["middle", parent, [root]],
					["root", root, []],
				]);
			});
		});

		describe("child nodes", () => {
			/*
			 * `first` and `second` are siblings, and `second` has a child.
			 * `ignored` is only reachable through a property that isn't a
			 * visitor key.
			 */
			const grandchild = { kind: "Grandchild" };
			const first = { kind: "First" };
			const second = { kind: "Second", only: grandchild };
			const ignored = { kind: "Ignored" };
			const root = {
				kind: "Root",
				items: [first, null, "text", second],
				other: [ignored],
			};
			const options = {
				nodeTypeKey: "kind",
				visitorKeys: { Root: ["items"] },
				fallback: node =>
					Object.keys(node).filter(key => key !== "kind"),
			};

			it("should use the `visitorKeys` option to find child nodes", () => {
				assert.isTrue(compile(":has(Second)")(root, [], options));
				assert.isFalse(compile(":has(Ignored)")(root, [], options));
				assert.isTrue(
					compile("First ~ Second")(second, [root], options),
				);
				assert.isTrue(compile(":last-child")(second, [root], options));
				assert.isFalse(
					compile(":first-child")(ignored, [root], options),
				);
			});

			it("should use the `fallback` option for node types without visitor keys", () => {
				assert.isTrue(compile(":has(Grandchild)")(root, [], options));
				assert.isTrue(
					compile(":has(> Grandchild)")(second, [root], options),
				);
				assert.isTrue(
					compile(":first-child")(ignored, [root], {
						...options,
						visitorKeys: {},
					}),
				);
			});

			it("should fall back to the own properties of a node when there are no options for child nodes", () => {
				const tree = {
					type: "Root",
					items: [{ type: "First" }, { type: "Second" }],
				};

				tree.items[0].parent = tree;
				tree.items[1].parent = tree;

				assert.isTrue(compile(":has(Second)")(tree));
				assert.isFalse(compile(":has(Root)")(tree.items[0]));
				assert.isTrue(compile("First + Second")(tree.items[1], [tree]));
			});

			it("should skip siblings that aren't nodes", () => {
				assert.isFalse(compile("* + Second")(second, [root], options));
				assert.isTrue(compile("* ~ Second")(second, [root], options));
				assert.isFalse(compile("!First + *")(first, [root], options));
			});

			it("should match descendants relative to the node that has them", () => {
				const tree = { kind: "Tree", items: [root] };
				const matcher = compile(":has(> First)");
				const treeOptions = {
					...options,
					visitorKeys: { Root: ["items"], Tree: ["items"] },
				};

				assert.isTrue(matcher(root, [tree], treeOptions));
				assert.isFalse(matcher(tree, [], treeOptions));
			});

			it("should not follow a reference to an ancestor", () => {
				const cyclicChild = { type: "Child" };
				const cyclicRoot = {
					type: "Root",
					child: cyclicChild,
					children: [cyclicChild],
				};

				cyclicChild.owner = cyclicRoot;
				cyclicChild.owners = [cyclicRoot];

				const cyclicOptions = { fallback: Object.keys };

				assert.isFalse(
					compile(":has(Missing)")(cyclicRoot, [], cyclicOptions),
				);
				assert.isTrue(
					compile(":has(Child)")(cyclicRoot, [], cyclicOptions),
				);
			});
		});

		describe("attributes", () => {
			it("should stop at a missing value on the way to a nested property", () => {
				const node = {
					type: "Foo",
					a: { b: null },
					c: { d: { e: 1 } },
				};

				assert.isFalse(compile("[a.b.c]")(node));
				assert.isFalse(compile("[a.b.c.d]")(node));
				assert.isFalse(compile("[x.y]")(node));
				assert.isFalse(compile("[x.y.z]")(node));
				assert.isTrue(compile("[c.d.e]")(node));
				assert.isTrue(compile("[c.d]")(node));
				assert.isTrue(compile("[c.d.e=1]")(node));
			});

			it("should compare values that aren't strings as strings", () => {
				const node = {
					type: "Foo",
					number: 1,
					nothing: null,
					text: "1",
				};

				assert.isTrue(compile("[number=1]")(node));
				assert.isTrue(compile("[number='1']")(node));
				assert.isTrue(compile("[text=1]")(node));
				assert.isTrue(compile("[nothing=null]")(node));
				assert.isTrue(compile("[missing=undefined]")(node));
				assert.isFalse(compile("[number!=1]")(node));
				assert.isFalse(compile("[text!='1']")(node));
				assert.isTrue(compile("[text!='2']")(node));
				assert.isTrue(compile("[nothing!='1']")(node));
			});
		});

		describe("invalid selectors", () => {
			it("should throw for an unknown selector type", () => {
				assert.throws(
					() => compileSelector({ type: "bogus" }),
					"Unknown selector type: bogus",
				);
			});

			it("should throw for an unknown operator", () => {
				assert.throws(
					() =>
						compileSelector({
							type: "attribute",
							name: "foo",
							operator: "~=",
							value: { type: "literal", value: "bar" },
						}),
					"Unknown operator: ~=",
				);
			});

			["=", "!="].forEach(operator => {
				it(`should throw for an unknown value type with the "${operator}" operator`, () => {
					assert.throws(
						() =>
							compileSelector({
								type: "attribute",
								name: "foo",
								operator,
								value: { type: "bogus", value: "bar" },
							}),
						"Unknown selector value type: bogus",
					);
				});
			});
		});
	});
});
