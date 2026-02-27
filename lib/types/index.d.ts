/**
 * @fileoverview This file contains the core types for ESLint. It was initially extracted
 * from the `@types/eslint` package.
 */

/*
 * MIT License
 * Copyright (c) Microsoft Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE
 */

import * as ESTree from "estree";
import type {
	DeprecatedInfo,
	LanguageOptions as GenericLanguageOptions,
	RuleContext as CoreRuleContext,
	RuleDefinition,
	SourceRange,
	TextSourceCode,
	TraversalStep,
	RulesConfig,
	GlobalAccess,
	GlobalsConfig,
	LinterOptionsConfig,
	EnvironmentConfig,
	ObjectMetaProperties as CoreObjectMetaProperties,
	Plugin as CorePlugin,
	LintMessage as CoreLintMessage,
	Processor as CoreProcessor,
	ConfigObject,
	LegacyConfigObject,
	SeverityName,
	SeverityLevel,
	Severity as CoreSeverity,
	EcmaVersion as CoreEcmaVersion,
	ConfigOverride as CoreConfigOverride,
	ProcessorFile as CoreProcessorFile,
	RulesMeta,
	RuleConfig,
	RuleTextEditor,
	RuleTextEdit,
	RuleVisitor,
	BaseConfig as CoreBaseConfig,
	RuleFixer as CoreRuleFixer,
	ViolationReportBase,
	ViolationMessage,
	ViolationLocation,
	SuggestionMessage,
	LintSuggestion as CoreLintSuggestion,
	JavaScriptSourceType,
	HasRules as CoreHasRules,
	SuggestedEditBase,
	SuggestedEdit,
	ViolationReport,
	MessagePlaceholderData,
} from "@eslint/core";
import type {
	CustomRuleDefinitionType,
	CustomRuleTypeDefinitions,
	CustomRuleVisitorWithExit,
} from "@eslint/plugin-kit";

//------------------------------------------------------------------------------
// ESLint-specific aliases for ESTree types
// https://github.com/eslint/eslint/issues/19418#issuecomment-3908393337
//------------------------------------------------------------------------------

export type ESTreePosition = ESTree.Position;
export type ESTreeSourceLocation = ESTree.SourceLocation;
export type ESTreeBaseNode = ESTree.BaseNode;
export type ESTreeNode = ESTree.Node;
export type ESTreeProgram = ESTree.Program;
export type ESTreeComment = ESTree.Comment;
export type ESTreeIdentifier = ESTree.Identifier;
export type ESTreeExpression = ESTree.Expression;
export type ESTreeCatchClause = ESTree.CatchClause;
export type ESTreeClassDeclaration = ESTree.ClassDeclaration;
export type ESTreeClassExpression = ESTree.ClassExpression;
export type ESTreeFunctionDeclaration = ESTree.FunctionDeclaration;
export type ESTreeFunctionExpression = ESTree.FunctionExpression;
export type ESTreeArrowFunctionExpression = ESTree.ArrowFunctionExpression;
export type ESTreeAssignmentExpression = ESTree.AssignmentExpression;
export type ESTreeForInStatement = ESTree.ForInStatement;
export type ESTreeForOfStatement = ESTree.ForOfStatement;
export type ESTreeImportDeclaration = ESTree.ImportDeclaration;
export type ESTreeImportSpecifier = ESTree.ImportSpecifier;
export type ESTreeImportDefaultSpecifier = ESTree.ImportDefaultSpecifier;
export type ESTreeImportNamespaceSpecifier = ESTree.ImportNamespaceSpecifier;
export type ESTreeVariableDeclaration = ESTree.VariableDeclaration;
export type ESTreeVariableDeclarator = ESTree.VariableDeclarator;

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

export namespace AST {
	type TokenType =
		| "Boolean"
		| "Null"
		| "Identifier"
		| "PrivateIdentifier"
		| "Keyword"
		| "Punctuator"
		| "JSXIdentifier"
		| "JSXText"
		| "Numeric"
		| "String"
		| "Template"
		| "RegularExpression";

	interface Token {
		type: TokenType;
		value: string;
		range: Range;
		loc: SourceLocation;
	}

	interface SourceLocation {
		start: ESTreePosition;
		end: ESTreePosition;
	}

	type Range = SourceRange;

	interface Program extends ESTreeProgram {
		comments: ESTreeComment[];
		tokens: Token[];
		loc: SourceLocation;
		range: Range;
	}
}

interface JSXIdentifier extends ESTreeBaseNode {
	type: "JSXIdentifier";
	name: string;
}

export namespace Scope {
	interface ScopeManager {
		scopes: Scope[];
		globalScope: Scope | null;

		acquire(node: ESTreeNode, inner?: boolean): Scope | null;

		getDeclaredVariables(node: ESTreeNode): Variable[];

		addGlobals(names: ReadonlyArray<string>): void;
	}

	interface Scope {
		type:
			| "block"
			| "catch"
			| "class"
			| "class-field-initializer"
			| "class-static-block"
			| "for"
			| "function"
			| "function-expression-name"
			| "global"
			| "module"
			| "switch"
			| "with";
		isStrict: boolean;
		upper: Scope | null;
		childScopes: Scope[];
		variableScope: Scope;
		block: ESTreeNode;
		variables: Variable[];
		set: Map<string, Variable>;
		references: Reference[];
		through: Reference[];
		functionExpressionScope: boolean;
		implicit?: {
			variables: Variable[];
			set: Map<string, Variable>;
		};
	}

