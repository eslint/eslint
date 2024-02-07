---
title: id-denylist
rule_type: suggestion
---


> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

Generic names can lead to hard-to-decipher code. This rule allows you to specify a deny list of disallowed identifier names to avoid this practice.

## Rule Details

This rule disallows specified identifiers in assignments and `function` definitions.

This rule will catch disallowed identifiers that are:

* variable declarations
* function declarations
* object properties assigned to during object creation
* class fields
* class methods

It will not catch disallowed identifiers that are:

* function calls (so you can still use functions you do not have control over)
* object properties (so you can still use objects you do not have control over)

## Options

The rule takes one or more strings as options: the names of restricted identifiers.

For example, to restrict the use of common generic identifiers:

```json
{
    "id-denylist": ["error", "data", "err", "e", "cb", "callback"]
}
```

**Note:** The first element of the array is for the rule severity (see [Configure Rules](../use/configure/rules). The other elements in the array are the identifiers that you want to disallow.

Examples of **incorrect** code for this rule with sample `"data", "callback"` restricted identifiers:

::: incorrect

```js
/*eslint id-denylist: ["error", "data", "callback"] */

var data = { ...values };

function callback() {
    // ...
}

element.callback = function() {
    // ...
};

var itemSet = {
    data: [...values]
};

class Foo {
    data = [];
}

class Bar {
    #data = [];
}

class Baz {
    callback() {}
}

class Qux {
    #callback() {}
}
```

:::

Examples of **correct** code for this rule with sample `"data", "callback"` restricted identifiers:

::: correct

```js
/*eslint id-denylist: ["error", "data", "callback"] */

var encodingOptions = {...values};

function processFileResult() {
    // ...
}

element.successHandler = function() {
    // ...
};

var itemSet = {
    entities: [...values]
};

callback(); // all function calls are ignored

foo.callback(); // all function calls are ignored

foo.data; // all property names that are not assignments are ignored

class Foo {
    items = [];
}

class Bar {
    #items = [];
}

class Baz {
    method() {}
}

class Qux {
    #method() {}
}
```

:::

## When Not To Use It

You can turn this rule off if you do not want to restrict the use of certain identifiers.
