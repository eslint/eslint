(function () {
    var enableToggle = function (btn) {
        btn.setAttribute("aria-pressed", "true");
    };

    var disableToggle = function (btns) {
        btns.forEach(btn => btn.setAttribute("aria-pressed", "false"));
    };

    var setTheme = function (theme) {
        if (theme === "system") {
            var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
            document.documentElement.setAttribute('data-theme', systemTheme);
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        window.localStorage.setItem("theme", theme);
    };

    var initializeThemeSwitcher = function () {
        var theme = window.localStorage.getItem("theme") || "system";
        var switcher = document.getElementById('js-theme-switcher');
        switcher.removeAttribute('hidden');

        var lightThemeToggle = document.getElementById('light-theme-toggle');
        var darkThemeToggle = document.getElementById('dark-theme-toggle');
        var systemThemeToggle = document.getElementById('system-theme-toggle');

        var toggleButtons = [lightThemeToggle, darkThemeToggle, systemThemeToggle];

        toggleButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                enableToggle(btn);
                var theme = this.getAttribute('data-theme');
                setTheme(theme);
                if (btn === systemThemeToggle) {
                    disableToggle([lightThemeToggle, darkThemeToggle]);
                } else if (btn === lightThemeToggle) {
                    disableToggle([systemThemeToggle, darkThemeToggle]);
                } else if (btn === darkThemeToggle) {
                    disableToggle([systemThemeToggle, lightThemeToggle]);
                }
            });
        });

        if (theme === "system") {
            enableToggle(systemThemeToggle);
            disableToggle([lightThemeToggle, darkThemeToggle]);
        } else if (theme === "light") {
            enableToggle(lightThemeToggle);
            disableToggle([systemThemeToggle, darkThemeToggle]);
        } else if (theme === "dark") {
            enableToggle(darkThemeToggle);
            disableToggle([systemThemeToggle, lightThemeToggle]);
        }

        // Update theme on system preference change
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
            var currentTheme = window.localStorage.getItem("theme");
            if (currentTheme === "system" || !currentTheme) {
                enableToggle(systemThemeToggle);
                disableToggle([lightThemeToggle, darkThemeToggle]);
                setTheme('system');
            }
        });
    };

    document.addEventListener('DOMContentLoaded', initializeThemeSwitcher);
})();
