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

## Rule Details

This rule is aimed to enforce consistent indentation style. The default style is `4 spaces`.

It takes an option as the second parameter which can be `"tab"` for tab-based indentation or a positive number for space indentations.

### Options

The `indent` rule has two options:

* Indentation style, positive number or `tab` (see rule details for examples)
* Configuring optional validations, `Object`.
    * `SwitchCase` - Level of switch cases indent, 0 by default.
    * `VariableDeclarator` - Level of variable declaration indent, 1 by default.

Level of indentation denotes the multiple of the indent specified. Example:

* Indent of 4 spaces with `VariableDeclarator` set to 3 will indent the multi-line variable declarations with 6 spaces with respect to the variable declarator keyword.
* Indent of 2 spaces with `VariableDeclarator` set to 2 will indent the multi-line variable declarations with 4 spaces with respect to the variable declarator keyword.
* Indent of tab with `VariableDeclarator` set to 2 will indent the multi-line variable declarations with 2 tabs.
* Indent of 2 spaces with SwitchCase set to 0 will not indent `SwitchCase` with respect to switch.
* Indent of 2 spaces with SwitchCase set to 2 will indent `SwitchCase` with 4 spaces with respect to switch.
* Indent of tabs with SwitchCase set to 1 will indent `SwitchCase` with 2 tabs with respect to switch.


```js
// 2 space indentation with enabled switch cases validation
 "indent": [2, 2, {"SwitchCase": 1}]

// 4 space indention
"indent": 2

// 2 space indentation
"indent": [2, 2]

// tabbed indentation
"indent": [2, "tab"]
```

The following patterns are considered warnings:

```js
// 2 spaces indentation
if (a) {
   b=c;
function(d) {
       e=f;
}
}

// tab indentation
if (a) {
     b=c;
function(d) {
           e=f;
 }
}

// variable declarations
// "indent": [2, 2, {"VariableDeclarator": 1}]
var a,
    b,
    c;
let a,
    b,
    c;
const a,
    b,
    c;

// switch case
// "indent": [2, 2, {"SwitchCase": 1}]
switch(a){
case "a":
    break;
case "b":
    break;
}
```

The following patterns are not warnings:

```js
// 2 space indentation
if (a) {
  b=c;
  function(d) {
    e=f;
  }
}

// tabbed indentation
if (a) {
    b=c;
    function(d) {
        e=f;
    }
}

// variable declarations
// "indent": [2, 2, {"VariableDeclarator": 2}]
var a,
    b,
    c;
let a,
    b,
    c;
const a = 1,
    b = 2,
    c = 3;

// switch case
// "indent": [2, 2, {"SwitchCase": 1}]
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
