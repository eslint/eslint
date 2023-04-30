/** 
 * @fileoverview Example of a file that will fail the custom rule in this tutorial.
 * @author Ben Perlmutter
*/
"use strict";

/* eslint-disable no-unused-vars -- Disable other rule causing problem for this file */

// To see the error in the terminal, run the following command:
// npx eslint example.js

// To fix the error, run the following command:
// npx eslint example.js --fix

function correctFooBar() {
  const foo = "bar";
}

function incorrectFoo(){
  const foo = "baz"; // Problem!
}

