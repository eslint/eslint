(function() {
    var index_trigger = document.getElementById("js-index-toggle"),
        index = document.getElementById("js-index-list"),
        body = document.getElementsByTagName("body")[0],
        open = false;

    if (matchMedia) {
        const mq = window.matchMedia("(max-width: 1023px)");
        mq.addListener(WidthChange);
        WidthChange(mq);
    }

    function WidthChange(mq) {
        initIndex();
    }

    function toggleindex(e) {
        if (!open) {
            this.setAttribute("aria-expanded", "true");
            index.setAttribute("data-open", "true");
            open = true;
        } else {
            this.setAttribute("aria-expanded", "false");
            index.setAttribute("data-open", "false");
            open = false;
        }
    }

    function initIndex() {
        index_trigger.removeAttribute("hidden");
        index_trigger.setAttribute("aria-expanded", "false");
        index.setAttribute("data-open", "false");
        index_trigger.addEventListener("click", toggleindex, false);
    }
})();
