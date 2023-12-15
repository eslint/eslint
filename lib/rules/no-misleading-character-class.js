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
            return chars.slice(index - 1, index + 2);
        }

        return null;
    }
};

const kinds = Object.keys(characterSequenceIndexFilters);

/**
 * Collects the indices where the filter returns an array.
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
         * Generates a granular loc for context.report, if directly calculable.
         * @param {Character[]} chars Individual characters being reported on.
         * @param {Node} node Parent string node to report within.
         * @returns {Object | null} Granular loc for context.report, if directly calculable.
         * @see https://github.com/eslint/eslint/pull/17515
         */
        function generateReportLocation(chars, node) {

            // Limit to to literals and expression-less templates with raw values === their value.
            switch (node.type) {
                case "TemplateLiteral":
                    if (node.expressions.length || node.quasis[0].value.raw !== node.quasis[0].value.cooked) {
                        return null;
                    }
                    break;

                case "Literal":
                    if (typeof node.value === "string" && node.value !== node.raw.slice(1, -1)) {
                        return null;
                    }
                    break;

                default:
                    return null;
            }

            return {
                start: sourceCode.getLocFromIndex(node.range[0] + 1 + chars[0].start),
                end: sourceCode.getLocFromIndex(node.range[0] + 1 + chars[chars.length - 1].end)
            };
        }

        /**
         * Finds the report loc(s) for a range of matches.
         * @param {Character[][]} matches Characters that should trigger a report.
         * @param {Node} node The node to report.
         * @returns {Object | null} Node loc(s) for context.report.
         */
        function getNodeReportLocations(matches, node) {
            const locs = [];

            for (const chars of matches) {
                const loc = generateReportLocation(chars, node);

                // If a report can't match to a range, don't report any others
                if (!loc) {
                    return [node.loc];
                }

                locs.push(loc);
            }

            return locs;
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

            const foundKindMatches = new Map();

            visitRegExpAST(patternNode, {
                onCharacterClassEnter(ccNode) {
                    for (const chars of iterateCharacterSequence(ccNode.elements)) {
                        for (const kind of kinds) {
                            const matches = accumulate(chars, characterSequenceIndexFilters[kind]);

                            if (foundKindMatches.has(kind)) {
                                foundKindMatches.get(kind).push(...matches);
                            } else {
                                foundKindMatches.set(kind, matches);
                            }

                        }
                    }
                }
            });

            foundKindMatches.forEach((matches, kind) => {
                let suggest;

                if (kind === "surrogatePairWithoutUFlag") {
                    suggest = [{
                        messageId: "suggestUnicodeFlag",
                        fix: unicodeFixer
                    }];
                }

                for (const loc of getNodeReportLocations(matches, node)) {
                    context.report({
                        loc,
                        messageId: kind,
                        suggest
                    });
                }
            });
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
