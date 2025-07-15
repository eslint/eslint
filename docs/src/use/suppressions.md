---
title: Bulk Suppressions
eleventyNavigation:
    key: suppressions
    parent: use eslint
    title: Bulk Suppressions
    order: 8
---

Enabling a new lint rule as `"error"` can be challenging when the codebase has many violations and the rule isn't auto-fixable. Unless the rule is enabled during the early stages of the project, it becomes harder and harder to enable it as the codebase grows. Existing violations must be resolved before enabling the rule, but while doing that other violations may occur.

To address this, ESLint provides a way to suppress existing violations for one or more rules. While the rule will be enforced for new code, the existing violations will not be reported. This way, you can address the existing violations at your own pace.

::: important
Only rules configured as `"error"` are suppressed. If a rule is enabled as `"warn"`, ESLint will not suppress the violations.
:::

After you enable a rule as `"error"` in your configuration file, you can suppress all the existing violations at once by using the `--suppress-all` flag. It is recommended to execute the command with the `--fix` flag so that you don't suppress violations that can be auto-fixed.

```bash
eslint --fix --suppress-all
```

This command will suppress all the existing violations of all the rules that are enabled as `"error"`. Running the `eslint` command again will not report these violations.

If you would like to suppress violations of a specific rule, you can use the `--suppress-rule` flag.

```bash
eslint --fix --suppress-rule no-unused-expressions
```

You can also suppress violations of multiple rules by providing multiple rule names.

```bash
eslint --fix --suppress-rule no-unused-expressions --suppress-rule no-unsafe-assignment
```

## Suppressions File

When you suppress violations, ESLint creates a `eslint-suppressions.json` file in the root of the project. This file contains the list of rules that have been suppressed. You should commit this file to the repository so that the suppressions are shared with all the developers.

If necessary, you can change the location of the suppressions file by using the `--suppressions-location` argument. Note that the argument must be provided not only when suppressing violations but also when running ESLint. This is necessary so that ESLint picks up the correct suppressions file.

```bash
eslint --suppressions-location .github/.eslint-suppressions
```

## Resolving Suppressions

You can address any of the reported violations by making the necessary changes to the code as usual. If you run ESLint again you will notice that it exits with a non-zero exit code and an error is reported about unused suppressions. This is because the violations have been resolved but the suppressions are still in place.

```bash
> eslint
There are suppressions left that do not occur anymore. Consider re-running the command with `--prune-suppressions`.
```

To remove the suppressions that are no longer needed, you can use the [`--prune-suppressions`](./command-line-interface#--prune-suppressions) flag.

```bash
eslint --prune-suppressions
```

To ignore unused suppressions when calculating the exit code and not report an error about unused suppressions, you can use the `--pass-on-unpruned-suppressions` flag.

```bash
eslint --pass-on-unpruned-suppressions
```

For more information on the available CLI options, refer to [Command Line Interface](./command-line-interface).
