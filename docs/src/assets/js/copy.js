function useCopyCode() {

    /** @type {WeakMap<HTMLElement, NodeJS.Timeout>} */
    const timeoutIdMap = new WeakMap();

    window.addEventListener("click", e => {

        /** @type {HTMLElement} */
        const el = e.target;

        if (el.matches('div[class*="language-"] > .c-btn--copy')) {
            const parent = el.parentElement;
            const sibling = el.nextElementSibling?.nextElementSibling.firstChild;

            if (!parent || !sibling) {
                return;
            }

            const isShell = /language-(shellscript|shell|bash|sh|zsh)/.test(
                parent.className
            );

            // Clone the node and remove the ignored nodes
            /** @type {HTMLElement} */
            const clone = sibling.cloneNode(true);

            let text = clone.textContent || "";

            if (isShell) {
                text = text.replace(/^ *(\$|>) /gm, "").trim();
            }

            copyToClipboard(text).then(() => {
                el.classList.add("copied");
                clearTimeout(timeoutIdMap.get(el));
                const timeoutId = setTimeout(() => {
                    el.classList.remove("copied");
                    el.blur();
                    timeoutIdMap.delete(el);
                }, 2000);

                timeoutIdMap.set(el, timeoutId);
            });
        }
    });

}

/**
 * @param {string} text
 * @returns {Promise<void>}
 */
function copyToClipboard(text) {
    try {
        return navigator.clipboard.writeText(text);
    } catch {
        const element = document.createElement("textarea");

        /** @type {HTMLElement} */
        const previouslyFocusedElement = document.activeElement;

        element.value = text;

        // Prevent keyboard from showing on mobile
        element.setAttribute("readonly", "");

        element.style.contain = "strict";
        element.style.position = "absolute";
        element.style.left = "-9999px";
        element.style.fontSize = "12pt"; // Prevent zooming on iOS

        const selection = document.getSelection();
        const originalRange = selection
            ? selection.rangeCount > 0 && selection.getRangeAt(0)
            : null;

        document.body.appendChild(element);
        element.select();

        // Explicit selection workaround for iOS
        element.selectionStart = 0;
        element.selectionEnd = text.length;

        document.execCommand("copy");
        document.body.removeChild(element);

        if (originalRange) {
            selection.removeAllRanges(); // originalRange can't be truthy when selection is falsy
            selection.addRange(originalRange);
        }

        // Get the focus back on the previously focused element, if any
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    useCopyCode();
});
