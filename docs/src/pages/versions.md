---
layout: main.html
title: Versions
permalink: /versions/
hook: "versions-page"
---

{%- from 'components/hero.macro.html' import hero %}

{{ hero({
    title: "ESLint Versions",
    supporting_text: "Choose the documentation version"
}) }}

<section class="versions-section section">
    <div class="content-container">
        <nav aria-labelledby="versions-label">
            {% include 'partials/versions-list.html' %}
        </nav>
    </div>
</section>
