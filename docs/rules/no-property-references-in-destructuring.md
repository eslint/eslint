# Disallows use of property references in destructuring patterns (no-property-references-in-destructuring)

Although destructuring is typically used to set local variables, it can
be used to set other variable references when not part of a variable
declaration, including "property references"–references that are expressed as
a property on some other object (like `window.prop` in the following example):

```js
let a;
const obj = {a: 5};
({ a: window.prop } = obj); // Only `window.prop` (and not `a`) is set here
console.log(a); // undefined
console.log(window.prop); // 5
```

Since extended expressions (like `window.prop`) would be more commonly expected
as part of default values:

```js
let a;
window.prop = 15;
const obj = {a: 5};
({ a = window.prop } = obj); // Only `a` is used here as no need to default
console.log(a); // 5
console.log(window.prop); // 15
```

...the above-mentioned property references may be confused with default value
setting. Thus, one reason for prohibiting such constructs is to avoid
their being confused with defaulting attempts.

Another reason would be to avoid having side effects that are less transparent
than a simple assignment or destructuring.

```js
// Bad
const obj = {};
({ a: this.a } = obj);

// Good
const obj = {};
({ a : { b, c }} = obj);
```

## Rule Details

This rule disallows references within object or array destructuring pattern
values if they are not simple variable references (if they are a property
reference).

Computed properties are still allowed as are default values of any kind.

## Options

None.

## Known Limitations

This rule only checks property references. If you want to detect another form
of useless destructuring, see [no-useless-rename](no-useless-rename.md).

## When Not To Use It

If you feel you can readily distinguish between property references in
destructuring and destructuring default values and want to be able to set
a property with its object during destructuring, you can avoid this rule.
