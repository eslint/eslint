# Validate Indentation (indent)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

This option validates a specific tab width for your code in block statements.

There are several common guidelines which require specific indentation of nested blocks and statements, like:

```js
function hello(indentSize, type) {
    if (indentSize === 4 && type !== 'tab') {
        console.log('Each next indentation will increase on 4 spaces');
    }
}
```

This is the most common scenarios recommended in different style guides:

* Two spaces, not longer and no tabs: Google, npm, Node.js, Idiomatic, Felix
* Tabs: jQuery
* Four spaces: Crockford

## Rule Details

This rule is aimed to enforce consistent indentation style. The default style is `4 spaces`.

It takes an option as the second parameter which can be `"tab"` for tab-based indentation or a positive number for space indentations.

## Options

The `indent` rule has two options:

* Indentation style, positive number or `tab` (see rule details for examples)
* Configuring optional validations, `Object`.
    * `SwitchCase` - Level of switch cases indent, 0 by default.
    * `VariableDeclarator` - Level of variable declaration indent, 1 by default. Can take an object to define separate rules for `var`, `let` and `const` declarations.

Level of indentation denotes the multiple of the indent specified. Example:

* Indent of 4 spaces with `VariableDeclarator` set to `2` will indent the multi-line variable declarations with 8 spaces.
* Indent of 2 spaces with `VariableDeclarator` set to `2` will indent the multi-line variable declarations with 4 spaces.
* Indent of 2 spaces with `VariableDeclarator` set to `{"var": 2, "let": 2, "const": 3}` will indent the multi-line variable declarations with 4 spaces for `var` and `let`, 6 spaces for `const` statements.
* Indent of tab with `VariableDeclarator` set to 2 will indent the multi-line variable declarations with 2 tabs.
* Indent of 2 spaces with SwitchCase set to 0 will not indent `SwitchCase` with respect to switch.
* Indent of 2 spaces with SwitchCase set to 2 will indent `SwitchCase` with 4 space with respect to switch.
* Indent of tabs with SwitchCase set to 2 will indent `SwitchCase` with 2 tabs with respect to switch.


2 space indentation with enabled switch cases indentation

```json
 "indent": ["error", 2, {"SwitchCase": 1}]
```

4 space indention

```json
"indent": "error"
```

2 space indentation

```json
"indent": ["error", 2]
```

tabbed indentation

```json
"indent": ["error", "tab"]
```

The following patterns are considered problems:

```js
/*eslint indent: ["error", 2]*/

if (a) {
   b=c;
function foo(d) {
       e=f;
}
}
```

```js
/*eslint indent: ["error", "tab"]*/

if (a) {
     b=c;
function foo(d) {
           e=f;
 }
}
```

```js
/*eslint indent: ["error", 2, {"VariableDeclarator": 1}]*/
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

```js
/*eslint indent: ["error", 2, {"SwitchCase": 1}]*/

switch(a){
case "a":
    break;
case "b":
    break;
}
```

The following patterns are not considered problems:

```js
/*eslint indent: ["error", 2]*/

if (a) {
  b=c;
  function foo(d) {
    e=f;
  }
}
```

```js
/*indent: ["error", "tab"]*/

if (a) {
/*tab*/b=c;
/*tab*/function foo(d) {
/*tab*//*tab*/e=f;
/*tab*/}
}
```

```js
/*eslint indent: ["error", 2, {"VariableDeclarator": 2}]*/
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

```js
/*eslint indent: ["error", 2, {"VariableDeclarator": { "var": 2, "let": 2, "const": 3}}]*/
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

```js
/*eslint indent: ["error", 4, {"SwitchCase": 1}]*/

switch(a){
    case "a":
        break;
    case "b":
        break;
}
```


## Compatibility

* **JSHint**: `indent`
* **JSCS**: `validateIndentation`
