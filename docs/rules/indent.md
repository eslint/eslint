# Validate Indentation (indent)

This option validates a specific tab width for your code in block statements.

There are several common guidelines, which indentation your code should have in nested blocks and statements, like:

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

It takes an option as the second parameter which can be `"tab"` for tabs indentation or a positive number for space indentations.

```js
// 4 spaces indention
"indent": 2

// 2 spaces indentation
"indent": [2, 2]

// tabs indentation
"indent": [2, "tab"]

// 4 spaces indentation with enabled switch cases validation
 "indent": [2, 4, {"indentSwitchCase": true}]
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

```

The following patterns are not warnings:

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
```

### Options

The `indent` rule has two options:

* Indentation style, positive number or `tab` (see rule detail for samples)
* Configuring optional validations, `Object`.
    * `indentSwitchCase` - indent switch cases, `false` by default.

```js
// 2 spaces indentation with enabled switch cases validation
 "indent": [2, 2, {"indentSwitchCase": true}]
```

## Compatibility

* **JSHint**: `indent`
* **JSCS**: `validateIndentation`
