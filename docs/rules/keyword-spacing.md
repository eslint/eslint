# Enforce spacing before and after keywords (keyword-spacing)

Keywords are syntax elements of JavaScript, such as `function` and `if`.
These identifiers have special meaning to the language and so often appear in a different color in code editors.
As an important part of the language, style guides often refer to the spacing that should be used around keywords.
For example, you might have a style guide that says keywords should be always surrounded by spaces, which would mean `if-else` statements must look like this:

```js
if (foo) {
    // ...
} else {
    // ...
}
```

Of course, you could also have a style guide that disallows spaces around keywords.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule will enforce consistency of spacing around keywords and keyword-like tokens: `as` (in module declarations), `break`, `case`, `catch`, `class`, `const`, `continue`, `debugger`, `default`, `delete`, `do`, `else`, `export`, `extends`, `finally`, `for`, `from` (in module declarations), `function`, `get` (of getters), `if`, `import`, `in`, `instanceof`, `let`, `new`, `of` (in for-of statements), `return`, `set` (of setters), `static`, `super`, `switch`, `this`, `throw`, `try`, `typeof`, `var`, `void`, `while`, `with`, and `yield`.

The following patterns are considered problems:

```js
/*eslint keyword-spacing: 2*/
/*eslint-env es6*/

if(foo){
    //...
}else if (bar) {
    //...
} else{
    //...
}

try{
    //...
}catch(e) {
    //...
}

switch (a) {
    case+1:
        break;
}

function foo() {
    return[0, 1, 2];
}

for (let[a, b]of[foo, bar, baz]) {
    //...
}

let obj = {
    get[FOO]() {
        //...
    },
    set[FOO](value) {
        //...
    }
};

import{foo}from"foo";
import*as bar from "foo";
```

The following patterns are considered not problems:

```js
/*eslint keyword-spacing: 2*/
/*eslint-env es6*/

if (foo) {
    //...
} else if (bar) {
    //...
} else {
    //...
}

try {
    //...
} catch (e) {
    //...
}

switch (a) {
    case +1:
        break;
}

function foo() {
    return [0, 1, 2];
}

for (let [a, b] of [foo, bar, baz]) {
    //...
}

let obj = {
    get [FOO]() {
        //...
    },
    set [FOO](value) {
        //...
    }
};

import {foo} from "foo";
import * as bar from "foo";
```

This rule is designed carefully to not conflict with other spacing rules.
Basically this rule ignores usage of spacing at places that other rules are catching.
So the following patterns are considered not problems.

```js
/*eslint keyword-spacing: 2*/
/*eslint-env es6*/

// not conflict with `array-bracket-spacing`
let a = [this];
let b = [function() {}];

// not conflict with `arrow-spacing`
let a = () =>this.foo;

// not conflict with `block-spacing`
{function foo() {}}

// not conflict with `comma-spacing`
let a = [100,this.foo, this.bar];

// not conflict with `computed-property-spacing`
obj[this.foo] = 0;

// not conflict with `generator-star-spacing`
function* foo() {}

// not conflict with `key-spacing`
let obj = {
    foo:function() {}
};

// not conflict with `no-spaced-func`
class A {
    constructor() {
        super();
    }
}

// not conflict with `object-curly-spacing`
let obj = {foo: this};

// not conflict with `semi-spacing`
let a = this;function foo() {}

// not conflict with `space-before-function-paren`
// not conflict with `space-in-parens`
(function() {})();

// not conflict with `space-infix-ops`
if ("foo"in{foo: 0}) {}
if (10+this.foo <=this.bar) {}

// not conflict with `space-unary-ops`
function* foo(a) {
    return yield+a;
}

// not conflict with `yield-star-spacing`
function* foo(a) {
    return yield* a;
}

// not conflict with `jsx-curly-spacing`
let a = <A foo={this.foo} bar={function(){}} />
```


## Options

This rule has 3 options.

```json
{
    "keyword-spacing": [2, {"before": true, "after": true, "overrides": {}}]
}
```

- `"before"` (`boolean`, default is `true`) -
  This option specifies usage of spacing before the keywords.
  If `true` then the keywords must be preceded by at least one space.
  Otherwise, no spaces will be allowed before the keywords (if possible).
- `"after"` (`boolean`, default is `true`) -
  This option specifies usage of spacing after the keywords.
  If `true` then the keywords must be followed by at least one space.
  Otherwise, no spaces will be allowed after the keywords (if possible).
- `"overrides"` (`object`, default is `{}`) -
  This option specifies overwriting usage of spacing for each keyword.
  For Example:

  ```json
  {
      "keyword-spacing": [2, {"overrides": {
          "if": {"after": false},
          "for": {"after": false},
          "while": {"after": false}
      }}]
  }
  ```

  In this case, no spaces will be allowed only after `if`, `for`, and `while`.

The following patterns are considered problems when configured `{"before": false, "after": false}`:

```js
/*eslint keyword-spacing: [2, {before: false, after: false}]*/
/*eslint-env es6*/

if (foo){
    //...
} else if(bar) {
    //...
}else {
    //...
}

try {
    //...
} catch (e) {
    //...
}

switch(a) {
    case +1:
        break;
}

function foo() {
    return [0, 1, 2];
}

for (let [a, b] of [foo, bar, baz]) {
    //...
}

let obj = {
    get [FOO]() {
        //...
    },
    set [FOO](value) {
        //...
    }
};

import {foo} from "foo";
import * as bar from"foo";
```

The following patterns are considered not problems when configured `{"before": false, "after": false}`:

```js
/*eslint keyword-spacing: [2, {before: false, after: false}]*/
/*eslint-env es6*/

if(foo) {
    //...
}else if(bar) {
    //...
}else{
    //...
}

try{
    //...
}catch(e) {
    //...
}

switch(a) {
    case+1:
        break;
}

function foo() {
    return[0, 1, 2];
}

for(let[a, b]of[foo, bar, baz]) {
    //...
}

let obj = {
    get[FOO]() {
        //...
    },
    set[FOO](value) {
        //...
    }
};
```

## When Not To Use It

If you don't want to enforce consistency on keyword spacing, then it's safe to disable this rule.
