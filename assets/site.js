/* Accessibility additions only; the original theme owns navigation and layout. */
(() => {
  "use strict";

  function enhanceNavigation() {
    const nav = document.getElementById("site-nav");
    if (!nav) return;
    const button = nav.querySelector("button");
    const menu = nav.querySelector(".hidden-links");
    if (!button || !menu) return;

    if (!menu.id) menu.id = "navigation-overflow";
    button.setAttribute("aria-controls", menu.id);
    if (!button.hasAttribute("aria-label")) {
      button.setAttribute("aria-label", document.documentElement.lang.startsWith("zh")
        ? "更多导航" : "More navigation");
    }

    const syncExpanded = () => {
      const isOpen = !button.classList.contains("hidden") &&
        !menu.classList.contains("hidden");
      button.setAttribute("aria-expanded", String(isOpen));
    };
    syncExpanded();

    // The theme changes these classes on click and resize. Observe those changes
    // instead of duplicating its width calculations or moving any links.
    const observer = new MutationObserver(syncExpanded);
    observer.observe(menu, { attributes: true, attributeFilter: ["class"] });
    observer.observe(button, { attributes: true, attributeFilter: ["class"] });

    nav.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || menu.classList.contains("hidden")) return;
      event.preventDefault();
      menu.classList.add("hidden");
      button.classList.remove("close");
      syncExpanded();
      button.focus();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceNavigation, { once: true });
  } else {
    enhanceNavigation();
  }
})();
