# enforce consistent indentation (indent-legacy)

ESLint 4.0.0 introduced a rewrite of the [`indent`](/docs/rules/indent) rule, which now reports more errors than it did in previous versions. To ease the process of migrating to 4.0.0, the `indent-legacy` rule was introduced as a snapshot of the `indent` rule from ESLint 3.x. If your build is failing after the upgrade to 4.0.0, you can disable `indent` and enable `indent-legacy` as a quick fix. Eventually, you should switch back to the `indent` rule to get bugfixes and improvements in future versions.

---

There are several common guidelines which require specific indentation of nested blocks and statements, like:

```js
function hello(indentSize, type) {
    if (indentSize === 4 && type !== 'tab') {
        console.log('Each next indentation will increase on 4 spaces');
    }
}
```

These are the most common scenarios recommended in different style guides:

* Two spaces, not longer and no tabs: Google, npm, Node.js, Idiomatic, Felix
* Tabs: jQuery
* Four spaces: Crockford

## Rule Details

This rule enforces a consistent indentation style. The default style is `4 spaces`.

## Options

This rule has a mixed option:

For example, for 2-space indentation:

```json
{
    "indent": ["error", 2]
}
```

Or for tabbed indentation:

```json
{
    "indent": ["error", "tab"]
}
```

Examples of **incorrect** code for this rule with the default options:

```js
/*eslint indent: "error"*/

if (a) {
  b=c;
  function foo(d) {
    e=f;
  }
}
```

Examples of **correct** code for this rule with the default options:

```js
/*eslint indent: "error"*/

if (a) {
    b=c;
    function foo(d) {
        e=f;
    }
}
```

This rule has an object option:

* `"SwitchCase"` (default: 0) enforces indentation level for `case` clauses in `switch` statements
* `"VariableDeclarator"` (default: 1) enforces indentation level for `var` declarators; can also take an object to define separate rules for `var`, `let` and `const` declarations.
* `"outerIIFEBody"` (default: 1) enforces indentation level for file-level IIFEs.
* `"MemberExpression"` (off by default) enforces indentation level for multi-line property chains (except in variable declarations and assignments)
* `"FunctionDeclaration"` takes an object to define rules for function declarations.
    * `parameters` (off by default) enforces indentation level for parameters in a function declaration. This can either be a number indicating indentation level, or the string `"first"` indicating that all parameters of the declaration must be aligned with the first parameter.
    * `body` (default: 1) enforces indentation level for the body of a function declaration.
* `"FunctionExpression"` takes an object to define rules for function expressions.
    * `parameters` (off by default) enforces indentation level for parameters in a function expression. This can either be a number indicating indentation level, or the string `"first"` indicating that all parameters of the expression must be aligned with the first parameter.
    * `body` (default: 1) enforces indentation level for the body of a function expression.
* `"CallExpression"` takes an object to define rules for function call expressions.
    * `arguments` (off by default) enforces indentation level for arguments in a call expression. This can either be a number indicating indentation level, or the string `"first"` indicating that all arguments of the expression must be aligned with the first argument.
* `"ArrayExpression"` (default: 1) enforces indentation level for elements in arrays. It can also be set to the string `"first"`, indicating that all the elements in the array should be aligned with the first element.
* `"ObjectExpression"` (default: 1) enforces indentation level for properties in objects. It can be set to the string `"first"`, indicating that all properties in the object should be aligned with the first property.

Level of indentation denotes the multiple of the indent specified. Example:

* Indent of 4 spaces with `VariableDeclarator` set to `2` will indent the multi-line variable declarations with 8 spaces.
* Indent of 2 spaces with `VariableDeclarator` set to `2` will indent the multi-line variable declarations with 4 spaces.
* Indent of 2 spaces with `VariableDeclarator` set to `{"var": 2, "let": 2, "const": 3}` will indent the multi-line variable declarations with 4 spaces for `var` and `let`, 6 spaces for `const` statements.
* Indent of tab with `VariableDeclarator` set to `2` will indent the multi-line variable declarations with 2 tabs.
* Indent of 2 spaces with `SwitchCase` set to `0` will not indent `case` clauses with respect to `switch` statements.
* Indent of 2 spaces with `SwitchCase` set to `1` will indent `case` clauses with 2 spaces with respect to `switch` statements.
* Indent of 2 spaces with `SwitchCase` set to `2` will indent `case` clauses with 4 spaces with respect to `switch` statements.
* Indent of tab with `SwitchCase` set to `2` will indent `case` clauses with 2 tabs with respect to `switch` statements.
* Indent of 2 spaces with `MemberExpression` set to `0` will indent the multi-line property chains with 0 spaces.
* Indent of 2 spaces with `MemberExpression` set to `1` will indent the multi-line property chains with 2 spaces.
* Indent of 2 spaces with `MemberExpression` set to `2` will indent the multi-line property chains with 4 spaces.
* Indent of 4 spaces with `MemberExpression` set to `0` will indent the multi-line property chains with 0 spaces.
* Indent of 4 spaces with `MemberExpression` set to `1` will indent the multi-line property chains with 4 spaces.
* Indent of 4 spaces with `MemberExpression` set to `2` will indent the multi-line property chains with 8 spaces.

