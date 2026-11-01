/** @import { AST, Rule, Scope, SourceCode } from "eslint" */

/** @type {SourceCode} */
const sourceCode = /** @type {any} */ (null);

/** @type {Scope.Scope} */
const scope = /** @type {any} */ (null);

/** @type {Scope.Variable} */
const variable = /** @type {any} */ (null);

/** @type {Scope.Reference} */
const reference = /** @type {any} */ (null);

/** @type {Scope.Definition} */
const definition = /** @type {any} */ (null);

/** @type {AST.Program} */
const program = /** @type {any} */ (null);

export const loc = sourceCode.getLoc(program);
export const comments = sourceCode.getAllComments();
export const ancestors = sourceCode.getAncestors(program);
export const nodeByRangeIndex = sourceCode.getNodeByRangeIndex(0);
export const position = sourceCode.getLocFromIndex(0);
export const tokenOrComment = sourceCode.getTokenByRangeStart(0, {
	includeComments: true,
});
export const firstTokenOrComment = sourceCode.getFirstToken(program, {
	includeComments: true,
});
export const block = scope.block;
export const identifiers = variable.identifiers;
export const identifier = reference.identifier;
export const writeExpr = reference.writeExpr;
export const definitionName = definition.name;
export const definitionNode = definition.node;
export const definitionParent = definition.parent;
export const programComments = program.comments;
export const programBody = program.body;

/** @satisfies {Rule.RuleModule} */
const rule = {
	create(context) {
		return {
			Program(node) {
				context.report({ node, message: "" });
			},
		};
	},
};

export { rule };
