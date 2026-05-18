import { renderHeader } from "../components/Header.js";
import { renderFooter } from "../components/Footer.js";
import { renderCaseGrid } from "../components/CaseGrid.js";
import { fetchJSON } from "../utils/io.js";
import { initHotjar } from "../analytics/hotjar.js";

export default async function initWork() {
  const headerRoot = document.getElementById("header-root");
  const footerRoot = document.getElementById("footer-root");
  if (headerRoot) headerRoot.appendChild(renderHeader());
  if (footerRoot) footerRoot.appendChild(renderFooter());

  const cases = await fetchJSON("/src/data/case_studies.json");
  const caseGridEl = document.getElementById("case-grid");

  if (cases && caseGridEl) {
    caseGridEl.appendChild(renderCaseGrid(cases));
  }

  initHotjar();
}

