---
title: Circular fixes detected …
eleventyNavigation:
    key: circular fixes
    parent: troubleshooting
    title: Circular fixes detected …
---

## Symptoms

When running ESLint with the `--fix` option, you may see the following warning:

```plaintext
ESLintCircularFixesWarning: Circular fixes detected while fixing path/to/file. It is likely that you have conflicting rules in your configuration.
```

## Cause

You have conflicting fixable rules in your configuration. ESLint autofixes code in multiple passes, meaning it's possible that a fix in one pass is undone in a subsequent pass. For example, in the first pass a rule removes a trailing comma and in the following pass a different rule adds a trailing comma in the same place, effectively changing the code back to the previous version. ESLint emits a warning when it detects cycles like this.

## Resolution

Common resolutions for this issue include:

- Remove or reconfigure one of the conflicting rules in your configuration file.

How to find the conflicting rules:

1. Open the file specified in the warning in an editor that supports applying individual fixes (for example, VS Code).
1. In the list of lint problems, find a fixable rule. That is one of the conflicting rules.
1. Apply the fix ("Fix this (rule-name) problem" action in VS Code).
1. Check what new lint problem has appeared in the list. That is the other conflicting rule.

## Resources

For more information, see:

- [Configure Rules](../configure/rules) for documentation on how to configure rules
