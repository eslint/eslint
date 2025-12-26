---
title: no-var
rule_type: suggestion
---



ECMAScript 6 allows programmers to create variables with block scope instead of function scope using the `let`
and `const` keywords. Block scope is common in many other programming languages and helps programmers avoid mistakes
such as:

```js
var count = people.length;
var enoughFood = sandwiches.length >= count;

if (enoughFood) {
    var count = sandwiches.length; // accidentally overriding the count variable
    console.log("We have " + count + " sandwiches for everyone. Plenty for all!");
}

// our count variable is no longer accurate
console.log("We have " + count + " people and " + sandwiches.length + " sandwiches!");
```

## Rule Details

This rule is aimed at discouraging the use of `var` and encouraging the use of `const` or `let` instead.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-var: "error"*/

var x = "y";
var CONFIG = {};
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-var: "error"*/

let x = "y";
const CONFIG = {};
```

:::

This rule additionally supports TypeScript type syntax. There are multiple ways to declare global variables in TypeScript. Only using `var` works for all cases. See this [TypeScript playground](https://www.typescriptlang.org/play/?#code/PQgEB4CcFMDNpgOwMbVAGwJYCMC8AiAEwHsBbfUYAPgFgAoew6ZdAQxlAHN1jtX1QAb3qhRGaABdQAGUkAuUAGcJkTIk4ixAN3agAauwXLV6+ptFqJCWK1SgA6mpIB3IebGjHiIyrUa6HgC+9MEMdGDcvPygtqiKivSyEvQGkPReZuHAoM5OxK6ckvS5iC4AdEnFec5lqVWl+WUZYWAlLkpFdG2NSaC4oADkA-XlqX2Dw13VTWrjQ5kRPHzoACoAFpiKXJ2Ry+ubFTtL-PuKtez0uycbZ830i1GrNx3JdFdPB73982-HH2djb6Td6nGaIOaTe7ZRTQdCwbavGFww6I2Gwc5pOhI9F3LIdOEvejYlEQolojGkrHkryU+jQAAeAAdiJApIJAkA) for reference.

Examples of **incorrect** TypeScript code for this rule:

:::incorrect

```ts
/*eslint no-var: "error"*/

declare var x: number

declare namespace ns {
	var x: number
}

declare module 'module' {
	var x: number
}
```

:::

Examples of **correct** TypeScript code for this rule:

:::correct

```ts
/*eslint no-var: "error"*/

declare global {
    declare var x: number
}
```

:::

## Options

This rule has no options.

## When Not To Use It

In addition to non-ES6 environments, existing JavaScript projects that are beginning to introduce ES6 into their
codebase may not want to apply this rule if the cost of migrating from `var` to `let` is too costly.
