/**
 * @fileoverview Script to update rule type annotations to use Rule.RuleModule
 */

"use strict";

const fs = require("fs");
const path = require("path");

const rulesDir = path.join(__dirname, "../lib/rules");

/**
 * Updates the type annotation in a rule file
 * @param {string} filePath The path to the rule file
 * @returns {void}
 */
function updateRuleFile(filePath) {
    let content = fs.readFileSync(filePath, "utf8");
    
    // The exact JSDoc comment that the test is looking for
    const expectedJSDocComment = '/** @type {import(\'../types\').Rule.RuleModule} */';
    
    // Check if the file already has the expected JSDoc comment
    if (content.includes(expectedJSDocComment)) {
        console.log(`${path.basename(filePath)} already has the correct JSDoc comment`);
        return;
    }
    
    // Check if the file has a type annotation
    const hasTypeAnnotation = /\/\*\* @type \{import\(['"].*['"]\).*\} \*\//g.test(content);
    
    if (hasTypeAnnotation) {
        // Replace the existing type annotation
        const updatedContent = content.replace(
            /\/\*\* @type \{import\(['"].*['"]\).*\} \*\//g,
            expectedJSDocComment
        );
        
        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent, "utf8");
            console.log(`Updated ${path.relative(process.cwd(), filePath)}`);
        }
    } else {
        // Add the type annotation if it doesn't exist
        const ruleDefinitionPattern = /(module\.exports = \{)/;
        if (ruleDefinitionPattern.test(content)) {
            const updatedContent = content.replace(
                ruleDefinitionPattern,
                `${expectedJSDocComment}\n$1`
            );
            fs.writeFileSync(filePath, updatedContent, "utf8");
            console.log(`Added type annotation to ${path.relative(process.cwd(), filePath)}`);
        } else {
            console.warn(`Could not find rule definition in ${path.relative(process.cwd(), filePath)}`);
        }
    }
}

/**
 * Processes all rule files in the rules directory
 * @returns {void}
 */
function updateAllRules() {
    const files = fs.readdirSync(rulesDir);
    
    for (const file of files) {
        if (file.endsWith(".js")) {
            const filePath = path.join(rulesDir, file);
            updateRuleFile(filePath);
        }
    }
    
    console.log("All rule files have been updated.");
}

updateAllRules();