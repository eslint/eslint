/**
 * @fileoverview Define common types for input completion.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

/** @type {any} */
module.exports = {};

/** @typedef {boolean | "off" | "readable" | "readonly" | "writable" | "writeable"} GlobalConf */
/** @typedef {0 | 1 | 2 | "off" | "warn" | "error"} SeverityConf */
/** @typedef {SeverityConf | [SeverityConf, ...any[]]} RuleConf */

/**
 * @typedef {Object} EcmaFeatures
 * @property {boolean} [globalReturn] Enabling `return` statements at the top-level.
 * @property {boolean} [jsx] Enabling JSX syntax.
 * @property {boolean} [impliedStrict] Enabling strict mode always.
 */

/**
 * @typedef {Object} ParserOptions
 * @property {EcmaFeatures} [ecmaFeatures] The optional features.
 * @property {3|5|6|7|8|9|10|11|12|13|14|15|16|2015|2016|2017|2018|2019|2020|2021|2022|2023|2024|2025} [ecmaVersion] The ECMAScript version (or revision number).
 * @property {"script"|"module"} [sourceType] The source code type.
 * @property {boolean} [allowReserved] Allowing the use of reserved words as identifiers in ES3.
 */

/**
 * @typedef {Object} ConfigData
 * @property {Record<string, boolean>} [env] The environment settings.
 * @property {string | string[]} [extends] The path to other config files or the package name of shareable configs.
 * @property {Record<string, GlobalConf>} [globals] The global variable settings.
 * @property {string | string[]} [ignorePatterns] The glob patterns that ignore to lint.
 * @property {boolean} [noInlineConfig] The flag that disables directive comments.
 * @property {OverrideConfigData[]} [overrides] The override settings per kind of files.
 * @property {string} [parser] The path to a parser or the package name of a parser.
 * @property {ParserOptions} [parserOptions] The parser options.
 * @property {string[]} [plugins] The plugin specifiers.
 * @property {string} [processor] The processor specifier.
 * @property {boolean} [reportUnusedDisableDirectives] The flag to report unused `eslint-disable` comments.
 * @property {boolean} [root] The root flag.
 * @property {Record<string, RuleConf>} [rules] The rule settings.
 * @property {Object} [settings] The shared settings.
 */

/**
 * @typedef {Object} OverrideConfigData
 * @property {Record<string, boolean>} [env] The environment settings.
 * @property {string | string[]} [excludedFiles] The glob patterns for excluded files.
 * @property {string | string[]} [extends] The path to other config files or the package name of shareable configs.
 * @property {string | string[]} files The glob patterns for target files.
 * @property {Record<string, GlobalConf>} [globals] The global variable settings.
 * @property {boolean} [noInlineConfig] The flag that disables directive comments.
 * @property {OverrideConfigData[]} [overrides] The override settings per kind of files.
 * @property {string} [parser] The path to a parser or the package name of a parser.
 * @property {ParserOptions} [parserOptions] The parser options.
 * @property {string[]} [plugins] The plugin specifiers.
 * @property {string} [processor] The processor specifier.
 * @property {boolean} [reportUnusedDisableDirectives] The flag to report unused `eslint-disable` comments.
 * @property {Record<string, RuleConf>} [rules] The rule settings.
 * @property {Object} [settings] The shared settings.
 */

/**
 * @typedef {Object} ParseResult
 * @property {Object} ast The AST.
 * @property {ScopeManager} [scopeManager] The scope manager of the AST.
 * @property {Record<string, any>} [services] The services that the parser provides.
 * @property {Record<string, string[]>} [visitorKeys] The visitor keys of the AST.
 */

/**
 * @typedef {Object} Parser
 * @property {(text:string, options:ParserOptions) => Object} parse The definition of global variables.
 * @property {(text:string, options:ParserOptions) => ParseResult} [parseForESLint] The parser options that will be enabled under this environment.
 */

/**
 * @typedef {Object} Environment
 * @property {Record<string, GlobalConf>} [globals] The definition of global variables.
 * @property {ParserOptions} [parserOptions] The parser options that will be enabled under this environment.
 */

/**
 * @typedef {Object} LintMessage
 * @property {number|undefined} column The 1-based column number.
 * @property {number} [endColumn] The 1-based column number of the end location.
 * @property {number} [endLine] The 1-based line number of the end location.
 * @property {boolean} [fatal] If `true` then this is a fatal error.
 * @property {{range:[number,number], text:string}} [fix] Information for autofix.
 * @property {number|undefined} line The 1-based line number.
 * @property {string} message The error message.
 * @property {string} [messageId] The ID of the message in the rule's meta.
 * @property {(string|null)} nodeType Type of node
 * @property {string|null} ruleId The ID of the rule which makes this message.
 * @property {0|1|2} severity The severity of this message.
 * @property {Array<{desc?: string, messageId?: string, fix: {range: [number, number], text: string}}>} [suggestions] Information for suggestions.
 */

