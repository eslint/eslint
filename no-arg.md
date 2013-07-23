---
title: ESLint
layout: default
---
# no arg

Both `arguments.caller` and `arguments.callee` have fallen out of favor due to their negative performance and security implications. Both are forbidden from use in ECMAScript 5 strict mode and are likely to be deprecated in future versions of ECMAScript. In order to ensure future compatibility, it's recommended to avoid using both `arguments.caller` and `arguments.callee`.

## Rule Details

This rule is aimed at eliminating `arguments.caller` and `arguments.callee` from your JavaScript. As such, it warns whenever it sees either in code.

The following patterns are considered warnings:

{% highlight javascript %}
function findCallingFunction() {
    return arguments.caller;
}

function recurseInfinitely() {
    return arguments.callee();
}
{% endhighlight %}

The following patterns are considered okay and do not cause warnings:

{% highlight javascript %}
// custom arguments
Arguments.callee();
{% endhighlight %}

## When Not To Use It

If you're using code that is meant strictly to run in an ECMAScript 3 environment, then you can safely disable this rule. Otherwise, it's recommended to use this rule all the time.

## Further Reading

* [Why was arguments.caller deprecated in JavaScript?](http://stackoverflow.com/questions/103598/why-was-the-arguments-callee-caller-property-deprecated-in-javascript)
* [arguments.callee](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments/callee)
* [arguments.caller](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments/caller)
