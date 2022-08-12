/* theme toggle buttons */
(function() {
    var enableToggle = function(btn) {
        btn.setAttribute("aria-pressed", "true");
    }

    var disableToggle = function(btn) {
        btn.setAttribute("aria-pressed", "false");
    }

    document.addEventListener('DOMContentLoaded', function() {
        var switcher = document.getElementById('js-theme-switcher');
        switcher.removeAttribute('hidden');

        var light_theme_toggle = document.getElementById('light-theme-toggle'),
            dark_theme_toggle = document.getElementById('dark-theme-toggle');

        // get any previously-chosen themes
        var theme = document.documentElement.getAttribute('data-theme');

        if (theme == "light") {
            enableToggle(light_theme_toggle);
            disableToggle(dark_theme_toggle);
        } else if (theme == "dark") {
            enableToggle(dark_theme_toggle);
            disableToggle(light_theme_toggle);
        }

        light_theme_toggle.addEventListener("click", function() {
            enableToggle(light_theme_toggle);
            theme = this.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', theme);
            window.localStorage.setItem("theme", theme);

            disableToggle(dark_theme_toggle);
        }, false);

        dark_theme_toggle.addEventListener("click", function() {
            enableToggle(dark_theme_toggle);
            theme = this.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', theme);
            window.localStorage.setItem("theme", theme);

            disableToggle(light_theme_toggle);
        }, false);
    }, false);

})();
