/**
 * @fileoverview Example rule from the Code Path Analysis documentation that
 * checks whether the `cb` parameter is called in every code path.
 */

function hasCb(node, context) {
	if (node.type.includes("Function")) {
		return context.sourceCode
			.getDeclaredVariables(node)
			.some(v =>
				v.defs.some(d => d.type === "Parameter" && v.name === "cb"),
			);
	}
	return false;
}

export default {
	meta: {
		// ...
	},
	create(context) {
		let codePathInfo = null;
		const codePathInfoStack = [];
		const segmentInfoMap = new Map();

		// Checks whether `cb` was called in every one of the given segments.
		function isCalledInEveryPath(segment) {
			return segmentInfoMap.get(segment.id).cbCalled;
		}

		// Checks whether a segment has already been visited.
		function hasBeenSeen(segment) {
			return segmentInfoMap.has(segment.id);
		}

		return {
			// Checks `cb`.
			onCodePathStart(codePath, node) {
				codePathInfoStack.push(codePathInfo);

				codePathInfo = {
					codePath,
					hasCb: hasCb(node, context),
					currentSegments: new Set(),
				};
			},

			onCodePathEnd(codePath, node) {
				const endedCodePathInfo = codePathInfo;
				codePathInfo = codePathInfoStack.pop();

				// Ignores if `cb` doesn't exist on the path that just ended.
				if (!endedCodePathInfo.hasCb) {
					return;
				}

				// Checks `cb` was called in every path.
				const cbCalled =
					codePath.finalSegments.every(isCalledInEveryPath);

				if (!cbCalled) {
					context.report({
						message: "`cb` should be called in every path.",
						node,
					});
				}
			},

			// Manages state of code paths and tracks traversed segments
			onCodePathSegmentStart(segment) {
				codePathInfo.currentSegments.add(segment);

				// Ignores if `cb` doesn't exist.
				if (!codePathInfo.hasCb) {
					return;
				}

				// Initialize state of this path.
				const info = { cbCalled: false };
				segmentInfoMap.set(segment.id, info);

				/*
				 * If there are previous segments that have already been
				 * visited, merge their state. A previous segment may not
				 * have been visited yet if it's a loop-back edge (e.g. the
				 * end of a loop body looping back to the loop's test); those
				 * are reconciled later in `onCodePathSegmentLoop`.
				 * Checks `cb` was called in every previous path.
				 */
				const seenPrevSegments =
					segment.prevSegments.filter(hasBeenSeen);
				if (seenPrevSegments.length > 0) {
					info.cbCalled = seenPrevSegments.every(isCalledInEveryPath);
				}
			},

			// Tracks unreachable segment traversal
			onUnreachableCodePathSegmentStart(segment) {
				codePathInfo.currentSegments.add(segment);
			},

			// Tracks reachable segment traversal
			onCodePathSegmentEnd(segment) {
				codePathInfo.currentSegments.delete(segment);
			},

			// Tracks unreachable segment traversal
			onUnreachableCodePathSegmentEnd(segment) {
				codePathInfo.currentSegments.delete(segment);
			},

			/*
			 * Re-checks segments between the head and the end of a loop,
			 * now that the loop-back edge makes their previous segments
			 * fully known.
			 */
			onCodePathSegmentLoop(fromSegment, toSegment) {
				if (!codePathInfo.hasCb) {
					return;
				}

				codePathInfo.codePath.traverseSegments(
					{ first: toSegment, last: fromSegment },
					(segment, controller) => {
						const info = segmentInfoMap.get(segment.id);

						// Skips segments after the loop; not visited yet.
						if (!info) {
							controller.skip();
							return;
						}

						const seenPrevSegments =
							segment.prevSegments.filter(hasBeenSeen);

						info.cbCalled ||=
							seenPrevSegments.length > 0 &&
							seenPrevSegments.every(isCalledInEveryPath);
					},
				);
			},

			// Checks whether the call is reachable.
			CallExpression(node) {
				// Ignores if `cb` doesn't exist.
				if (!codePathInfo.hasCb) {
					return;
				}

				// Marks that `cb` was called.
				const callee = node.callee;
				if (callee.type === "Identifier" && callee.name === "cb") {
					codePathInfo.currentSegments.forEach(segment => {
						const info = segmentInfoMap.get(segment.id);
						info.cbCalled = true;
					});
				}
			},
		};
	},
};
