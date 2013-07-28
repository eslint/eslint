# No multiline strings

This rule prevents the use of ES5 only feature that allows usage of multiline strings:

```javascript
var x = "Line 1 \
         Line 2";
```

This feature is only supported in the browsers that can parse and process ES5. Older browsers will likely throw an exception when they try to parse this code.

## Further Reading

* [Bad escapement of EOL](http://jslinterrors.com/bad-escapement-of-eol-use-option-multistr-if-needed/)