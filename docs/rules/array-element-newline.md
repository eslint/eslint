# enforce line breaks between array elements (array-element-newline)

A number of style guides require or disallow line breaks between array elements.

## Rule Details

This rule enforces line breaks between array elements.

## Options

This rule has either a string option:

* `"always"` (default) requires line breaks between array elements
* `"never"` disallows line breaks between array elements
* `"consistent"` requires consistent usage of linebreaks between array elements

Or an object option (Requires line breaks if any of properties is satisfied. Otherwise, disallows line breaks):

* `"multiline": <boolean>` requires line breaks if there are line breaks inside elements. If this is false, this condition is disabled.
* `"minItems": <number>` requires line breaks if the number of elements is at least the given integer. If this is 0, this condition will act the same as the option `"always"`. If this is `null` (the default), this condition is disabled.

Alternatively, different configurations can be specified for array expressions and array patterns:

```json
{
    "array-element-newline": ["error", {
        "ArrayExpression": "consistent",
        "ArrayPattern": { "minItems": 3 },
    }]
}
```

* `"ArrayExpression"` configuration for array expressions (if unspecified, this rule will not apply to array expressions)
* `"ArrayPattern"` configuration for array patterns of destructuring assignments (if unspecified, this rule will not apply to array patterns)

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

```js
/*eslint array-element-newline: ["error", "always"]*/

var c = [1, 2];
var d = [1, 2, 3];
var e = [
    function foo() {
        dosomething();
    }, function bar() {
        dosomething();
    }
];
```

Examples of **correct** code for this rule with the default `"always"` option:

```js
/*eslint array-element-newline: ["error", "always"]*/

var a = [];
var b = [1];
var c = [1,
    2];
var d = [1,
    2,
    3];
var e = [
    function foo() {
        dosomething();
    },
    function bar() {
        dosomething();
    }
];
```

### never

Examples of **incorrect** code for this rule with the `"never"` option:

```js
/*eslint array-element-newline: ["error", "never"]*/

var c = [
    1,
    2
];
var d = [
    1,
    2,
    3
];
var e = [
    function foo() {
        dosomething();
    },
    function bar() {
        dosomething();
    }
];
```

Examples of **correct** code for this rule with the `"never"` option:

```js
/*eslint array-element-newline: ["error", "never"]*/

var a = [];
var b = [1];
var c = [1, 2];
var d = [1, 2, 3];
var e = [
    function foo() {
        dosomething();
    }, function bar() {
        dosomething();
    }
];
```

### consistent

Examples of **incorrect** code for this rule with the `"consistent"` option:

```js
/*eslint array-element-newline: ["error", "consistent"]*/

var a = [
    1, 2,
    3
];
var b = [
    function foo() {
        dosomething();
    }, function bar() {
        dosomething();
    },
    function baz() {
        dosomething();
    }
];
```

Examples of **correct** code for this rule with the `"consistent"` option:

```js
/*eslint array-element-newline: ["error", "consistent"]*/

var a = [];
var b = [1];
var c = [1, 2];
var d = [1, 2, 3];
var e = [
    1,
    2
];
var f = [
    1,
    2,
    3
];
var g = [
    function foo() {
        dosomething();
    }, function bar() {
        dosomething();
    }, function baz() {
        dosomething();
    }
];
var h = [
    function foo() {
        dosomething();
    },
    function bar() {
        dosomething();
    },
    function baz() {
        dosomething();
    }
];
```

### multiline

Examples of **incorrect** code for this rule with the `{ "multiline": true }` option:

```js
/*eslint array-element-newline: ["error", { "multiline": true }]*/

var d = [1,
    2, 3];
var e = [
    function foo() {
        dosomething();
    }, function bar() {
        dosomething();
    }
];
```

Examples of **correct** code for this rule with the `{ "multiline": true }` option:

```js
/*eslint array-element-newline: ["error", { "multiline": true }]*/

var a = [];
var b = [1];
var c = [1, 2];
var d = [1, 2, 3];
var e = [
    function foo() {
        dosomething();
    },
    function bar() {
        dosomething();
    }
];
```

### minItems

Examples of **incorrect** code for this rule with the `{ "minItems": 3 }` option:

```js
/*eslint array-element-newline: ["error", { "minItems": 3 }]*/

var c = [1,
    2];
var d = [1, 2, 3];
var e = [
    function foo() {
        dosomething();
    },
    function bar() {
        dosomething();
    }
];
```

Examples of **correct** code for this rule with the `{ "minItems": 3 }` option:

```js
/*eslint array-element-newline: ["error", { "minItems": 3 }]*/

var a = [];
var b = [1];
var c = [1, 2];
var d = [1,
    2,
    3];
var e = [
    function foo() {
        dosomething();
    }, function bar() {
        dosomething();
    }
];
```

### multiline and minItems

Examples of **incorrect** code for this rule with the `{ "multiline": true, "minItems": 3 }` options:

```js
/*eslint array-element-newline: ["error", { "multiline": true, "minItems": 3 }]*/

var c = [1,
2];
var d = [1, 2, 3];
var e = [
    function foo() {
        dosomething();
    }, function bar() {
        dosomething();
    }
];
```

Examples of **correct** code for this rule with the `{ "multiline": true, "minItems": 3 }` options:

```js
/*eslint array-element-newline: ["error", { "multiline": true, "minItems": 3 }]*/

var a = [];
var b = [1];
var c = [1, 2];
var d = [1,
    2,
    3];
var e = [
    function foo() {
        dosomething();
    },
    function bar() {
        dosomething();
    }
];
```

### ArrayExpression and ArrayPattern

Examples of **incorrect** code for this rule with the `{ "ArrayExpression": "always", "ArrayPattern": "never" }` options:

```js
/*eslint array-element-newline: ["error", { "ArrayExpression": "always", "ArrayPattern": "never" }]*/

var a = [1, 2];
var b = [1, 2, 3];
var c = [
    function foo() {
        dosomething();
    }, function bar() {
        dosomething();
    }
];

var [d,
    e] = arr;
var [f,
    g,
    h] = arr;
var [i = function foo() {
  dosomething()
},
j = function bar() {
  dosomething()
}] = arr
```

Examples of **correct** code for this rule with the `{ "ArrayExpression": "always", "ArrayPattern": "never" }` options:

```js
/*eslint object-curly-newline: ["error", { "ArrayExpression": "always", "ArrayPattern": "never" }]*/

var a = [1,
    2];
var b = [1,
    2,
    3];
var c = [
    function foo() {
        dosomething();
    },
    function bar() {
        dosomething();
    }
];

var [d, e] = arr
var [f, g, h] = arr
var [i = function foo() {
    dosomething()
}, j = function bar() {
    dosomething()
}] = arr
```

## When Not To Use It

If you don't want to enforce linebreaks between array elements, don't enable this rule.

## Compatibility

* **JSCS:** [validateNewlineAfterArrayElements](https://jscs-dev.github.io/rule/validateNewlineAfterArrayElements)

## Related Rules

* [array-bracket-spacing](array-bracket-spacing.md)
* [array-bracket-newline](array-bracket-newline.md)
* [object-property-newline](object-property-newline.md)
* [object-curly-spacing](object-curly-spacing.md)
* [object-curly-newline](object-curly-newline.md)
* [max-statements-per-line](max-statements-per-line.md)
* [block-spacing](block-spacing.md)
* [brace-style](brace-style.md)
