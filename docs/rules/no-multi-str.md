# Disallow Multiline Strings (no-multi-str)

It's possible to create multiline strings in JavaScript by using a slash before a newline, such as:

```js
var x = "Line 1 \
         Line 2";
```

Some consider this to be a bad practice as it was an undocumented feature of JavaScript that was only formalized later.

## Rule Details

This rule is aimed at preventing the use of multiline strings.

The following generates a warning:

```js
/*eslint no-multi-str: 2*/

/*error Multiline support is limited to browsers supporting ES5 only.*/ var x = "Line 1 \
         Line 2";
```

The following does not generate a warning:

```js
/*eslint no-multi-str: 2*/

var x = "Line 1\n" +
        "Line 2";
```



## Further Reading

* [Bad escapement of EOL](http://jslinterrors.com/bad-escapement-of-eol-use-option-multistr-if-needed/)
