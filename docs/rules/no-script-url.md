# Disallow Script URLs (no-script-url)

Using `javascript:` URLs is considered by some as a form of `eval`. Code passed in `javascript:` URLs has to be parsed and evaluated by the browser in the same way that `eval` is processed.

## Rule Details

The following patterns are considered problems:

```js
/*eslint no-script-url: 2*/

location.href = "javascript:void(0)"; /*error Script URL is a form of eval.*/
```

## Compatibility

* **JSHint**: This rule corresponds to `scripturl` rule of JSHint.

## Further Reading

* [What is the matter with script-targeted URLs?](http://stackoverflow.com/questions/13497971/what-is-the-matter-with-script-targeted-urls)
