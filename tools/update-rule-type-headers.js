/**
 * @fileoverview Script to update the TSDoc header comments of rule types.
 * If this script is run with command-line arguments, it will only update rule types that match the specified rule files.
 * E.g. running with CLI arguments `"./lib/rules/no-unused-vars.js"`
 * will only update the TSDoc header comment for the `no-unused-vars` rule.
 * If this script is run without arguments, it will update the TSDoc header comments for all rules.
 *
 * @author Francesco Trotta
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { readdir, readFile, writeFile } = require("node:fs/promises");
const { basename, extname, join, relative } = require("node:path");
const { added } = require("../docs/src/_data/rule_versions.json");
const rules = require("../lib/rules");
const ts = require("typescript");

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/** @typedef {import("eslint").AST.Range} Range */
/** @typedef {import("eslint").Rule.RuleMetaData} RuleMetaData */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Returns the deprecation notice for a rule.
 * If the provided TSDoc comment contains a `@deprecated` tag followed by some text, the deprecation notice is extracted from there;
 * otherwise, a standard notice will be created from the name of the replacement rule, if one exists.
 * @param {string} tsDoc The text of the existing TSDoc comment.
 * @param {RuleMetaData} ruleMeta The rule's `meta` object.
 * @returns {string} The deprecation notice for the specified rule.
 */
function createDeprecationNotice(tsDoc, ruleMeta) {
    const match = /\n *\* *@deprecated +(?<notice>.+)\n/u.exec(tsDoc);

    if (match) {
        return match.groups.notice;
    }
    const { replacedBy } = ruleMeta;

    if (replacedBy && replacedBy.length === 1) {
        const replacement = replacedBy[0];
        const replacementURL = rules.get(replacement).meta.docs.url;

        return `please use [\`${replacement}\`](${replacementURL}).`;
    }
    return "";
}

/**
 * Escapes a line of markdown text so it can be safely inserted into a TSDoc comment.
 * @param {string} line A line of markdown text.
 * @returns {string} The escaped text.
 */
function escapeForMultilineComment(line) {
    return line.replaceAll(
        /(`*)([^`]+)\1/gu,
        (substring, backticks, capture) => {

            // In a TSDoc comment, the sequence `*/` ("*" + "/") must be escaped as `*\/`.
            // But escaping inside a markdown code block is not possible, so discard the backticks.
            if (capture.includes("*/")) {
                return capture.replaceAll("/", "\\/");
            }
            return substring;
        }
    );
}

/**
 * Checks if a declared interface extends `Linter.RulesRecord`.
 * @param {ts.InterfaceDeclaration} node An `InterfaceDeclaration` node.
 * @returns {boolean} A boolean value indicating whether the specified interface extends `Linter.RulesRecord`.
 */
