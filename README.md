[![Build Status](https://travis-ci.org/eslint/eslint.svg?branch=master)](http://travis-ci.org/eslint/eslint)
[![NPM version](https://badge.fury.io/js/eslint.svg)](http://badge.fury.io/js/eslint)

# ESLint

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code. In many ways, it is similar to JSLint and JSHint with a few exceptions:

* ESLint uses Esprima for JavaScript parsing.
* ESLint uses an AST to evaluate patterns in code.
* ESLint is completely pluggable, every single rule is a plugin and you can add more at runtime.

## Alpha Version

ESLint, as of v0.1.0, is in alpha, meaning that there is some stability but you shouldn't be depending on it as your only means of code verification at this time. The alpha version is intended to gather feedback from the community, catch bugs, and determine general direction for the project.

When ESLint v0.5.0 is released, it will be in beta and will have more stability in terms of interface and API.

## Installation

You can install ESLint using npm:

    npm install -g eslint

## Usage

    eslint test.js test2.js

## Frequently Asked Questions
### Why don't you like JSHint???

I do like JSHint. And I like Anton. Neither of those were deciding factors in creating this tool. The fact is that I've had a dire need for a JavaScript tool with pluggable linting rules. I had hoped JSHint would be able to do this, however after chatting with Anton, I found that the planned plugin infrastructure wasn't going to suit my purpose.

### I'm not giving up JSHint for this!

That's not really a question, but I got it. I'm not trying to convince you that ESLint is better than JSHint. The only thing I know is that ESLint is better than JSHint for what I'm doing. In the off chance you're doing something similar, it might be better for you. Otherwise, keep using JSHint, I'm certainly not going to tell you to stop using it.

### What are the plans for ESLint?

Our first goal for ESLint is to hit rule and stability parity with JSHint so that developers can start using ESLint as part of their production toolchain. The master list of JSHint features to be implemented is maintained in this [Google Docs spreadsheet](https://docs.google.com/spreadsheet/lv?key=0Ap5QGaRT4AJ_dGV6VXBlMEw3NHhVRl9vQ0lIX2FnVlE&usp=sharing). To read about plans beyond parity with JSHint, check out the [ESLint Roadmap](https://github.com/eslint/eslint/wiki/Release-goals).

### What about ECMAScript 6 support?

At the moment, ES6 support is turned off due to the experimental nature of the support in Esprima. There is basic support for `let` and `const`, but aside from that, the rest of the features are unsupported. We will re-evaluate ES6 support after v0.5.0.

### Where to ask for help?

Join our [Mailing List](https://groups.google.com/group/eslint)
