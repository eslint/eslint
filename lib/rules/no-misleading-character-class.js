/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

const { CALL, CONSTRUCT, ReferenceTracker, getStringIfConstant } = require("@eslint-community/eslint-utils");
const { RegExpParser, visitRegExpAST } = require("@eslint-community/regexpp");
const { isCombiningCharacter, isEmojiModifier, isRegionalIndicatorSymbol, isSurrogatePair } = require("./utils/unicode");
const astUtils = require("./utils/ast-utils.js");
const { isValidWithUnicodeFlag } = require("./utils/regular-expressions");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * @typedef {import('@eslint-community/regexpp').AST.Character} Character
 * @typedef {import('@eslint-community/regexpp').AST.CharacterClassElement} CharacterClassElement
 */

/**
 * Iterate character sequences of a given nodes.
 *
 * CharacterClassRange syntax can steal a part of character sequence,
 * so this function reverts CharacterClassRange syntax and restore the sequence.
 * @param {CharacterClassElement[]} nodes The node list to iterate character sequences.
 * @returns {IterableIterator<Character[]>} The list of character sequences.
 */
function *iterateCharacterSequence(nodes) {

    /** @type {Character[]} */
    let seq = [];

    for (const node of nodes) {
        switch (node.type) {
            case "Character":
                seq.push(node);
                break;

            case "CharacterClassRange":
                seq.push(node.min);
                yield seq;
                seq = [node.max];
                break;

            case "CharacterSet":
            case "CharacterClass": // [[]] nesting character class
            case "ClassStringDisjunction": // \q{...}
            case "ExpressionCharacterClass": // [A--B]
                if (seq.length > 0) {
                    yield seq;
                    seq = [];
                }
                break;

            // no default
        }
    }

    if (seq.length > 0) {
        yield seq;
    }
}


/**
 * Checks whether the given character node is a Unicode code point escape or not.
 * @param {Character} char the character node to check.
 * @returns {boolean} `true` if the character node is a Unicode code point escape.
 */
function isUnicodeCodePointEscape(char) {
    return /^\\u\{[\da-f]+\}$/iu.test(char.raw);
}

/**
 * Each function returns `true` if it detects that kind of problem.
 * @type {Record<string, (char: Character, index: number, chars: Character[]) => boolean>}
 */
const characterSequenceIndexFilters = {
    surrogatePairWithoutUFlag(char, index, chars) {
        if (index === 0) {
            return false;
        }
        const c1 = chars[index - 1];

        return (
            isSurrogatePair(c1.value, char.value) &&
            !isUnicodeCodePointEscape(c1) &&
            !isUnicodeCodePointEscape(char)
        );
    },

    surrogatePair(char, index, chars) {
        if (index === 0) {
            return false;
        }
        const c1 = chars[index - 1];

        return (
            isSurrogatePair(c1.value, char.value) &&
            (
                isUnicodeCodePointEscape(c1) ||
                isUnicodeCodePointEscape(char)
            )
        );
    },

    combiningClass(char, index, chars) {
        return (
            index !== 0 &&
            isCombiningCharacter(char.value) &&
            !isCombiningCharacter(chars[index - 1].value)
        );
    },

    emojiModifier(char, index, chars) {
        return (
            index !== 0 &&
            isEmojiModifier(char.value) &&
            !isEmojiModifier(chars[index - 1].value)
        );
    },

    regionalIndicatorSymbol(char, index, chars) {
        return (
            index !== 0 &&
            isRegionalIndicatorSymbol(char.value) &&
            isRegionalIndicatorSymbol(chars[index - 1].value)
        );
    },

    zwj(char, index, chars) {
        const lastIndex = chars.length - 1;

        return (
            index !== 0 &&
            index !== lastIndex &&
            char.value === 0x200d &&
            chars[index - 1].value !== 0x200d &&
            chars[index + 1].value !== 0x200d
        );
    }
};

const kinds = Object.keys(characterSequenceIndexFilters);

/**
 * Collects the indices where the filter returns true.
 * @param {Character[]} chars Characters to run the filter on.
 * @param {(char: Character, index: number, chars: Character[]) => boolean} filter Determines whether an index should be returned.
 * @returns {number[]} Indices where the filter returned true.
 */
