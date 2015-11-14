# Require braces in arrow function body (arrow-body-style)

Arrow functions can omit braces when there is a single statement in the body. This rule enforces the consistent use of braces in arrow functions.

Additionally, this rule specifically warns against a possible developer error when the intention is to return an empty object literal but creates an empty block instead, returning undefined.

```js
/*eslint-env es6*/
// Bad
var foo = () => {};

// Good
var foo = () => ({});
```

## Rule Details

This rule can enforce the use of braces around arrow function body.

### Options

The rule takes one option, a string, which can be:

* `"always"` enforces braces around the function body
* `"as-needed"` enforces no braces where they can be omitted (default)

#### "always"

```json
"arrow-body-style": [2, "always"]
```

When the rule is set to `"always"` the following patterns are considered problems:

```js
/*eslint arrow-body-style: [2, "always"]*/
/*eslint-env es6*/
let foo = () => 0;
```

The following patterns are not considered problems:

```js
let foo = () => {
    return 0;
};
let foo = (retv, name) => {
    retv[name] = true;
    return retv;
};
```

#### "as-needed"

When the rule is set to `"as-needed"` the following patterns are considered problems:

```js
/*eslint arrow-body-style: [2, "as-needed"]*/
/*eslint-env es6*/

let foo = () => {
    return 0;
};

let foo = () => {};
```

The following patterns are not considered problems:

```js
/*eslint arrow-body-style: [2, "as-needed"]*/
/*eslint-env es6*/

let foo = () => 0;
let foo = (retv, name) => {
    retv[name] = true;
    return retv;
};
let foo = () => { bar(); };
let foo = () => { /* do nothing */ };
let foo = () => {
    // do nothing.
};
```
