# enforce consistent indentation (indent)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

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

* `"SwitchCase"` (default: 0) enforces indentation level for `switch` cases
* `"VariableDeclarator"` (default: 1) enforces indentation level for `var` declarators; can also take an object to define separate rules for `var`, `let` and `const` declarations.

Level of indentation denotes the multiple of the indent specified. Example:

* Indent of 4 spaces with `VariableDeclarator` set to `2` will indent the multi-line variable declarations with 8 spaces.
* Indent of 2 spaces with `VariableDeclarator` set to `2` will indent the multi-line variable declarations with 4 spaces.
* Indent of 2 spaces with `VariableDeclarator` set to `{"var": 2, "let": 2, "const": 3}` will indent the multi-line variable declarations with 4 spaces for `var` and `let`, 6 spaces for `const` statements.
* Indent of tab with `VariableDeclarator` set to 2 will indent the multi-line variable declarations with 2 tabs.
* Indent of 2 spaces with SwitchCase set to 0 will not indent `SwitchCase` with respect to switch.
* Indent of 2 spaces with SwitchCase set to 2 will indent `SwitchCase` with 4 space with respect to switch.
* Indent of tabs with SwitchCase set to 2 will indent `SwitchCase` with 2 tabs with respect to switch.

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

## Compatibility

* **JSHint**: `indent`
* **JSCS**: `validateIndentation`