	interface Variable {
		name: string;
		scope: Scope;
		identifiers: ESTreeIdentifier[];
		references: Reference[];
		defs: Definition[];
	}

	interface Reference {
		identifier: ESTreeIdentifier | JSXIdentifier;
		from: Scope;
		resolved: Variable | null;
		writeExpr?: ESTreeExpression | null;
		init?: boolean;

		isWrite(): boolean;

		isRead(): boolean;

		isWriteOnly(): boolean;

		isReadOnly(): boolean;

		isReadWrite(): boolean;
	}

	type DefinitionType =
		| { type: "CatchClause"; node: ESTreeCatchClause; parent: null }
		| {
				type: "ClassName";
				node: ESTreeClassDeclaration | ESTreeClassExpression;
				parent: null;
		  }
		| {
				type: "FunctionName";
				node: ESTreeFunctionDeclaration | ESTreeFunctionExpression;
				parent: null;
		  }
		| {
				type: "ImplicitGlobalVariable";
				node:
					| ESTreeAssignmentExpression
					| ESTreeForInStatement
					| ESTreeForOfStatement;
				parent: null;
		  }
		| {
				type: "ImportBinding";
				node:
					| ESTreeImportSpecifier
					| ESTreeImportDefaultSpecifier
					| ESTreeImportNamespaceSpecifier;
				parent: ESTreeImportDeclaration;
		  }
		| {
				type: "Parameter";
				node:
					| ESTreeFunctionDeclaration
					| ESTreeFunctionExpression
					| ESTreeArrowFunctionExpression;
				parent: null;
		  }
		| {
				type: "Variable";
				node: ESTreeVariableDeclarator;
				parent: ESTreeVariableDeclaration;
		  };

	type Definition = DefinitionType & { name: ESTreeIdentifier };
}

// #region SourceCode

export class SourceCode
	implements
		TextSourceCode<{
			LangOptions: Linter.LanguageOptions;
			RootNode: AST.Program;
			SyntaxElementWithLoc: AST.Token | ESTreeNode;
			ConfigNode: ESTreeComment;
		}>
{
	text: string;
	ast: AST.Program;
	lines: string[];
	hasBOM: boolean;
	parserServices: SourceCode.ParserServices;
	scopeManager: Scope.ScopeManager;
	visitorKeys: SourceCode.VisitorKeys;

	constructor(text: string, ast: AST.Program);
	constructor(config: SourceCode.Config);

	static splitLines(text: string): string[];

	getLoc(syntaxElement: AST.Token | ESTreeNode): ESTreeSourceLocation;
	getRange(syntaxElement: AST.Token | ESTreeNode): SourceRange;

	getText(
		node?: ESTreeNode,
		beforeCount?: number,
		afterCount?: number,
	): string;

	getLines(): string[];

	getAllComments(): ESTreeComment[];

	getAncestors(node: ESTreeNode): ESTreeNode[];

	getDeclaredVariables(node: ESTreeNode): Scope.Variable[];

	getNodeByRangeIndex(index: number): ESTreeNode | null;

	getLocFromIndex(index: number): ESTreePosition;

	getIndexFromLoc(location: ESTreePosition): number;

	// Inherited methods from TokenStore
	// ---------------------------------

	getTokenByRangeStart(
		offset: number,
		options?: { includeComments: false },
	): AST.Token | null;
	getTokenByRangeStart(
		offset: number,
		options: { includeComments: boolean },
	): AST.Token | ESTreeComment | null;

	getFirstToken: SourceCode.UnaryNodeCursorWithSkipOptions;

	getFirstTokens: SourceCode.UnaryNodeCursorWithCountOptions;

	getLastToken: SourceCode.UnaryNodeCursorWithSkipOptions;

	getLastTokens: SourceCode.UnaryNodeCursorWithCountOptions;

	getTokenBefore: SourceCode.UnaryCursorWithSkipOptions;

	getTokensBefore: SourceCode.UnaryCursorWithCountOptions;

	getTokenAfter: SourceCode.UnaryCursorWithSkipOptions;

	getTokensAfter: SourceCode.UnaryCursorWithCountOptions;

	getFirstTokenBetween: SourceCode.BinaryCursorWithSkipOptions;

	getFirstTokensBetween: SourceCode.BinaryCursorWithCountOptions;

	getLastTokenBetween: SourceCode.BinaryCursorWithSkipOptions;

	getLastTokensBetween: SourceCode.BinaryCursorWithCountOptions;

	getTokensBetween: SourceCode.BinaryCursorWithCountOptions;

	getTokens: ((
		node: ESTreeNode,
		beforeCount?: number,
		afterCount?: number,
	) => AST.Token[]) &
		SourceCode.UnaryNodeCursorWithCountOptions;

	commentsExistBetween(
		left: ESTreeNode | AST.Token | ESTreeComment,
		right: ESTreeNode | AST.Token | ESTreeComment,
	): boolean;

	getCommentsBefore(nodeOrToken: ESTreeNode | AST.Token): ESTreeComment[];

	getCommentsAfter(nodeOrToken: ESTreeNode | AST.Token): ESTreeComment[];

	getCommentsInside(node: ESTreeNode): ESTreeComment[];

	getScope(node: ESTreeNode): Scope.Scope;

	isSpaceBetween(
		first: ESTreeNode | AST.Token,
		second: ESTreeNode | AST.Token,
	): boolean;

	isGlobalReference(node: ESTreeIdentifier): boolean;

	markVariableAsUsed(name: string, refNode?: ESTreeNode): boolean;

	traverse(): Iterable<TraversalStep>;
}

