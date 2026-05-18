import { renderHeader } from "../components/Header.js";
import { renderFooter } from "../components/Footer.js";
import { initHotjar } from "../analytics/hotjar.js";

export default function initAbout() {
  const headerRoot = document.getElementById("header-root");
  const footerRoot = document.getElementById("footer-root");
  if (headerRoot) headerRoot.appendChild(renderHeader());
  if (footerRoot) footerRoot.appendChild(renderFooter());

  initHotjar();
}

