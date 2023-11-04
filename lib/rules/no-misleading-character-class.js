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
 * Counts how many \\\\s appear in text.
 * @param {string} text Text to count within.
 * @returns {number} How many \\\\s were found.
 */
function countDoubleEscapedBackslashes(text) {
    const matches = text.match(/\\\\/gu);

    return matches ? matches.length : 0;
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
 * Each function returns matched characters if it detects that kind of problem.
 * @type {Record<string, (char: Character, index: number, chars: Character[]) => Character[] | null>}
 */
const characterSequenceIndexFilters = {
    surrogatePairWithoutUFlag(char, index, chars) {
        if (index === 0) {
            return null;
        }

        const previous = chars[index - 1];

        if (
            isSurrogatePair(previous.value, char.value) &&
            !isUnicodeCodePointEscape(previous) &&
            !isUnicodeCodePointEscape(char)
        ) {
            return [previous, char];
        }

        return null;
    },

    surrogatePair(char, index, chars) {
        if (index === 0) {
            return null;
        }

        const previous = chars[index - 1];

        if (
            isSurrogatePair(previous.value, char.value) &&
            (
                isUnicodeCodePointEscape(previous) ||
                isUnicodeCodePointEscape(char)
            )
        ) {
            return [previous, char];
        }

        return null;
    },

    combiningClass(char, index, chars) {
        if (
            index !== 0 &&
            isCombiningCharacter(char.value) &&
            !isCombiningCharacter(chars[index - 1].value)
        ) {
            return [chars[index - 1], char];
        }

        return null;
    },

    emojiModifier(char, index, chars) {
        if (
            index !== 0 &&
            isEmojiModifier(char.value) &&
            !isEmojiModifier(chars[index - 1].value)
        ) {
            return [chars[index - 1], char];
        }

        return null;
    },

    regionalIndicatorSymbol(char, index, chars) {
        if (
            index !== 0 &&
            isRegionalIndicatorSymbol(char.value) &&
            isRegionalIndicatorSymbol(chars[index - 1].value)
        ) {
            return [chars[index - 1], char];
        }

        return null;
    },

    zwj(char, index, chars) {
        if (
            index !== 0 &&
            index !== chars.length - 1 &&
            char.value === 0x200d &&
            chars[index - 1].value !== 0x200d &&
            chars[index + 1].value !== 0x200d
        ) {
            return chars.slice(index - 1, index + 1);
        }

        return null;
    }
};

const kinds = Object.keys(characterSequenceIndexFilters);

/**
 * Collects the indices where the filter returns true.
 * @param {Character[]} chars Characters to run the filter on.
 * @param {(char: Character, index: number, chars: Character[]) => Character[] | null} filter Finds matches for an index.
 * @returns {Character[][]} Indices where the filter returned true.
 */
function accumulate(chars, filter) {
    const matchingChars = [];

    chars.forEach((char, index) => {
        const matches = filter(char, index, chars);

        if (matches) {
            matchingChars.push(matches);
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
         * Generates a granular loc for context.report.
         * @param {Character[]} chars Individual characters being reported on.
         * @param {Node} node Parent string node to report within.
         * @returns {Object} Granular loc for context.report.
         * @see https://github.com/eslint/eslint/pull/17515#issuecomment-1707697186
         */
        function generateReportLocation(chars, node) {
            if (node.type !== "Literal" && (node.type !== "TemplateLiteral" || node.expressions.length)) {
                return node.loc;
            }

            const first = chars[0];
            const last = chars.at(-1);

            const reportStartOffset = countDoubleEscapedBackslashes(node.raw.slice(0, first.start));
            const reportEndOffset = countDoubleEscapedBackslashes(node.raw.slice(first.start, last.end));

            // eslint-disable-next-line unicorn/prefer-set-has -- bug in the lint rule, this is a string not an array
            const approximateRegion = node.raw.slice(first.start, last.end + reportEndOffset + last.parent.raw.length);

            if (!approximateRegion.includes(first.raw) || !approximateRegion.includes(last.raw)) {
                return node.loc;
            }

            return {
                end: {
                    line: node.loc.end.line,
                    column: node.loc.start.column + last.end + 1 + reportEndOffset + reportStartOffset
                },
                start: {
                    line: node.loc.start.line,
                    column: node.loc.start.column + first.start + 1 + reportStartOffset
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

            const foundKindMatches = [];

            visitRegExpAST(patternNode, {
                onCharacterClassEnter(ccNode) {
                    for (const chars of iterateCharacterSequence(ccNode.elements)) {
                        for (const kind of kinds) {
                            const matches = accumulate(chars, characterSequenceIndexFilters[kind]);

                            if (matches.length) {
                                foundKindMatches.push({ kind, matches });
                            }
                        }
                    }
                }
            });

            for (const { kind, matches } of foundKindMatches) {
                let suggest;

                if (kind === "surrogatePairWithoutUFlag") {
                    suggest = [{
                        messageId: "suggestUnicodeFlag",
                        fix: unicodeFixer
                    }];
                }

                for (const chars of matches) {
                    context.report({
                        loc: generateReportLocation(chars, node),
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
