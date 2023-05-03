/**
 * @fileoverview Test ESLint integration example code
 * @author Ben Perlmutter
 */

const { lintFiles } = require("./example-eslint-integration");

async function testExampleEslintIntegration(){
    const filePaths = ["sample-data/test-file.js"];
    const lintResults = await lintFiles(filePaths);

    // Test cases
    if(lintResults[0].messages.length !== 3){
        throw new Error("Expected 3 linting errors, got " + lintResults.length);
    }
    const messageRuleIds = new Set()
    lintResults[0].messages.forEach(msg => messageRuleIds.add(msg.ruleId));
    if(messageRuleIds.size !== 1){
        throw new Error("Expected 1 linting rule, got " + messageRuleIds.size);
    }
    if(!messageRuleIds.has("no-console")){
        throw new Error("Expected linting rule 'no-console', got " + messageRuleIds);
    }

}

testExampleEslintIntegration()