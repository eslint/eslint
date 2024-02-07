---
title: valid-jsdoc
rule_type: suggestion
related_rules:
- require-jsdoc
further_reading:
- https://jsdoc.app
---

:::important
This rule was removed in ESLint v9.0.0 and replaced by the [`eslint-plugin-jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc) equivalent.
:::

[JSDoc](http://usejsdoc.org) generates application programming interface (API) documentation from specially-formatted comments in JavaScript code. For example, this is a JSDoc comment for a function:

```js
/**
 * Add two numbers.
 * @param {number} num1 The first number.
 * @param {number} num2 The second number.
 * @returns {number} The sum of the two numbers.
 */
function add(num1, num2) {
    return num1 + num2;
}
```

If comments are invalid because of typing mistakes, then documentation will be incomplete.

If comments are inconsistent because they are not updated when function definitions are modified, then readers might become confused.

## Rule Details

This rule enforces valid and consistent JSDoc comments. It reports any of the following problems:

* missing parameter tag: `@arg`, `@argument`, or `@param`
* inconsistent order of parameter names in a comment compared to the function or method
* missing return tag: `@return` or `@returns`
* missing parameter or return type
* missing parameter or return description
* syntax error

This rule does not report missing JSDoc comments for classes, functions, or methods.

**Note:** This rule does not support all of the Google Closure documentation tool's use cases. As such, some code such as `(/**number*/ n => n * 2);` will be flagged as missing appropriate function JSDoc comments even though `/**number*/` is intended to be a type hint and not a documentation block for the function. We don't recommend using this rule if you use type hints in this way.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint valid-jsdoc: "error"*/

// expected @param tag for parameter num1 but found num instead
// missing @param tag for parameter num2
// missing return type
/**
 * Add two numbers.
 * @param {number} num The first number.
 * @returns The sum of the two numbers.
 */
function add(num1, num2) {
    return num1 + num2;
}

// missing brace
// missing @returns tag
/**
 * @param {string name Whom to greet.
 */
function greet(name) {
    console.log("Hello " + name);
}

// missing parameter type for num1
// missing parameter description for num2
/**
 * Represents a sum.
 * @constructor
 * @param num1 The first number.
 * @param {number} num2
 */
function sum(num1, num2) {
    this.num1 = num1;
    this.num2 = num2;
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint valid-jsdoc: "error"*/
/*eslint-env es6*/

/**
 * Add two numbers.
 * @param {number} num1 The first number.
 * @param {number} num2 The second number.
 * @returns {number} The sum of the two numbers.
 */
function add(num1, num2) {
    return num1 + num2;
}

// default options allow missing function description
// return type `void` means the function has no `return` statement
/**
 * @param {string} name Whom to greet.
 * @returns {void}
 */
function greet(name) {
    console.log("Hello " + name);
}

// @constructor tag allows missing @returns tag
/**
 * Represents a sum.
 * @constructor
 * @param {number} num1 The first number.
 * @param {number} num2 The second number.
 */
function sum(num1, num2) {
    this.num1 = num1;
    this.num2 = num2;
}

// class constructor allows missing @returns tag
/**
 * Represents a sum.
 */
class Sum {
    /**
     * @param {number} num1 The first number.
     * @param {number} num2 The second number.
     */
    constructor(num1, num2) {
        this.num1 = num1;
        this.num2 = num2;
    }
}

// @abstract tag allows @returns tag without `return` statement
class Widget {
    /**
    * When the state changes, does it affect the rendered appearance?
    * @abstract
    * @param {Object} state The new state of the widget.
    * @returns {boolean} Is current appearance inconsistent with new state?
    */
    mustRender (state) {
        throw new Error("Widget subclass did not implement mustRender");
    }
}

// @override tag allows missing @param and @returns tags
class WonderfulWidget extends Widget {
    /**
     * @override
     */
    mustRender (state) {
        return state !== this.state; // shallow comparison
    }
}
```

:::

## Options

This rule has an object option:

* `"prefer"` enforces consistent documentation tags specified by an object whose properties mean instead of key use value (for example, `"return": "returns"` means instead of `@return` use `@returns`)
* `"preferType"` enforces consistent type strings specified by an object whose properties mean instead of key use value (for example, `"object": "Object"` means instead of `object` use `Object`)
* `"requireReturn"` requires a return tag:
    * `true` (default) **even if** the function or method does not have a `return` statement (this option value does not apply to constructors)
    * `false` **if and only if** the function or method has a `return` statement or returns a value e.g. `async` function (this option value does apply to constructors)
* `"requireReturnType": false` allows missing type in return tags
* `"matchDescription"` specifies (as a string) a regular expression to match the description in each JSDoc comment (for example, `".+"` requires a description; this option does not apply to descriptions in parameter or return tags)
* `"requireParamDescription": false` allows missing description in parameter tags
* `"requireReturnDescription": false` allows missing description in return tags
* `"requireParamType": false` allows missing type in parameter tags

### prefer

Examples of additional **incorrect** code for this rule with sample `"prefer": { "arg": "param", "argument": "param", "class": "constructor", "return": "returns", "virtual": "abstract" }` options:

::: incorrect

```js
/*eslint valid-jsdoc: ["error", { "prefer": { "arg": "param", "argument": "param", "class": "constructor", "return": "returns", "virtual": "abstract" } }]*/
/*eslint-env es6*/

/**
 * Add two numbers.
 * @arg {int} num1 The first number.
 * @arg {int} num2 The second number.
 * @return {int} The sum of the two numbers.
 */
function add(num1, num2) {
    return num1 + num2;
}

/**
 * Represents a sum.
 * @class
 * @argument {number} num1 The first number.
 * @argument {number} num2 The second number.
 */
function sum(num1, num2) {
    this.num1 = num1;
    this.num2 = num2;
}

class Widget {
    /**
     * When the state changes, does it affect the rendered appearance?
     * @virtual
     * @argument {Object} state The new state of the widget.
     * @return {boolean} Is current appearance inconsistent with new state?
     */
    mustRender (state) {
        throw new Error("Widget subclass did not implement mustRender");
    }
}
```

:::

### preferType

Examples of additional **incorrect** code for this rule with sample `"preferType": { "Boolean": "boolean", "Number": "number", "object": "Object", "String": "string" }` options:

::: incorrect

```js
/*eslint valid-jsdoc: ["error", { "preferType": { "Boolean": "boolean", "Number": "number", "object": "Object", "String": "string" } }]*/
/*eslint-env es6*/

/**
 * Add two numbers.
 * @param {Number} num1 The first number.
 * @param {Number} num2 The second number.
 * @returns {Number} The sum of the two numbers.
 */
function add(num1, num2) {
    return num1 + num2;
}

/**
 * Output a greeting as a side effect.
 * @param {String} name Whom to greet.
 * @returns {void}
 */
function greet(name) {
    console.log("Hello " + name);
}

class Widget {
    /**
     * When the state changes, does it affect the rendered appearance?
     * @abstract
     * @param {object} state The new state of the widget.
     * @returns {Boolean} Is current appearance inconsistent with new state?
     */
    mustRender (state) {
        throw new Error("Widget subclass did not implement mustRender");
    }
}
```

:::

### requireReturn

Examples of additional **incorrect** code for this rule with the `"requireReturn": false` option:

::: incorrect

```js
/*eslint valid-jsdoc: ["error", { "requireReturn": false }]*/

// unexpected @returns tag because function has no `return` statement
/**
 * @param {string} name Whom to greet.
 * @returns {string} The greeting.
 */
function greet(name) {
    console.log("Hello " + name);
}

// add @abstract tag to allow @returns tag without `return` statement
class Widget {
    /**
     * When the state changes, does it affect the rendered appearance?
     * @param {Object} state The new state of the widget.
     * @returns {boolean} Is current appearance inconsistent with new state?
     */
    mustRender (state) {
        throw new Error("Widget subclass did not implement mustRender");
    }
}
```

:::

Example of additional **correct** code for this rule with the `"requireReturn": false` option:

::: correct

```js
/*eslint valid-jsdoc: ["error", { "requireReturn": false }]*/

/**
 * @param {string} name Whom to greet.
 */
function greet(name) {
    console.log("Hello " + name);
}
```

:::

### requireReturnType

Example of additional **correct** code for this rule with the `"requireReturnType": false` option:

::: correct

```js
/*eslint valid-jsdoc: ["error", { "requireReturnType": false }]*/

/**
 * Add two numbers.
 * @param {number} num1 The first number.
 * @param {number} num2 The second number.
 * @returns The sum of the two numbers.
 */
function add(num1, num2) {
    return num1 + num2;
}
```

:::

### requireParamType

Example of additional **correct** code for this rule with the `"requireParamType": false` option:

::: correct

```js
/*eslint valid-jsdoc: ["error", { "requireParamType": false }]*/

/**
 * Add two numbers.
 * @param num1 The first number.
 * @param num2 The second number.
 * @returns {number} The sum of the two numbers.
 */
function add(num1, num2) {
    return num1 + num2;
}
```

:::

### matchDescription

Example of additional **incorrect** code for this rule with a sample `"matchDescription": ".+"` option:

::: incorrect

```js
/*eslint valid-jsdoc: ["error", { "matchDescription": ".+" }]*/

// missing function description
/**
 * @param {string} name Whom to greet.
 * @returns {void}
 */
function greet(name) {
    console.log("Hello " + name);
}
```

:::

### requireParamDescription

Example of additional **correct** code for this rule with the `"requireParamDescription": false` option:

::: correct

```js
/*eslint valid-jsdoc: ["error", { "requireParamDescription": false }]*/

/**
 * Add two numbers.
 * @param {int} num1
 * @param {int} num2
 * @returns {int} The sum of the two numbers.
 */
function add(num1, num2) {
    return num1 + num2;
}
```

:::

### requireReturnDescription

Example of additional **correct** code for this rule with the `"requireReturnDescription": false` option:

::: correct

```js
/*eslint valid-jsdoc: ["error", { "requireReturnDescription": false }]*/

/**
 * Add two numbers.
 * @param {number} num1 The first number.
 * @param {number} num2 The second number.
 * @returns {number}
 */
function add(num1, num2) {
    return num1 + num2;
}
```

:::

## When Not To Use It

If you aren't using JSDoc, then you can safely turn this rule off.
