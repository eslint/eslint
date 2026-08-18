---
title: Code Path Analysis Details
---

ESLint rules can analyze control flow using code paths.
A code path represents an execution route through a program.
Control flow forks and merges at control structures such as `if` statements and loops.

```js
if (a && b) {
	foo();
}
bar();
```

:::img-container
![Code Path Example](../assets/images/code-path-analysis/helo.svg)
:::

::: tip
You can view code path diagrams for any JavaScript code using [Code Explorer](https://explorer.eslint.org).
:::

## Objects

A program's control flow is represented by one or more code paths.
A code path graph is composed of two main types of objects: `CodePath` and `CodePathSegment`.

### `CodePath`

A `CodePath` object represents an entire code path graph for a given scope (such as a program, function, class static block, or class field initializer).
It holds references to both the initial segment and final segments of the code path.

`CodePath` has the following properties:

- `id` (`string`) - A unique string identifier. Rules can use `id` to associate custom state with each code path.
- `origin` (`string`) - The reason that the code path was created. May be `"program"`, `"function"`, `"class-field-initializer"`, or `"class-static-block"`.
- `initialSegment` (`CodePathSegment`) - The initial segment at the head of this code path.
- `finalSegments` (`CodePathSegment[]`) - The final terminal segments of the code path, including both returned and thrown segments.
- `returnedSegments` (`CodePathSegment[]`) - The final segments that represent normal completion (return) of the code path.
- `thrownSegments` (`CodePathSegment[]`) - The final segments that represent thrown exceptions or throw-like exits.
- `upper` (`CodePath|null`) - The code path of the enclosing scope.
- `childCodePaths` (`CodePath[]`) - Code paths of functions this code path contains.

`CodePath` has the following methods:

- `traverseSegments(optionsOrCallback, callback)` - Traverses all reachable segments in this code path from the initial segment to the final segments. You can optionally pass an options object with `first` (`CodePathSegment`) and `last` (`CodePathSegment`) properties to limit the traversal. The callback receives a `CodePathSegment` and a controller object, and is called with `this` set to the current `CodePath`. The controller has a `skip()` method to skip the following segments in the current branch and a `break()` method to stop traversal.

### `CodePathSegment`

A `CodePathSegment` represents a single discrete segment within a code path.
A code path consists of multiple `CodePathSegment` objects, forming a directed graph similar to a doubly linked list.
The primary difference from a standard doubly linked list is that code paths support forking and merging, so a segment can have multiple previous segments (`prevSegments`) and multiple next segments (`nextSegments`).

`CodePathSegment` has the following properties:

- `id` (`string`) - A unique string identifier. Rules can use `id` to associate custom state with each segment.
- `nextSegments` (`CodePathSegment[]`) - The next reachable segments. If control flow forks, there are two or more; if final, the array is empty.
- `prevSegments` (`CodePathSegment[]`) - The previous reachable segments. If control flow merges, there are two or more; if initial, the array is empty.
- `allNextSegments` (`CodePathSegment[]`) - The next segments, including both reachable and unreachable segments.
- `allPrevSegments` (`CodePathSegment[]`) - The previous segments, including both reachable and unreachable segments.
- `reachable` (`boolean`) - Indicates whether the segment is reachable during execution. This is `false` for segments following control-transfer statements like `return`, `throw`, `break`, or `continue`.

## Events

There are seven events related to code paths, and you can define event handlers by adding them alongside node visitors in the object returned from the `create()` method of your rule.

::: tip Precalculated Code Paths
In ESLint v9+, code path graphs are precalculated before rule visitors run. This means that when code path events fire, the `CodePath` and `CodePathSegment` objects are already fully constructed and populated. You can safely inspect properties such as `CodePath#childCodePaths`, `CodePath#finalSegments`, `CodePathSegment#nextSegments`, and `CodePathSegment#prevSegments` at any point during AST traversal without waiting for `onCodePathEnd`.
:::

```js
module.exports = {
	meta: {
		// ...
	},
	create(context) {
		return {
			/**
			 * This is called when AST traversal enters a code path (at the start of a program, function, class static block, or field initializer).
			 * The codePath object is precalculated and fully populated with all segments and child code paths.
			 *
			 * @param {CodePath} codePath - The code path entering traversal.
			 * @param {ASTNode} node - The AST node corresponding to the code path.
			 * @returns {void}
			 */
			onCodePathStart(codePath, node) {
				// do something with codePath
			},

			/**
			 * This is called when AST traversal exits a code path.
			 * The codePath object is precalculated and fully populated.
			 *
			 * @param {CodePath} codePath - The code path exiting traversal.
			 * @param {ASTNode} node - The AST node corresponding to the code path.
			 * @returns {void}
			 */
			onCodePathEnd(codePath, node) {
				// do something with codePath
			},

			/**
			 * This is called when AST traversal enters a reachable code path segment.
			 * The segment has its previous and next segments fully populated.
			 *
			 * @param {CodePathSegment} segment - The code path segment entering traversal.
			 * @param {ASTNode} node - The AST node corresponding to the segment.
			 * @returns {void}
			 */
			onCodePathSegmentStart(segment, node) {
				// do something with segment
			},

			/**
			 * This is called when AST traversal exits a reachable code path segment.
			 * The segment has its previous and next segments fully populated.
			 *
			 * @param {CodePathSegment} segment - The code path segment exiting traversal.
			 * @param {ASTNode} node - The AST node corresponding to the segment.
			 * @returns {void}
			 */
			onCodePathSegmentEnd(segment, node) {
				// do something with segment
			},

			/**
			 * This is called when AST traversal enters an unreachable code path segment.
			 * The segment has its previous and next segments fully populated.
			 *
			 * @param {CodePathSegment} segment - The code path segment entering traversal.
			 * @param {ASTNode} node - The AST node corresponding to the segment.
			 * @returns {void}
			 */
			onUnreachableCodePathSegmentStart(segment, node) {
				// do something with segment
			},

			/**
			 * This is called when AST traversal exits an unreachable code path segment.
			 * The segment has its previous and next segments fully populated.
			 *
			 * @param {CodePathSegment} segment - The code path segment exiting traversal.
			 * @param {ASTNode} node - The AST node corresponding to the segment.
			 * @returns {void}
			 */
			onUnreachableCodePathSegmentEnd(segment, node) {
				// do something with segment
			},

			/**
			 * This is called when AST traversal encounters a loop back edge in a code path.
			 * This occurs when control flow loops back from a source segment to a target segment that was already visited.
			 *
			 * @param {CodePathSegment} fromSegment - The source code path segment of the loop.
			 * @param {CodePathSegment} toSegment - The target code path segment of the loop.
			 * @param {ASTNode} node - The AST node corresponding to the loop.
			 * @returns {void}
			 */
			onCodePathSegmentLoop(fromSegment, toSegment, node) {
				// do something with segment
			},
		};
	},
};
```

### About `onCodePathSegmentLoop`

This event is fired when AST traversal encounters a loop back edge—that is, when control flow returns to a previously visited target segment in a loop.

For Example 1:

```js
while (a) {
	a = foo();
}
bar();
```

1. First, AST traversal advances through the loop condition and loop body.

:::img-container
![Loop Event's Example 1](../assets/images/code-path-analysis/loop-event-example-while-1.svg)
:::

2. Next, control flow returns from the end of the loop body back to the loop condition segment.
   Because the target segment has already been visited, `onCodePathSegmentStart` is not fired; instead, `onCodePathSegmentLoop` is fired for this back edge.

:::img-container
![Loop Event's Example 2](../assets/images/code-path-analysis/loop-event-example-while-2.svg)
:::

3. Finally, AST traversal advances past the loop to subsequent code.

:::img-container
![Loop Event's Example 3](../assets/images/code-path-analysis/loop-event-example-while-3.svg)
:::

For Example 2:

```js
for (let i = 0; i < 10; ++i) {
	foo(i);
}
bar();
```

1. `for` statements involve multiple control flow steps.
   First, AST traversal processes the initialization and condition, then encounters the `ForStatement.update` segment, which will be evaluated after each loop iteration.

:::img-container
![Loop Event's Example 1](../assets/images/code-path-analysis/loop-event-example-for-1.svg)
:::

2. Next, AST traversal enters the `ForStatement.body` segment, which follows the `test` segment.

:::img-container
![Loop Event's Example 2](../assets/images/code-path-analysis/loop-event-example-for-2.svg)
:::

3. Third, control flow transitions from the `body` segment to the `update` segment.
   Since the `update` segment was already established, `onCodePathSegmentLoop` is fired for this transition.

:::img-container
![Loop Event's Example 3](../assets/images/code-path-analysis/loop-event-example-for-3.svg)
:::

4. Fourth, control flow transitions from the `update` segment back to the `test` segment.
   Because the `test` segment was already visited, `onCodePathSegmentLoop` is fired for this back edge.

:::img-container
![Loop Event's Example 4](../assets/images/code-path-analysis/loop-event-example-for-4.svg)
:::

5. Finally, AST traversal advances past the loop to subsequent code.

:::img-container
![Loop Event's Example 5](../assets/images/code-path-analysis/loop-event-example-for-5.svg)
:::

## Usage Examples

### Track current segment position

To track the current code path segment position, you can define a rule like this:

```js
module.exports = {
	meta: {
		// ...
	},
	create(context) {
		// tracks the code path we are currently in
		let currentCodePath;

		// tracks the segments we've traversed in the current code path
		let currentSegments;

		// tracks all current segments for all open paths
		const allCurrentSegments = [];

		return {
			onCodePathStart(codePath) {
				currentCodePath = codePath;
				allCurrentSegments.push(currentSegments);
				currentSegments = new Set();
			},

			onCodePathEnd(codePath) {
				currentCodePath = codePath.upper;
				currentSegments = allCurrentSegments.pop();
			},

			onCodePathSegmentStart(segment) {
				currentSegments.add(segment);
			},

			onCodePathSegmentEnd(segment) {
				currentSegments.delete(segment);
			},

			onUnreachableCodePathSegmentStart(segment) {
				currentSegments.add(segment);
			},

			onUnreachableCodePathSegmentEnd(segment) {
				currentSegments.delete(segment);
			},
		};
	},
};
```

In this example, the `currentCodePath` variable is used to access the code path that is currently being traversed and the `currentSegments` variable tracks the segments in that code path that have been traversed to that point. Note that `currentSegments` both starts and ends as an empty set, constantly being updated as the traversal progresses.

Tracking the current segment position is helpful for analyzing the code path that led to a particular node, as in the next example.

### Find an unreachable node

To find an unreachable node, track the current segment position and then use a node visitor to check if any of the segments are reachable. For example, the following looks for any `ExpressionStatement` that is unreachable.

```js
function areAnySegmentsReachable(segments) {
	for (const segment of segments) {
		if (segment.reachable) {
			return true;
		}
	}

	return false;
}

module.exports = {
	meta: {
		// ...
	},
	create(context) {
		// tracks the code path we are currently in
		let currentCodePath;

		// tracks the segments we've traversed in the current code path
		let currentSegments;

		// tracks all current segments for all open paths
		const allCurrentSegments = [];

		return {
			onCodePathStart(codePath) {
				currentCodePath = codePath;
				allCurrentSegments.push(currentSegments);
				currentSegments = new Set();
			},

			onCodePathEnd(codePath) {
				currentCodePath = codePath.upper;
				currentSegments = allCurrentSegments.pop();
			},

			onCodePathSegmentStart(segment) {
				currentSegments.add(segment);
			},

			onCodePathSegmentEnd(segment) {
				currentSegments.delete(segment);
			},

			onUnreachableCodePathSegmentStart(segment) {
				currentSegments.add(segment);
			},

			onUnreachableCodePathSegmentEnd(segment) {
				currentSegments.delete(segment);
			},

			ExpressionStatement(node) {
				// check all the code path segments that led to this node
				if (!areAnySegmentsReachable(currentSegments)) {
					context.report({ message: "Unreachable!", node });
				}
			},
		};
	},
};
```

See Also:
[no-unreachable](https://github.com/eslint/eslint/blob/HEAD/lib/rules/no-unreachable.js),
[no-fallthrough](https://github.com/eslint/eslint/blob/HEAD/lib/rules/no-fallthrough.js),
[consistent-return](https://github.com/eslint/eslint/blob/HEAD/lib/rules/consistent-return.js)

### Check if a function is called in every path

This example checks whether or not the parameter `cb` is called in every path.
Instances of `CodePath` and `CodePathSegment` are shared across all rules.
Rules must never modify these objects directly; use a rule-local state map instead.

```js
function hasCb(node, context) {
	if (node.type.indexOf("Function") !== -1) {
		const sourceCode = context.sourceCode;
		return sourceCode.getDeclaredVariables(node).some(function (v) {
			return v.type === "Parameter" && v.name === "cb";
		});
	}
	return false;
}

function isCbCalled(info) {
	return info.cbCalled;
}

module.exports = {
	meta: {
		// ...
	},
	create(context) {
		let funcInfo;
		const funcInfoStack = [];
		const segmentInfoMap = Object.create(null);

		return {
			// Checks `cb`.
			onCodePathStart(codePath, node) {
				funcInfoStack.push(funcInfo);

				funcInfo = {
					codePath: codePath,
					hasCb: hasCb(node, context),
					currentSegments: new Set(),
				};
			},

			onCodePathEnd(codePath, node) {
				funcInfo = funcInfoStack.pop();

				// Checks whether `cb` was called along every path.
				const cbCalled = codePath.finalSegments.every(
					function (segment) {
						const info = segmentInfoMap[segment.id];
						return info.cbCalled;
					},
				);

				if (!cbCalled) {
					context.report({
						message: "`cb` should be called in every path.",
						node: node,
					});
				}
			},

			// Manages state of code paths and tracks traversed segments
			onCodePathSegmentStart(segment) {
				funcInfo.currentSegments.add(segment);

				// Ignores if `cb` doesn't exist.
				if (!funcInfo.hasCb) {
					return;
				}

				// Initialize state of this path.
				const info = (segmentInfoMap[segment.id] = {
					cbCalled: false,
				});

				// If there are previous segments, merge their states.
				// Checks if `cb` was called in every previous path.
				if (segment.prevSegments.length > 0) {
					info.cbCalled = segment.prevSegments.every(isCbCalled);
				}
			},

			// Tracks unreachable segment traversal
			onUnreachableCodePathSegmentStart(segment) {
				funcInfo.currentSegments.add(segment);
			},

			// Tracks reachable segment traversal
			onCodePathSegmentEnd(segment) {
				funcInfo.currentSegments.delete(segment);
			},

			// Tracks unreachable segment traversal
			onUnreachableCodePathSegmentEnd(segment) {
				funcInfo.currentSegments.delete(segment);
			},

			// Checks reachable or not.
			CallExpression(node) {
				// Ignores if `cb` doesn't exist.
				if (!funcInfo.hasCb) {
					return;
				}

				// Sets marks that `cb` was called.
				const callee = node.callee;
				if (callee.type === "Identifier" && callee.name === "cb") {
					funcInfo.currentSegments.forEach(segment => {
						const info = segmentInfoMap[segment.id];
						info.cbCalled = true;
					});
				}
			},
		};
	},
};
```

See Also:
[constructor-super](https://github.com/eslint/eslint/blob/HEAD/lib/rules/constructor-super.js),
[no-this-before-super](https://github.com/eslint/eslint/blob/HEAD/lib/rules/no-this-before-super.js)

## Code Path Examples

### Hello World

```js
console.log("Hello world!");
```

:::img-container
![Hello World](../assets/images/code-path-analysis/example-hello-world.svg)
:::

### `IfStatement`

```js
if (a) {
	foo();
} else {
	bar();
}
```

:::img-container
![`IfStatement`](../assets/images/code-path-analysis/example-ifstatement.svg)
:::

### `IfStatement` (chain)

```js
if (a) {
	foo();
} else if (b) {
	bar();
} else if (c) {
	hoge();
}
```

:::img-container
![`IfStatement` (chain)](../assets/images/code-path-analysis/example-ifstatement-chain.svg)
:::

### `SwitchStatement`

```js
switch (a) {
	case 0:
		foo();
		break;

	case 1:
	case 2:
		bar();
	// fallthrough

	case 3:
		hoge();
		break;
}
```

:::img-container
![`SwitchStatement`](../assets/images/code-path-analysis/example-switchstatement.svg)
:::

### `SwitchStatement` (has `default`)

```js
switch (a) {
	case 0:
		foo();
		break;

	case 1:
	case 2:
		bar();
	// fallthrough

	case 3:
		hoge();
		break;

	default:
		fuga();
		break;
}
```

:::img-container
![`SwitchStatement` (has `default`)](../assets/images/code-path-analysis/example-switchstatement-has-default.svg)
:::

### `TryStatement` (try-catch)

```js
try {
	foo();
	if (a) {
		throw new Error();
	}
	bar();
} catch (err) {
	hoge(err);
}
last();
```

Paths from the `try` block to the `catch` block exist at:

- `throw` statements.
- The first throwable node (e.g., a function call) in the `try` block.
- The end of the `try` block.

:::img-container
![`TryStatement` (try-catch)](../assets/images/code-path-analysis/example-trystatement-try-catch.svg)
:::

### `TryStatement` (try-finally)

```js
try {
	foo();
	bar();
} finally {
	fuga();
}
last();
```

If there is no `catch` block, the `finally` block has two current segments: one for the normal execution path, and another for leaving paths (`throw` or `return`).

:::img-container
![`TryStatement` (try-finally)](../assets/images/code-path-analysis/example-trystatement-try-finally.svg)
:::

### `TryStatement` (try-catch-finally)

```js
try {
	foo();
	bar();
} catch (err) {
	hoge(err);
} finally {
	fuga();
}
last();
```

:::img-container
![`TryStatement` (try-catch-finally)](../assets/images/code-path-analysis/example-trystatement-try-catch-finally.svg)
:::

### `WhileStatement`

```js
while (a) {
	foo();
	if (b) {
		continue;
	}
	bar();
}
```

:::img-container
![`WhileStatement`](../assets/images/code-path-analysis/example-whilestatement.svg)
:::

### `DoWhileStatement`

```js
do {
	foo();
	bar();
} while (a);
```

:::img-container
![`DoWhileStatement`](../assets/images/code-path-analysis/example-dowhilestatement.svg)
:::

### `ForStatement`

```js
for (let i = 0; i < 10; ++i) {
	foo();
	if (b) {
		break;
	}
	bar();
}
```

:::img-container
![`ForStatement`](../assets/images/code-path-analysis/example-forstatement.svg)
:::

### `ForStatement` (for ever)

```js
for (;;) {
	foo();
}
bar();
```

:::img-container
![`ForStatement` (for ever)](../assets/images/code-path-analysis/example-forstatement-for-ever.svg)
:::

### `ForInStatement`

```js
for (let key in obj) {
	foo(key);
}
```

:::img-container
![`ForInStatement`](../assets/images/code-path-analysis/example-forinstatement.svg)
:::

### When there is a function

```js
function foo(a) {
	if (a) {
		return;
	}
	bar();
}

foo(false);
```

This program contains two code paths:

- The global's

:::img-container
![When there is a function](../assets/images/code-path-analysis/example-when-there-is-a-function-g.svg)
:::

- The function's

:::img-container
![When there is a function](../assets/images/code-path-analysis/example-when-there-is-a-function-f.svg)
:::

### `YieldExpression` in generator functions

```js
function* generator(flag) {
	yield 1;
	if (flag) {
		foo();
	}
	bar();
}
```

In generator functions, a `yield` expression branches into three paths:

- To the next segment.
- To the thrown path.
- To the end of the function.

:::img-container
![`YieldExpression` in generator functions](../assets/images/code-path-analysis/example-yieldExpression-in-generator-functions.svg)
:::
