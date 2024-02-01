/**
 * @fileoverview An example of how to integrate ESLint into your own tool
 * @author Ben Perlmutter
 */

const { ESLint } = require("eslint");

// Create an instance of ESLint with the configuration passed to the function
function createESLintInstance(overrideConfig) {
    return new ESLint({
        overrideConfigFile: true,
        overrideConfig,
        fix: true
    });
}

// Lint the specified files and return the error results
async function lintAndFix(eslint, filePaths) {
    const results = await eslint.lintFiles(filePaths);

    // Apply automatic fixes and output fixed code
    await ESLint.outputFixes(results);

    return results;
}

// Log results to console if there are any problems
function outputLintingResults(results) {
    // Identify the number of problems found
    const problems = results.reduce((acc, result) => acc + result.errorCount + result.warningCount, 0);

    if (problems > 0) {
        console.log("Linting errors found!");
        console.log(results);
    } else {
        console.log("No linting errors found.");
    }
    return results;
}

// Put previous functions all together
async function lintFiles(filePaths) {

    // The ESLint configuration. Alternatively, you could load the configuration
    // from an eslint.config.js file or just use the default config.
    const overrideConfig = {
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: "commonjs"
        },
        rules: {
            "no-console": "error",
            "no-unused-vars": "warn",
        },
    };

    const eslint = createESLintInstance(overrideConfig);
    const results = await lintAndFix(eslint, filePaths);
    return outputLintingResults(results);
}

// Export integration
module.exports = { lintFiles }
