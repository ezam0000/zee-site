import { renderHeader } from "../components/Header.js";
import { renderFooter } from "../components/Footer.js";
import { initHotjar } from "../analytics/hotjar.js";
import { events } from "../analytics/events.js";

export default function initContact() {
  const headerRoot = document.getElementById("header-root");
  const footerRoot = document.getElementById("footer-root");
  if (headerRoot) headerRoot.appendChild(renderHeader());
  if (footerRoot) footerRoot.appendChild(renderFooter());

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      events.trackCTAClick("contact_form");
      alert("Thank you for your message! We'll get back to you soon.");
    });
  }

  initHotjar();
}