/**
 * @typedef {Object} SuppressedLintMessage
 * @property {number|undefined} column The 1-based column number.
 * @property {number} [endColumn] The 1-based column number of the end location.
 * @property {number} [endLine] The 1-based line number of the end location.
 * @property {boolean} [fatal] If `true` then this is a fatal error.
 * @property {{range:[number,number], text:string}} [fix] Information for autofix.
 * @property {number|undefined} line The 1-based line number.
 * @property {string} message The error message.
 * @property {string} [messageId] The ID of the message in the rule's meta.
 * @property {(string|null)} nodeType Type of node
 * @property {string|null} ruleId The ID of the rule which makes this message.
 * @property {0|1|2} severity The severity of this message.
 * @property {Array<{kind: string, justification: string}>} suppressions The suppression info.
 * @property {Array<{desc?: string, messageId?: string, fix: {range: [number, number], text: string}}>} [suggestions] Information for suggestions.
 */

/**
 * @typedef {Record<string, Record<string, { count: number }>>} SuppressedViolations
 */

/**
 * @typedef {Object} SuggestionResult
 * @property {string} desc A short description.
 * @property {string} [messageId] Id referencing a message for the description.
 * @property {{ text: string, range: number[] }} fix fix result info
 */

/**
 * @typedef {Object} Processor
 * @property {(text:string, filename:string) => Array<string | { text:string, filename:string }>} [preprocess] The function to extract code blocks.
 * @property {(messagesList:LintMessage[][], filename:string) => LintMessage[]} [postprocess] The function to merge messages.
 * @property {boolean} [supportsAutofix] If `true` then it means the processor supports autofix.
 */

/**
 * @typedef {Object} RuleMetaDocs
 * @property {string} description The description of the rule.
 * @property {boolean} recommended If `true` then the rule is included in `eslint:recommended` preset.
 * @property {string} url The URL of the rule documentation.
 */

/**
 * @typedef {Object} DeprecatedInfo
 * @property {string} [message] General message presented to the user
 * @property {string} [url] URL to more information about this deprecation in general
 * @property {ReplacedByInfo[]} [replacedBy] Potential replacements for the rule
 * @property {string} [deprecatedSince] Version since the rule is deprecated
 * @property {?string} [availableUntil] Version until it is available or null if indefinite
 */

/**
 * @typedef {Object} ReplacedByInfo
 * @property {string} [message] General message presented to the user
 * @property {string} [url] URL to more information about this replacement in general
 * @property {{ name?: string, url?: string }} [plugin] Use "eslint" for a core rule. Omit if the rule is in the same plugin.
 * @property {{ name?: string, url?: string }} [rule] Name and information of the replacement rule
 */

/**
 * Information of deprecated rules.
 * @typedef {Object} DeprecatedRuleInfo
 * @property {string} ruleId The rule ID.
 * @property {string[]} replacedBy The rule IDs that replace this deprecated rule.
 * @property {DeprecatedInfo} [info] The raw deprecated info provided by rule. Unset if `deprecated` is a boolean.
 */

/**
 * A linting result.
 * @typedef {Object} LintResult
 * @property {string} filePath The path to the file that was linted.
 * @property {LintMessage[]} messages All of the messages for the result.
 * @property {SuppressedLintMessage[]} suppressedMessages All of the suppressed messages for the result.
 * @property {number} errorCount Number of errors for the result.
 * @property {number} fatalErrorCount Number of fatal errors for the result.
 * @property {number} warningCount Number of warnings for the result.
 * @property {number} fixableErrorCount Number of fixable errors for the result.
 * @property {number} fixableWarningCount Number of fixable warnings for the result.
 * @property {Stats} [stats] The performance statistics collected with the `stats` flag.
 * @property {string} [source] The source code of the file that was linted.
 * @property {string} [output] The source code of the file that was linted, with as many fixes applied as possible.
 * @property {DeprecatedRuleInfo[]} usedDeprecatedRules The list of used deprecated rules.
 */

/**
 * Performance statistics
 * @typedef {Object} Stats
 * @property {number} fixPasses The number of times ESLint has applied at least one fix after linting.
 * @property {Times} times The times spent on (parsing, fixing, linting) a file.
 */

/**
 * Performance Times for each ESLint pass
 * @typedef {Object} Times
 * @property {TimePass[]} passes Time passes
 */

/**
 * @typedef {Object} TimePass
 * @property {ParseTime} parse The parse object containing all parse time information.
 * @property {Record<string, RuleTime>} [rules] The rules object containing all lint time information for each rule.
 * @property {FixTime} fix The parse object containing all fix time information.
 * @property {number} total The total time that is spent on (parsing, fixing, linting) a file.
 */
/**
 * @typedef {Object} ParseTime
 * @property {number} total The total time that is spent when parsing a file.
 */
/**
 * @typedef {Object} RuleTime
 * @property {number} total The total time that is spent on a rule.
 */
/**
 * @typedef {Object} FixTime
 * @property {number} total The total time that is spent on applying fixes to the code.
 */

/**
 * Information provided when the maximum warning threshold is exceeded.
 * @typedef {Object} MaxWarningsExceeded
 * @property {number} maxWarnings Number of warnings to trigger nonzero exit code.
 * @property {number} foundWarnings Number of warnings found while linting.
 */

/**
 * Metadata about results for formatters.
 * @typedef {Object} ResultsMeta
 * @property {MaxWarningsExceeded} [maxWarningsExceeded] Present if the maxWarnings threshold was exceeded.
 */
