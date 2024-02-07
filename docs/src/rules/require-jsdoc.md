---
title: require-jsdoc
rule_type: suggestion
related_rules:
- valid-jsdoc
---

:::important
This rule was removed in ESLint v9.0.0 and replaced by the [`eslint-plugin-jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc) equivalent.
:::

[JSDoc](http://usejsdoc.org) is a JavaScript API documentation generator. It uses specially-formatted comments inside of code to generate API documentation automatically. For example, this is what a JSDoc comment looks like for a function:

```js
/**
 * Adds two numbers together.
 * @param {int} num1 The first number.
 * @param {int} num2 The second number.
 * @returns {int} The sum of the two numbers.
 */
function sum(num1, num2) {
    return num1 + num2;
}
```

Some style guides require JSDoc comments for all functions as a way of explaining function behavior.

## Rule Details

This rule requires JSDoc comments for specified nodes. Supported nodes:

* `"FunctionDeclaration"`
* `"ClassDeclaration"`
* `"MethodDefinition"`
* `"ArrowFunctionExpression"`
* `"FunctionExpression"`

## Options

This rule has a single object option:

* `"require"` requires JSDoc comments for the specified nodes

Default option settings are:

```json
{
    "require-jsdoc": ["error", {
        "require": {
            "FunctionDeclaration": true,
            "MethodDefinition": false,
            "ClassDeclaration": false,
            "ArrowFunctionExpression": false,
            "FunctionExpression": false
        }
    }]
}
```

### require

Examples of **incorrect** code for this rule with the `{ "require": { "FunctionDeclaration": true, "MethodDefinition": true, "ClassDeclaration": true, "ArrowFunctionExpression": true, "FunctionExpression": true } }` option:

::: incorrect

```js
/*eslint "require-jsdoc": ["error", {
    "require": {
        "FunctionDeclaration": true,
        "MethodDefinition": true,
        "ClassDeclaration": true,
        "ArrowFunctionExpression": true,
        "FunctionExpression": true
    }
}]*/

function foo() {
    return 10;
}

var bar = () => {
    return 10;
};

class Foo {
    bar() {
        return 10;
    }
}

var bar = function() {
    return 10;
};

var bar = {
    bar: function() {
        return 10;
    },

    baz() {
        return 10;
    }
};
```

:::

Examples of **correct** code for this rule with the `{ "require": { "FunctionDeclaration": true, "MethodDefinition": true, "ClassDeclaration": true, "ArrowFunctionExpression": true, "FunctionExpression": true } }` option:

::: correct

```js
/*eslint "require-jsdoc": ["error", {
    "require": {
        "FunctionDeclaration": true,
        "MethodDefinition": true,
        "ClassDeclaration": true,
        "ArrowFunctionExpression": true,
        "FunctionExpression": true
    }
}]*/

/**
 * It returns 10
 */
function foo() {
    return 10;
}

/**
 * It returns test + 10
 * @params {int} test - some number
 * @returns {int} sum of test and 10
 */
var bar = (test) => {
    return test + 10;
}

/**
 * It returns 10
 */
var bar = () => {
    return 10;
}

/**
 * It returns 10
 */
var bar = function() {
    return 10;
}

var array = [1,2,3];
array.filter(function(item) {
    return item > 2;
});

/**
 * A class that can return the number 10
 */
class Foo {
    /**
    * It returns 10
    */
    bar() {
        return 10;
    }
}

/**
 * It returns 10
 */
var bar = function() {
    return 10;
};

var bar = {
    /**
    * It returns 10
    */
    bar: function() {
        return 10;
    },

    /**
    * It returns 10
    */
    baz() {
        return 10;
    }
};

setTimeout(() => {}, 10); // since it's an anonymous arrow function
```

:::

## When Not To Use It

If you do not require JSDoc for your functions, then you can leave this rule off.