export namespace SourceCode {
	interface Config {
		text: string;
		ast: AST.Program;
		hasBOM?: boolean | undefined;
		parserServices?: ParserServices | null | undefined;
		scopeManager?: Scope.ScopeManager | null | undefined;
		visitorKeys?: VisitorKeys | null | undefined;
	}

	type ParserServices = any;

	interface VisitorKeys {
		[nodeType: string]: string[];
	}

	interface UnaryNodeCursorWithSkipOptions {
		<T extends AST.Token>(
			node: ESTreeNode,
			options:
				| ((token: AST.Token) => token is T)
				| {
						filter: (token: AST.Token) => token is T;
						includeComments?: false | undefined;
						skip?: number | undefined;
				  },
		): T | null;
		<T extends AST.Token | ESTreeComment>(
			node: ESTreeNode,
			options: {
				filter: (
					tokenOrComment: AST.Token | ESTreeComment,
				) => tokenOrComment is T;
				includeComments: boolean;
				skip?: number | undefined;
			},
		): T | null;
		(
			node: ESTreeNode,
			options?:
				| {
						filter?: ((token: AST.Token) => boolean) | undefined;
						includeComments?: false | undefined;
						skip?: number | undefined;
				  }
				| ((token: AST.Token) => boolean)
				| number,
		): AST.Token | null;
		(
			node: ESTreeNode,
			options: {
				filter?:
					| ((token: AST.Token | ESTreeComment) => boolean)
					| undefined;
				includeComments: boolean;
				skip?: number | undefined;
			},
		): AST.Token | ESTreeComment | null;
	}

	interface UnaryNodeCursorWithCountOptions {
		<T extends AST.Token>(
			node: ESTreeNode,
			options:
				| ((token: AST.Token) => token is T)
				| {
						filter: (token: AST.Token) => token is T;
						includeComments?: false | undefined;
						count?: number | undefined;
				  },
		): T[];
		<T extends AST.Token | ESTreeComment>(
			node: ESTreeNode,
			options: {
				filter: (
					tokenOrComment: AST.Token | ESTreeComment,
				) => tokenOrComment is T;
				includeComments: boolean;
				count?: number | undefined;
			},
		): T[];
		(
			node: ESTreeNode,
			options?:
				| {
						filter?: ((token: AST.Token) => boolean) | undefined;
						includeComments?: false | undefined;
						count?: number | undefined;
				  }
				| ((token: AST.Token) => boolean)
				| number,
		): AST.Token[];
		(
			node: ESTreeNode,
			options: {
				filter?:
					| ((token: AST.Token | ESTreeComment) => boolean)
					| undefined;
				includeComments: boolean;
				count?: number | undefined;
			},
		): Array<AST.Token | ESTreeComment>;
	}

	interface UnaryCursorWithSkipOptions {
		<T extends AST.Token>(
			node: ESTreeNode | AST.Token | ESTreeComment,
			options:
				| ((token: AST.Token) => token is T)
				| {
						filter: (token: AST.Token) => token is T;
						includeComments?: false | undefined;
						skip?: number | undefined;
				  },
		): T | null;
		<T extends AST.Token | ESTreeComment>(
			node: ESTreeNode | AST.Token | ESTreeComment,
			options: {
				filter: (
					tokenOrComment: AST.Token | ESTreeComment,
				) => tokenOrComment is T;
				includeComments: boolean;
				skip?: number | undefined;
			},
		): T | null;
		(
			node: ESTreeNode | AST.Token | ESTreeComment,
			options?:
				| {
						filter?: ((token: AST.Token) => boolean) | undefined;
						includeComments?: false | undefined;
						skip?: number | undefined;
				  }
				| ((token: AST.Token) => boolean)
				| number,
		): AST.Token | null;
		(
			node: ESTreeNode | AST.Token | ESTreeComment,
			options: {
				filter?:
					| ((token: AST.Token | ESTreeComment) => boolean)
					| undefined;
				includeComments: boolean;
				skip?: number | undefined;
			},
		): AST.Token | ESTreeComment | null;
	}

	interface UnaryCursorWithCountOptions {
		<T extends AST.Token>(
			node: ESTreeNode | AST.Token | ESTreeComment,
			options:
				| ((token: AST.Token) => token is T)
				| {
						filter: (token: AST.Token) => token is T;
						includeComments?: false | undefined;
						count?: number | undefined;
				  },
		): T[];
		<T extends AST.Token | ESTreeComment>(
			node: ESTreeNode | AST.Token | ESTreeComment,
			options: {
				filter: (
					tokenOrComment: AST.Token | ESTreeComment,
				) => tokenOrComment is T;
				includeComments: boolean;
				count?: number | undefined;
			},
		): T[];
		(
			node: ESTreeNode | AST.Token | ESTreeComment,
			options?:
				| {
						filter?: ((token: AST.Token) => boolean) | undefined;
						includeComments?: false | undefined;
						count?: number | undefined;
				  }
				| ((token: AST.Token) => boolean)
				| number,
		): AST.Token[];
		(
			node: ESTreeNode | AST.Token | ESTreeComment,
			options: {
				filter?:
					| ((token: AST.Token | ESTreeComment) => boolean)
					| undefined;
				includeComments: boolean;
				count?: number | undefined;
			},
		): Array<AST.Token | ESTreeComment>;
	}

