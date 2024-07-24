---
title: Integrations
eleventyNavigation:
    key: integrations
    parent: use eslint
    title: Integrations
    order: 8

---

This page contains community projects that have integrated ESLint. The projects on this page are not maintained by the ESLint team.

If you would like to recommend an integration to be added to this page, [submit a pull request](../contribute/pull-requests).

## Editors

* Sublime Text 3:
    * [SublimeLinter-eslint](https://github.com/SublimeLinter/SublimeLinter-eslint)
    * [Build Next](https://github.com/albertosantini/sublimetext-buildnext)
* Vim:
    * [ALE](https://github.com/dense-analysis/ale)
    * [Syntastic](https://github.com/vim-syntastic/syntastic/tree/master/syntax_checkers/javascript)
* Emacs: [Flycheck](http://www.flycheck.org/) supports ESLint with the [javascript-eslint](http://www.flycheck.org/en/latest/languages.html#javascript) checker.
* Eclipse Orion: ESLint is the [default linter](https://dev.eclipse.org/mhonarc/lists/orion-dev/msg02718.html)
* Eclipse IDE: [Tern ESLint linter](https://github.com/angelozerr/tern.java/wiki/Tern-Linter-ESLint)
* TextMate 2:
    * [eslint.tmbundle](https://github.com/ryanfitzer/eslint.tmbundle)
    * [javascript-eslint.tmbundle](https://github.com/natesilva/javascript-eslint.tmbundle)
* IntelliJ IDEA, WebStorm, PhpStorm, PyCharm, RubyMine, and other JetBrains IDEs: [How to use ESLint](https://www.jetbrains.com/help/webstorm/eslint.html)
* Visual Studio: [Linting JavaScript in VS](https://learn.microsoft.com/en-us/visualstudio/javascript/linting-javascript?view=vs-2022)
* Visual Studio Code: [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* Brackets: Included and [Brackets ESLint](https://github.com/brackets-userland/brackets-eslint)

## Build tools

* Grunt: [grunt-eslint](https://www.npmjs.com/package/grunt-eslint)
* Webpack: [eslint-webpack-plugin](https://www.npmjs.com/package/eslint-webpack-plugin)
* Rollup: [@rollup/plugin-eslint](https://www.npmjs.com/package/@rollup/plugin-eslint)

## Command Line Tools

* [ESLint Watch](https://www.npmjs.com/package/eslint-watch)
* [Code Climate CLI](https://github.com/codeclimate/codeclimate)
* [ESLint Nibble](https://github.com/IanVS/eslint-nibble)

## Source Control

* [Git Precommit Hook](https://coderwall.com/p/zq8jlq/eslint-pre-commit-hook)
* [Git pre-commit hook that only lints staged changes](https://gist.github.com/dahjelle/8ddedf0aebd488208a9a7c829f19b9e8)
* [overcommit Git hook manager](https://github.com/brigade/overcommit)
* [Mega-Linter](https://megalinter.io/latest/): Linters aggregator for CI, [embedding eslint](https://megalinter.io/latest/descriptors/javascript_eslint/)

## Other Integration Lists

You can find a curated list of other popular integrations for ESLint in the [awesome-eslint](https://github.com/dustinspecker/awesome-eslint) GitHub repository.
