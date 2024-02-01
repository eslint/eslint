---
title: Rules Reference
permalink: /rules/index.html
eleventyNavigation:
    key: rules
    parent: use eslint
    title: Rules Reference
    order: 5
---

{% from 'components/rule-categories.macro.html' import ruleCategories, recommended, fixable, hasSuggestions %}
{% from 'components/rule.macro.html' import rule %}

Rules in ESLint are grouped by type to help you understand their purpose. Each rule has emojis denoting:

{{ ruleCategories({
        index: true,
        recommended: true,
        fixable: true,
        hasSuggestions: true
}) }}

{%- for type in rules.types -%}

<h2 id="{{ type.displayName | slugify }}"> {{ type.displayName }} </h2>

{{ type.description | safe }}

    {%- for the_rule in type.rules -%}
    {%- if type.displayName == 'deprecated' -%}{%- set deprecated_value = true -%}{%- endif -%}

    {%- set name_value = the_rule.name -%}
    {%- set description_value = the_rule.description -%}
    {%- set isRecommended = the_rule.recommended -%}
    {%- set isFixable = the_rule.fixable -%}
    {%- set isHasSuggestions = the_rule.hasSuggestions -%}

    {{ rule({
            name: name_value,
            deprecated: deprecated_value,
            description: description_value,
            categories: {
                recommended: isRecommended,
                fixable: isFixable,
                hasSuggestions: isHasSuggestions
            }
    }) }}
    {%- endfor -%}
{%- endfor -%}

{%- if rules.deprecated -%}

<h2 id="{{ rules.deprecated.name | slugify }}">{{ rules.deprecated.name }}</h2>

{{ rules.deprecated.description | safe }}

{%- for the_rule in rules.deprecated.rules -%}
    {%- set name_value = the_rule.name -%}
    {%- set isReplacedBy = the_rule.replacedBy -%}

    {{ rule({
            name: name_value,
            deprecated: true,
            replacedBy: isReplacedBy
    }) }}
{%- endfor -%}
{%- endif -%}

{%- if rules.removed -%}

<h2 id="{{ rules.removed.name | slugify }}">{{ rules.removed.name }}</h2>

{{ rules.removed.description | safe }}

{%- for the_rule in rules.removed.rules -%}
    {%- set name_value = the_rule.removed -%}
    {%- set isReplacedBy = the_rule.replacedBy -%}

    {{ rule({
            name: name_value,
            removed: true,
            replacedBy: isReplacedBy
    }) }}
{%- endfor -%}
{%- endif -%}

{# <!-- markdownlint-disable-file MD046 --> #}
