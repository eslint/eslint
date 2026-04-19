---
title: Rule Deprecation
---

The rule deprecation metadata describes whether a rule is deprecated and how the rule can be replaced if there is a replacement.
The legacy format used the two top-level [rule meta](./custom-rules#rule-structure) properties `deprecated` (as a boolean only) and `replacedBy`.
In the new format, `deprecated` is a boolean or an object of type `DeprecatedInfo`, and `replacedBy` should be defined inside `deprecated` instead of at the top-level.

## ◆ DeprecatedInfo type

This type represents general information about a rule deprecation.
Every property is optional.

- `message` (`string`)<br>
  A general message presentable to the user. May contain why this rule is deprecated or how to replace the rule.
- `url` (`string`)<br>
  An URL with more information about this rule deprecation.
- `replacedBy` (`ReplacedByInfo[]`)<br>
  Information about the available replacements for the rule.
  This may be an empty array to explicitly state there is no replacement.
- `deprecatedSince` (`string`)<br>
  [Semver](https://semver.org/) of the version deprecating the rule.
- `availableUntil` (`string | null`)<br>
  [Semver](https://semver.org/) of the version likely to remove the rule, e.g. the next major version.
  The special value `null` means the rule will no longer be changed but will be kept available.

## ◆ ReplacedByInfo type

The type describes a single possible replacement of a rule.
Every property is optional.

- `message` (`string`)<br>
  A general message about this rule replacement, e.g.
- `url` (`string`)<br>
  An URL with more information about this rule replacement.
- `plugin` (`ExternalSpecifier`)<br>
  Specifies which plugin has the replacement rule.
  The name should be the package name and should be "eslint" if the replacement is an ESLint core rule.
  This property should be omitted if the replacement is in the same plugin.
- `rule` (`ExternalSpecifier`)<br>
  Specifies the replacement rule.
  May be omitted if the plugin only contains a single rule or has the same name as the rule.

### ◆ ExternalSpecifier type

This type represents an external resource.
Every property is optional.

- `name` (`string`)<br>
  The package name for `plugin` and the rule id for `rule`.
- `url` (`string`)<br>
  An URL pointing to documentation for the plugin / rule..
