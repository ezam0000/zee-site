export function initPrefetch() {
  const links = document.querySelectorAll('a[href^="/"]');
  
  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const href = link.getAttribute("href");
      if (href && !document.querySelector(`link[href="${href}"]`)) {
        const prefetchLink = document.createElement("link");
        prefetchLink.rel = "prefetch";
        prefetchLink.href = href;
        document.head.appendChild(prefetchLink);
      }
    });
  });
}

