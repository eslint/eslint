# Comma style (comma-style)

Comma Style rule enforces comma styles for a list of things separated by commas. There are two comma styles primarily in javascript. The standard one in which commas are placed at the end of the line. And Comma-First, in which, commas are placed at the start of the next line after the list item.

One of the justifications for using Comma-First is that it helps tracking missing and trailing commas.
In case linting is turned off, missing commas in variable declarations lead to leakage of global variables and trailing commas lead to errors in older versions of IE.


## Rule Details

This rule is aimed at enforcing a particular comma style in JavaScript. As such, it warns whenever it sees a variable declaration, object property and array element that does not adhere to a particular comma style. It doesn't support cases where there are line breaks before and after comma (lone commas) with in declarations, properties and elements. It also avoids single line declaration cases.

### Options

The rule takes an option, a string, which could be either "last" or "first". The default is "last".

You can set the style in configuration like this:

```json
"comma-style": [2, "first"]
```

#### "last"

This is the default setting for this rule. This option requires that the comma be placed after and be in the same line as the variable declaration, object property and array element.

While using this setting, the following patterns are considered warnings:

```js

var foo = 1
, //lone comma
bar = 2;

var foo = 1
  , bar = 2;


var foo = ["apples"
           , "oranges"];


function bar() {
    return {
        "a": 1
        ,"b:": 2
    };
}

```

The following patterns are not warnings:

```js

var foo = 1, bar = 2;

var foo = 1,
    bar = 2;


var foo = ["apples",
           "oranges"];


function bar() {
    return {
        "a": 1,
        "b:": 2
    };
}

```

#### "first"

This option requires that the comma be placed before and be in the same line as the variable declaration, object property and array element.

While using this setting, the following patterns are considered warnings:

```js

var foo = 1,
    bar = 2;


var foo = ["apples",
           "oranges"];


function bar() {
    return {
        "a": 1,
        "b:": 2
    };
}

```

The following patterns are not warnings:

```js

var foo = 1, bar = 2;

var foo = 1
    ,bar = 2;


var foo = ["apples"
          ,"oranges"];


function bar() {
    return {
        "a": 1
        ,"b:": 2
    };
}

```

## When Not To Use It

If your project will not be using one true comma style, turn this rule off.


## Further Reading

For the first option in comma-style rule:

* [A better coding convention for lists and object literals in JavaScript by isaacs](https://gist.github.com/isaacs/357981)
* [npm coding style guideline](https://www.npmjs.org/doc/misc/npm-coding-style.html)

