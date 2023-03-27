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

