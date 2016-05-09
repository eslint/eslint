# global-strict: require or disallow strict mode directives in the global scope

(removed) This rule was **removed** in ESLint v1.0 and **replaced** by the [strict](strict.md) rule. The `"global"` option in the new rule is most similar to the removed rule.

Strict mode is enabled by using the following pragma in your code:

```js
"use strict";
```

When used globally, as in this example, the strict mode pragma applies to all code within a single file. This can be dangerous if you concatenate scripts together before serving them to a browser. For instance, if you have a file running in strict mode and you concatenate that file with jQuery, the strict mode now also applies to jQuery and may cause errors.

However, if you're using Node.js, you may want to turn strict mode on globally. Files are typically not concatenated together in Node.js projects and therefore the risk of applying strict mode accidentally is minimal. Further, since every file in Node.js has its own scope, global strict mode only effects the single file in which it is placed.

## Rule Details

This rule requires or disallows global strict mode invoked by a `"use strict"` pragma in the global scope.

The following pattern is under strict mode globally and is considered valid with the `"always"` option and a warning with the `"never"` option.

```js
"use strict";

function foo() {
    return true;
}
```

The following patterns apply strict mode only to functions so are valid with the `"never"` option but are problems with the `"always"` option.

```js
function foo() {
    "use strict";

    return true;
}

(function() {
    "use strict";

    // other code
}());
```

## Options

```json
"global-strict": ["error", "always"]
```

Requires that every file have a top-level `"use strict"` statement.

```json
"global-strict": ["error", "never"]
```

Warns whenever `"use strict"` is used in the global scope such that it could contaminate concatenated files.

## When Not To Use It

When a project may use non-strict-mode code side by side with strict-mode code and the files are not concatenated, the decision to use global strict mode can be made on an individual basis, rendering this rule unnecessary.
