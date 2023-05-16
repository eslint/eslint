/** 
 * @fileoverview An example of how to integrate ESLint into your own tool
 * @author Ben Perlmutter
 */

const { ESLint } = require("eslint");

function createESLintInstance(eslintConfig){
    if (eslintConfig) {
        return new ESLint({ useEslintrc: false, overrideConfig: eslintConfig });
    } else {
        return new ESLint({ useEslintrc: false });
    }
}

// a function that lints the specified files and returns the error results
async function getLintingResults(eslint, filePaths) {
  const results = await eslint.lintFiles(filePaths);

  // Apply automatic fixes and output fixed code
  await ESLint.outputFixes(results);

  // Get error results
  const errorResults = ESLint.getErrorResults(results);

  return errorResults;
}

// Log results to console if there are any problems
function outputLintingResults(results) {
  if (results.length) {
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
    // from a .eslintrc file or just use the default config.
    const overrideConfig = {
        env: {
            es6: true,
            node: true,
        },
        parserOptions: {
            ecmaVersion: 2018,
        },
        rules: {
            "no-console": "error",
            "no-unused-vars": "warn",
        },
    };

    const eslint = createESLintInstance(overrideConfig);
    const results = await getLintingResults(eslint, filePaths);
    return handleLintingResults(results);
}

module.exports = { lintFiles }