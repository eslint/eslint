"use strict";

module.exports = function(it, encodeHTML) {
    const {
        parentIndex,
        lineNumber,
        columnNumber,
        severityNumber,
        severityName,
        message,
        ruleUrl,
        ruleId
    } = it;

    return `
<tr style="display:none" class="f-${parentIndex}">
    <td>${lineNumber}:${columnNumber}</td>
    <td class="clr-${severityNumber}">${severityName}</td>
    <td>${encodeHTML(message)}</td>
    <td>
        <a href="${ruleUrl}" target="_blank" rel="noopener noreferrer">${ruleId ? ruleId : ""}</a>
    </td>
</tr>
`.trimLeft();
};
