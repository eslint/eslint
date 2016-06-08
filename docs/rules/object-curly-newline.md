# require or disallow line breaks inside braces (object-curly-newline)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

A number of style guides require or disallow line breaks inside of object braces and other tokens.

## Rule Details

This rule enforces consistent line breaks inside braces.
This rule is applied to both object literals and destructuring assignments.

## Options

```json
{
    "object-curly-newline": ["error", {"multiline": true}]
}
```

This rule has options of 4 kinds:

* `"always"` - requires line breaks always.
* `"never"` - disallows line breaks.
* `{multiline: true}` (default) - requires line breaks if there are line breaks inside properties or between properties. Otherwise, disallows line breaks.
* `{minProperties: <integer>}` - requires line breaks if the number of properties is more than the given integer. Otherwise, disallows line breaks.

`multiline` and `minProperties` can be combined.

* `{multiline: true, minProperties: <integer>}` - requires line breaks if there are line breaks inside properties or between properties, or if the number of properties is more than the given integer. Otherwise, disallows line breaks.

Also, we can separate configuration for each object literal and destructuring assignment:

```json
{
    "object-curly-newline": ["error", {
        "ObjectExpression": "always",
        "ObjectPattern": {"multiline": true}
    }]
}
```

* `"ObjectExpression"` - configuration for object literals.
* `"ObjectPattern"` - configuration for object patterns of destructuring assignments.

### always

Examples of **incorrect** code for this rule with the `"always"` option:

```js
/*eslint object-curly-newline: ["error", "always"]*/
/*eslint-env es6*/

let a = {};
let b = {foo: 1};
let c = {foo: 1, bar: 2};
let d = {foo: 1,
    bar: 2};
let e = {foo() {
    dosomething();
}};

let {} = obj;
let {f} = obj;
let {g, h} = obj;
let {i,
    j} = obj;
let {k = function() {
    dosomething();
}} = obj;
```

Examples of **correct** code for this rule with the `"always"` option:

```js
/*eslint object-curly-newline: ["error", "always"]*/
/*eslint-env es6*/

let a = {
};
let b = {
    foo: 1
};
let c = {
    foo: 1, bar: 2
};
let d = {
    foo: 1,
    bar: 2
};
let e = {
    foo: function() {
        dosomething();
    }
};

let {
} = obj;
let {
    f
} = obj;
let {
    g, h
} = obj;
let {
    i,
    j
} = obj;
let {
    k = function() {
        dosomething();
    }
} = obj;
```

### never

Examples of **incorrect** code for this rule with the `"never"` option:

```js
/*eslint object-curly-newline: ["error", "never"]*/
/*eslint-env es6*/

let a = {
};
let b = {
    foo: 1
};
let c = {
    foo: 1, bar: 2
};
let d = {
    foo: 1,
    bar: 2
};
let e = {
    foo: function() {
        dosomething();
    }
};

let {
} = obj;
let {
    f
} = obj;
let {
    g, h
} = obj;
let {
    i,
    j
} = obj;
let {
    k = function() {
        dosomething();
    }
} = obj;
```

Examples of **correct** code for this rule with the `"never"` option:

```js
/*eslint object-curly-newline: ["error", "never"]*/
/*eslint-env es6*/

let a = {};
let b = {foo: 1};
let c = {foo: 1, bar: 2};
let d = {foo: 1,
    bar: 2};
let e = {foo: function() {
    dosomething();
}};

let {} = obj;
let {f} = obj;
let {g, h} = obj;
let {i,
    j} = obj;
let {k = function() {
    dosomething();
}} = obj;
```

### multiline

Examples of **incorrect** code for this rule with the default `{"multiline": true}` option:

```js
/*eslint object-curly-newline: ["error", {"multiline": true}]*/
/*eslint-env es6*/

let a = {
};
let b = {
    foo: 1
};
let c = {
    foo: 1, bar: 2
};
let d = {foo: 1,
    bar: 2};
let e = {foo: function() {
    dosomething();
}};

let {
} = obj;
let {
    f
} = obj;
let {
    g, h
} = obj;
let {i,
    j} = obj;
let {k = function() {
    dosomething();
}} = obj;
```

Examples of **correct** code for this rule with the default `{"multiline": true}` option:

```js
/*eslint object-curly-newline: ["error", {"multiline": true}]*/
/*eslint-env es6*/

let a = {};
let b = {foo: 1};
let c = {foo: 1, bar: 2};
let d = {
    foo: 1,
    bar: 2
};
let e = {
    foo: function() {
        dosomething();
    }
};

let {} = obj;
let {f} = obj;
let {g, h} = obj;
let {
    i,
    j
} = obj;
let {
    k = function() {
        dosomething();
    }
} = obj;
```

