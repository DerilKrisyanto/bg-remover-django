document.addEventListener("DOMContentLoaded", function () {

    const root = document.documentElement;
    const toggle = document.getElementById("theme-toggle");
    const icon = document.getElementById("theme-icon");

    if (!toggle) return;

    // DEFAULT LIGHT
    const savedTheme = localStorage.getItem("theme") || "light";
    root.setAttribute("data-theme", savedTheme);
    updateIcon(savedTheme);

    toggle.addEventListener("click", function () {
        const current = root.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";

        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);

        updateIcon(next);
    });

    function updateIcon(theme) {
        icon.className =
            theme === "dark"
                ? "bi bi-moon-fill"
                : "bi bi-sun-fill";
    }

});