function extendsRulesRecord(node) {
    const { heritageClauses } = node;

    if (!heritageClauses) {
        return false;
    }
    for (const heritageClause of heritageClauses) {
        for (const { expression } of heritageClause.types) {
            if (expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
                if (
                    expression.expression.kind === ts.SyntaxKind.Identifier &&
                    expression.expression.text === "Linter" &&
                    expression.name.kind === ts.SyntaxKind.Identifier &&
                    expression.name.text === "RulesRecord"
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * Creates a TSDoc comment from a list of lines.
 * @param {ReadonlyArray<string>} lines The lines of the TSDoc comments.
 * @returns {string} The formatted text of the TSDoc comment.
 */
function formatTSDoc(lines) {
    const formattedLines = ["/**"];

    for (const line of lines) {
        formattedLines.push(`     *${line ? ` ${line}` : ""}`);
    }
    formattedLines.push("     */");
    return formattedLines.join("\n");
}

/**
 * Returns the names of the rules whose paths were specified in the command line.
 * If no rule paths were specified, the names of all built-in rules are returned.
 * @param {string[]} args The command line arguments without options.
 * @returns {Set<string>} The names of the rules to be considered for the current run.
 */
function getConsideredRuleIds(args) {
    let ruleIds;

    if (args.length) {
        const ruleDir = join(__dirname, "../lib/rules");

        ruleIds = args
            .filter(arg => relative(arg, ruleDir) === ".." && basename(arg) !== "index.js")
            .map(ruleFile => basename(ruleFile, ".js"));
    } else {
        ruleIds = rules.keys();
    }
    return new Set(ruleIds);
}

/**
 * Returns the locations of the TSDoc header comments for each rule in a type declaration file.
 * If a rule has no header comment the location returned is the start position of the rule name.
 * @param {string} sourceText The source text of the type declaration file.
 * @param {Set<string>} consideredRuleIds The names of the rules to be considered for the current run.
 * @returns {Map<string, Range>} A map of rule names to ranges.
 * The ranges indicate the locations of the TSDoc header comments in the source.
 */
function getTSDocRangeMap(sourceText, consideredRuleIds) {
    const tsDocRangeMap = new Map();
    const ast = ts.createSourceFile("", sourceText);

    for (const statement of ast.statements) {
        if (statement.kind === ts.SyntaxKind.InterfaceDeclaration && extendsRulesRecord(statement)) {
            const { members } = statement;

            for (const member of members) {
                if (member.kind === ts.SyntaxKind.PropertySignature) {
                    const ruleId = member.name.text;

                    if (consideredRuleIds.has(ruleId)) {
                        let tsDocRange;

                        // Only the last TSDoc comment is regarded.
                        const tsDoc = member.jsDoc?.at(-1);

                        if (tsDoc) {
                            tsDocRange = [tsDoc.pos, tsDoc.end];
                        } else {
                            const regExp = /\S/gu;

                            regExp.lastIndex = member.pos;
                            const { index } = regExp.exec(sourceText);

                            tsDocRange = [index, index];
                        }
                        tsDocRangeMap.set(ruleId, tsDocRange);
                    }
                }
            }
        }
    }
    return tsDocRangeMap;
}

/**
 * Rewords a rule description to match the existing conventions for TSDoc header comments.
 * For example "Require foobar" becomes "Rule to require foobar."
 * @param {string} description The original rule description.
 * @returns {string} The reworded rule description.
 */
function paraphraseDescription(description) {
    let newDescription;
    const match = /^(Disallow|Enforce|Require) /u.exec(description);

    if (match) {
        newDescription = `Rule to ${description[0].toLowerCase()}${description.slice(1)}`;
    } else {
        newDescription = description;
    }
    if (!newDescription.endsWith(".")) {
        newDescription += ".";
    }
    return newDescription;
}

/**
 * Creates the TSDoc header comment for a rule.
 * @param {string} ruleId The rule name.
 * @param {string} currentTSDoc The current TSDoc comment, if any.
 * @returns {string} The updated TSDoc comment.
 */
function createTSDoc(ruleId, currentTSDoc) {
    const ruleMeta = rules.get(ruleId).meta;
    const ruleDocs = ruleMeta.docs;
    const since = added[ruleId];
    const lines = [escapeForMultilineComment(paraphraseDescription(ruleDocs.description)), ""];

    if (ruleDocs.recommended) {
        lines.push(
            "@remarks",
            "Recommended by ESLint, the rule was enabled in `eslint:recommended`.",
            ""
        );
    }
    if (since) {
        lines.push(`@since ${since}`);
    }
    if (ruleMeta.deprecated) {
        const deprecationNotice = createDeprecationNotice(currentTSDoc, ruleMeta);

        lines.push(`@deprecated${deprecationNotice ? ` ${deprecationNotice}` : ""}`);
    }
    lines.push(`@see ${ruleDocs.url}`);
    const newTSDoc = formatTSDoc(lines);

    return newTSDoc;
}

/**
 * Updates rule header comments in a `.d.ts` file or checks is a `.d.ts` file is up-to-date.
 * @param {string} ruleTypeFile Pathname of the `.d.ts` file.
 * @param {Set<string>} consideredRuleIds The names of the rules to be considered for the current run.
 * @param {boolean} check Whether to throw an error if the `.d.ts` file is not up-to-date.
 * @returns {Promise<Iterable<string>>} The names of the rules found in the `.d.ts` file.
 */
async function updateTypeDeclaration(ruleTypeFile, consideredRuleIds, check) {
    const sourceText = await readFile(ruleTypeFile, "utf-8");
    const tsDocRangeMap = getTSDocRangeMap(sourceText, consideredRuleIds);
    const chunks = [];
    let lastPos = 0;

    for (const [ruleId, [tsDocStart, tsDocEnd]] of tsDocRangeMap) {
        const textBeforeTSDoc = sourceText.slice(lastPos, tsDocStart);
        const currentTSDoc = sourceText.slice(tsDocStart, tsDocEnd);
        const newTSDoc = createTSDoc(ruleId, currentTSDoc);

        chunks.push(textBeforeTSDoc, newTSDoc);
        if (sourceText[tsDocEnd] !== "\n") {
            chunks.push("\n    ");
        }
        lastPos = tsDocEnd;
    }
    chunks.push(sourceText.slice(Math.max(0, lastPos)));
    const newSourceText = chunks.join("");

    if (newSourceText !== sourceText) {
        if (check) {
            throw new Error("The rule types are not up-to-date. Please, run `node tools/update-rule-type-headers.js` to fix.");
        }
        await writeFile(ruleTypeFile, newSourceText);
    }
    return tsDocRangeMap.keys();
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

(async () => {
    let check = false;
    const args = process.argv.slice(2).filter(arg => {
        if (arg === "--check") {
            check = true;
            return false;
        }
        return true;
    });
    const consideredRuleIds = getConsideredRuleIds(args);
    const ruleTypeDir = join(__dirname, "../lib/types/rules");
    const fileNames = (await readdir(ruleTypeDir)).filter(fileName => extname(fileName) === ".ts");
    const typedRuleIds = new Set();
    const repeatedRuleIds = new Set();
    const untypedRuleIds = [];

    console.log(`Considering ${consideredRuleIds.size} rule(s).`);
    await Promise.all(
        fileNames.map(
            async fileName => {
                const ruleIds = await updateTypeDeclaration(join(ruleTypeDir, fileName), consideredRuleIds, check);

                for (const ruleId of ruleIds) {
                    if (typedRuleIds.has(ruleId)) {
                        repeatedRuleIds.add(ruleId);
                    } else {
                        typedRuleIds.add(ruleId);
                    }
                }
            }
        )
    );
    for (const ruleId of consideredRuleIds) {
        if (!typedRuleIds.has(ruleId)) {
            untypedRuleIds.push(ruleId);
        }
    }
    if (repeatedRuleIds.size) {
        console.warn(
            "The following rules have multiple type definition:%s",
            [...repeatedRuleIds].map(ruleId => `\n* ${ruleId}`).join("")
        );
        process.exitCode = 1;
    }
    if (untypedRuleIds.length) {
        console.warn(
            "The following rules have no type definition:%s",
            untypedRuleIds.map(ruleId => `\n* ${ruleId}`).join("")
        );
        process.exitCode = 1;
    }
})();
