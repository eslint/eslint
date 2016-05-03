# Rule Changes

Occasionally, a core ESLint rule needs to be changed. This is not necessarily a bug, but rather, an enhancement that makes a rule more configurable. In those situations, we will consider making changes to rules.

## Proposing a Rule Change

If you want to propose a rule change, [create an issue](https://github.com/eslint/eslint/issues/new?body=**What%20version%20of%20ESLint%20are%20you%20using%3F**%0A%0A**What%20rule%20do%20you%20want%20to%20change%3F**%0A%0A**What%20code%20should%20be%20flagged%20as%20incorrect%20with%20this%20change%3F**%0A%0A**What%20happens%20when%20the%20rule%20is%20applied%20to%20this%20code%20now%3F**%0A%0A%0A) be sure to include:

1. The version of ESLint you are using
2. The rule you want to change
3. The code you want to be flagged as incorrect
4. What happens when the rule is applied to the code without your change

We need all of this information in order to determine whether or not the change is a good candidate for inclusion.

## Accepting a Rule Change

In order for a rule change to be accepted into ESLint, it must:

1. Adhere to the [Core Rule Guidelines](new-rules#core-rule-guidelines)
1. Have an ESLint team member champion the change
1. Be important enough that rule is deemed incomplete without this change

## Implementation is Your Responsibility

The ESLint team doesn't implement rule changes that are suggested by users because we have a limited number of people and need to focus on the overall roadmap. Once a rule change is accepted, you are responsible for implementing and documenting it. You may, alternately, recruit another person to help you. The ESLint team member who championed the rule is your resource to help guide you through the rest of this process.