	interface BinaryCursorWithSkipOptions {
		<T extends AST.Token>(
			left: ESTreeNode | AST.Token | ESTreeComment,
			right: ESTreeNode | AST.Token | ESTreeComment,
			options:
				| ((token: AST.Token) => token is T)
				| {
						filter: (token: AST.Token) => token is T;
						includeComments?: false | undefined;
						skip?: number | undefined;
				  },
		): T | null;
		<T extends AST.Token | ESTreeComment>(
			left: ESTreeNode | AST.Token | ESTreeComment,
			right: ESTreeNode | AST.Token | ESTreeComment,
			options: {
				filter: (
					tokenOrComment: AST.Token | ESTreeComment,
				) => tokenOrComment is T;
				includeComments: boolean;
				skip?: number | undefined;
			},
		): T | null;
		(
			left: ESTreeNode | AST.Token | ESTreeComment,
			right: ESTreeNode | AST.Token | ESTreeComment,
			options?:
				| {
						filter?: ((token: AST.Token) => boolean) | undefined;
						includeComments?: false | undefined;
						skip?: number | undefined;
				  }
				| ((token: AST.Token) => boolean)
				| number,
		): AST.Token | null;
		(
			left: ESTreeNode | AST.Token | ESTreeComment,
			right: ESTreeNode | AST.Token | ESTreeComment,
			options: {
				filter?:
					| ((token: AST.Token | ESTreeComment) => boolean)
					| undefined;
				includeComments: boolean;
				skip?: number | undefined;
			},
		): AST.Token | ESTreeComment | null;
	}

	interface BinaryCursorWithCountOptions {
		<T extends AST.Token>(
			left: ESTreeNode | AST.Token | ESTreeComment,
			right: ESTreeNode | AST.Token | ESTreeComment,
			options:
				| ((token: AST.Token) => token is T)
				| {
						filter: (token: AST.Token) => token is T;
						includeComments?: false | undefined;
						count?: number | undefined;
				  },
		): T[];
		<T extends AST.Token | ESTreeComment>(
			left: ESTreeNode | AST.Token | ESTreeComment,
			right: ESTreeNode | AST.Token | ESTreeComment,
			options: {
				filter: (
					tokenOrComment: AST.Token | ESTreeComment,
				) => tokenOrComment is T;
				includeComments: boolean;
				count?: number | undefined;
			},
		): T[];
		(
			left: ESTreeNode | AST.Token | ESTreeComment,
			right: ESTreeNode | AST.Token | ESTreeComment,
			options?:
				| {
						filter?: ((token: AST.Token) => boolean) | undefined;
						includeComments?: false | undefined;
						count?: number | undefined;
				  }
				| ((token: AST.Token) => boolean)
				| number,
		): AST.Token[];
		(
			left: ESTreeNode | AST.Token | ESTreeComment,
			right: ESTreeNode | AST.Token | ESTreeComment,
			options: {
				filter?:
					| ((token: AST.Token | ESTreeComment) => boolean)
					| undefined;
				includeComments: boolean;
				count?: number | undefined;
			},
		): Array<AST.Token | ESTreeComment>;
	}
}

// #endregion

export type JSSyntaxElement = {
	type: string;
	loc?: ESTreeSourceLocation | null | undefined;
};

export namespace Rule {
	interface RuleModule
		extends RuleDefinition<{
			LangOptions: Linter.LanguageOptions;
			Code: SourceCode;
			RuleOptions: any[];
			Visitor: RuleListener;
			Node: JSSyntaxElement;
			MessageIds: string;
			ExtRuleDocs: {};
		}> {
		create(context: RuleContext): RuleListener;
	}

	type NodeTypes = ESTreeNode["type"];

	interface NodeListener
		extends CustomRuleVisitorWithExit<
			{
				[Node in Rule.Node as Node["type"]]?:
					| ((node: Node) => void)
					| undefined;
			} & {
				// A `Program` visitor's node type has no `parent` property.
				Program?: ((node: AST.Program) => void) | undefined;
			}
		> {}

	interface NodeParentExtension {
		parent: Node;
	}

	type Node =
		| (AST.Program & { parent: null })
		| (Exclude<ESTreeNode, ESTreeProgram> & NodeParentExtension);

	interface RuleListener extends NodeListener {
		onCodePathStart?(codePath: CodePath, node: Node): void;

		onCodePathEnd?(codePath: CodePath, node: Node): void;

		onCodePathSegmentStart?(segment: CodePathSegment, node: Node): void;

		onCodePathSegmentEnd?(segment: CodePathSegment, node: Node): void;

		onUnreachableCodePathSegmentStart?(
			segment: CodePathSegment,
			node: Node,
		): void;

		onUnreachableCodePathSegmentEnd?(
			segment: CodePathSegment,
			node: Node,
		): void;

		onCodePathSegmentLoop?(
			fromSegment: CodePathSegment,
			toSegment: CodePathSegment,
			node: Node,
		): void;

		[key: string]:
			| ((codePath: CodePath, node: Node) => void)
			| ((segment: CodePathSegment, node: Node) => void)
			| ((
					fromSegment: CodePathSegment,
					toSegment: CodePathSegment,
					node: Node,
			  ) => void)
			| ((node: Node) => void)
			| NodeListener[keyof NodeListener]
			| undefined;
	}

