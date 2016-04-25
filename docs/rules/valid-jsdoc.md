# Validates JSDoc comments are syntactically correct (valid-jsdoc)

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

The JSDoc comments have a syntax all their own, and it is easy to mistakenly mistype a comment because comments aren't often checked for correctness in editors. Further, it's very easy for the function definition to get out of sync with the comments, making the comments a source of confusion and error.

## Rule Details

This rule aims to prevent invalid and incomplete JSDoc comments. It will warn when any of the following is true:

* There is a JSDoc syntax error
* A `@param` or `@returns` is used without a type specified
* A `@param` or `@returns` is used without a description
* A comment for a function is missing `@returns`
* A parameter has no associated `@param` in the JSDoc comment
* `@param`s are out of order with named arguments

Examples of **incorrect** code for this rule:

```js
/*eslint valid-jsdoc: "error"*/

// missing type for @param and missing @returns
/**                                 // 2 errors
 * A description
 * @param num1 The first number.
 */
function foo(num1) {
    // ...
}

// missing description for @param
/**                                 //error Missing JSDoc parameter description for 'num1'.
 * A description
 * @param {int} num1
 * @returns {void}
 */
function foo(num1) {
    // ...
}

// no description for @returns
/**                                 //error Missing JSDoc return description.
 * A description
 * @returns {int}
 */
function foo() {
    // ...
}

// no type for @returns
/**                                 //error JSDoc syntax error.
 * A description
 * @returns Something awesome
 */
function foo() {
    // ...
}

// missing @param
/**                                 //error Missing JSDoc for parameter 'a'.
 * A description
 * @returns {void}
 */
function foo(a) {
    // ...
}

// incorrect @param
/**                                 //error Expected JSDoc for 'a' but found 'b'.
 * A description
 * @param {string} b Desc
 * @returns {void}
 */
function foo(a) {
    // ...
}
```

Examples of **correct** code for this rule:

```js
/*eslint valid-jsdoc: "error"*/

/**
 * Adds two numbers together.
 * @param {int} num1 The first number.
 * @param {int} num2 The second number.
 * @returns {int} The sum of the two numbers.
 */
function foo(num1, num2) {
    return num1 + num2;
}

/**
 * Represents a sum.
 * @param {int} num1 The first number.
 * @param {int} num2 The second number.
 * @constructor
 */
function foo(num1, num2) { }

// use of @override make @param and @returns optional
/**
 * A description
 * @override
 */
function foo(a) {
    return a;
}

// @returns is not required for a constructor
class Foo {
    /**
    *
    * @param {int} num1 The first number.
    */
    constructor(num1) {
        this.num1 = num1;
    }
}

// @returns allowed without return if used with @abstract
class Foo {
    /**
     * @abstract
     * @return {Number} num
     */
    abstractMethod () {
        throw new Error('Not implemented');
    }
}

```

## Options

### prefer

JSDoc offers a lot of tags with overlapping meaning. For example, both `@return` and `@returns` are acceptable for specifying the return value of a function. However, you may want to enforce a certain tag be used instead of others. You can specify your preferences regarding tag substitution by providing a mapping called `prefer` in the rule configuration. For example, to specify that `@returns` should be used instead of `@return`, you can use the following configuration:

```json
"valid-jsdoc": ["error", {
    "prefer": {
        "return": "returns"
    }
}]
```

With this configuration, ESLint will warn when it finds `@return` and recommend to replace it with `@returns`.

### requireReturn

By default ESLint requires you to document every function with a `@return` tag regardless of whether there is anything returned by the function. If instead you want to enforce that only functions with a `return` statement are documented with a `@return` tag, set the `requireReturn` option to `false`.  When `requireReturn` is `false`, every function documented with a `@return` tag must have a `return` statement, and every function with a `return` statement must have a `@return` tag.

```json
"valid-jsdoc": ["error", {
    "requireReturn": false
}]
```

### requireParamDescription

By default ESLint requires you to specify a description for each `@param`. You can choose not to require descriptions for parameters by setting `requireParamDescription` to `false`.

```json
"valid-jsdoc": ["error", {
    "requireParamDescription": false
}]
```

### requireReturnDescription

By default ESLint requires you to specify a description for each `@return`. You can choose not to require descriptions for `@return` by setting `requireReturnDescription` to `false`.

```json
"valid-jsdoc": ["error", {
    "requireReturnDescription": false
}]
```

### matchDescription

Specify a regular expression to validate jsdoc comment block description against.

```json
"valid-jsdoc": ["error", {
    "matchDescription": "^[A-Z][A-Za-z0-9\\s]*[.]$"
}]
```

### requireReturnType

By default ESLint requires you to specify `type` for `@return` tag for every documented function.

```json
"valid-jsdoc": ["error", {
    "requireReturnType": false
}]
```

### preferType

It will validate all the types from jsdoc with the options setup by the user. Inside the options, key should be what the type you want to check and the value of it should be what the expected type should be. Note that we don't check for spelling mistakes with this option.
In the example below, it will expect the "object" to start with an uppercase and all the "string" type to start with a lowercase.

```json
"valid-jsdoc": ["error", {
    "preferType": {
        "String": "string",
        "object": "Object",
        "test": "TesT"
    }
}]
```

Examples of **incorrect** code for a sample of `"preferType"` options:

```js
/*eslint valid-jsdoc: ["error", { "preferType": { "String": "string", "object": "Object", "test": "TesT" } }]*/

/**
 * Adds two numbers together.
 * @param {String} param1 The first parameter.
 * @returns {object} The sum of the two numbers.
 */
function foo(param1) {
    return {a: param1};
}

/**
 * Adds two numbers together.
 * @param {Array<String>} param1 The first parameter.
 * @param {{1:test}} param2 The second parameter.
 * @returns {object} The sum of the two numbers.
 */
function foo(param1, param2) {
    return {a: param1};
}

/**
 * Adds two numbers together.
 * @param {String|int} param1 The first parameter.
 * @returns {object} The sum of the two numbers.
 */
function foo(param1) {
    return {a: param1};
}
```

Examples of **correct** code for a sample of `"preferType"` options:

```js
/*eslint valid-jsdoc: ["error", { "preferType": { "String": "string", "object": "Object", "test": "TesT" } }]*/

/**
 * Adds two numbers together.
 * @param {string} param1 The first parameter.
 * @returns {Object} The sum of the two numbers.
 */
function foo(param1) {
    return {a: param1};
}

/**
 * Adds two numbers together.
 * @param {Array<string>} param1 The first parameter.
 * @param {{1:TesT}} param2 The second parameter.
 * @returns {Object} The sum of the two numbers.
 */
function foo(param1, param2) {
    return {a: param1};
}

/**
 * Adds two numbers together.
 * @param {string|int} param1 The first parameter.
 * @returns {Object} The sum of the two numbers.
 */
function foo(param1) {
    return {a: param1};
}
```

## When Not To Use It

If you aren't using JSDoc, then you can safely turn this rule off.

## Further Reading

* [JSDoc](http://usejsdoc.org)
