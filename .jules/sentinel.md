## 2024-05-24 - XSS Vulnerability in HTML Formatter
**Vulnerability:** XSS in HTML formatter due to unescaped `ruleId` and `ruleUrl` variables.
**Learning:** Externally derived variables like rule IDs and URLs must be escaped using internal encodeHTML utility to prevent XSS vulnerabilities, even if they usually come from trusted rule metadata, as custom rules or malicious configurations might inject them.
**Prevention:** Always escape variables inserted into HTML strings, even seemingly safe identifiers like rule IDs and URLs.