	type CodePathOrigin =
		| "program"
		| "function"
		| "class-field-initializer"
		| "class-static-block";

	interface CodePath {
		id: string;
		origin: CodePathOrigin;
		initialSegment: CodePathSegment;
		finalSegments: CodePathSegment[];
		returnedSegments: CodePathSegment[];
		thrownSegments: CodePathSegment[];
		upper: CodePath | null;
		childCodePaths: CodePath[];
	}

	interface CodePathSegment {
		id: string;
		nextSegments: CodePathSegment[];
		prevSegments: CodePathSegment[];
		reachable: boolean;
	}

	type RuleMetaData = RulesMeta;

	interface RuleContext
		extends CoreRuleContext<{
			LangOptions: Linter.LanguageOptions;
			Code: SourceCode;
			RuleOptions: any[];
			Node: JSSyntaxElement;
			MessageIds: string;
		}> {}

	type ReportFixer = CoreRuleFixer;

	/** @deprecated Use `ReportDescriptorOptions` instead. */
	type ReportDescriptorOptionsBase = Omit<ViolationReportBase, "suggest">;

	type SuggestionReportOptions = SuggestedEditBase;
	type SuggestionDescriptorMessage = SuggestionMessage;
	type SuggestionReportDescriptor = SuggestedEdit;

	// redundant with ReportDescriptorOptionsBase but kept for clarity
	type ReportDescriptorOptions = ViolationReportBase;

	type ReportDescriptor = ViolationReport<JSSyntaxElement>;
	type ReportDescriptorMessage = ViolationMessage;
	type ReportDescriptorLocation = ViolationLocation<JSSyntaxElement>;

	type RuleFixer = RuleTextEditor<ESTreeNode | AST.Token>;
	type Fix = RuleTextEdit;
}

export type JSRuleDefinitionTypeOptions = CustomRuleTypeDefinitions;

export type JSRuleDefinition<
	Options extends Partial<JSRuleDefinitionTypeOptions> = {},
> = CustomRuleDefinitionType<
	{
		LangOptions: Linter.LanguageOptions;
		Code: SourceCode;
		Visitor: Rule.RuleListener;
		Node: JSSyntaxElement;
	},
	Options
>;

// #region Linter

export class Linter {
	static readonly version: string;

	version: string;

	constructor(options?: { cwd?: string | undefined; configType?: "flat" });

	verify(
		code: SourceCode | string,
		config: Linter.Config | Linter.Config[],
		filename?: string,
	): Linter.LintMessage[];
	verify(
		code: SourceCode | string,
		config: Linter.Config | Linter.Config[],
		options: Linter.LintOptions,
	): Linter.LintMessage[];

	verifyAndFix(
		code: string,
		config: Linter.Config | Linter.Config[],
		filename?: string,
	): Linter.FixReport;
	verifyAndFix(
		code: string,
		config: Linter.Config | Linter.Config[],
		options: Linter.FixOptions,
	): Linter.FixReport;

	getSourceCode(): SourceCode;

	getTimes(): Linter.Stats["times"];

	getFixPassCount(): Linter.Stats["fixPasses"];
}

export namespace Linter {
	/**
	 * The numeric severity level for a rule.
	 *
	 * - `0` means off.
	 * - `1` means warn.
	 * - `2` means error.
	 *
	 * @see [Rule Severities](https://eslint.org/docs/latest/use/configure/rules#rule-severities)
	 */
	type Severity = SeverityLevel;

	/**
	 * The human readable severity level for a rule.
	 *
	 * @see [Rule Severities](https://eslint.org/docs/latest/use/configure/rules#rule-severities)
	 */
	type StringSeverity = SeverityName;

	/**
	 * The numeric or human readable severity level for a rule.
	 *
	 * @see [Rule Severities](https://eslint.org/docs/latest/use/configure/rules#rule-severities)
	 */
	type RuleSeverity = CoreSeverity;

	/**
	 * An array containing the rule severity level, followed by the rule options.
	 *
	 * @see [Rules](https://eslint.org/docs/latest/use/configure/rules)
	 */
	type RuleSeverityAndOptions<Options extends any[] = any[]> = [
		RuleSeverity,
		...Partial<Options>,
	];

	/**
	 * The severity level for the rule or an array containing the rule severity level, followed by the rule options.
	 *
	 * @see [Rules](https://eslint.org/docs/latest/use/configure/rules)
	 */
	type RuleEntry<Options extends any[] = any[]> = RuleConfig<Options>;

	/**
	 * The rules config object is a key/value map of rule names and their severity and options.
	 */
	type RulesRecord = RulesConfig;

	/**
	 * A configuration object that may have a `rules` block.
	 */
	type HasRules<Rules extends RulesConfig = RulesConfig> =
		CoreHasRules<Rules>;

	/**
	 * The ECMAScript version of the code being linted.
	 */
	type EcmaVersion = CoreEcmaVersion;

	/**
	 * The type of JavaScript source code.
	 */
	type SourceType = JavaScriptSourceType;

	/**
	 * ESLint legacy configuration.
	 *
	 * @see [ESLint Legacy Configuration](https://eslint.org/docs/latest/use/configure/)
	 */
	type BaseConfig<
		Rules extends RulesConfig = RulesConfig,
		OverrideRules extends RulesConfig = Rules,
	> = CoreBaseConfig<Rules, OverrideRules>;

