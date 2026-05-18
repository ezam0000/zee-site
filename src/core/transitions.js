export function initPageTransitions() {
  const links = document.querySelectorAll('a[href^="/"]');
  
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("/") && !link.target) {
        e.preventDefault();
        
        // Add fade out
        document.body.style.opacity = "0";
        document.body.style.transition = "opacity 0.3s";
        
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });
}

