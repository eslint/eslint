---
title: ESLint
layout: default
---
# brace style

One true brace style is a common coding style in JavaScript, in which the opening curly brace of a block is placed on the same line as its corresponding statement or declaration.

{% highlight javascript %}
function foo()
{
  return true;
}

if (foo)
{
  bar();
}
{% endhighlight %}

## Rule Details

This rule is aimed at enforcing one true brace style across your JavaScript. As such, it warns whenever it sees a statement or declaration that does not adhere to the one true brace style.

The following patterns are considered warnings:

{% highlight javascript %}
function foo()
{
  return true;
}

if (foo)
{
  bar();
}

try
{
  somethingRisky();
} catch(e)
{
  handleError();
}
{% endhighlight %}

The following patterns adhere to one true brace style and do not cause warnings:

{% highlight javascript %}
function foo() {
  return true;
}

if (foo) {
  bar();
}

try {
  somethingRisky();
} catch(e) {
  handleError();
}
{% endhighlight %}

## When Not To Use It

If your project will not be using the one true brace style, turn this rule off.
