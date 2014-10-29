[![Build Status](https://travis-ci.org/eslint/eslint.svg?branch=master)](http://travis-ci.org/eslint/eslint)
[![NPM version](https://badge.fury.io/js/eslint.svg)](http://badge.fury.io/js/eslint)
[![Coverage Status](https://img.shields.io/coveralls/eslint/eslint.svg)](https://coveralls.io/r/eslint/eslint)
[![Bountysource](https://www.bountysource.com/badge/tracker?tracker_id=282608)](https://www.bountysource.com/trackers/282608-eslint?utm_source=282608&utm_medium=shield&utm_campaign=TRACKER_BADGE)

# ESLint

[Website](http://eslint.org) | [Documentation](http://eslint.org/docs) | [Contributing](http://eslint.org/docs/developer-guide/contributing.html) | [Twitter](https://twitter.com/geteslint) | [Mailing List](https://groups.google.com/group/eslint)

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code. In many ways, it is similar to JSLint and JSHint with a few exceptions:

* ESLint uses Esprima for JavaScript parsing.
* ESLint uses an AST to evaluate patterns in code.
* ESLint is completely pluggable, every single rule is a plugin and you can add more at runtime.

## Installation

You can install ESLint using npm:

    npm install -g eslint

## Usage

    eslint test.js test2.js

## Frequently Asked Questions

### Why don't you like JSHint???

I do like JSHint. And I like Anton and Rick. Neither of those were deciding factors in creating this tool. The fact is that I've had a dire need for a JavaScript tool with pluggable linting rules. I had hoped JSHint would be able to do this, however after chatting with Anton, I found that the planned plugin infrastructure wasn't going to suit my purpose.

### I'm not giving up JSHint for this!

That's not really a question, but I got it. I'm not trying to convince you that ESLint is better than JSHint. The only thing I know is that ESLint is better than JSHint for what I'm doing. In the off chance you're doing something similar, it might be better for you. Otherwise, keep using JSHint, I'm certainly not going to tell you to stop using it.

### How does ESLint performance compare to JSHint?

ESLint is slower than JSHint, usually 2-3x slower on a single file. This is because ESLint uses Esprima to construct an AST before it can evaluate your code whereas JSHint evaluates your code as it's being parsed. The speed is also based on the number of rules you enable; the more rules you enable, the slower the process. 

Despite being slower, we believe that ESLint is fast enough to replace JSHint without causing significant pain.

### Who is using ESLint?

The following projects are using ESLint to validate their JavaScript:

* [WebKit](https://bugs.webkit.org/show_bug.cgi?id=125048)
* [Drupal](https://www.drupal.org/node/2264205)
* [Esprima](https://github.com/ariya/esprima)

In addition, the following companies are using ESLint internally to validate their JavaScript:

* [Box](https://box.com)
* [the native web](http://www.thenativeweb.io)

### What are the plans for ESLint?

Check out the [ESLint Roadmap](https://github.com/eslint/eslint/wiki/Release-goals).

### What about ECMAScript 6 support?

At the moment, ES6 support is turned off due to the experimental nature of the support in Esprima. There is basic support for `let` and `const`, but aside from that, the rest of the features are unsupported. We will re-evaluate ES6 support for v0.9.0.

### Where to ask for help?

Join our [Mailing List](https://groups.google.com/group/eslint)
