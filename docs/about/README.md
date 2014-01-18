# About

ESLint is an open source project originally created by Nicholas C. Zakas in June 2013. The goal of ESLint is to provide a pluggable linting utility for JavaScript. While [JSHint](http://jshint.com/) and [JSLint](http://jslint.com/) dominate JavaScript linting, neither one provides an API for plugging in your own rules. This means that if you need a new rule, you need to write it and get it accepted into the released product. That's lousy if you need to quickly add something to your build system or even if you need company-specific rules.

ESLint is designed to have all rules completely pluggable. The default rules are written just like any plugin rules would be. They can all follow the same pattern, both for the rules themselves as well as tests. While ESLint will ship with some built-in rules for compatibility with JSHint and JSLint, you'll be able to dynamically load rules at any point in time.

ESLint is written using Node.js to provide a fast runtime environment and easy installation via [npm](http://npmjs.org/).

## Philosophy

Everything is pluggable:

* Rule API is used both by bundled and custom rules
* Formatter API is used both by bundled and custom formatters
* Additional rules and formatters can be specified at runtime
* Rules and formatters don't have to be bundled to be used

Every rule:

* Is standalone
* Can be able to be turned off or on (nothing can be deemed "too important to turn off")
* Can be set to be a warning or error individually
* Is turned on by providing a non-zero number and off by providing zero

Additionally:

* Rules are "agenda free" - ESLint does not promote any particular coding style
* Any bundled rules are generalizable

The project:

* Values documentation and clear communication
* Is as transparent as possible
* Believes in the importance of testing
