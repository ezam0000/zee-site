export function boot() {
  const page = document.body.dataset.page;
  if (!page) {
    // If no page specified, try to load home
    const modulePath = `/src/pages/home.js`;
    import(modulePath)
      .then((module) => {
        if (module.default) {
          module.default();
        }
      })
      .catch((error) => {
        console.warn(`No page module found`, error);
      });
    return;
  }

  // Dynamically load page-specific modules
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

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

