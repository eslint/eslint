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

        var activateDarkMode = function() {
            enableToggle(dark_theme_toggle);

            document.documentElement.setAttribute('data-theme', "dark");
            window.localStorage.setItem("theme", "dark");
    
            disableToggle(light_theme_toggle);
        }

        var activateLightMode = function() {
            enableToggle(light_theme_toggle);

            document.documentElement.setAttribute('data-theme', "light");
            window.localStorage.setItem("theme", "light");
    
            disableToggle(dark_theme_toggle);
        }

        var darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
        darkModePreference.addEventListener("change", e => e.matches ? activateDarkMode() : activateLightMode());

        light_theme_toggle.addEventListener("click", activateLightMode, false);
        dark_theme_toggle.addEventListener("click", activateDarkMode, false);
    }, false);

})();
