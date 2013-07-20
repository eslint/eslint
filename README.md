[![Build Status](https://secure.travis-ci.org/nzakas/eslint.png?branch=master)](http://travis-ci.org/nzakas/eslint)

# ESLint

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code. In many ways, it is similar to JSLint and JSHint with a few exceptions:

* ESLint uses Esprima for JavaScript parsing.
* ESLint uses an AST to evaluate patterns in code.
* ESLint is completely pluggable, every single rule is a plugin and you can add more at runtime.

## WARNING: Pre-alpha

Right now, ESLint is in early development and should not be relied upon. There are no guarantees that anything is working at any particular point in time. Installing directly from GitHub increases the likelihood that something will explode, so if you'd like to try it out, please install the official release from npm.

Prior to version 0.1.0, this utility should be considered completely unstable.

## Installation

You can install ESLint using npm:

    npm i -g eslint

## Usage

    eslint test.js test2.js

## Frequently Asked Questions
### Why don't you like JSHint???

I do like JSHint. And I like Anton. Neither of those were deciding factors in creating this tool. The fact is that I've had a dire need for a JavaScript tool with pluggable linting rules. I had hoped JSHint would be able to do this, however after chatting with Anton, I found that the planned plugin infrastructure wasn't going to suit my purpose.

### I'm not giving up JSHint for this!

That's not really a question, but I got it. I'm not trying to convince you that ESLint is better than JSHint. The only thing I know is that ESLint is better than JSHint for what I'm doing. In the off chance you're doing something similar, it might be better for you. Otherwise, keep using JSHint, I'm certainly not going to tell you to stop using it.

### Where to ask for help?

Join our [Mailing List](https://groups.google.com/group/eslint)