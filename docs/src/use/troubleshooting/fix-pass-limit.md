---
title: The fix loop reached the maximum number of fix passes …
eleventyNavigation:
    key: fix pass limit
    parent: troubleshooting
    title: The fix loop reached the maximum number of fix passes …
---

## Symptoms

When running ESLint with the `--fix` option, you may see the following warning:

```plaintext
ESLintMaxAutoFixWarning: The fix loop reached the maximum number of fix passes (10) while fixing path/to/file. Some fixable problems might not have been fixed.
```

## Cause

ESLint autofixes code in multiple passes, up to a maximum of 10 passes per file. If the fix loop reaches that limit while still applying fixes, ESLint stops to avoid running indefinitely. This warning indicates that not all fixable problems were resolved before the loop stopped.

## Resolution

Common resolutions for this issue include:

- Review the fixable rules enabled for the file and check whether any of them apply fixes that do not converge.
- If a single rule or a combination of rules keeps producing new fixes in every pass, consider reconfiguring or disabling the most likely offending rule.
- If the file is generated or third-party code, consider disabling `--fix` for it so that partial fixes are not applied to code that you do not own.

## Resources

For more information, see:

- [Configure Rules](../configure/rules) for documentation on how to configure rules
