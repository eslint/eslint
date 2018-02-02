# Rule Changes

Occasionally, a core ESLint rule needs to be changed. This is not necessarily a bug, but rather, an enhancement that makes a rule more configurable. In those situations, we will consider making changes to rules.

## Proposing a Rule Change

To propose a change to an existing rule, [create a pull request](/docs/developer-guide/contributing/pull-requests.md) or [new issue](https://github.com/eslint/eslint/issues/new?template=RULE_CHANGE.md) and fill out the template.

We need all of this information in order to determine whether or not the change is a good candidate for inclusion.

## Accepting a Rule Change

In order for a rule change to be accepted into ESLint, it must:

1. Adhere to the [Core Rule Guidelines](new-rules.md#core-rule-guidelines)
1. Have an ESLint team member champion the change
1. Be important enough that rule is deemed incomplete without this change

## Implementation is Your Responsibility

The ESLint team doesn't implement rule changes that are suggested by users because we have a limited number of people and need to focus on the overall roadmap. Once a rule change is accepted, you are responsible for implementing and documenting it. You may, alternately, recruit another person to help you. The ESLint team member who championed the rule is your resource to help guide you through the rest of this process.
