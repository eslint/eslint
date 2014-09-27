#  a rule that enforces or disallows spaces after property names (and before property values) inside of objects. (key-spacing)



## Rule Details

This rule aims to enforce consistency about spaces inside of objects.

It takes an option as a second parameter which can be `"always"` or `"never"` for always having a space or never having any spaces respectively.  There is no default.

The following patterns are considered warnings:

```js
\\when [1,always]
{foo:'bar'}
{foo :'bar'}
{foo: 'bar'}
\\when [1,never]
{foo : 'bar'}
{foo :'bar'}
{foo: 'bar'}
```

The following patterns are not considered warnings:
```js
\\when [1,always]
{foo : 'bar'}
\\when [1,never]
{foo:'bar'}