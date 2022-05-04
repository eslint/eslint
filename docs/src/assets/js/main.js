(function() {
    var toc_trigger = document.getElementById("js-toc-label"),
        toc = document.getElementById("js-toc-panel"),
        body = document.getElementsByTagName("body")[0],
        open = true;

    if (toc && matchMedia) {
        const mq = window.matchMedia("(max-width: 1023px)");
        mq.addListener(WidthChange);
        WidthChange(mq);
    }

    // media query change
    function WidthChange(mq) {
        if (mq.matches && toc_trigger) {
            let text = toc_trigger.innerText;
            let headingButton = document.createElement("button");
            headingButton.setAttribute("aria-expanded", "false");
            headingButton.innerText = text;
            toc_trigger.innerHTML = "";

            toc_trigger.appendChild(headingButton);
            headingButton.innerHTML += `<svg class="toc-trigger-icon" width="12" height="8" aria-hidden="true" focusable="false" viewBox="0 0 12 8"><g fill="none"><path fill="currentColor" d="M1.41.59l4.59 4.58 4.59-4.58 1.41 1.41-6 6-6-6z"/><path d="M-6-8h24v24h-24z"/></g></svg>`;

            toc.setAttribute("data-open", "false");
            toc_trigger.setAttribute("aria-expanded", "false");
            headingButton.addEventListener("click", toggleTOC, false);
        } else {
            toc_trigger.innerHTML = 'Table of Contents';
            toc.setAttribute("data-open", "true");
        }

    }

    function toggleTOC(e) {
        if (!open) {
            this.setAttribute("aria-expanded", "true");
            toc.setAttribute("data-open", "true");
            open = true;
        } else {
            this.setAttribute("aria-expanded", "false");
            toc.setAttribute("data-open", "false");
            open = false;
        }
    }
})();

(function() {
    var nav_trigger = document.getElementById("nav-toggle"),
        nav = document.getElementById("nav-panel"),
        body = document.getElementsByTagName("body")[0],
        open = false;

    if (matchMedia) {
        const mq = window.matchMedia("(max-width: 1023px)");
        mq.addListener(WidthChange);
        WidthChange(mq);
    }

    // media query change
    function WidthChange(mq) {
        if (mq.matches) {
            nav.setAttribute("data-open", "false");
            nav_trigger.removeAttribute("hidden");
            nav_trigger.setAttribute("aria-expanded", "false");
            nav_trigger.addEventListener("click", togglenav, false);
        } else {
            nav.setAttribute("data-open", "true");
            nav_trigger.setAttribute("hidden", "");
            nav_trigger.setAttribute("aria-expanded", "true");
        }

    }

    function togglenav(e) {
        if (!open) {
            this.setAttribute("aria-expanded", "true");
            nav.setAttribute("data-open", "true");
            open = true;
        } else {
            this.setAttribute("aria-expanded", "false");
            nav.setAttribute("data-open", "false");
            open = false;
        }
    }
})();

(function() {
    var index_trigger = document.getElementById("js-docs-index-toggle"),
        index = document.getElementById("js-docs-index-list"),
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
        if(index_trigger) {

            index_trigger.removeAttribute("hidden");
            index_trigger.setAttribute("aria-expanded", "false");
            index.setAttribute("data-open", "false");

            index.setAttribute("data-open", "false");
            index_trigger.addEventListener("click", toggleindex, false);
        }
    }
})();



(function() {
    var switchers = document.querySelectorAll('.switcher'),
        fallbacks = document.querySelectorAll('.switcher-fallback');

    if (fallbacks != null) {
        fallbacks.forEach(el => {
            el.setAttribute('hidden', '');
        });
    }

    if (switchers != null) {
        switchers.forEach(element => {
            element.removeAttribute('hidden');
            const select = element.querySelector('select');

            select.addEventListener('change', function() {
                var selected = this.options[this.selectedIndex];
                url = selected.getAttribute('data-url');

                window.location.href = url;
            })
        });
    }
})();

// add "Open in Playground" button to code blocks
(function() {
    let blocks = document.querySelectorAll('pre[class*="language-"]');
    if (blocks) {
        blocks.forEach(function(block) {
            let button = document.createElement("a");
            button.classList.add('c-btn--playground');
            button.classList.add('c-btn');
            button.classList.add('c-btn--secondary');
            button.setAttribute("href", "#");
            button.innerText = "Open in Playground";
            block.appendChild(button);
        });
    }
})();



// add utilities
var util = {
    keyCodes: {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        HOME: 36,
        END: 35,
        ENTER: 13,
        SPACE: 32,
        DELETE: 46,
        TAB: 9,
    },

    generateID: function(base) {
        return base + Math.floor(Math.random() * 999);
    },

    getDirectChildren: function(elm, selector) {
        return Array.prototype.filter.call(elm.children, function(child) {
            return child.matches(selector);
        });
    },
};

(function(w, doc, undefined) {
    var CollapsibleIndexOptions = {
        allCollapsed: false,
        icon: '<svg class="index-icon" width="12" height="8" aria-hidden="true" focusable="false" viewBox="0 0 12 8"><g fill="none"><path fill="currentColor" d="M1.41.59l4.59 4.58 4.59-4.58 1.41 1.41-6 6-6-6z"/><path d="M-6-8h24v24h-24z"/></g></svg>',
    };
    var CollapsibleIndex = function(inst, options) {
        var _options = Object.assign(CollapsibleIndexOptions, options);
        var el = inst;
        var indexToggles = el.querySelectorAll(".docs-index > ul > .docs-index__item[data-has-children] > a"); // only top-most level
        var indexPanels = el.querySelectorAll(".docs-index > ul > .docs-index__item>[data-child-list]"); // the list
        var accID = util.generateID("c-index-");

        var init = function() {
            el.classList.add("index-js");

            setupindexToggles(indexToggles);
            setupindexPanels(indexPanels);
        };


        var setupindexToggles = function(indexToggles) {
            Array.from(indexToggles).forEach(function(item, index) {
                var $this = item;

                $this.setAttribute('role', 'button');
                $this.setAttribute("id", accID + "__item-" + index);
                $this.innerHTML += _options.icon;

                if (_options.allCollapsed) $this.setAttribute("aria-expanded", "false");
                else $this.setAttribute("aria-expanded", "true");

                $this.addEventListener("click", function(e) {
                    e.preventDefault();
                    togglePanel($this);
                });
            });
        };

        var setupindexPanels = function(indexPanels) {
            Array.from(indexPanels).forEach(function(item, index) {
                let $this = item;

                $this.setAttribute("id", accID + "__list-" + index);
                $this.setAttribute(
                    "aria-labelledby",
                    accID + "__item-" + index
                );
                if (_options.allCollapsed) $this.setAttribute("aria-hidden", "true");
                else $this.setAttribute("aria-hidden", "false");
            });
        };

        var togglePanel = function(toggleButton) {
            var thepanel = toggleButton.nextElementSibling;

            if (toggleButton.getAttribute("aria-expanded") == "true") {
                toggleButton.setAttribute("aria-expanded", "false");
                thepanel.setAttribute("aria-hidden", "true");
            } else {
                toggleButton.setAttribute("aria-expanded", "true");
                thepanel.setAttribute("aria-hidden", "false");
            }
        };


        init.call(this);
        return this;
    }; // CollapsibleIndex()

    w.CollapsibleIndex = CollapsibleIndex;
})(window, document);

// init
var index = document.getElementById('docs-index');
if (index) {
    index = new CollapsibleIndex(index, {
        allCollapsed: false
    });
}