### tab

Examples of **incorrect** code for this rule with the `"tab"` option:

```js
/*eslint indent: ["error", "tab"]*/

if (a) {
     b=c;
function foo(d) {
           e=f;
 }
}
```

Examples of **correct** code for this rule with the `"tab"` option:

```js
/*eslint indent: ["error", "tab"]*/

if (a) {
/*tab*/b=c;
/*tab*/function foo(d) {
/*tab*//*tab*/e=f;
/*tab*/}
}
```

### SwitchCase

Examples of **incorrect** code for this rule with the `2, { "SwitchCase": 1 }` options:

```js
/*eslint indent: ["error", 2, { "SwitchCase": 1 }]*/

switch(a){
case "a":
    break;
case "b":
    break;
}
```

Examples of **correct** code for this rule with the `2, { "SwitchCase": 1 }` option:

```js
/*eslint indent: ["error", 2, { "SwitchCase": 1 }]*/

switch(a){
  case "a":
    break;
  case "b":
    break;
}
```

### VariableDeclarator

Examples of **incorrect** code for this rule with the `2, { "VariableDeclarator": 1 }` options:

```js
/*eslint indent: ["error", 2, { "VariableDeclarator": 1 }]*/
/*eslint-env es6*/

var a,
    b,
    c;
let a,
    b,
    c;
const a = 1,
    b = 2,
    c = 3;
```

Examples of **correct** code for this rule with the `2, { "VariableDeclarator": 1 }` options:

```js
/*eslint indent: ["error", 2, { "VariableDeclarator": 1 }]*/
/*eslint-env es6*/

var a,
  b,
  c;
let a,
  b,
  c;
const a = 1,
  b = 2,
  c = 3;
```

Examples of **correct** code for this rule with the `2, { "VariableDeclarator": 2 }` options:

```js
/*eslint indent: ["error", 2, { "VariableDeclarator": 2 }]*/
/*eslint-env es6*/

var a,
    b,
    c;
let a,
    b,
    c;
const a = 1,
    b = 2,
    c = 3;
```

Examples of **correct** code for this rule with the `2, { "VariableDeclarator": { "var": 2, "let": 2, "const": 3 } }` options:

```js
/*eslint indent: ["error", 2, { "VariableDeclarator": { "var": 2, "let": 2, "const": 3 } }]*/
/*eslint-env es6*/

var a,
    b,
    c;
let a,
    b,
    c;
const a = 1,
      b = 2,
      c = 3;
```

### outerIIFEBody

Examples of **incorrect** code for this rule with the options `2, { "outerIIFEBody": 0 }`:

```js
/*eslint indent: ["error", 2, { "outerIIFEBody": 0 }]*/

(function() {

  function foo(x) {
    return x + 1;
  }

})();


if(y) {
console.log('foo');
}
```

Examples of **correct** code for this rule with the options `2, {"outerIIFEBody": 0}`:

```js
/*eslint indent: ["error", 2, { "outerIIFEBody": 0 }]*/

(function() {

function foo(x) {
  return x + 1;
}

})();


if(y) {
   console.log('foo');
}
```

### MemberExpression

Examples of **incorrect** code for this rule with the `2, { "MemberExpression": 1 }` options:

```js
/*eslint indent: ["error", 2, { "MemberExpression": 1 }]*/

foo
.bar
.baz()
```

Examples of **correct** code for this rule with the `2, { "MemberExpression": 1 }` option:

```js
/*eslint indent: ["error", 2, { "MemberExpression": 1 }]*/

foo
  .bar
  .baz();

// Any indentation is permitted in variable declarations and assignments.
var bip = aardvark.badger
                  .coyote;
```

### FunctionDeclaration

Examples of **incorrect** code for this rule with the `2, { "FunctionDeclaration": {"body": 1, "parameters": 2} }` option:

```js
/*eslint indent: ["error", 2, { "FunctionDeclaration": {"body": 1, "parameters": 2} }]*/

function foo(bar,
  baz,
  qux) {
    qux();
}
```

Examples of **correct** code for this rule with the `2, { "FunctionDeclaration": {"body": 1, "parameters": 2} }` option:

```js
/*eslint indent: ["error", 2, { "FunctionDeclaration": {"body": 1, "parameters": 2} }]*/

function foo(bar,
    baz,
    qux) {
  qux();
}
```

Examples of **incorrect** code for this rule with the `2, { "FunctionDeclaration": {"parameters": "first"} }` option:

```js
/*eslint indent: ["error", 2, {"FunctionDeclaration": {"parameters": "first"}}]*/

function foo(bar, baz,
  qux, boop) {
  qux();
}
```

