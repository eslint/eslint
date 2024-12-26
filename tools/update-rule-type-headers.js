/**
 * @fileoverview Script to update the TSDoc header comments of rule types.
 * This script should be run after `docs/src/_data/rules_meta.json` and `docs/src/_data/rule_versions.json` have been updated.
 *
 * @author Francesco Trotta
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { readdir, readFile, writeFile } = require("node:fs/promises");
const { extname, join } = require("node:path");
const rulesMeta = require("../docs/src/_data/rules_meta.json");
const { added } = require("../docs/src/_data/rule_versions.json");
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
        const replacementURL = rulesMeta[replacement].docs.url;

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
                return capture.replaceAll(/\//gu, "\\/");
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
 * Returns the locations of the TSDoc header comments for each rule in a type declaration file.
 * If a rule has no header comment the location returned is the start position of the rule name.
 * @param {string} sourceText The source text of the type declaration file.
 * @returns {Map<string, Range>} A map of rule names to ranges.
 * The ranges indicate the locations of the TSDoc header comments in the source.
 */
function getTSDocRangeMap(sourceText) {
    const tsDocRangeMap = new Map();
    const ast = ts.createSourceFile("", sourceText);

    for (const statement of ast.statements) {
        if (statement.kind === ts.SyntaxKind.InterfaceDeclaration && extendsRulesRecord(statement)) {
            const { members } = statement;

            for (const member of members) {
                if (member.kind === ts.SyntaxKind.PropertySignature) {
                    const ruleId = member.name.text;
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
    const ruleMeta = rulesMeta[ruleId];
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
 * Updates rule header comments in a `.d.ts` file.
 * @param {string} filePath Pathname of the `.d.ts` file.
 * @returns {Promise<Iterable<string>>} The names of the rules found in the `.d.ts` file.
 */
async function updateTypeDeclaration(filePath) {
    const sourceText = await readFile(filePath, "utf-8");
    const tsDocRangeMap = getTSDocRangeMap(sourceText);
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
    const newText = chunks.join("");

    await writeFile(filePath, newText);
    return tsDocRangeMap.keys();
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

(async () => {
    const dirPath = join(__dirname, "../lib/types/rules");
    const fileNames = (await readdir(dirPath)).filter(fileName => extname(fileName) === ".ts");
    const typedRuleIds = new Set();
    const repeatedRuleIds = new Set();
    const untypedRuleIds = [];

    await Promise.all(
        fileNames.map(
            async fileName => {
                const ruleIds = await updateTypeDeclaration(join(dirPath, fileName));

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
    for (const ruleId of Object.keys(rulesMeta)) {
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
