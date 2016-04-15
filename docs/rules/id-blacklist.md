# disallow specified identifiers (id-blacklist)

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

Bad names can lead to hard-to-decipher code. Generic names, such as `data`, don't infer much about the code and the values it receives. This rule allows you to configure a blacklist of bad identifier names, that you don't want to see in your code.

## Rule Details

This rule disallows specified identifiers in assignments and `function` definitions.

This rule will catch blacklisted identifiers that are:

- variable declarations
- function declarations
- object properties assigned to during object creation

It will not catch blacklisted identifiers that are:

- function calls (so you can still use functions you do not have control over)
- object properties (so you can still use objects you do not have control over)

## Options

The rule takes one or more strings as options: the names of restricted identifiers.

For example, to restrict the use of common generic identifiers:

```json
{
    "id-blacklist": ["error", "data", "err", "e", "cb", "callback"]
}
```

Examples of **incorrect** code for this rule with sample `"data", "callback"` restricted identifiers:

```js
/*eslint id-blacklist: ["error", "data", "callback"] */

var data = {...};

function callback() {
    // ...
}

element.callback = function() {
    // ...
};

var itemSet = {
    data: [...]
};
```

Examples of **correct** code for this rule with sample `"data", "callback"` restricted identifiers:

```js
/*eslint id-blacklist: ["error", "data", "callback"] */

var encodingOptions = {...};

function processFileResult() {
    // ...
}

element.successHandler = function() {
    // ...
};

var itemSet = {
    entities: [...]
};

callback(); // all function calls are ignored

foo.callback(); // all function calls are ignored

foo.data; // all property names that are not assignments are ignored
```

## When Not To Use It

You can turn this rule off if you are happy for identifiers to be named freely.
