import type { AST, Scope, SourceCode } from "eslint";

declare const sourceCode: SourceCode;
declare const variable_: Scope.Variable;
declare const reference: Scope.Reference;
declare const definition: Scope.Definition;
declare const program: AST.Program;

export const location = sourceCode.getLoc(null as never);
export const comments = sourceCode.getAllComments();
export const position = sourceCode.getLocFromIndex(0);
export const identifiers = variable_.identifiers;
export const identifier = reference.identifier;
export const definitionName = definition.name;
export const definitionNode = definition.node;
export const definitionParent = definition.parent;
export const programComments = program.comments;
export const programBody = program.body;
