# About

ESLint is an open source JavaScript linting utility originally created by Nicholas C. Zakas in June 2013. Code [linting][] is a type of static analysis that is frequently used to find problematic patterns or code that doesn't adhere to certain style guidelines. There are code linters for most programming languages, and compilers sometimes incorporate linting into the compilation process.

JavaScript, being a dynamic and loosely-typed language, is especially prone to developer error. Without the benefit of a compilation process, JavaScript code is typically executed in order to find syntax or other errors. Linting tools like ESLint allow developers to discover problems with their JavaScript code without executing it.

The primary reason ESLint was created was to allow developers to create their own linting rules. ESLint is designed to have all rules completely pluggable. The default rules are written just like any plugin rules would be. They can all follow the same pattern, both for the rules themselves as well as tests. While ESLint will ship with some built-in rules to make it useful from the start, you'll be able to dynamically load rules at any point in time.

ESLint is written using Node.js to provide a fast runtime environment and easy installation via [npm][].

[linting]: https://en.wikipedia.org/wiki/Lint_(software)
[npm]: https://npmjs.org/

## Philosophy

Everything is pluggable:

* Rule API is used both by bundled and custom rules
* Formatter API is used both by bundled and custom formatters
* Additional rules and formatters can be specified at runtime
* Rules and formatters don't have to be bundled to be used

Every rule:

* Is standalone
* Can be turned off or on (nothing can be deemed "too important to turn off")
* Can be set to a warning or error individually

Additionally:

* Rules are "agenda free" - ESLint does not promote any particular coding style
* Any bundled rules are generalizable

The project:

* Values documentation and clear communication
* Is as transparent as possible
* Believes in the importance of testing
