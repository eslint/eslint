# No script url

Using javascript: urls is considered by some as a form of eval. Script passed after javascript: has to be parsed and evaluated by the browser the same way that it does eval. This rule corresponds to `scripturl` rule of JSHint.

## Rule Details

The following patterns are considered warnings:

```js
location.href = "javascript:void(0)";
```

## Further Reading

* [What is the matter with script-targeted URLs?](http://stackoverflow.com/questions/13497971/what-is-the-matter-with-script-targeted-urls)