	/**
	 * The overwrites that apply more differing configuration to specific files or directories.
	 */
	type ConfigOverride<Rules extends RulesConfig = RulesConfig> =
		CoreConfigOverride<Rules>;

	/**
	 * ESLint legacy configuration.
	 *
	 * @see [ESLint Legacy Configuration](https://eslint.org/docs/latest/use/configure/)
	 */
	// https://github.com/eslint/eslint/blob/v8.57.0/conf/config-schema.js
	type LegacyConfig<
		Rules extends RulesConfig = RulesConfig,
		OverrideRules extends RulesConfig = Rules,
	> = LegacyConfigObject<Rules, OverrideRules>;

	/**
	 * Parser options.
	 *
	 * @see [Specifying Parser Options](https://eslint.org/docs/latest/use/configure/language-options#specifying-parser-options)
	 */
	interface ParserOptions {
		/**
		 * Allow the use of reserved words as identifiers (if `ecmaVersion` is 3).
		 *
		 * @default false
		 */
		allowReserved?: boolean | undefined;
		/**
		 * An object indicating which additional language features you'd like to use.
		 *
		 * @see https://eslint.org/docs/latest/use/configure/language-options#specifying-parser-options
		 */
		ecmaFeatures?:
			| {
					/**
					 * Allow `return` statements in the global scope.
					 *
					 * @default false
					 */
					globalReturn?: boolean | undefined;
					/**
					 * Enable global [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) (if `ecmaVersion` is 5 or greater).
					 *
					 * @default false
					 */
					impliedStrict?: boolean | undefined;
					/**
					 * Enable [JSX](https://facebook.github.io/jsx/).
					 *
					 * @default false
					 */
					jsx?: boolean | undefined;
					[key: string]: any;
			  }
			| undefined;
		[key: string]: any;
	}

	/**
	 * Options used for linting code with `Linter#verify` and `Linter#verifyAndFix`.
	 */
	interface LintOptions {
		filename?: string | undefined;
		preprocess?: ((code: string) => string[]) | undefined;
		postprocess?:
			| ((problemLists: LintMessage[][]) => LintMessage[])
			| undefined;
		filterCodeBlock?:
			| ((filename: string, text: string) => boolean)
			| undefined;
		disableFixes?: boolean | undefined;
		allowInlineConfig?: boolean | undefined;
		reportUnusedDisableDirectives?: boolean | undefined;
	}

	type LintSuggestion = CoreLintSuggestion;
	type LintMessage = CoreLintMessage;

	interface LintSuppression {
		kind: string;
		justification: string;
	}

	interface SuppressedLintMessage extends LintMessage {
		/** The suppression info. */
		suppressions: LintSuppression[];
	}

	interface FixOptions extends LintOptions {
		fix?: boolean | undefined;
	}

	interface FixReport {
		fixed: boolean;
		output: string;
		messages: LintMessage[];
	}

	// Temporarily loosen type for just flat config files (see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/68232)
	type NonESTreeParser = ESLint.ObjectMetaProperties &
		(
			| {
					parse(text: string, options?: any): unknown;
			  }
			| {
					parseForESLint(
						text: string,
						options?: any,
					): Omit<ESLintParseResult, "ast" | "scopeManager"> & {
						ast: unknown;
						scopeManager?: unknown;
					};
			  }
		);

	type ESTreeParser = ESLint.ObjectMetaProperties &
		(
			| { parse(text: string, options?: any): AST.Program }
			| { parseForESLint(text: string, options?: any): ESLintParseResult }
		);

	type Parser = NonESTreeParser | ESTreeParser;

	interface ESLintParseResult {
		/** The AST object. */
		ast: AST.Program;

		/** The services that the parser provides. */
		services?: SourceCode.ParserServices | undefined;

		/** The scope manager of the AST. */
		scopeManager?: Scope.ScopeManager | undefined;

		/** The visitor keys of the AST. */
		visitorKeys?: SourceCode.VisitorKeys | undefined;
	}

	type ProcessorFile = CoreProcessorFile;

	// https://eslint.org/docs/latest/extend/plugins#processors-in-plugins
	type Processor<T extends string | ProcessorFile = string | ProcessorFile> =
		CoreProcessor<T>;

	type Config<Rules extends RulesConfig = RulesConfig> = ConfigObject<Rules>;

	/** @deprecated  Use `Config` instead of `FlatConfig` */
	type FlatConfig<Rules extends RulesConfig = RulesConfig> = Config<Rules>;

	type GlobalConf = GlobalAccess;
	type Globals = GlobalsConfig;

	interface LanguageOptions extends GenericLanguageOptions {
		/**
		 * The version of ECMAScript to support. May be any year (i.e., 2022) or
		 * version (i.e., 5). Set to "latest" for the most recent supported version.
		 * @default "latest"
		 */
		ecmaVersion?: EcmaVersion | undefined;

		/**
		 * The type of JavaScript source code. Possible values are "script" for
		 * traditional script files, "module" for ECMAScript modules (ESM), and
		 * "commonjs" for CommonJS files. (default: "module" for .js and .mjs
		 * files; "commonjs" for .cjs files)
		 */
		sourceType?: SourceType | undefined;

		/**
		 * An object specifying additional objects that should be added to the
		 * global scope during linting.
		 */
		globals?: Globals | undefined;

		/**
		 * An object containing a parse() or parseForESLint() method.
		 * If not configured, the default ESLint parser (Espree) will be used.
		 */
		parser?: Parser | undefined;

