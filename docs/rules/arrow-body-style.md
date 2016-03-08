# Require braces in arrow function body (arrow-body-style)

Arrow functions can omit braces when there is a single statement in the body. This rule enforces the consistent use of braces in arrow functions.

## Rule Details

This rule can enforce the use of braces around arrow function body.

## Options

The rule takes two options, a string, which can be:

* `"always"` enforces braces around the function body
* `"as-needed"` enforces no braces where they can be omitted (default)

and an object with values that apply when `"as-needed"` is applied:

* `"max-len"` enforces braces around arrow functions of any line length exceeding a number of characters, excluding trailing or leading whitespace on each line
* `"max-lines"` enforces braces around arrow functions exceeding a number of lines
* `"include-args"` include arguments in whichever or both of these applied limitations

### "always"

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

### "as-needed"

When the rule is set to `"as-needed"` the following patterns are considered problems:

```js
/*eslint arrow-body-style: [2, "as-needed"]*/
/*eslint-env es6*/

let foo = () => {
    return 0;
};
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
let foo = () => {};
let foo = () => { /* do nothing */ };
let foo = () => {
    // do nothing.
};
```

### "max-len"

When the rule `"as-needed"` is applied in addition to an object with a key of `"max-len"`, the following patterns are considered problems:

```js
/*eslint arrow-body-style: [2, "as-needed", { "max-len": 30  }]*/
/*eslint-env es6*/

var foo = () => Promise.resolve(bar()).then(bar).then(bar);
var foo = () => Promise.resolve(bar())
    .then(bar)
    .then(bar);
var foo = () => {
    return bar();
};
```

The following patterns are not considered problems:

```js
/*eslint arrow-body-style: [2, "as-needed", { "max-len": 30  }]*/
/*eslint-env es6*/

var foo = () => bar();
var foo = () => {
    return Promise.resolve(bar()).then(bar).then(bar);
};
```

### "max-lines"

When the rule `"as-needed"` is applied in addition to an object with a key of `"max-lines"`, the following patterns are considered problems:

```js
/*eslint arrow-body-style: [2, "as-needed", { "max-lines": 2 }]*/
/*eslint-env es6*/

var foo = () => Promise.resolve(bar())
    .then(bar)
    .then(bar);
var foo = () => {
    return bar();
}
```

The following patterns are not considered problems:

```js
/*eslint arrow-body-style: [2, "as-needed", { "max-lines": 2 }]*/
/*eslint-env es6*/

var foo = () => bar();
var foo = () => Promise.resolve(bar()).then(bar).then(bar);
var foo = () => {
    return Promise.resolve(bar())
        .then(bar)
        .then(bar);
};
```

### "include-args"

When either `"max-len"` or `"max-lines"` are applied, `"include-args"` brings the function parameters into the code which is being checked for length requirements.
`"include-args"` defaults to false.
The following patterns are considered problems (for both `"max-lines"` and `"max-len"`):

```js
/*eslint arrow-body-style: [2, "as-needed", { "max-lines": 1, "max-len": 15, "include-args": true }]*/
/*eslint-env es6*/

var foo = ({
    bar: bar,
    baz: baz
}) => bar + baz;
var foo = (bar, baz) =>
    bar(baz());
```

`"include-args"` defaults to false so that the following patterns are not considered problems:

```js
/*eslint arrow-body-style: [2, "as-needed", { "max-lines": 1, "max-len": 15 }]*/
/*eslint-env es6*/

var foo = ({
    bar: bar,
    baz: baz
}) => bar + baz;
var foo = (bar, baz) => bar(baz());
```

With `true` these patterns are also not considered problems:

```js
/*eslint arrow-body-style: [2, "as-needed", { "max-lines": 1, "max-len": 15, "include-args": true }]*/
/*eslint-env es6*/

var foo = ({
    bar: bar,
    baz: baz
}) => {
    return bar + baz;
};
var foo = (bar, baz) => {
    return bar(baz());
};
```
