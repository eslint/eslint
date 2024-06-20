/* theme toggle buttons */
(function () {
    var enableToggle = function (btn) {
        btn.setAttribute("aria-pressed", "true");
    }
    var disableToggle = function (btns) {
        btns.forEach(btn => btn.setAttribute("aria-pressed", "false"));
    }
    var setTheme = function (theme) {
        if (theme === "system") {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
            document.documentElement.setAttribute('data-theme', theme);
            window.localStorage.setItem("theme", "system");
        } else {
            document.documentElement.setAttribute('data-theme', theme);
            window.localStorage.setItem("theme", theme);
        }
    }

    var theme = window.localStorage.getItem("theme");

    document.addEventListener('DOMContentLoaded', function () {
        var switcher = document.getElementById('js-theme-switcher');
        switcher.removeAttribute('hidden');
        var light_theme_toggle = document.getElementById('light-theme-toggle'),
            dark_theme_toggle = document.getElementById('dark-theme-toggle'),
            system_theme_toggle = document.getElementById('system-theme-toggle');

        if (!theme || theme === "system") {
            enableToggle(system_theme_toggle);
            disableToggle([light_theme_toggle, dark_theme_toggle]);
        } else if (theme === "light") {
            enableToggle(light_theme_toggle);
            disableToggle([system_theme_toggle, dark_theme_toggle]);
        } else if (theme === "dark") {
            enableToggle(dark_theme_toggle);
            disableToggle([system_theme_toggle, light_theme_toggle]);
        }

        light_theme_toggle.addEventListener("click", function () {
            enableToggle(light_theme_toggle);
            theme = this.getAttribute('data-theme');
            setTheme(theme);
            disableToggle([system_theme_toggle, dark_theme_toggle]);
        }, false);
        dark_theme_toggle.addEventListener("click", function () {
            enableToggle(dark_theme_toggle);
            theme = this.getAttribute('data-theme');
            setTheme(theme);
            disableToggle([system_theme_toggle, light_theme_toggle]);
        }, false);
        system_theme_toggle.addEventListener("click", function () {
            enableToggle(system_theme_toggle);
            setTheme('system');
            disableToggle([light_theme_toggle, dark_theme_toggle]);
        }, false);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            var currentTheme = window.localStorage.getItem("theme");
            if (currentTheme === "system" || !currentTheme) {
                enableToggle(system_theme_toggle);
                disableToggle([light_theme_toggle, dark_theme_toggle]);
                setTheme('system');
            }
        });
    }, false);
})();
