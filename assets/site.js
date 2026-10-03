/* All content and navigation remain available without JavaScript. */
(() => {
  "use strict";

  function enhancePage() {
    const controls = document.querySelector(".publication-tools");
    const cards = document.querySelector(".publications-grid");
    const list = document.querySelector(".publication-list");

    if (controls && cards && list) {
      const buttons = Array.from(controls.querySelectorAll("button[data-view]"));
      const setView = (view) => {
        const showList = view === "list";
        cards.hidden = showList;
        list.hidden = !showList;
        buttons.forEach((button) => {
          button.setAttribute("aria-pressed", String(button.dataset.view === view));
        });
      };

      buttons.forEach((button) => {
        button.addEventListener("click", () => setView(button.dataset.view));
      });
      setView("cards");
      controls.hidden = false;
      document.documentElement.classList.add("has-js");
    }

    if (!("IntersectionObserver" in window)) return;

    const navLinks = Array.from(document.querySelectorAll(".main-nav a[href]"))
      .filter((link) => {
        const target = new URL(link.href, window.location.href);
        return target.origin === window.location.origin &&
          target.pathname === window.location.pathname && target.hash &&
          document.getElementById(decodeURIComponent(target.hash.slice(1)));
      });
    if (!navLinks.length) return;

    const linksBySection = new Map(navLinks.map((link) => [
      document.getElementById(decodeURIComponent(new URL(link.href).hash.slice(1))), link
    ]));
    const visibleSections = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.add(entry.target);
        else visibleSections.delete(entry.target);
      });
      const currentSection = Array.from(linksBySection.keys())
        .find((section) => visibleSections.has(section));
      if (!currentSection) return;

      navLinks.forEach((link) => link.removeAttribute("aria-current"));
      linksBySection.get(currentSection).setAttribute("aria-current", "location");
    }, { rootMargin: "-120px 0px -55% 0px", threshold: 0 });

    linksBySection.forEach((link, section) => observer.observe(section));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhancePage, { once: true });
  } else {
    enhancePage();
  }
})();
