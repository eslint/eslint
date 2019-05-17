# Rule Deprecation

Balancing the trade-offs of improving a tool and the frustration these changes can cause is a difficult task. One key area in which this affects our users is in the removal of rules.

The ESLint team is committed to making upgrading as easy and painless as possible. To that end, the team has agreed upon the following set of guidelines for deprecating rules in the future. The goal of these guidelines is to allow for improvements and changes to be made without breaking existing configurations.

* Rules will never be removed from ESLint.
* Rules will be deprecated as needed, and marked as such in all documentation.
* After a rule has been deprecated, the team will no longer do any work on it. This includes bug fixes, enhancements, and updates to the rule's documentation. Issues and pull requests related to deprecated rule will not be accepted and will be closed.

Since deprecated rules will never be removed, you can continue to use them indefinitely if they are working for you. However, keep in mind that deprecated rules will effectively be unmaintained.

We hope that by following these guidelines we will be able to continue improving and working to make ESLint the best tool it can be while causing as little disruption to our users as possible during the process.