		/**
		 * An object specifying additional options that are passed directly to the
		 * parser() method on the parser. The available options are parser-dependent
		 */
		parserOptions?: Linter.ParserOptions | undefined;
	}

	type LinterOptions = LinterOptionsConfig;

	/**
	 * Performance statistics.
	 */
	interface Stats {
		/**
		 * The number of times ESLint has applied at least one fix after linting.
		 */
		fixPasses: number;

		/**
		 * The times spent on (parsing, fixing, linting) a file, where the linting refers to the timing information for each rule.
		 */
		times: { passes: TimePass[] };
	}

	interface TimePass {
		/**
		 * The parse object containing all parse time information.
		 */
		parse: { total: number };

		/**
		 * The rules object containing all lint time information for each rule.
		 */
		rules?: Record<string, { total: number }>;

		/**
		 * The fix object containing all fix time information.
		 */
		fix: { total: number };

		/**
		 * The total time that is spent on (parsing, fixing, linting) a file.
		 */
		total: number;
	}
}

// #endregion

// #region ESLint

export class ESLint {
	static configType: "flat";

	static readonly version: string;

	/**
	 * The default configuration that ESLint uses internally. This is provided for tooling that wants to calculate configurations using the same defaults as ESLint.
	 * Keep in mind that the default configuration may change from version to version, so you shouldn't rely on any particular keys or values to be present.
	 */
	static readonly defaultConfig: Linter.Config[];

	static outputFixes(results: ESLint.LintResult[]): Promise<void>;

	static getErrorResults(results: ESLint.LintResult[]): ESLint.LintResult[];

	constructor(options?: ESLint.Options);

	lintFiles(patterns: string | string[]): Promise<ESLint.LintResult[]>;

	lintText(
		code: string,
		options?: {
			filePath?: string | undefined;
			warnIgnored?: boolean | undefined;
		},
	): Promise<ESLint.LintResult[]>;

	getRulesMetaForResults(
		results: ESLint.LintResult[],
	): ESLint.LintResultData["rulesMeta"];

	hasFlag(flag: string): boolean;

	calculateConfigForFile(filePath: string): Promise<any>;

	findConfigFile(filePath?: string): Promise<string | undefined>;

	isPathIgnored(filePath: string): Promise<boolean>;

	loadFormatter(nameOrPath?: string): Promise<ESLint.LoadedFormatter>;

	static fromOptionsModule(optionsURL: {
		readonly href: string;
	}): Promise<ESLint>;
}

export namespace ESLint {
	type ConfigData<Rules extends Linter.RulesRecord = RulesConfig> = Omit<
		Linter.LegacyConfig<Rules>,
		"$schema"
	>;

	type Environment = EnvironmentConfig;
	type ObjectMetaProperties = CoreObjectMetaProperties;
	type Plugin = CorePlugin;

	type FixType = "directive" | "problem" | "suggestion" | "layout";

	type CacheStrategy = "content" | "metadata";

	interface Options {
		// File enumeration
		cwd?: string | undefined;
		errorOnUnmatchedPattern?: boolean | undefined;
		globInputPaths?: boolean | undefined;
		ignore?: boolean | undefined;
		ignorePatterns?: string[] | null | undefined;
		passOnNoPatterns?: boolean | undefined;
		warnIgnored?: boolean | undefined;

		// Linting
		allowInlineConfig?: boolean | undefined;
		baseConfig?: Linter.Config | Linter.Config[] | null | undefined;
		overrideConfig?: Linter.Config | Linter.Config[] | null | undefined;
		overrideConfigFile?: string | true | null | undefined;
		plugins?: Record<string, Plugin> | null | undefined;
		ruleFilter?:
			| ((arg: {
					ruleId: string;
					severity: Exclude<Linter.Severity, 0>;
			  }) => boolean)
			| undefined;
		stats?: boolean | undefined;

		// Autofix
		fix?: boolean | ((message: Linter.LintMessage) => boolean) | undefined;
		fixTypes?: FixType[] | null | undefined;

		// Cache-related
		cache?: boolean | undefined;
		cacheLocation?: string | undefined;
		cacheStrategy?: CacheStrategy | undefined;

		// Other Options
		concurrency?: number | "auto" | "off" | undefined;
		flags?: string[] | undefined;
	}

	/** A linting result. */
	interface LintResult {
		/** The path to the file that was linted. */
		filePath: string;

		/** All of the messages for the result. */
		messages: Linter.LintMessage[];

		/** All of the suppressed messages for the result. */
		suppressedMessages: Linter.SuppressedLintMessage[];

		/** Number of errors for the result. */
		errorCount: number;

		/** Number of fatal errors for the result. */
		fatalErrorCount: number;

		/** Number of warnings for the result. */
		warningCount: number;

		/** Number of fixable errors for the result. */
		fixableErrorCount: number;

		/** Number of fixable warnings for the result. */
		fixableWarningCount: number;

		/** The source code of the file that was linted, with as many fixes applied as possible. */
		output?: string | undefined;

		/** The source code of the file that was linted. */
		source?: string | undefined;

		/** The performance statistics collected with the `stats` flag. */
		stats?: Linter.Stats | undefined;

		/** The list of used deprecated rules. */
		usedDeprecatedRules: DeprecatedRuleUse[];
	}

	/**
	 * Information provided when the maximum warning threshold is exceeded.
	 */
	interface MaxWarningsExceeded {
		/**
		 * Number of warnings to trigger nonzero exit code.
		 */
		maxWarnings: number;

