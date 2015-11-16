# Validate Indentation (indent)

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

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule is aimed to enforce consistent indentation style. The default style is `4 spaces`.

It takes an option as the second parameter which can be `"tab"` for tab-based indentation or a positive number for space indentations.

### Options

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
 "indent": [2, 2, {"SwitchCase": 1}]
```

4 space indention

```json
"indent": 2
```

2 space indentation

```json
"indent": [2, 2]
```

tabbed indentation

```json
"indent": [2, "tab"]
```

The following patterns are considered problems:

```js
/*eslint indent: [2, 2]*/

if (a) {
   b=c;            /*error Expected indentation of 2 space characters but found 3.*/
function foo(d) {  /*error Expected indentation of 2 space characters but found 0.*/
       e=f;        /*error Expected indentation of 2 space characters but found 7.*/
}                  /*error Expected indentation of 6 space characters but found 0.*/
}
```

```js
/*eslint indent: [2, "tab"]*/

if (a) {
     b=c;          /*error Expected indentation of 1 tab character but found 0.*/
function foo(d) {  /*error Expected indentation of 1 tab character but found 0.*/
           e=f;    /*error Expected indentation of 1 tab character but found 0.*/
 }
}
```

```js
/*eslint indent: [2, 2, {"VariableDeclarator": 1}]*/
/*eslint-env es6*/

var a,
    b,             /*error Expected indentation of 2 space characters but found 4.*/
    c;             /*error Expected indentation of 2 space characters but found 4.*/
let a,
    b,             /*error Expected indentation of 2 space characters but found 4.*/
    c;             /*error Expected indentation of 2 space characters but found 4.*/
const a = 1,
    b = 2,         /*error Expected indentation of 2 space characters but found 4.*/
    c = 3;         /*error Expected indentation of 2 space characters but found 4.*/
```

```js
/*eslint indent: [2, 2, {"SwitchCase": 1}]*/

switch(a){
case "a":          /*error Expected indentation of 2 space characters but found 0.*/
    break;
case "b":          /*error Expected indentation of 2 space characters but found 0.*/
    break;
}
```

The following patterns are not considered problems:

```js
/*eslint indent: [2, 2]*/

if (a) {
  b=c;
  function foo(d) {
    e=f;
  }
}
```

```js
/*indent: [2, "tab"]*/

if (a) {
/*tab*/b=c;
/*tab*/function foo(d) {
/*tab*//*tab*/e=f;
/*tab*/}
}
```

```js
/*eslint indent: [2, 2, {"VariableDeclarator": 2}]*/
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
/*eslint indent: [2, 2, {"VariableDeclarator": { "var": 2, "let": 2, "const": 3}}]*/
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
/*eslint indent: [2, 4, {"SwitchCase": 1}]*/

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
