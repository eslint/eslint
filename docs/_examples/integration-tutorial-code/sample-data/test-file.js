/** 
 * @fileoverview Example data to lint using ESLint. This file contains a variety of errors.
 * @author Ben Perlmutter
 */

// Unused variable 'y' (no-unused-vars from configured rules)
const y = 20;

function add(a, b) {
  // Unexpected console statement (no-console from configured rules)
  console.log('Adding two numbers');
  return a + b;
}

// 'result' is assigned a value but never used (no-unused-vars from configured rules)
const result = add(x, 5);

if (x > 5) {
    // Unexpected console statement (no-console from configured rules)
    console.log('x is greater than 5');
} else {
    // Unexpected console statement (no-console from configured rules)
    console.log('x is not greater than 5');
}

// 'subtract' is defined but never used (no-unused-vars from configured rules)
function subtract(a, b) {
  return a - b;
}
