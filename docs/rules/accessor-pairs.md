# Enforces getter/setter pairs in objects (accessor-pairs)

It's a common mistake in JavaScript to create an object with just setter but never have a getter defined for it. If you have a setter but no corresponding getter then you can never get the value. So it ends up not getting used as you can only set the value and never get the value.
Here are some examples:

```js
// Bad
var o = {
    set a(value) {
        this.val = value;
    }
};

// Good
var o = {
    set a(value) {
        this.val = value;
    },
    get a() {
        return this.val;
    }
};

```

This rule warns if setters are defined without getters. Using an option `getWithoutSet`, it will warn if you have a getter without a setter also.

## Rule Details

This rule enforces a style where it requires to have a getter for every object which has a setter defined. By activating the below option it enforces vice-versa behaviour also.

### Options

`getWithoutSet` set to `true` will warn for getters without setters (Default `false`).
`setWithoutGet` set to `true` will warn for setters without getters (Default `true`).

#### Usage

By default `setWithoutGet` option is always set to `true`.

```js
{
    accessor-pairs: [2, {getWithoutSet: true}]
}
```

The following patterns are considered warnings by default:

```js
var o = {
    set a(value) {
        this.val = value;
    }
};

var o = {d: 1};
Object.defineProperty(o, 'c', {
    set: function(value) {
        this.val = value;
    }
});
```

The following patterns are not considered warnings by default:

```js
var o = {
    set a(value) {
        this.val = value;
    },
    get a() {
        return this.val;
    }
};

var o = {d: 1};
Object.defineProperty(o, 'c', {
    set: function(value) {
        this.val = value;
    },
    get: function() {
        return this.val;
    }
});

```

The following patterns are considered warnings with option `getWithoutSet` set:

```js
var o = {
    set a(value) {
        this.val = value;
    }
};

var o = {
    get a() {
        return this.val;
    }
};

var o = {d: 1};
Object.defineProperty(o, 'c', {
    set: function(value) {
        this.val = value;
    }
});

var o = {d: 1};
Object.defineProperty(o, 'c', {
    get: function() {
        return this.val;
    }
});
```

The following patterns are not considered warnings by option `getWithoutSet` set:

```js
var o = {
    set a(value) {
        this.val = value;
    },
    get a() {
        return this.val;
    }
};

var o = {d: 1};
Object.defineProperty(o, 'c', {
    set: function(value) {
        this.val = value;
    },
    get: function() {
        return this.val;
    }
});

```

## When Not To Use It

You can turn this rule off if you are not concerned with the presence of setters or getters on objects.

## Further Reading

* [Object Setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)
* [Object Getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)
* [Working with Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)
