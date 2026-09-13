const ALLOWED_PAGES = new Set(["about", "contact", "portfolio"]);

export function boot() {
  const page = document.body.dataset.page;
  if (!page || !ALLOWED_PAGES.has(page)) {
    console.warn(`No allowed page module for data-page="${page ?? ""}"`);
    return;
  }

  const modulePath = `/src/pages/${page}.js`;

  import(modulePath)
    .then((module) => {
      if (module.default) {
        module.default();
      }
    })
    .catch((error) => {
      console.warn(`No page module found for: ${page}`, error);
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