function accumulate(chars, filter) {
    const matchingChars = [];

    chars.forEach((char, index) => {
        if (filter(char, index, chars)) {
            matchingChars.push(char);
        }
    });

    return matchingChars;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "Disallow characters which are made with multiple code points in character class syntax",
            recommended: true,
            url: "https://eslint.org/docs/latest/rules/no-misleading-character-class"
        },

        hasSuggestions: true,

        schema: [],

        messages: {
            surrogatePairWithoutUFlag: "Unexpected surrogate pair in character class. Use 'u' flag.",
            surrogatePair: "Unexpected surrogate pair in character class.",
            combiningClass: "Unexpected combined character in character class.",
            emojiModifier: "Unexpected modified Emoji in character class.",
            regionalIndicatorSymbol: "Unexpected national flag in character class.",
            zwj: "Unexpected joined character sequence in character class.",
            suggestUnicodeFlag: "Add unicode 'u' flag to regex."
        }
    },
    create(context) {
        const sourceCode = context.sourceCode;
        const parser = new RegExpParser();

        /**
         * Determines what offset to start a granular report, if it's straightforward to do so.
         * @param {Character} char Individual character being reported on.
         * @param {Node} node Parent string node to report within.
         * @see https://github.com/eslint/eslint/pull/17515#issuecomment-1707697186
         * @returns {Object | null} Report offset, or null to report on the whole node.
         */
        function getReportStartOffset(char, node) {
            if (node.type !== "Literal" && (node.type !== "TemplateLiteral" || node.expressions.length)) {
                return null;
            }

            const offsetStart = node.raw.slice(0, char.start + char.raw.length + 2).indexOf(char.raw, char.start - 2);

            return offsetStart === -1 ? null : offsetStart;
        }

        /**
         * Generates a granular loc for context.report.
         * @param {Character} char Individual character being reported on.
         * @param {string} kind What kind of character report is being made.
         * @param {Node} node Parent string node to report within.
         * @param {number} reportStartOffset Starting offset to report within the node.
         * @returns {Object} Granular loc for context.report.
         * @see https://github.com/eslint/eslint/pull/17515#issuecomment-1707697186
         */
        function generateReportLocation(char, kind, node, reportStartOffset) {
            const reportEndOffset = reportStartOffset + char.raw.length;
            let reportStartOffsetAdjusted = reportStartOffset;

            if (!char.raw.startsWith("\\u")) {
                reportStartOffsetAdjusted -=
                    ["combiningClass", "surrogatePairWithoutUFlag"].includes(kind)
                        ? 1
                        : 2;
            }

            if (node.raw.slice(char.start + 1, char.start + 3) === "\\\\") {
                reportStartOffsetAdjusted -= 1;
            }

            return {
                end: {
                    line: node.loc.end.line,
                    column: node.loc.start.column + reportEndOffset
                },
                start: {
                    line: node.loc.start.line,
                    column: node.loc.start.column + reportStartOffsetAdjusted
                }
            };
        }

        /**
         * Verify a given regular expression.
         * @param {Node} node The node to report.
         * @param {string} pattern The regular expression pattern to verify.
         * @param {string} flags The flags of the regular expression.
         * @param {Function} unicodeFixer Fixer for missing "u" flag.
         * @returns {void}
         */
        function verify(node, pattern, flags, unicodeFixer) {
            let patternNode;

            try {
                patternNode = parser.parsePattern(
                    pattern,
                    0,
                    pattern.length,
                    {
                        unicode: flags.includes("u"),
                        unicodeSets: flags.includes("v")
                    }
                );
            } catch {

                // Ignore regular expressions with syntax errors
                return;
            }

            const foundKinds = [];

            visitRegExpAST(patternNode, {
                onCharacterClassEnter(ccNode) {
                    for (const chars of iterateCharacterSequence(ccNode.elements)) {
                        for (const kind of kinds) {
                            const matchingChars = accumulate(chars, characterSequenceIndexFilters[kind]);

                            if (matchingChars.length) {
                                foundKinds.push({ chars: matchingChars, kind });
                            }
                        }
                    }
                }
            });

            for (const { chars, kind } of foundKinds) {
                let suggest;

                if (kind === "surrogatePairWithoutUFlag") {
                    suggest = [{
                        messageId: "suggestUnicodeFlag",
                        fix: unicodeFixer
                    }];
                }

                for (const char of chars) {
                    const reportStartOffset = getReportStartOffset(char, node);

                    context.report({
                        ...(
                            reportStartOffset
                                ? { loc: generateReportLocation(char, kind, node, reportStartOffset) }
                                : { node }
                        ),
                        messageId: kind,
                        suggest
                    });
                }
            }
        }

        return {
            "Literal[regex]"(node) {
                verify(node, node.regex.pattern, node.regex.flags, fixer => {
                    if (!isValidWithUnicodeFlag(context.languageOptions.ecmaVersion, node.regex.pattern)) {
                        return null;
                    }

                    return fixer.insertTextAfter(node, "u");
                });
            },
            "Program"(node) {
                const scope = sourceCode.getScope(node);
                const tracker = new ReferenceTracker(scope);

                /*
                 * Iterate calls of RegExp.
                 * E.g., `new RegExp()`, `RegExp()`, `new window.RegExp()`,
                 *       `const {RegExp: a} = window; new a()`, etc...
                 */
                for (const { node: refNode } of tracker.iterateGlobalReferences({
                    RegExp: { [CALL]: true, [CONSTRUCT]: true }
                })) {
                    const [patternNode, flagsNode] = refNode.arguments;
                    const pattern = getStringIfConstant(patternNode, scope);
                    const flags = getStringIfConstant(flagsNode, scope);

                    if (typeof pattern === "string") {
                        verify(patternNode, pattern, flags || "", fixer => {

                            if (!isValidWithUnicodeFlag(context.languageOptions.ecmaVersion, pattern)) {
                                return null;
                            }

                            if (refNode.arguments.length === 1) {
                                const penultimateToken = sourceCode.getLastToken(refNode, { skip: 1 }); // skip closing parenthesis

                                return fixer.insertTextAfter(
                                    penultimateToken,
                                    astUtils.isCommaToken(penultimateToken)
                                        ? ' "u",'
                                        : ', "u"'
                                );
                            }

                            if ((flagsNode.type === "Literal" && typeof flagsNode.value === "string") || flagsNode.type === "TemplateLiteral") {
                                const range = [flagsNode.range[0], flagsNode.range[1] - 1];

                                return fixer.insertTextAfterRange(range, "u");
                            }

                            return null;
                        });
                    }
                }
            }
        };
    }
};
