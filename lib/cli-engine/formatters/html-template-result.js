"use strict";

module.exports = function(it, encodeHTML) {
    const { color, index, filePath, summary } = it;

    return `
<tr class="bg-${color}" data-group="f-${index}">
    <th colspan="4">
        [+] ${encodeHTML(filePath)}
        <span>${encodeHTML(summary)}</span>
    </th>
</tr>
`.trimLeft();
};
