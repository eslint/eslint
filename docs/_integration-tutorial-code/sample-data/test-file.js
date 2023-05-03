/** 
 * @fileoverview Example data to lint using ESLint. This file contains a variety of errors.
 * @author Ben Perlmutter
 */
v// 'var' should be replaced with 'const' or 'let' (no-var from eslint:recommended)
var x = 10;

// Unused variable 'y' (no-unused-vars from custom rules)
const y = 20;

function add(a, b) {
  // Unexpected console statement (no-console from custom rules)
  console.log('Adding two numbers');
  return a + b;
}

// 'result' is assigned a value but never used (no-unused-vars from custom rules)
const result = add(x, 5);

// Expected indentation of 2 spaces but found 4 (indent from eslint:recommended)
    if (x > 5) {
        // Unexpected console statement (no-console from custom rules)
        console.log('x is greater than 5');
    } else {
        // Unexpected console statement (no-console from custom rules)
        console.log('x is not greater than 5');
    }

// 'subtract' is defined but never used (no-unused-vars from custom rules)
function subtract(a, b) {
  return a - b;
}
