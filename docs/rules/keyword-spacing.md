# enforce consistent spacing before and after keywords (keyword-spacing)

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

## Rule Details

This rule enforces consistent spacing around keywords and keyword-like tokens: `as` (in module declarations), `async` (of async functions), `await` (of await expressions), `break`, `case`, `catch`, `class`, `const`, `continue`, `debugger`, `default`, `delete`, `do`, `else`, `export`, `extends`, `finally`, `for`, `from` (in module declarations), `function`, `get` (of getters), `if`, `import`, `in`, `instanceof`, `let`, `new`, `of` (in for-of statements), `return`, `set` (of setters), `static`, `super`, `switch`, `this`, `throw`, `try`, `typeof`, `var`, `void`, `while`, `with`, and `yield`. This rule is designed carefully not to conflict with other spacing rules: it does not apply to spacing where other rules report problems.

## Options

This rule has an object option:

* `"before": true` (default) requires at least one space before keywords
* `"before": false` disallows spaces before keywords
* `"after": true` (default) requires at least one space after keywords
* `"after": false` disallows spaces after keywords
* `"overrides"` allows overriding spacing style for specified keywords

### before

Examples of **incorrect** code for this rule with the default `{ "before": true }` option:

```js
/*eslint keyword-spacing: ["error", { "before": true }]*/

if (foo) {
    //...
}else if (bar) {
    //...
}else {
    //...
}
```

Examples of **correct** code for this rule with the default `{ "before": true }` option:

```js
/*eslint keyword-spacing: ["error", { "before": true }]*/
/*eslint-env es6*/

if (foo) {
    //...
} else if (bar) {
    //...
} else {
    //...
}

// Avoid conflict with `array-bracket-spacing`
let a = [this];
let b = [function() {}];

// Avoid conflict with `arrow-spacing`
let a = ()=> this.foo;

// Avoid conflict with `block-spacing`
{function foo() {}}

// Avoid conflict with `comma-spacing`
let a = [100,this.foo, this.bar];

// Avoid conflict with `computed-property-spacing`
obj[this.foo] = 0;

// Avoid conflict with `generator-star-spacing`
function *foo() {}

// Avoid conflict with `key-spacing`
let obj = {
    foo:function() {}
};

// Avoid conflict with `object-curly-spacing`
let obj = {foo: this};

// Avoid conflict with `semi-spacing`
let a = this;function foo() {}

// Avoid conflict with `space-in-parens`
(function () {})();

// Avoid conflict with `space-infix-ops`
if ("foo"in {foo: 0}) {}
if (10+this.foo<= this.bar) {}

// Avoid conflict with `jsx-curly-spacing`
let a = <A foo={this.foo} bar={function(){}} />
```

Examples of **incorrect** code for this rule with the `{ "before": false }` option:

```js
/*eslint keyword-spacing: ["error", { "before": false }]*/

if (foo) {
    //...
} else if (bar) {
    //...
} else {
    //...
}
```

Examples of **correct** code for this rule with the `{ "before": false }` option:

```js
/*eslint keyword-spacing: ["error", { "before": false }]*/

if (foo) {
    //...
}else if (bar) {
    //...
}else {
    //...
}
```

### after

Examples of **incorrect** code for this rule with the default `{ "after": true }` option:

```js
/*eslint keyword-spacing: ["error", { "after": true }]*/

if(foo) {
    //...
} else if(bar) {
    //...
} else{
    //...
}
```

Examples of **correct** code for this rule with the default `{ "after": true }` option:

```js
/*eslint keyword-spacing: ["error", { "after": true }]*/

if (foo) {
    //...
} else if (bar) {
    //...
} else {
    //...
}

// Avoid conflict with `array-bracket-spacing`
let a = [this];

// Avoid conflict with `arrow-spacing`
let a = ()=> this.foo;

// Avoid conflict with `comma-spacing`
let a = [100, this.foo, this.bar];

// Avoid conflict with `computed-property-spacing`
obj[this.foo] = 0;

// Avoid conflict with `generator-star-spacing`
function* foo() {}

// Avoid conflict with `key-spacing`
let obj = {
    foo:function() {}
};

// Avoid conflict with `func-call-spacing`
class A {
    constructor() {
        super();
    }
}

// Avoid conflict with `object-curly-spacing`
let obj = {foo: this};

// Avoid conflict with `semi-spacing`
let a = this;function foo() {}

// Avoid conflict with `space-before-function-paren`
function() {}

// Avoid conflict with `space-infix-ops`
if ("foo"in{foo: 0}) {}
if (10+this.foo<= this.bar) {}

// Avoid conflict with `space-unary-ops`
function* foo(a) {
    return yield+a;
}

// Avoid conflict with `yield-star-spacing`
function* foo(a) {
    return yield* a;
}

// Avoid conflict with `jsx-curly-spacing`
let a = <A foo={this.foo} bar={function(){}} />
```

Examples of **incorrect** code for this rule with the `{ "after": false }` option:

```js
/*eslint keyword-spacing: ["error", { "after": false }]*/

if (foo) {
    //...
} else if (bar) {
    //...
} else {
    //...
}
```

Examples of **correct** code for this rule with the `{ "after": false }` option:

```js
/*eslint keyword-spacing: ["error", { "after": false }]*/

if(foo) {
    //...
} else if(bar) {
    //...
} else{
    //...
}
```

### overrides

Examples of **correct** code for this rule with the `{ "overrides": { "if": { "after": false }, "for": { "after": false }, "while": { "after": false } } }` option:

```js
/*eslint keyword-spacing: ["error", { "overrides": {
  "if": { "after": false },
  "for": { "after": false },
  "while": { "after": false }
} }]*/

if(foo) {
    //...
} else if(bar) {
    //...
} else {
    //...
}

for(;;);

while(true) {
  //...
}
```

## When Not To Use It

If you don't want to enforce consistency on keyword spacing, then it's safe to disable this rule.
