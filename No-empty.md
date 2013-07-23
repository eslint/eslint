---
title: ESLint
layout: default
---
# No empty

Empty statements usually occur due to refactoring that wasn't completed. You may end up with empty statements inside of blocks or `switch`, or by having too many semicolons in a row.

## Rule Details

This rule is aimed at eliminating empty statements. While not technically an error, empty statements can be a source of confusion when reading code.

The following patterns are considered warnings:

{% highlight javascript %}
if (foo) {
}

while (foo) {
}

foo();;

switch(foo) {
}
{% endhighlight %}

## When Not To Use It

If you intentionally use empty statements then you can disable this rule.

