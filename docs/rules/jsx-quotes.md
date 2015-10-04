# Enforce JSX Quote Style (jsx-quotes)

JSX attribute values can contain string literals, which are delimited with single or double quotes.

```xml
<a b='c' />
<a b="c" />
```

Unlike string literals in JavaScript, string literals within JSX attributes can’t contain escaped quotes.
If you want to have e.g. a double quote within a JSX attribute value, you have to use single quotes as string delimiter.

```xml
<a b="'" />
<a b='"' />
```

## Rule Details

This rule takes one argument.
If it is `"prefer-double"` then the rule enforces the usage of double quotes for all JSX attribute values which doesn’t contain a double quote.
If `"prefer-single"` is configured then the rule enforces the usage of single quotes for all JSX attribute values which doesn’t contain a single quote.

The default is `"prefer-double"`.

The following patterns are considered problems when set to `"prefer-double"`:

```xml
<a b='c' />
```

The following patterns are not considered problems when set to `"prefer-double"`:

```xml
<a b="c" />
<a b='"' />
```

The following patterns are considered problems when set to `"prefer-single"`:

```xml
<a b="c" />
```

The following patterns are not considered problems when set to `"prefer-single"`:

```xml
<a b='c' />
<a b="'" />
```

## When Not To Use It

You can turn this rule off if you don’t use JSX or if you aren’t concerned with a consistent usage of quotes within JSX attributes.

## Related Rules

* [quotes](quotes.md)