### minProperties

Examples of **incorrect** code for this rule with the `{"minProperties": 2}` option:

```js
/*eslint object-curly-newline: ["error", {"minProperties": 2}]*/
/*eslint-env es6*/

let a = {
};
let b = {
    foo: 1
};
let c = {foo: 1, bar: 2};
let d = {foo: 1,
    bar: 2};
let e = {
    foo: function() {
        dosomething();
    }
};

let {
} = obj;
let {
    f
} = obj;
let {g, h} = obj;
let {i,
    j} = obj;
let {
    k = function() {
        dosomething();
    }
} = obj;
```

Examples of **correct** code for this rule with the `{"minProperties": 2}` option:

```js
/*eslint object-curly-newline: ["error", {"minProperties": 2}]*/
/*eslint-env es6*/

let a = {};
let b = {foo: 1};
let c = {
    foo: 1, bar: 2
};
let d = {
    foo: 1,
    bar: 2
};
let e = {foo: function() {
    dosomething();
}};

let {} = obj;
let {f} = obj;
let {
    g, h
} = obj;
let {
    i,
    j
} = obj;
let {k = function() {
    dosomething();
}} = obj;
```

### multiline and minProperties

Examples of **incorrect** code for this rule with the `{"multiline": true, "minProperties": 2}` option:

```js
/*eslint object-curly-newline: ["error", {"multiline": true, "minProperties": 2}]*/
/*eslint-env es6*/

let a = {
};
let b = {
    foo: 1
};
let c = {foo: 1, bar: 2};
let d = {foo: 1,
    bar: 2};
let e = {foo: function() {
    dosomething();
}};

let {
} = obj;
let {
    f
} = obj;
let {g, h} = obj;
let {i,
    j} = obj;
let {k = function() {
    dosomething();
}} = obj;
```

Examples of **correct** code for this rule with the `{"multiline": true, "minProperties": 2}` option:

```js
/*eslint object-curly-newline: ["error", {"multiline": true, "minProperties": 2}]*/
/*eslint-env es6*/

let a = {};
let b = {foo: 1};
let c = {
    foo: 1, bar: 2
};
let d = {
    foo: 1,
    bar: 2
};
let e = {
    foo: function() {
        dosomething();
    }
};

let {} = obj;
let {f} = obj;
let {
    g, h
} = obj;
let {
    i,
    j
} = obj;
let {
    k = function() {
        dosomething();
    }
} = obj;
```

### separating configuration

Examples of **incorrect** code for this rule with the `{"ObjectExpression": "always", "ObjectPattern": "never"}` option:

```js
/*eslint object-curly-newline: ["error", {"ObjectExpression": "always", "ObjectPattern": "never"}]*/
/*eslint-env es6*/

let a = {};
let b = {foo: 1};
let c = {foo: 1, bar: 2};
let d = {foo: 1,
    bar: 2};
let e = {foo: function() {
    dosomething();
}};

let {
} = obj;
let {
    f
} = obj;
let {
    g, h
} = obj;
let {
    i,
    j
} = obj;
let {
    k = function() {
        dosomething();
    }
} = obj;
```

Examples of **correct** code for this rule with the `{"ObjectExpression": "always", "ObjectPattern": "never"}` option:

```js
/*eslint object-curly-newline: ["error", {"ObjectExpression": "always", "ObjectPattern": "never"}]*/
/*eslint-env es6*/

let a = [
];
let b = [
    1
];
let c = [
    1, 2
];
let d = [
    1,
    2
];
let e = [
    function() {
        dosomething();
    }
];

let [] = obj;
let [f] = obj;
let [g, h] = obj;
let [i,
    j] = obj;
let [k = function() {
    dosomething();
}] = obj;
```

## Compatibility

* **JSCS**: [requirePaddingNewLinesInObjects](http://jscs.info/rule/requirePaddingNewLinesInObjects) and [disallowPaddingNewLinesInObjects](http://jscs.info/rule/disallowPaddingNewLinesInObjects)

## When Not To Use It

If you don't want to enforce consistent line breaks inside braces, then it's safe to disable this rule.

## Related Rules

* [comma-spacing](key-spacing.md)
* [key-spacing](key-spacing.md)
* [object-curly-spacing](object-curly-spacing.md)
* [object-property-newline](object-property-newline.md)
