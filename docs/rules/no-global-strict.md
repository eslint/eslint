# Disallow Global Strict Mode

Strict mode is enabled by using the following pragma in your code:

```js
"use strict";
```

When used globally, as in this example, the strict mode pragma applies to all code within a single file. This can be dangerous if you concatenate scripts together before serving them to a browser. For instance, if you have a file running in strict mode and you concatenate that file with jQuery, the strict mode now also applies to jQuery and may cause errors.

## Rule Details

This rule is aimed at disallowing global strict mode. As such, it warns whenever a strict mode pragma is found in the global scope.


The following patterns are considered warnings:

```js
"use strict";

function foo() {
    return true;
}
```

The following patterns apply strict mode only to functions and therefore do not cause a warning.

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

## When Not To Use It

If you're using Node.js, you may not mind having strict mode turned on globally. Files are typically not concatenated together in Node.js projects and therefore the risk of applying strict mode accidentally is minimal. Further, since every file in Node.js has its own scope, global strict mode only effects the single file in which it is placed. In this case, it is safe to turn off this rule.