Examples of **correct** code for this rule with the `2, { "FunctionDeclaration": {"parameters": "first"} }` option:

```js
/*eslint indent: ["error", 2, {"FunctionDeclaration": {"parameters": "first"}}]*/

function foo(bar, baz,
             qux, boop) {
  qux();
}
```

### FunctionExpression

Examples of **incorrect** code for this rule with the `2, { "FunctionExpression": {"body": 1, "parameters": 2} }` option:

```js
/*eslint indent: ["error", 2, { "FunctionExpression": {"body": 1, "parameters": 2} }]*/

var foo = function(bar,
  baz,
  qux) {
    qux();
}
```

Examples of **correct** code for this rule with the `2, { "FunctionExpression": {"body": 1, "parameters": 2} }` option:

```js
/*eslint indent: ["error", 2, { "FunctionExpression": {"body": 1, "parameters": 2} }]*/

var foo = function(bar,
    baz,
    qux) {
  qux();
}
```

Examples of **incorrect** code for this rule with the `2, { "FunctionExpression": {"parameters": "first"} }` option:

```js
/*eslint indent: ["error", 2, {"FunctionExpression": {"parameters": "first"}}]*/

var foo = function(bar, baz,
  qux, boop) {
  qux();
}
```

Examples of **correct** code for this rule with the `2, { "FunctionExpression": {"parameters": "first"} }` option:

```js
/*eslint indent: ["error", 2, {"FunctionExpression": {"parameters": "first"}}]*/

var foo = function(bar, baz,
                   qux, boop) {
  qux();
}
```

### CallExpression

Examples of **incorrect** code for this rule with the `2, { "CallExpression": {"arguments": 1} }` option:

```js
/*eslint indent: ["error", 2, { "CallExpression": {"arguments": 1} }]*/

foo(bar,
    baz,
      qux
);
```

Examples of **correct** code for this rule with the `2, { "CallExpression": {"arguments": 1} }` option:

```js
/*eslint indent: ["error", 2, { "CallExpression": {"arguments": 1} }]*/

foo(bar,
  baz,
  qux
);
```

Examples of **incorrect** code for this rule with the `2, { "CallExpression": {"arguments": "first"} }` option:

```js
/*eslint indent: ["error", 2, {"CallExpression": {"arguments": "first"}}]*/

foo(bar, baz,
  baz, boop, beep);
```

Examples of **correct** code for this rule with the `2, { "CallExpression": {"arguments": "first"} }` option:

```js
/*eslint indent: ["error", 2, {"CallExpression": {"arguments": "first"}}]*/

foo(bar, baz,
    baz, boop, beep);
```

### ArrayExpression

Examples of **incorrect** code for this rule with the `2, { "ArrayExpression": 1 }` option:

```js
/*eslint indent: ["error", 2, { "ArrayExpression": 1 }]*/

var foo = [
    bar,
baz,
      qux
];
```

Examples of **correct** code for this rule with the `2, { "ArrayExpression": 1 }` option:

```js
/*eslint indent: ["error", 2, { "ArrayExpression": 1 }]*/

var foo = [
  bar,
  baz,
  qux
];
```

Examples of **incorrect** code for this rule with the `2, { "ArrayExpression": "first" }` option:

```js
/*eslint indent: ["error", 2, {"ArrayExpression": "first"}]*/

var foo = [bar,
  baz,
  qux
];
```

Examples of **correct** code for this rule with the `2, { "ArrayExpression": "first" }` option:

```js
/*eslint indent: ["error", 2, {"ArrayExpression": "first"}]*/

var foo = [bar,
           baz,
           qux
];
```

### ObjectExpression

Examples of **incorrect** code for this rule with the `2, { "ObjectExpression": 1 }` option:

```js
/*eslint indent: ["error", 2, { "ObjectExpression": 1 }]*/

var foo = {
    bar: 1,
baz: 2,
      qux: 3
};
```

Examples of **correct** code for this rule with the `2, { "ObjectExpression": 1 }` option:

```js
/*eslint indent: ["error", 2, { "ObjectExpression": 1 }]*/

var foo = {
  bar: 1,
  baz: 2,
  qux: 3
};
```

Examples of **incorrect** code for this rule with the `2, { "ObjectExpression": "first" }` option:

```js
/*eslint indent: ["error", 2, {"ObjectExpression": "first"}]*/

var foo = { bar: 1,
  baz: 2 };
```

Examples of **correct** code for this rule with the `2, { "ObjectExpression": "first" }` option:

```js
/*eslint indent: ["error", 2, {"ObjectExpression": "first"}]*/

var foo = { bar: 1,
            baz: 2 };
```

## Compatibility

* **JSHint**: `indent`
* **JSCS**: [validateIndentation](https://jscs-dev.github.io/rule/validateIndentation)
