# enforce placing object properties on separate lines (object-property-newline)

This rule permits you to restrict the locations of property specifications in object literals. You may prohibit any part of any property specification from appearing on the same line as any part of any other property specification. You may make this prohibition absolute, or, by invoking an object option, you may allow an exception, permitting an object literal to have all parts of all of its property specifications on a single line. Other object options let you make the rule looser or stricter with respect to certain notations.

## Rule Details

### Motivations

This rule makes it possible to ensure, as some style guides require, that property specifications appear on separate lines for better readability. For example, you can prohibit all of these:

```js
const newObject = {a: 1, b: [2, {a: 3, b: 4}]};
const newObject = {
    a: 1, b: [2, {a: 3, b: 4}]
};
const newObject = {
    a: 1,
    b: [2, {a: 3, b: 4}]
};
const newObject = {
    a: 1,
    b: [
        2,
        {a: 3, b: 4}
    ]
};
```

Instead of those, you can comply with the rule by writing

```js
const newObject = {
    a: 1,
    b: [2, {
        a: 3,
        b: 4
    }]
};
```

or

```js
const newObject = {
    a: 1,
    b: [
        2,
        {
            a: 3,
            b: 4
        }
    ]
};
```

Another benefit of this rule is specificity of diffs when a property is changed:

```diff
// More specific
 var obj = {
     foo: "foo",
-    bar: "bar",
+    bar: "bazz",
     baz: "baz"
 };
```

```diff
// Less specific
-var obj = { foo: "foo", bar: "bar", baz: "baz" };
+var obj = { foo: "foo", bar: "bazz", baz: "baz" };
```

### Optional Exceptions

The rule offers three object options.

#### `allowAllPropertiesOnSameLine`

If you set `allowAllPropertiesOnSameLine` (a deprecated synonym is `allowMultiplePropertiesPerLine`) to `true`, object literals such as the first two above, with all property specifications on the same line, will be permitted, but one like

```js
const newObject = {
    a: 'a.m.', b: 'p.m.',
    c: 'daylight saving time'
};
```

will be prohibited, because two properties, but not all properties, appear on the same line.

#### `treatComputedPropertiesLikeJSCS`

If you set `treatComputedPropertiesLikeJSCS` to `true`, an object literal such as the one below will be permitted:

```js
const newObject = {
    a: 1, [
        process.argv[4]
    ]: '01'
};
```

Otherwise, this rule will prohibit it, because ESLint treats the opening bracket of a computed property name as part of the property specification. The JSCS rule `requireObjectKeysOnNewLine` does not, so this object option makes ESLint compatible with JSCS in this respect.

#### `noCommaFirst`

If you set `noCommaFirst` to `true`, an object literal such as the one below will be prohibited, even though all its property specifications are on separate lines:

```js
const newFunction = multiplier => ({
    a: 2 * multiplier
    , b: 4 * multiplier
    , c: 8 * multiplier
});
```

This object option makes the rule stricter by prohibiting one of the patterns by which you could comply with the rule. Specifically, the comma between two property specifications may not appear before the second one on the same line. The JSCS rule `requireObjectKeysOnNewLine` treats commas this way, so this object option makes ESLint compatible with JSCS in this respect.

You can use the `comma-style` rule instead of this option to achieve partial JSCS compatibility, but not in combination with the `treatComputedPropertiesLikeJSCS` object option. Using the `comma-style` rule for the sole purpose of JSCS compatibility would also require you to enumerate 9 exceptions, leaving only `ObjectExpression` subject to the rule.

### Notations

This rule applies equally to all property specifications, regardless of notation, including:

- `a: 1` (ES5)
- `a` (ES2015 shorthand property)
- ``[`prop${a}`]`` (ES2015 computed property name)

Thus, the rule (without the object option) prohibits both of these:

```js
const newObject = {
    a: 1, [
        process.argv[4]
    ]: '01'
};
const newObject = {
    a: 1, [process.argv[4]]: '01'
};
```

(This behavior differs from that of the JSCS rule cited below, which does not treat the leading `[` of a computed property name as part of that property specification. The JSCS rule prohibits the second of these formats but permits the first.)

### Multiline Properties

The rule prohibits the colocation on any line of at least 1 character of one property specification with at least 1 character of any other property specification. For example, the rule prohibits

