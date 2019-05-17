# enforce a maximum number of classes per file (max-classes-per-file)

Files containing multiple classes can often result in a less navigable
and poorly structured codebase. Best practice is to keep each file
limited to a single responsibility.

## Rule Details

This rule enforces that each file may contain only a particular number
of classes and no more.

Examples of **incorrect** code for this rule:

```js
/*eslint max-classes-per-file: "error"*/

class Foo {}
class Bar {}
```

Examples of **correct** code for this rule:

```js
/*eslint max-classes-per-file: "error"*/

class Foo {}
```

## Options

This rule has a numeric option (defaulted to 1) to specify the
maximum number of classes.

For example:

```json
{
    "max-classes-per-file": ["error", 1]
}
```

Examples of **correct** code for this rule with the numeric option set to `2`:

```js
/* eslint max-classes-per-file: ["error", 2] */

class Foo {}
class Bar {}
```