		/**
		 * Number of warnings found while linting.
		 */
		foundWarnings: number;
	}

	interface LintResultData extends ResultsMeta {
		cwd: string;
		rulesMeta: {
			[ruleId: string]: Rule.RuleMetaData;
		};
	}

	/**
	 * Information about deprecated rules.
	 */
	interface DeprecatedRuleUse {
		/**
		 * The rule ID.
		 */
		ruleId: string;

		/**
		 * The rule IDs that replace this deprecated rule.
		 */
		replacedBy: string[];

		/**
		 * The raw deprecated info provided by the rule.
		 * - Undefined if the rule's `meta.deprecated` property is a boolean.
		 * - Unset when using the legacy eslintrc configuration.
		 */
		info?: DeprecatedInfo | undefined;
	}

	/**
	 * Metadata about results for formatters.
	 */
	interface ResultsMeta {
		/**
		 * Whether or not to use color in the formatter output.
		 * - If `--color` was set, this property is `true`.
		 * - If `--no-color` was set, it is `false`.
		 * - If neither option was provided, the property is omitted.
		 */
		color?: boolean | undefined;

		/**
		 * Present if the maxWarnings threshold was exceeded.
		 */
		maxWarningsExceeded?: MaxWarningsExceeded | undefined;
	}

	/** The type of an object resolved by {@link ESLint.loadFormatter}. */
	interface LoadedFormatter {
		/**
		 * Used to call the underlying formatter.
		 * @param results An array of lint results to format.
		 * @param resultsMeta An object with optional `color` and `maxWarningsExceeded` properties that will be
		 * passed to the underlying formatter function along with other properties set by ESLint.
		 * This argument can be omitted if `color` and `maxWarningsExceeded` are not needed.
		 * @return The formatter output.
		 */
		format(
			results: LintResult[],
			resultsMeta?: ResultsMeta,
		): string | Promise<string>;
	}

	// The documented type name is `LoadedFormatter`, but `Formatter` has been historically more used.
	type Formatter = LoadedFormatter;

	/**
	 * The expected signature of a custom formatter.
	 * @param results An array of lint results to format.
	 * @param context Additional information for the formatter.
	 * @return The formatter output.
	 */
	type FormatterFunction = (
		results: LintResult[],
		context: LintResultData,
	) => string | Promise<string>;

	// Docs reference the types by those name
	type EditInfo = Rule.Fix;
}

// #endregion

/**
 * Loads the correct `ESLint` constructor.
 */
export function loadESLint(): Promise<typeof ESLint>;

// #region RuleTester

export class RuleTester {
	static describe: ((...args: any) => any) | null;
	static it: ((...args: any) => any) | null;
	static itOnly: ((...args: any) => any) | null;
	static setDefaultConfig(config: Linter.Config): void;
	static getDefaultConfig(): Linter.Config;
	static resetDefaultConfig(): void;

	constructor(config?: Linter.Config);

	run(
		name: string,
		rule: RuleDefinition,
		tests: {
			valid: Array<string | RuleTester.ValidTestCase>;
			invalid: RuleTester.InvalidTestCase[];
			/**
			 * Additional assertions for the "error" matchers of invalid test cases to enforce consistency.
			 */
			assertionOptions?: {
				/**
				 * If true, each `errors` block must check the expected error
				 * message, either via a string in the `errors` array, or via
				 * `message`/`messageId` in an errors object.
				 * `"message"`/`"messageId"` can be used to further limit the
				 * message assertions to the respective versions.
				 */
				requireMessage?: boolean | "message" | "messageId";
				/**
				 * If true, each `errors` block must be an array of objects,
				 * that each check all location properties `line`, `column`,
				 * `endLine`, `endColumn`, the later may be omitted, if the
				 * error does not contain them.
				 */
				requireLocation?: boolean;
				/**
				 * If true, each error and suggestion with a `messageId` must specify a `data`
				 * property if the referenced message contains placeholders.
				 * `"error"` and `"suggestion" limit the assertion to errors and suggestions respectively.
				 */
				requireData?: boolean | "error" | "suggestion";
			};
		},
	): void;

	static only(
		item: string | RuleTester.ValidTestCase | RuleTester.InvalidTestCase,
	): RuleTester.ValidTestCase | RuleTester.InvalidTestCase;
}

export namespace RuleTester {
	interface ValidTestCase
		extends Omit<
			Linter.Config,
			| "name"
			| "basePath"
			| "files"
			| "ignores"
			| "linterOptions"
			| "plugins"
			| "rules"
		> {
		name?: string;
		code: string;
		options?: any[];
		filename?: string | undefined;
		only?: boolean;
		before?: () => void;
		after?: () => void;
	}

	interface SuggestionOutput {
		messageId?: string;
		desc?: string;
		data?: MessagePlaceholderData | undefined;
		output: string;
	}

	interface InvalidTestCase extends ValidTestCase {
		errors: number | Array<TestCaseError | string | RegExp>;
		output?: string | null | undefined;
	}

	interface TestCaseError {
		message?: string | RegExp;
		messageId?: string;
		data?: MessagePlaceholderData | undefined;
		line?: number | undefined;
		column?: number | undefined;
		endLine?: number | undefined;
		endColumn?: number | undefined;
		suggestions?: SuggestionOutput[] | number | undefined;
	}
}

// #endregion