```js
const newObject = {a: [
    'Officiële website van de Europese Unie',
    'Официален уебсайт на Европейския съюз'
], b: 2};
```

because 1 character of the specification of `a` (i.e. the trailing `]` of its value) is on the same line as the specification of `b`.

The `allowMultiplePropertiesPerLine` object option would not excuse this case, because the entire collection of property specifications spans 4 lines, not 1.

### --fix

If this rule is invoked with the command-line `--fix` option, object literals that violate the rule are generally modified to comply with it. The modification in each case is to move a property specification to the next line whenever there is part or all of a previous property specification on the same line. For example,

```js
const newObject = {
    a: 'a.m.', b: 'p.m.',
    c: 'daylight saving time'
};
```

is converted to

```js
const newObject = {
    a: 'a.m.',
b: 'p.m.',
    c: 'daylight saving time'
};
```

The modification does not depend on whether the `allowMultiplePropertiesPerLine` object option is set to `true`. In other words, ESLint never collects all the property specifications onto a single line, even when this object option would permit that.

ESLint does not correct a violation of this rule if a comment immediately precedes the second or subsequent property specification on a line, since ESLint cannot determine which line to put the comment onto.

As illustrated above, the `--fix` option, applied to this rule, does not comply with other rules, such as `indent`, but, if those other rules are also in effect, the option applies them, too.

## Examples

Examples of **incorrect** code for this rule, with all object options omitted or set to `false`:

```js
/*eslint object-property-newline: "error"*/

const obj = { foo: "foo", bar: "bar", baz: "baz" };

const obj = {
    foo: "foo", bar: "bar", baz: "baz"
};

const obj = {
    foo: "foo", bar: "bar",
    baz: "baz"
};

const obj = {
    [process.argv[3] ? "foo" : "bar"]: 0, baz: [
        1,
        2,
        4,
        8
    ]
};

const a = "antidisestablishmentarianistically";
const b = "yugoslavyalılaştırabildiklerimizdenmişsiniz";
const obj = {a, b};

const domain = process.argv[4];
const obj = {
    foo: "foo", [
    domain.includes(":") ? "complexdomain" : "simpledomain"
]: true};
```

Example of additional **incorrect** code for this rule with the `{ "noCommaFirst": true }` option:

```js
/*eslint object-property-newline: ["error", { "noCommaFirst": true }]*/

const obj = {
    foo: "foo"
    , bar: "bar"
    , baz: "baz"
};
```

Examples of **correct** code for this rule, with all object options omitted or set to `false`:

```js
/*eslint object-property-newline: "error"*/

const obj = {
    foo: "foo",
    bar: "bar",
    baz: "baz"
};

const obj = {
    foo: "foo"
    , bar: "bar"
    , baz: "baz"
};

const user = process.argv[2];
const obj = {
    user,
    [process.argv[3] ? "foo" : "bar"]: 0,
    baz: [
        1,
        2,
        4,
        8
    ]
};
```

Examples of additional **correct** code for this rule with the `{ "allowAllPropertiesOnSameLine": true }` option:

```js
/*eslint object-property-newline: ["error", { "allowAllPropertiesOnSameLine": true }]*/

const obj = { foo: "foo", bar: "bar", baz: "baz" };

const obj = {
    foo: "foo", bar: "bar", baz: "baz"
};
const user = process.argv[2];
const obj = {
    user, [process.argv[3] ? "foo" : "bar"]: 0, baz: [1, 2, 4, 8]
};
```

Example of additional **correct** code for this rule with the `{ "treatComputedPropertiesLikeJSCS": true }` option:

```js
/*eslint object-property-newline: ["error", { "treatComputedPropertiesLikeJSCS": true }]*/

const domain = process.argv[4];
const obj = {
    foo: "foo", [
    domain.includes(":") ? "complexdomain" : "simpledomain"
]: true};
```

## When Not To Use It

You can turn this rule off if you want to decide, case-by-case, whether to place property specifications on separate lines.

## Compatibility

- **JSCS**: [requireObjectKeysOnNewLine](http://jscs.info/rule/requireObjectKeysOnNewLine)

## Related Rules

- [brace-style](brace-style.md)
- [comma-dangle](comma-dangle.md)
- [key-spacing](key-spacing.md)
- [object-curly-spacing](object-curly-spacing.md)
