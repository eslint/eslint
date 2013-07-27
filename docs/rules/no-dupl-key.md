# no duplicate object keys

## Rule Details

This rule flags object expressions that contain duplicate keys. Using
duplicate keys can cause your code to behave in unexpected ways, despite
being able to run without raising explicit errors.

The following patterns are considered warnings:

```js
var x = {
    y: 10,
    y: 20
};

var x = {
    y: {
        a: 10,
        a: 20
    }
};
```

The following patterns are considered okay and do not cause warnings:

```js
var x = {
    a: 10,
    b: 20
};

var x = {
    y: {
        a: 10,
        b: 20
    }
};

var x = {
    y: 10
};
x.y = "foo";
```

## Notes

When using strict mode, duplicate object keys will actually raise a 
syntax error.

## Further Reading

* [JSLint -- Duplicate member {a}](http://jslinterrors.com/duplicate-member-a/)
* [JSLint -- Duplicate key {a}](http://jslinterrors.com/duplicate-key-a/)
