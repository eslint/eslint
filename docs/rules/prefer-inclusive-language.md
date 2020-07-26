# Rule to encourage the use of inclusive language that avoids discrimination against groups of people.   (prefer-inclusive-language)

This rule discourages the use of exclusive or oppressive terminology in identifier names.

## Rule Details

By default, this rule includes two sets of terms that are normalised on the technical level but oppressive on a societal level: "blacklist"/"whitelist", and "master"/"slave". Both sets of terms can be replaced with alternatives that are clear in their intent, and also more inclusive/less offensive. This rule is also configurable, allowing users to choose the terms that best represent the values of their project or team.

### Options

* `deny`: (`string[]`) list of terms to disallow in identifiers (default: `["blacklist", "whitelist", "master", "slave"]`)
* `allow`: (`string[]`) list of _exact_ terms to ignore (default: `[]`)
* `ignoreDestructuring`: `false` (default) enforces deny list on destructured identifiers
* `ignoreDestructuring`: `true` does not check destructured identifiers (but still checks any use of those identifiers later in the code)

### deny: ["blacklist", "whitelist", "master", "slave"]

Examples of **incorrect** code for this rule with the default `{ deny: ["blacklist", "whitelist", "master", "slave"] }` option:

```js
var blackList = ['foo', 'bar'];
let whitelist = ['a', 'b'];

const MasterDetail = new View();
class Coordinator {
  attach(slaves) {
    // ...
  }
}
```

Examples of **correct** code for this rule:

```js
var denyList = ['foo', 'bar'];
let allowlist = ['a', 'b'];

const ListDetail = new View();
class Coordinator {
  attach(workers) {
    // ...
  }
}
```

### deny: (custom list)

Examples of **incorrect** code for this rule when specifying a custom list:

```js
/* eslint prefer-inclusive-language: ["error", {deny: ["foo"]}] */
const someFoo = ['bar', 'baz'];
```

Examples of **correct** code for this rule:

```js
/* eslint prefer-inclusive-language: ["error", {deny: ["foo"]}] */
const someBar = ['foo', 'baz'];
```

### allow: (custom list)

Examples of **incorrect** code for this rule with a custom `allow` option (and a default `deny` option):

```js
/* eslint prefer-inclusive-language: ["error", {allow: ["masterDetailView"]}] */
const MasterDetailView = new View();
```

Examples of **correct** code for this rule:

```js
/* eslint prefer-inclusive-language: ["error", {allow: ["masterDetailView"]}] */
const masterDetailView = new View();
```

### ignoreDestructuring: false

Examples of **incorrect** code for this rule with the default `{ "allowDestructuring": false }` option:

```js
const { masterList } = someObject;
```

Examples of **correct** code for this rule:

```js
const { masterList: list } = someObject;
```

### ignoreDestructuring: false

Examples of **incorrect** code for this rule with the `{ "allowDestructuring": true }` option:

```js
/* eslint prefer-inclusive-language: ["error", {allowDestructuring: true}] */
const masterList = ['one', 'two'];
```

Examples of **correct** code for this rule:

```js
/* eslint prefer-inclusive-language: ["error", {allowDestructuring: true}] */
const { masterList } = someObject;
```
