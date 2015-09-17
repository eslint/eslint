# Disallow Unnecessary Strict Pragma (no-extra-strict)

**Replacement notice**: This rule was removed in ESLint v1.0 and replaced by the [strict](strict.md) rule. Both `"global"` and `"function"` mode in the strict rule implement this rule's behavior.

The `"use strict";` directive applies to the scope in which it appears and all inner scopes contained within that scope. Therefore, using the `"use strict";` directive in one of these inner scopes is unnecessary.

```js
"use strict";

(function () {
    "use strict";
    var foo = true;
}());
```

## Rule Details

This rule is aimed at preventing unnecessary `"use strict";` directives. As such, it will warn when it encounters a `"use strict";` directive when already in strict mode.

The following patterns are considered problems:

```js
"use strict";

(function () {
    "use strict";
    var foo = true;
}());
```

The following patterns are not considered problems:

```js
"use strict";

(function () {
    var foo = true;
}());
```



```js
(function () {
    "use strict";
    var foo = true;
}());
```

## Further Reading

* [The ECMAScript 5 Annotated Specification - Strict Mode](http://es5.github.io/#C)
