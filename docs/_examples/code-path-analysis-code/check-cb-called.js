/**
 * @fileoverview Example rule from the Code Path Analysis documentation that
 * checks whether the `cb` parameter is called in every code path.
 */

function getCbParameter(codePath, node, context) {
	if (codePath.origin !== "function") {
		return null;
	}

	return (
		context.sourceCode
			.getDeclaredVariables(node)
			.find(
				variable =>
					variable.name === "cb" &&
					variable.defs.some(def => def.type === "Parameter"),
			) ?? null
	);
}

function hasPathWithoutCall(codePath, segmentsWithCall) {
	const visited = new Set();
	const stack = [codePath.initialSegment];

	while (stack.length > 0) {
		const segment = stack.pop();

		if (visited.has(segment) || segmentsWithCall.has(segment)) {
			continue;
		}
		visited.add(segment);

		if (codePath.finalSegments.includes(segment)) {
			return true;
		}

		stack.push(...segment.nextSegments);
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

		return {
			onCodePathStart(codePath, node) {
				codePathInfoStack.push(codePathInfo);

				codePathInfo = {
					cbVariable: getCbParameter(codePath, node, context),
					currentSegments: new Set(),
					segmentsWithCall: new Set(),
				};
			},

			onCodePathEnd(codePath, node) {
				const { cbVariable, segmentsWithCall } = codePathInfo;

				codePathInfo = codePathInfoStack.pop();

				if (!cbVariable) {
					return;
				}

				if (hasPathWithoutCall(codePath, segmentsWithCall)) {
					context.report({
						message: "`cb` should be called in every path.",
						node,
					});
				}
			},

			onCodePathSegmentStart(segment) {
				codePathInfo.currentSegments.add(segment);
			},

			onCodePathSegmentEnd(segment) {
				codePathInfo.currentSegments.delete(segment);
			},

			CallExpression(node) {
				const { cbVariable } = codePathInfo;

				if (
					cbVariable?.references.some(
						reference => reference.identifier === node.callee,
					)
				) {
					for (const segment of codePathInfo.currentSegments) {
						codePathInfo.segmentsWithCall.add(segment);
					}
				}
			},
		};
	},
};
