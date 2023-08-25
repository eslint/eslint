---
title: Package.json Conventions
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/contribute/package-json-conventions.md
eleventyNavigation:
    key: package.json conventions
    parent: contribute to eslint
    title: Package.json Conventions
    order: 8
---

The following applies to the "scripts" section of `package.json` files.

## Names

npm script names MUST contain only lower case letters, `:` to separate parts, `-` to separate words, and `+` to separate file extensions. Each part name SHOULD be either a full English word (e.g. `coverage` not `cov`) or a well-known initialism in all lowercase (e.g. `wasm`).

Here is a summary of the proposal in ABNF.

```abnf
name         = life-cycle / main target? option* ":watch"?
life-cycle   = "prepare" / "preinstall" / "install" / "postinstall" / "prepublish" / "preprepare" / "prepare" / "postprepare" / "prepack" / "postpack" / "prepublishOnly"
main         = "build" / "lint" ":fix"? / "release" / "start" / "test" / "fetch"
target       = ":" word ("-" word)* / extension ("+" extension)*
option       = ":" word ("-" word)*
word         = ALPHA +
extension    = ( ALPHA / DIGIT )+
```

## Order

The script names MUST appear in the package.json file in alphabetical order. The other conventions outlined in this document ensure that alphabetical order will coincide with logical groupings.

## Main Script Names

With the exception of [npm life cycle scripts](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts) all script names MUST begin with one of the following names.

### Build

Scripts that generate a set of files from source code and / or data MUST have names that begin with `build`.

If a package contains any `build:*` scripts, there MAY be a script named `build`. If so, SHOULD produce the same output as running each of the `build` scripts individually. It MUST produce a subset of the output from running those scripts.

### Fetch

Scripts that generate a set of files from external data or resources MUST have names that begin with `fetch`.

If a package contains any `fetch:*` scripts, there MAY be a script named `fetch`. If so, it SHOULD produce the same output as running each of the `fetch` scripts individually. It MUST produce a subset of the output from running those scripts.

### Release

Scripts that have public side effects (publishing the web site, committing to Git, etc.) MUST begin with `release`.

### Lint

Scripts that statically analyze files (mostly, but not limited to running `eslint` itself) MUST have names that begin with `lint`.

If a package contains any `lint:*` scripts, there SHOULD be a script named `lint` and it MUST run all of the checks that would have been run if each `lint:*` script was called individually.

If fixing is available, a linter MUST NOT apply fixes UNLESS the script contains the `:fix` modifier (see below).

### Start

A `start` script is used to start a server. As of this writing, no ESLint package has more than one `start` script, so there's no need `start` to have any modifiers.

### Test

Scripts that execute code in order to ensure the actual behavior matches expected behavior MUST have names that begin with `test`.

If a package contains any `test:*` scripts, there SHOULD be a script named `test` and it MUST run of all of the tests that would have been run if each `test:*` script was called individually.

A test script SHOULD NOT include linting.

A test script SHOULD report test coverage when possible.

## Modifiers

One or more of the following modifiers MAY be appended to the standard script names above. If a target has modifiers, they MUST be in the order in which they appear below (e.g. `lint:fix:js:watch` not `lint:watch:js:fix`)

### Fix

If it's possible for a linter to fix problems that it finds, add a copy of the script with `:fix` appended to the end that also fixes.

### Target

The name of the target of the action being run. In the case of a `build` script, it SHOULD identify the build artifact(s), e.g. "javascript" or "css" or "website". In the case of a `lint` or `test` script, it SHOULD identify the item(s) being linted or tested. In the case of a `start` script, it SHOULD identify which server is starting.

A target MAY refer to a list of affected file extensions (such as `cjs` or `less`) delimited by a `+`. If there is more than one extension, the list SHOULD be alphabetized. When a file extension has variants (such as `cjs` for CommonJS and `mjs` for ESM), the common part of the extension MAY be used instead of explicitly listing out all of the variants (e.g. `js` instead of `cjs+jsx+mjs`).

The target SHOULD NOT refer to name of the name of the tool that's performing the action (`eleventy`, `webpack`, etc.)

### Options

Additional options that don't fit under the other modifiers.

### Watch

If a script watches the filesystem and responds to changes, add `:watch` to the script name.
