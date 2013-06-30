# JSCheck

JSCheck is a tool for identifying and reporting on patterns found in JavaScript code. In many ways, it is similar to JSLint and JSHint with a few exceptions:

* JSCheck uses Esprima for JavaScript parsing.
* JSCheck uses an AST to evaluate patterns in code.
* JSCheck is completely pluggable, every single rule is a plugin and you can add more at runtime.

## Installation

You can install JSCheck using npm:

    npm i -g jscheck

## Usage

    jscheck test.js test2.js

## Frequently Asked Questions
### Why don't you like JSHint???

I do like JSHint. And I like Anton. Neither of those were deciding factors in creating this tool. The fact is that I've had a dire need for a JavaScript tool with pluggable linting rules. I had hoped JSHint would be able to do this, however after chatting with Anton, I found that the planned plugin infrastructure wasn't going to suit my purpose.

### I'm not giving up JSHint for this!

That's not really a question, but I got it. I'm not trying to convince you that JSCheck is better than JSHint. The only thing I know is that JSCheck is better than JSHint for what I'm doing. In the off chance you're doing something similar, it might be better for you. Otherwise, keep using JSHint, I'm certainly not going to tell you to stop using it.
